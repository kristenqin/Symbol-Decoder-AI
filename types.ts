
export enum PartOfSpeech {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  ADVERB = 'adverb',
  PREPOSITION = 'preposition',
  CONJUNCTION = 'conjunction',
  OTHER = 'other'
}

export interface WordToken {
  text: string;
  pos: PartOfSpeech;
  explanation?: string;
  isPhrase?: boolean;
}

export interface SentenceStructure {
  original: string;
  tokens: WordToken[];
  skeleton: {
    subject: string;
    verb: string;
    object?: string;
  };
  clauses?: Array<{
    type: 'main' | 'subordinate';
    text: string;
  }>;
}

export interface DecodedText {
  sentences: SentenceStructure[];
}
