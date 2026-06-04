import { StockMetric } from './types';

export function evaluateEquityMetrics(
  symbol: string,
  name: string,
  price: number,
  eps: number,
  bvps: number,
  peRatio: number,
  operatingMargin: number,
  roe: number,
  ncav: number,
  leverageDebtToEquity: number,
  insiderOwnershipPercent: number,
  ...args: any[]
): StockMetric {
  // Graham Number = sqrt(22.5 * EPS * BVPS), bounded
  const gNum = Math.sqrt(22.5 * Math.abs(eps) * Math.abs(bvps));
  const grahamNumber = isNaN(gNum) ? "0.00" : gNum.toFixed(2);
  const mos = ((gNum - price) / price * 100);
  const marginOfSafetyPercent = isNaN(mos) ? 0 : parseFloat(mos.toFixed(1));

  let pGrade = "C";
  if(operatingMargin > 20 && roe > 15) pGrade = "A";
  else if(operatingMargin > 10) pGrade = "B";

  let vGrade = "B";
  if(peRatio < 15 && marginOfSafetyPercent > 10) vGrade = "A";
  else if(peRatio > 35) vGrade = "D";

  const riskFlags = [];
  if (leverageDebtToEquity > 2.0) riskFlags.push("Excessive Systemic Leverage");
  if (insiderOwnershipPercent < 5) riskFlags.push("Low Insider Alignment");
  if (marginOfSafetyPercent < -20) riskFlags.push("Price Premium over Intrinsic Value");
  if (riskFlags.length === 0) riskFlags.push("Negligible Flag Violations Detected");

  return {
    symbol,
    name,
    price,
    peRatio,
    operatingMargin,
    ncav,
    profitabilityGrade: pGrade,
    valuationGrade: vGrade,
    growthGrade: "B+",
    overallGrade: pGrade === "A" && vGrade === "A" ? "A+" : pGrade,
    grahamNumber,
    marginOfSafetyPercent,
    roe,
    insiderOwnershipPercent,
    leverageDebtToEquity,
    riskFlags
  };
}

export const initialEquities: StockMetric[] = [
  evaluateEquityMetrics("TCS", "Tata Consultancy Services", 3845.5, 132.8, 298.5, 28.4, 24.5, 43.2, 12.8, 0.05, 72.3),
  evaluateEquityMetrics("SBIN", "State Bank of India", 745.2, 85.4, 520.1, 7.8, 18.4, 16.5, 45.2, 1.2, 57.5),
  evaluateEquityMetrics("ZOMATO", "Zomato Ltd", 185.4, 1.2, 18.5, 154.5, 4.2, 3.5, 2.1, 0.1, 8.5)
];
