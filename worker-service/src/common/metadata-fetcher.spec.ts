import axios from 'axios';
import * as dns from 'dns';
import {
  MetadataUrlError,
  fetchMetadataJson,
  isPublicAddress,
  parseMetadataUrl,
  publicOnlyLookup,
} from './metadata-fetcher';

jest.mock('dns', () => ({
  ...jest.requireActual('dns'),
  lookup: jest.fn(),
}));

describe('metadata-fetcher', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    (dns.lookup as unknown as jest.Mock).mockReset();
  });

  describe('isPublicAddress', () => {
    it.each([
      '127.0.0.1',
      '10.1.2.3',
      '172.16.0.1',
      '172.31.255.255',
      '192.168.1.1',
      '169.254.169.254',
      '100.64.0.1',
      '0.0.0.0',
      '224.0.0.1',
      '255.255.255.255',
      '::1',
      '::',
      'fe80::1',
      'fd00::1',
      '::ffff:127.0.0.1',
      '::ffff:7f00:1',
      '::ffff:a9fe:a9fe',
      '[::1]',
      'not-an-ip',
    ])('rejects %s', (address) => {
      expect(isPublicAddress(address)).toBe(false);
    });

    it.each(['8.8.8.8', '104.16.0.1', '2606:4700::1111', '::ffff:8.8.8.8'])(
      'accepts %s',
      (address) => {
        expect(isPublicAddress(address)).toBe(true);
      },
    );
  });

  describe('parseMetadataUrl', () => {
    it('accepts http and https URLs', () => {
      expect(parseMetadataUrl('https://example.com/a.json').hostname).toBe(
        'example.com',
      );
      expect(parseMetadataUrl('http://example.com/a.json').hostname).toBe(
        'example.com',
      );
    });

    it.each([
      'file:///etc/passwd',
      'ftp://example.com/a.json',
      'gopher://example.com',
      'ipfs://bafy',
      'not a url',
      'https://user:pass@example.com/a.json',
      'http://127.0.0.1/a.json',
      'http://169.254.169.254/latest/meta-data/',
      'http://[::1]/a.json',
      'http://[::ffff:127.0.0.1]/a.json',
      'http://2130706433/a.json',
      'http://0x7f000001/a.json',
    ])('rejects %s', (url) => {
      expect(() => parseMetadataUrl(url)).toThrow(MetadataUrlError);
    });
  });

  describe('publicOnlyLookup', () => {
    const mockLookup = (addresses: dns.LookupAddress[]) =>
      (dns.lookup as unknown as jest.Mock).mockImplementation(
        (_host, _opts, cb) => cb(null, addresses),
      );

    it('resolves hosts with public addresses', (done) => {
      mockLookup([{ address: '93.184.216.34', family: 4 }]);
      publicOnlyLookup('example.com', {}, (err, address, family) => {
        expect(err).toBeNull();
        expect(address).toBe('93.184.216.34');
        expect(family).toBe(4);
        done();
      });
    });

    it('returns all addresses when requested', (done) => {
      const addresses = [
        { address: '93.184.216.34', family: 4 },
        { address: '2606:2800:220:1::1', family: 6 },
      ];
      mockLookup(addresses);
      publicOnlyLookup('example.com', { all: true }, (err, address) => {
        expect(err).toBeNull();
        expect(address).toEqual(addresses);
        done();
      });
    });

    it('rejects hosts that resolve to an internal address', (done) => {
      mockLookup([
        { address: '93.184.216.34', family: 4 },
        { address: '10.0.0.5', family: 4 },
      ]);
      publicOnlyLookup('internal.example', {}, (err) => {
        expect(err).toBeInstanceOf(MetadataUrlError);
        done();
      });
    });

    it('passes through resolver errors', (done) => {
      const error = Object.assign(new Error('not found'), {
        code: 'ENOTFOUND',
      });
      (dns.lookup as unknown as jest.Mock).mockImplementation(
        (_host, _opts, cb) => cb(error),
      );
      publicOnlyLookup('missing.example', (err) => {
        expect(err).toBe(error);
        done();
      });
    });
  });

  describe('fetchMetadataJson', () => {
    it('fetches JSON with a timeout, size limit and no automatic redirects', async () => {
      const get = jest
        .spyOn(axios, 'get')
        .mockResolvedValue({ status: 200, data: { body: { title: 't' } } });

      const data = await fetchMetadataJson('https://example.com/a.json');

      expect(data).toEqual({ body: { title: 't' } });
      const config = get.mock.calls[0][1];
      expect(config.maxRedirects).toBe(0);
      expect(config.timeout).toBeGreaterThan(0);
      expect(config.maxContentLength).toBeGreaterThan(0);
      expect(config.proxy).toBe(false);
      expect(config.httpAgent).toBeDefined();
      expect(config.httpsAgent).toBeDefined();
    });

    it('follows redirects to allowed URLs', async () => {
      const get = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({
          status: 301,
          headers: { location: '/moved.json' },
          data: '',
        })
        .mockResolvedValueOnce({ status: 200, data: { ok: true } });

      const data = await fetchMetadataJson('https://example.com/a.json');

      expect(data).toEqual({ ok: true });
      expect(get.mock.calls[1][0]).toBe('https://example.com/moved.json');
    });

    it('does not follow redirects to internal addresses', async () => {
      const get = jest.spyOn(axios, 'get').mockResolvedValueOnce({
        status: 302,
        headers: { location: 'http://169.254.169.254/latest/meta-data/' },
        data: '',
      });

      await expect(
        fetchMetadataJson('https://example.com/a.json'),
      ).rejects.toThrow(MetadataUrlError);
      expect(get).toHaveBeenCalledTimes(1);
    });

    it('stops after too many redirects', async () => {
      const get = jest.spyOn(axios, 'get').mockResolvedValue({
        status: 302,
        headers: { location: 'https://example.com/loop' },
        data: '',
      });

      await expect(
        fetchMetadataJson('https://example.com/a.json', { maxRedirects: 2 }),
      ).rejects.toThrow('Too many redirects');
      expect(get).toHaveBeenCalledTimes(3);
    });

    it('rejects disallowed URLs without making a request', async () => {
      const get = jest.spyOn(axios, 'get');

      await expect(
        fetchMetadataJson('http://127.0.0.1:1337/api'),
      ).rejects.toThrow(MetadataUrlError);
      expect(get).not.toHaveBeenCalled();
    });

    it('refuses to connect to hosts resolving to internal addresses', async () => {
      (dns.lookup as unknown as jest.Mock).mockImplementation(
        (_host, _opts, cb) => cb(null, [{ address: '127.0.0.1', family: 4 }]),
      );

      await expect(
        fetchMetadataJson('http://internal.example/a.json'),
      ).rejects.toThrow(/not allowed/);
    });
  });
});
