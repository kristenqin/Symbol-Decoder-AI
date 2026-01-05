
import React from 'react';
import { PartOfSpeech } from './types';

export const POS_COLORS: Record<PartOfSpeech, string> = {
  [PartOfSpeech.NOUN]: 'text-blue-600 font-medium',
  [PartOfSpeech.VERB]: 'text-rose-600 font-bold',
  [PartOfSpeech.ADJECTIVE]: 'text-emerald-600',
  [PartOfSpeech.ADVERB]: 'text-teal-500 italic',
  [PartOfSpeech.PREPOSITION]: 'text-slate-400',
  [PartOfSpeech.CONJUNCTION]: 'text-purple-600 font-semibold',
  [PartOfSpeech.OTHER]: 'text-slate-800'
};

export const POS_LABELS: Record<PartOfSpeech, string> = {
  [PartOfSpeech.NOUN]: 'N',
  [PartOfSpeech.VERB]: 'V',
  [PartOfSpeech.ADJECTIVE]: 'Adj',
  [PartOfSpeech.ADVERB]: 'Adv',
  [PartOfSpeech.PREPOSITION]: 'P',
  [PartOfSpeech.CONJUNCTION]: 'C',
  [PartOfSpeech.OTHER]: '...'
};
