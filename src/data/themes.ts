import { THEME_WORD_CLUSTERS } from './wordClusters';

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  words: string[];
}

const BASE_THEMES: Theme[] = THEME_WORD_CLUSTERS.map((tc) => ({
  id: tc.themeId,
  name: tc.themeName,
  emoji: tc.emoji,
  description: tc.description,
  words: Array.from(new Set(tc.clusters.flat()))
}));

/**
 * THEMES gerado dinamicamente a partir dos clusters de palavras (Single Source of Truth).
 * Inclui o tema 'aleatorio' no topo como opção surpresa para as rodadas.
 */
export const THEMES: Theme[] = [
  {
    id: 'aleatorio',
    name: 'Aleatório',
    emoji: '🎲',
    description: 'Sorteia uma categoria.',
    words: []
  },
  ...BASE_THEMES
];

/**
 * Retorna uma palavra aleatória do tema para o modo Clássico.
 * Se o tema for 'aleatorio', seleciona primeiro uma categoria aleatória e depois a palavra.
 */
export function getRandomWordFromTheme(themeId: string): { word: string; themeName: string } {
  let theme = BASE_THEMES.find((t) => t.id === themeId);

  if (!theme || themeId === 'aleatorio') {
    const randomThemeIndex = Math.floor(Math.random() * BASE_THEMES.length);
    theme = BASE_THEMES[randomThemeIndex] || BASE_THEMES[0];
  }

  const randomIndex = Math.floor(Math.random() * theme.words.length);
  return {
    word: theme.words[randomIndex],
    themeName: theme.name
  };
}
