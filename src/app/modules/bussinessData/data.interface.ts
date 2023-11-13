export interface IFormData {
  income: number;
  expenses: number;
  debts: number;
  assets: number;
}

export interface IBusinessHealth {
  data: IFormData;
  year: string;
  month: string;
  owner: string;
  health: string;
  currentRatio?: number;
  quickRatio?: number;
  debtToEquityRatio?: number;
  netProfitMargin?: number;
  lastMonth: {
    data: IFormData;
    year: string;
    month: string;
    health: string;
  };
}
