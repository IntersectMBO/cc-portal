import axios, { AxiosResponse } from 'axios';
import * as dns from 'dns';
import * as http from 'http';
import * as https from 'https';
import { BlockList, isIP } from 'net';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_CONTENT_LENGTH = 1024 * 1024; // 1 MiB
const DEFAULT_MAX_REDIRECTS = 3;
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

/**
 * Address ranges that metadata URLs must never resolve to: loopback,
 * private, link-local (including cloud metadata endpoints), shared,
 * documentation, benchmarking, multicast and reserved ranges.
 */
const blockedAddresses = new BlockList();
[
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.88.99.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
].forEach(([address, prefix]: [string, number]) =>
  blockedAddresses.addSubnet(address, prefix, 'ipv4'),
);
[
  ['::', 96],
  ['64:ff9b::', 96],
  ['64:ff9b:1::', 48],
  ['100::', 64],
  ['2001::', 23],
  ['2001:db8::', 32],
  ['2002::', 16],
  ['fc00::', 7],
  ['fe80::', 10],
  ['fec0::', 10],
  ['ff00::', 8],
].forEach(([address, prefix]: [string, number]) =>
  blockedAddresses.addSubnet(address, prefix, 'ipv6'),
);

export class MetadataUrlError extends Error {}

/**
 * Returns true when the given IP address is publicly routable and may be
 * contacted when fetching metadata.
 */
export function isPublicAddress(address: string): boolean {
  let ip = address;
  if (ip.startsWith('[') && ip.endsWith(']')) {
    ip = ip.slice(1, -1);
  }
  const family = isIP(ip);
  if (family === 0) {
    return false;
  }
  if (family === 6) {
    // IPv4-mapped / IPv4-compatible IPv6 addresses (e.g. ::ffff:127.0.0.1)
    const mapped = ip.match(/^::(?:ffff:(?:0{1,4}:)?)?(\d+\.\d+\.\d+\.\d+)$/i);
    if (mapped) {
      return isPublicAddress(mapped[1]);
    }
    const mappedHex = ip.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
    if (mappedHex) {
      const high = parseInt(mappedHex[1], 16);
      const low = parseInt(mappedHex[2], 16);
      return isPublicAddress(
        [high >> 8, high & 0xff, low >> 8, low & 0xff].join('.'),
      );
    }
    return !blockedAddresses.check(ip, 'ipv6');
  }
  return !blockedAddresses.check(ip, 'ipv4');
}

/**
 * Parses and validates a metadata URL. Only http(s) URLs without embedded
 * credentials are accepted, and IP literal hosts must be public addresses.
 * Host names are checked against the resolved addresses at connect time.
 */
export function parseMetadataUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new MetadataUrlError('Invalid URL');
  }
  if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
    throw new MetadataUrlError(`Unsupported URL protocol ${url.protocol}`);
  }
  if (url.username || url.password) {
    throw new MetadataUrlError('URLs with credentials are not supported');
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  if (!hostname) {
    throw new MetadataUrlError('URL has no host');
  }
  if (isIP(hostname) !== 0 && !isPublicAddress(hostname)) {
    throw new MetadataUrlError('URL host is not allowed');
  }
  return url;
}

type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address?: string | dns.LookupAddress[],
  family?: number,
) => void;

/**
 * dns.lookup replacement that refuses to connect to non-public addresses.
 * Used by the HTTP agents so the check applies to the address that is
 * actually connected to, including on redirects.
 */
export function publicOnlyLookup(
  hostname: string,
  options: dns.LookupOptions | number | LookupCallback,
  callback?: LookupCallback,
): void {
  let opts: dns.LookupOptions;
  let cb: LookupCallback;
  if (typeof options === 'function') {
    cb = options;
    opts = {};
  } else {
    cb = callback;
    opts = typeof options === 'number' ? { family: options } : (options ?? {});
  }
  dns.lookup(hostname, { ...opts, all: true }, (err, addresses) => {
    if (err) {
      cb(err);
      return;
    }
    const list = addresses as dns.LookupAddress[];
    if (list.length === 0 || !list.every((a) => isPublicAddress(a.address))) {
      cb(new MetadataUrlError(`Host ${hostname} is not allowed`));
      return;
    }
    if (opts.all) {
      cb(null, list);
    } else {
      cb(null, list[0].address, list[0].family);
    }
  });
}

const httpAgent = new http.Agent({ lookup: publicOnlyLookup });
const httpsAgent = new https.Agent({ lookup: publicOnlyLookup });

export interface FetchMetadataOptions {
  timeout?: number;
  maxContentLength?: number;
  maxRedirects?: number;
}

/**
 * Fetches JSON metadata from an untrusted URL (e.g. an on-chain anchor).
 * Redirects are followed manually so every hop is validated, and the
 * request is bounded by a timeout and a maximum response size.
 */
export async function fetchMetadataJson<T = any>(
  rawUrl: string,
  options: FetchMetadataOptions = {},
): Promise<T> {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;
  const maxContentLength =
    options.maxContentLength ?? DEFAULT_MAX_CONTENT_LENGTH;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;

  let url = parseMetadataUrl(rawUrl);
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const response: AxiosResponse = await axios.get(url.toString(), {
      headers: {
        'User-Agent': 'axios',
        Accept: 'application/json',
      },
      timeout,
      maxContentLength,
      maxRedirects: 0,
      proxy: false,
      httpAgent,
      httpsAgent,
      validateStatus: (status) => status >= 200 && status < 400,
    });
    if (response.status < 300) {
      return response.data;
    }
    const location = response.headers?.location;
    if (!location) {
      throw new MetadataUrlError('Redirect without location');
    }
    url = parseMetadataUrl(new URL(location, url).toString());
  }
  throw new MetadataUrlError('Too many redirects');
}
