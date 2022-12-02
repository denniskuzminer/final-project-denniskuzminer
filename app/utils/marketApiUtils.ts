import axios from "axios";
import { AnyAaaaRecord } from "dns";

export interface Prices {
  data: Array<Array<number | undefined>>;
  ohlc: Array<Array<number | undefined>>;
  volume: Array<Array<number | undefined>>;
  x: Array<string>;
  y: Array<number | undefined>;
  direction: string;
}

export const getPrices = async (
  symbol: string,
  timeFrame: any,
  interval: any = null
) => {
  // const timeToFunction =
  //   {
  //     "1H": "TIME_SERIES_INTRADAY",
  //     "4H": "TIME_SERIES_INTRADAY",
  //     "1D": "TIME_SERIES_INTRADAY",
  //     "1W": "TIME_SERIES_INTRADAY",
  //     "1M": "TIME_SERIES_INTRADAY",
  //     "3M": "TIME_SERIES_DAILY_ADJUSTED",
  //     YTD: "TIME_SERIES_DAILY_ADJUSTED",
  //     "1Y": "TIME_SERIES_DAILY_ADJUSTED",
  //     "5Y": "TIME_SERIES_WEEKLY_ADJUSTED",
  //   }[timeFrame] || "";

  if (!timeFrame || !symbol) {
    return [];
  }

  if (["1H", "4H", "1D", "1W", "1M"].includes(timeFrame)) {
    const { data } = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=${
        ["1H", "4H", "1D"].includes(timeFrame) ? "compact" : "full"
      }&apikey=${process.env.ALPHA_VANTAGE_API_KEY!}`
    );
    let timeSeries = data[`Time Series (${interval})`];
    let x = Object.keys(timeSeries);
    let y = Object.entries(timeSeries).map((e: any) => +e[1]["4. close"]); // it gets a little complicated with the types here
    return {
      data: y?.map((e, i) => [new Date(x[i]).getTime(), +e]),
      ohlc: Object.entries(timeSeries).map(([k, e]: any) => [
        new Date(k).getTime(),
        +e["1. open"],
        +e["2. high"],
        +e["3. low"],
        +e["4. close"],
        // +e["5. volume"],
      ]),
      volume: Object.entries(timeSeries).map(([k, e]: any) => [
        new Date(k).getTime(),
        +e["5. volume"],
      ]),
      x,
      y,
      direction:
        +(Object.entries(timeSeries)[0][1] as any)["1. open"] -
          +y[y.length - 1] >=
        0
          ? "up"
          : "down",
    };
  }
  //("1H", "4H", "1D", "1W", "1M", "3M", "YTD", "1Y", "5Y")
  // 1h and 4h can also do 1 minute
  // 1 month can do these agg
  // 5min, 15min, 30min, 60min
  // 3M to 1Y that do daily minimum
  // 5Y do weekly minimum

  // const { data } = await axios.get(
  //   `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&interval=${interval}&apikey=${process
  //     .env.ALPHA_VANTAGE_API_KEY!}`
  // );
};

export const searchSymbol = async (keywords: string) => {
  if (keywords === "") {
    return [];
  }
  const { data } = await axios.get(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${process
      .env.ALPHA_VANTAGE_API_KEY!}`
  );
  const { bestMatches } = data;
  return (
    bestMatches?.filter(
      (e: any) =>
        (e["3. type"] === "Equity" || e["3. type"] === "ETF") &&
        e["4. region"] === "United States"
    ) || []
  );
};

export const getCompanyInfoAndNews = async (symbol: string) => {
  if (!symbol) {
    return {};
  }
  return await Promise.all(
    ["OVERVIEW", "NEWS_SENTIMENT"].map((func) =>
      axios.get(
        `https://www.alphavantage.co/query?function=${func}&${
          func === "OVERVIEW" ? "symbol" : "tickers"
        }=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY!}`
      )
    )
  )
    .then((values) => {
      const [{ data: info }, { data: news }] = values;
      return { info, news };
    })
    .catch((error) => ({}));
};

export const API_LIMIT_ERROR_MESSAGE =
  " Woah, woah, woah. Listen, I appreciate that you find my project cool and want to try things out, " +
  "but I'm just a measly student. We're not all made of money. APIs are expensive kinda... I'm working " +
  'with the free tier here. I know what you\'re thinking, \n\t "Cool story developer man, so what?"\n' +
  "Well, I only get 5 API calls per minute, so wait one minute and check right back here again. :)";

export const hitAPILimit = (data: any) =>
  data?.Note ===
  "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.";

export const getDataFromFavorites = async (favorites: Array<string>) => {
  if (!favorites?.length) {
    return [];
  }
  return await Promise.all(
    favorites.map((symbol) =>
      axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process
          .env.ALPHA_VANTAGE_API_KEY!}`
      )
    )
  )
    .then((values) => values)
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

export const formatDollarAmount = (amt: string | number): string => {
  const formattedArr = ("" + formatter.format(+amt)).split(".");
  return formattedArr.join(".") + (formattedArr[1]?.length === 1 ? "0" : "");
};
