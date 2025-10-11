export interface Earning {
  symbol: string;
  date: string;
  epsEstimated: number | null;
  actual: number | null;
  revenueEstimated: number | null;
  revenueActual: number | null;
}

export interface EarningsResponse {
  dateRange: {
    from: string;
    to: string;
  };
  count: number;
  earnings: Earning[];
  groupedByDate: Record<string, Earning[]>;
  tickerList: TickerList[]
}

export interface TickerList {
    symbol:string
}