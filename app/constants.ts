export const SEARCH_TIMEOUT = 1500;

export const TIME_FRAMES = [
  "1H",
  "4H",
  "1D",
  "1W",
  "1M",
  "3M",
  "YTD",
  "1Y",
  "5Y",
];

export const TIME_FRAMES_TO_INTERVALS: Record<string, string[]> = {
  "1H": ["1min", "5min", "15min", "30min", "60min"],
  "4H": ["1min", "5min", "15min", "30min", "60min"],
  "1D": ["5min", "15min", "30min", "60min", "1D"],
  "1W": ["5min", "15min", "30min", "60min", "1D", "1W"],
  "1M": ["5min", "15min", "30min", "60min", "1D", "1W", "1M"],
  "3M": ["1D", "1W", "1M"],
  YTD: ["1D", "1W", "1M"],
  "1Y": ["1D", "1W", "1M", "1Y"],
  "5Y": ["1W", "1M", "1Y"],
};

export const ITEM_TYPES = {
  INDICATOR: "indicator",
};
