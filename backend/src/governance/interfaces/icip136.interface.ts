export interface ICIP136 {
  '@context': Context;
  hashAlgorithm: string;
  authors: AuthorContent[];
  body: BodyContent;
}
interface Context {
  '@language': string;
  CIP100: string;
  CIP136: string;
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
  summary: string;
  rationaleStatement: string;
  precedentDiscussion: string;
  counterargumentDiscussion: string;
  conclusion: string;
  internalVote: InternalVote;
}

interface References {
  '@id': string;
  '@container': string;
  '@context': ReferencesContext;
}

interface ReferencesContext {
  GovernanceMetadata: string;
  Other: string;
  label: string;
  uri: string;
  RelevantArticles: string;
}

interface InternalVote {
  '@id': string;
  '@container': string;
  '@context': InternalVoteContext;
}

interface InternalVoteContext {
  constitutional: string;
  unconstitutional: string;
  abstain: string;
  didNotVote: string;
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
  summary: string;
  rationaleStatement: string;
}

interface AuthorContent {
  name: string;
}
