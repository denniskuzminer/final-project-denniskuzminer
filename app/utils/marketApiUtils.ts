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
