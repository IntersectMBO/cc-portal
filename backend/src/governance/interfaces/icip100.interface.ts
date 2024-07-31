export interface ICIP100 {
  '@context': Context;
  hashAlgorithm: string;
  authors: Author[];
  body: Body;
}

interface Context {
  '@language': string;
  hashAlgorithm: string;
  body: BodyContext;
  authors: AuthorsContext;
}

interface BodyContext {
  '@id': string;
  '@context': BodySubContext;
}

interface BodySubContext {
  references: ReferencesContext;
  comment: string;
  externalUpdates: ExternalUpdatesContext;
}

interface ReferencesContext {
  '@id': string;
  '@container': string;
  '@context': ReferencesSubContext;
}

interface ReferencesSubContext {
  governanceMetadata: string;
  other: string;
  label: string;
  uri: string;
}

interface ExternalUpdatesContext {
  '@id': string;
  '@context': UpdatesSubContext;
}

interface UpdatesSubContext {
  title: string;
  uri: string;
}

interface AuthorsContext {
  '@id': string;
  '@container': string;
  '@context': AuthorsSubContext;
}

interface AuthorsSubContext {
  did: string;
  name: string;
  witness: WitnessContext;
}

interface WitnessContext {
  '@id': string;
  '@context': WitnessSubContext;
}

interface WitnessSubContext {
  witnessAlgorithm: string;
  publicKey: string;
  signature: string;
}

interface Author {
  name: string;
  witness: {
    witnessAlgorithm: string;
    publicKey: string;
    signature: string;
  };
}

interface Reference {
  '@type': string;
  label: string;
  uri: string;
}

interface ExternalUpdate {
  title: string;
  uri: string;
}

interface Body {
  references: Reference[];
  comment: string;
  externalUpdates: ExternalUpdate[];
}
