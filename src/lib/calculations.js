import { getPreviousMonth } from './month';

const metricConfig = {
  sales: { keys: ['매출액', '매출'], fileTypes: ['pl'] },
  grossProfit: { keys: ['매출총이익'], fileTypes: ['pl'] },
  sga: { keys: ['판관비', '판매관리비'], fileTypes: ['pl'] },
  operatingProfit: { keys: ['영업이익'], fileTypes: ['pl'] },
  pretaxProfit: { keys: ['세전이익'], fileTypes: ['pl'] },
  taxExpense: { keys: ['법인세', '법인세비용'], fileTypes: ['pl'] },
  netIncome: { keys: ['당기순이익'], fileTypes: ['pl'] },
  lngVolume: { keys: ['LNG매출 부피', '판매량'], fileTypes: ['lngVolume'] },
  lngHeat: { keys: ['LNG매출 열량', '열량'], fileTypes: ['lngHeat'] },
};

function collectRowValues(dataset, rowKeys, monthKey) {
  const entries = Object.entries(dataset?.rowsByKey ?? {});
  return entries
    .filter(([rowName]) => rowKeys.some((key) => rowName.includes(key)))
    .reduce((acc, [, byMonth]) => acc + (byMonth?.[monthKey] ?? 0), 0);
}

export function sumProductByRowAndMonth(dataset, rowKeys, monthKey, divisor = 1000) {
  if (!dataset || !monthKey) return null;
  const total = collectRowValues(dataset, rowKeys, monthKey);
  return total === 0 ? null : total / divisor;
}

function getMetricByMonth(parsedByFile, config, monthKey) {
  for (const fileType of config.fileTypes) {
    const data = parsedByFile[fileType];
    if (!data) continue;
    const value = sumProductByRowAndMonth(data, config.keys, monthKey, 1000);
    if (value !== null) return value;
  }
  return null;
}

export function getHLookupValue(monthKey, table) {
  return table?.[monthKey] ?? null;
}

export function calculateDerivedMetrics(parsedByFile, monthKey) {
  const prev = getPreviousMonth(monthKey);
  const metrics = Object.fromEntries(Object.entries(metricConfig).map(([k, cfg]) => [k, getMetricByMonth(parsedByFile, cfg, monthKey)]));

  if (metrics.operatingProfit == null && metrics.grossProfit != null && metrics.sga != null) metrics.operatingProfit = metrics.grossProfit - metrics.sga;
  if (metrics.netIncome == null && metrics.pretaxProfit != null && metrics.taxExpense != null) metrics.netIncome = metrics.pretaxProfit - metrics.taxExpense;

  const previous = Object.fromEntries(Object.entries(metricConfig).map(([k, cfg]) => [k, getMetricByMonth(parsedByFile, cfg, prev)]));

  return { currentMonth: monthKey, previousMonth: prev, metrics, previous };
}
