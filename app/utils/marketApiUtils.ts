import axios from "axios";

export const getPrices = async (
  symbol: string,
  interval: any,
  func = "TIME_SERIES_INTRADAY"
) => {
  const { data } = await axios.get(
    `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&interval=${interval}&apikey=${process
      .env.ALPHA_VANTAGE_API_KEY!}`
  );
  const timeSeries = data[`Time Series (${interval})`];

  console.log(data);
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

export const getCompanyInfo = async (symbol: string) => {
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
      info["News"] = news;
      return info;
    })
    .catch((error) => ({}));
};

export const API_LIMIT_ERROR_MESSAGE =
  "Woah, woah, woah. Listen, I appreciate that you find my project cool and want to try things out, " +
  "but I'm just a measly student. We're not all made of money. APIs are expensive kinda... I'm working " +
  'with the free tier here. I know what you\'re thinking, \n\t "Cool story developer man, so what?"\n' +
  "Well, I only get 5 API calls per minute, so wait one minute and check right back here again. :)";

export const hitAPILimit = (data) =>
  data.Note ===
  "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.";
