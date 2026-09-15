import { useMemo } from 'react';

/**
 * Council anti-A-spam (cycle 9/14): MCQ choices render in a SHUFFLED display order so the
 * correct answer's screen position varies. Logic compares ORIGINAL indices, so callers keep
 * their existing answer handling — only the render order changes.
 * Deterministic per (seed) so re-renders don't re-shuffle mid-question.
 */
export function shuffledOrder(choiceCount: number, seed: string | number): number[] {
  const idx = Array.from({ length: choiceCount }, (_, i) => i);
  let h = 0;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  // Fisher-Yates with LCG seeded by h
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

/** React hook: stable shuffled order for a question's lifetime. */
export function useShuffledChoices(choiceCount: number, seed: string | number): number[] {
  return useMemo(() => shuffledOrder(choiceCount, seed), [choiceCount, seed]);
}
