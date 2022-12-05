import { lettersIndex, positionsIndex } from "./constant";

// Translate position string to number
export const tPosSN = (position: string): { x: number; y: number } => ({
  x: parseInt(position.substring(0, 1)) - 1,
  y: lettersIndex[position.substring(1, 2)],
});

// Translate position number to string
export const tPosNS = (position: { x: number; y: number }): string => `${position.x + 1}${positionsIndex[position.y]}`;
