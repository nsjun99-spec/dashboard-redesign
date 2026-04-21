import { useSyncExternalStore } from 'react';
import { parseExcelFile } from '../lib/excelParser';
import { calculateDerivedMetrics } from '../lib/calculations';

export const FILE_TYPES = [
  { key: 'bs', label: '재무상태표' },
  { key: 'pl', label: '손익계산서' },
  { key: 'lngVolume', label: 'LNG매출 부피' },
  { key: 'lngHeat', label: 'LNG매출 열량' },
];

const currentMonth = new Date().toISOString().slice(0, 7);
let state = {
  baseMonth: currentMonth,
  uploads: Object.fromEntries(FILE_TYPES.map((f) => [f.key, { fileName: null, status: 'idle', error: null, parsed: null }])),
  dashboard: null,
  warnings: [],
};

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const setState = (updater) => {
  state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
  emit();
};

function recalculate() {
  const parsedByFile = Object.fromEntries(Object.entries(state.uploads).map(([k, v]) => [k, v.parsed]).filter(([, v]) => !!v));
  const dashboard = calculateDerivedMetrics(parsedByFile, state.baseMonth);
  const missing = FILE_TYPES.filter((f) => !state.uploads[f.key]?.parsed).map((f) => f.label);
  setState({ dashboard, warnings: missing.length ? [`미업로드 파일: ${missing.join(', ')}`] : [] });
}

export async function uploadFile(type, file) {
  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    setState((s) => ({ ...s, uploads: { ...s.uploads, [type]: { ...s.uploads[type], status: 'error', error: '엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.' } } }));
    return;
  }
  setState((s) => ({ ...s, uploads: { ...s.uploads, [type]: { ...s.uploads[type], fileName: file.name, status: 'parsing', error: null } } }));
  try {
    const parsed = await parseExcelFile(file);
    setState((s) => ({ ...s, uploads: { ...s.uploads, [type]: { ...s.uploads[type], status: 'success', parsed, error: null, fileName: file.name } } }));
    const allMonths = new Set();
    Object.values(state.uploads).forEach((u) => u.parsed?.monthKeys?.forEach((m) => allMonths.add(m)));
    const latest = [...allMonths].sort().at(-1);
    if (latest) setState((s) => ({ ...s, baseMonth: latest }));
    recalculate();
  } catch (e) {
    setState((s) => ({ ...s, uploads: { ...s.uploads, [type]: { ...s.uploads[type], status: 'error', error: e.message, fileName: file.name } } }));
  }
}

export function setBaseMonth(month) {
  setState((s) => ({ ...s, baseMonth: month }));
  recalculate();
}

export function useFinanceStore(selector = (s) => s) {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => selector(state),
    () => selector(state),
  );
}
