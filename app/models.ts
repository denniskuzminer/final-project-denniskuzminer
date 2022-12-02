import { IndicatorModel } from "./backtest/models";

export interface GraphProps {
  stockStyles: StockStyles;
  companyInfo: any;
  companyTimeSeries: any;
  graphLoading: boolean;
  graphType: string;
  indicators: IndicatorModel[];
  setIndicators: React.Dispatch<React.SetStateAction<IndicatorModel[]>>;
}

export interface StockStyles {
  main: string;
  transparent: string;
}

export interface IndicatorProps {
  indicator: IndicatorModel;
  setIndicators: React.Dispatch<React.SetStateAction<IndicatorModel[]>>;
}
