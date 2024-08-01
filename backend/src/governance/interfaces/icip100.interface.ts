export interface ICIP100 {
  '@context': Context;
  hashAlgorithm: string;
  authors: any[];
  body: {
    comment: string;
  };
}
interface Context {
  '@language': string;
  hashAlgorithm: string;
  body: {
    '@id': string;
    '@context': {
      references: {
        '@id': string;
        '@container': string;
        '@context': {
          governanceMetadata: string;
          other: string;
          label: string;
          uri: string;
        };
      };
      comment: string;
      externalUpdates: {
        '@id': string;
        '@context': {
          title: string;
          uri: string;
        };
      };
    };
  };
  authors: {
    '@id': string;
    '@container': string;
    '@context': {
      did: string;
      name: string;
      witness: {
        '@id': string;
        '@context': {
          witnessAlgorithm: string;
          publicKey: string;
          signature: string;
        };
      };
    };
  };
}
