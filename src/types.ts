export interface StockMetric {
  symbol: string;
  name: string;
  price: number;
  peRatio: number;
  operatingMargin: number;
  ncav: number;
  profitabilityGrade: string;
  valuationGrade: string;
  growthGrade: string;
  overallGrade: string;
  grahamNumber: string;
  marginOfSafetyPercent: number;
  roe: number;
  insiderOwnershipPercent: number;
  leverageDebtToEquity: number;
  riskFlags: string[];
}
