import { normalizeMonthKey } from './month';

let xlsxLoader;

const SHEETJS_CDN_URLS = [
  'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js',
];

function injectScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error(`엑셀 파서 스크립트 로딩 실패: ${src}`));
    document.head.appendChild(script);
  });
}

async function loadFromCdns() {
  let lastError;
  for (const src of SHEETJS_CDN_URLS) {
    try {
      const xlsx = await injectScript(src);
      if (xlsx) return xlsx;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error('엑셀 파서를 불러오지 못했습니다.');
}

function loadXLSX() {
  if (xlsxLoader) return xlsxLoader;
  xlsxLoader = new Promise(async (resolve, reject) => {
    try {
      if (typeof window === 'undefined') throw new Error('브라우저 환경에서만 엑셀 파싱이 가능합니다.');
      if (window.XLSX) return resolve(window.XLSX);
      const xlsx = await loadFromCdns();
      resolve(xlsx);
    } catch (error) {
      reject(new Error(`엑셀 파서 로딩에 실패했습니다. 네트워크/CSP 설정을 확인하세요. (${error.message})`));
    }
  });
  return xlsxLoader;
}

function toNumber(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v.replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function extractMonthCols(headerRow = []) {
  return headerRow.map((cell, idx) => ({ idx, key: normalizeMonthKey(cell) })).filter((x) => x.key);
}

function resolveRowKey(row) {
  const first = String(row[0] ?? '').trim();
  const second = String(row[1] ?? '').trim();
  if (first && second) return `${first} ${second}`.trim();
  return first || second || '';
}

export async function parseExcelFile(file) {
  const XLSX = await loadXLSX();
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });

  const dataset = { rowsByKey: {}, monthKeys: new Set(), namedRanges: {} };

  if (wb.Workbook?.Names) {
    wb.Workbook.Names.forEach((n) => {
      dataset.namedRanges[n.Name] = n.Ref;
    });
  }

  wb.SheetNames.forEach((name) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: '' });
    if (!rows.length) return;

    let headerIdx = rows.findIndex((r) => extractMonthCols(r).length >= 1);
    if (headerIdx === -1) headerIdx = 0;

    const monthCols = extractMonthCols(rows[headerIdx]);
    if (!monthCols.length) return;

    for (let i = headerIdx + 1; i < rows.length; i += 1) {
      const row = rows[i] ?? [];
      const rawKey = resolveRowKey(row);
      if (!rawKey) continue;

      if (!dataset.rowsByKey[rawKey]) dataset.rowsByKey[rawKey] = {};

      monthCols.forEach(({ idx, key }) => {
        const n = toNumber(row[idx]);
        if (n === null) return;

        dataset.monthKeys.add(key);
        dataset.rowsByKey[rawKey][key] = (dataset.rowsByKey[rawKey][key] ?? 0) + n;
      });
    }
  });

  return { ...dataset, monthKeys: [...dataset.monthKeys].sort() };
}
