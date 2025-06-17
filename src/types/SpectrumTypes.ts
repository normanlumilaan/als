export const SPECTRUM_COLORS = [
  "#000000",
  "#0000CD",
  "#CD0000",
  "#CD00CD",
  "#00CD00",
  "#00CDCD",
  "#CDCD00",
  "#CDCDCD",
  "#000000",
  "#0000FF",
  "#FF0000",
  "#FF00FF",
  "#00FF00",
  "#00FFFF",
  "#FFFF00",
  "#FFFFFF",
] as const;

export const SPECTRUM_WIDTH = 256;
export const SPECTRUM_HEIGHT = 192;
export const SPECTRUM_BORDER_WIDTH = 32;
export const SPECTRUM_BORDER_HEIGHT = 24;
export const SPECTRUM_TOTAL_WIDTH = SPECTRUM_WIDTH + SPECTRUM_BORDER_WIDTH * 2;
export const SPECTRUM_TOTAL_HEIGHT =
  SPECTRUM_HEIGHT + SPECTRUM_BORDER_HEIGHT * 2;

export type SpectrumColor =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;
