const black = '\u001b[30m';
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const blue = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan = '\u001b[36m';
const white = '\u001b[37m';

const reset = '\u001b[0m';

export const COLORS = {
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  reset,
} as const;

export const BOLD = '\u001b[1m';

export type ColorKeys = keyof typeof COLORS;
export type ColorValues = (typeof COLORS)[ColorKeys];
