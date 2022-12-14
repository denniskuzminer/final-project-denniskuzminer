type Action = "BUY" | "SELL" | "NOTHING" | undefined;

export interface BacktestFormData {
  name: string;
  principal: Number;
  condition: string;
  actionIf?: Action;
  actionElse?: Action;
  on: string;
  per: string;
  startDate: Date;
  endDate: Date;
  options?: string;
  backtests: any;
}

export interface IndicatorModel {
  name: string;
  description: string;
  params?: Object;
  calculation: Function;
  id: string;
  active: boolean;
}
