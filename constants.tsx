
import React from 'react';
import { PartOfSpeech } from './types';

export const POS_COLORS: Record<PartOfSpeech, string> = {
  [PartOfSpeech.NOUN]: 'text-blue-600 font-semibold',
  [PartOfSpeech.VERB]: 'text-rose-600 font-bold underline decoration-rose-200 underline-offset-4',
  [PartOfSpeech.ADJECTIVE]: 'text-emerald-600 italic',
  [PartOfSpeech.ADVERB]: 'text-amber-600',
  [PartOfSpeech.PREPOSITION]: 'text-slate-500 font-medium',
  [PartOfSpeech.CONJUNCTION]: 'text-purple-600 border-b border-purple-200',
  [PartOfSpeech.OTHER]: 'text-slate-800'
};

export const POS_LABELS: Record<PartOfSpeech, string> = {
  [PartOfSpeech.NOUN]: 'N',
  [PartOfSpeech.VERB]: 'V',
  [PartOfSpeech.ADJECTIVE]: 'Adj',
  [PartOfSpeech.ADVERB]: 'Adv',
  [PartOfSpeech.PREPOSITION]: 'Prep',
  [PartOfSpeech.CONJUNCTION]: 'Conj',
  [PartOfSpeech.OTHER]: '...'
};
