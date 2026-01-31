
import React from 'react';
import { Genre, Mood } from './types';

export const GENRES: { id: Genre; label: string; icon: string }[] = [
  { id: 'Afrobeats', label: 'Afrobeats', icon: '🥁' },
  { id: 'Amapiano', label: 'Amapiano', icon: '🎹' },
  { id: 'Gospel', label: 'Gospel/Worship', icon: '🙏' },
  { id: 'Pop', label: 'Pop', icon: '✨' },
  { id: 'R&B', label: 'R&B', icon: '🕯️' },
  { id: 'Country', label: 'Country', icon: '🤠' },
  { id: 'Lullaby', label: 'Lullaby', icon: '🌙' },
  { id: 'UK Drill', label: 'UK Drill', icon: '🇬🇧' },
];

export const MOODS: { id: Mood; label: string }[] = [
  { id: 'Joyful', label: 'Joyful & Bright' },
  { id: 'Sentimental', label: 'Sentimental & Sweet' },
  { id: 'Energetic', label: 'High Energy' },
  { id: 'Soulful', label: 'Deeply Soulful' },
  { id: 'Funny', label: 'Lighthearted & Funny' },
];

export const APP_THEME = {
  primary: 'indigo-600',
  secondary: 'rose-500',
  accent: 'amber-400',
  background: 'slate-50',
};
