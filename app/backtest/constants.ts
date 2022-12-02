import { IndicatorModel } from "./models";

export const formFields = [
  { id: "name", label: "Name", text: "Name" },
  { id: "principal", label: "Amount", text: "Principal" },
  { id: "condition", label: "Condition", text: "If" },
  { id: "actionIf", label: "Action", text: "Do" },
  { id: "actionElse", label: "Action", text: "Else do" },
  { id: "on", label: "Ticker", text: "Backtest On" },
  { id: "per", label: "Interval", text: "Per" },
  { id: "from", label: "Date", text: "Start Date" },
  { id: "to", label: "Date", text: "End Date" },
  { id: "options", label: "Options", text: "Options" },
];

export const rightDrawerWidth = "15%";
export const leftDrawerWidth = "15%";

export function getSMA(
  timeSeries: Array<Array<number | undefined>>,
  params: { Periods: number }
): Array<Array<number | undefined>> {
  const { Periods: window } = params;
  if (!timeSeries || timeSeries.length < window) {
    return [];
  }
  let index = window - 1;
  const length = timeSeries.length + 1;
  const simpleMovingAverages = [];
  timeSeries = timeSeries.reverse();
  console.log(timeSeries);
  while (++index < length) {
    const windowSlice = timeSeries.slice(index - window, index);
    const sum = windowSlice.reduce((prev, curr) => prev + (curr[1] ?? 0), 0);
    simpleMovingAverages.push([timeSeries[index]?.at(0), sum / window]);
  }
  console.log(simpleMovingAverages);
  return simpleMovingAverages;
}

export const defaultIndicators: IndicatorModel[] = [
  {
    name: "Simple Moving Average",
    description: "Plots the average of the previous X periods",
    params: { Periods: 21 },
    calculation: getSMA,
    id: "SMA",
    active: false,
  },
  // {
  //   name: "Exponential Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Simple Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Exponential Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Simple Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Exponential Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Simple Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Exponential Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Simple Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Exponential Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Simple Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Exponential Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Simple Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
  // {
  //   name: "Last Exponential Moving Average",
  //   description: "Plots the average of the previous X periods",
  //   calculation: "",
  // },
];
