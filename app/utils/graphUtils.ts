import { StockStyles } from "../models";

export const easeOutBounce = function (pos: number) {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos;
  }
  if (pos < 2 / 2.75) {
    return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
  }
  if (pos < 2.5 / 2.75) {
    return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
  }
  return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
};

export const stockUp: StockStyles = {
  main: "rgba(134,210,159,1)",
  transparent: "rgba(134,210,159,0)",
};

export const stockDown: StockStyles = {
  main: "rgba(200,37,37,1)",
  transparent: "rgba(200,37,37,0)",
};
