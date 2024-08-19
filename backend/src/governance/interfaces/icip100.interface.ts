export interface ICIP100 {
  '@context': Context;
  hashAlgorithm: string;
  authors: any[];
  body: BodyContent;
}
interface Context {
  '@language': string;
  hashAlgorithm: string;
  body: Body;
  authors: Authors;
}

interface Body {
  '@id': string;
  '@context': BodyContext;
}

interface BodyContext {
  references: References;
  comment: string;
  externalUpdates: ExternalUpdates;
}

interface References {
  '@id': string;
  '@container': string;
  '@context': ReferencesContext;
}

interface ReferencesContext {
  governanceMetadata: string;
  other: string;
  label: string;
  uri: string;
}

interface ExternalUpdates {
  '@id': string;
  '@context': ExternalUpdatesContext;
}

interface ExternalUpdatesContext {
  title: string;
  uri: string;
}

interface Authors {
  '@id': string;
  '@container': string;
  '@context': AuthorsContext;
}

interface AuthorsContext {
  did: string;
  name: string;
  witness: Witness;
}

interface Witness {
  '@id': string;
  '@context': WitnessContext;
}

interface WitnessContext {
  witnessAlgorithm: string;
  publicKey: string;
  signature: string;
}

interface BodyContent {
  references: any[];
  comment: string;
}
