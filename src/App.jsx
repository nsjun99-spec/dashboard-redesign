import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, UploadCloud, ShieldCheck, Settings2, Database, Search } from 'lucide-react';
import { FILE_TYPES, setBaseMonth, uploadFile, useFinanceStore } from './store/useFinanceStore';
import { monthLabel } from './lib/month';

const navItems = [
  { key: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { key: 'upload', label: '데이터 업로드', icon: UploadCloud },
  { key: 'validation', label: '검증 및 매핑', icon: ShieldCheck },
  { key: 'settings', label: '운영 설정', icon: Settings2 },
];

function formatNumber(v, unit = '') {
  if (v == null) return '-';
  const sign = v < 0 ? '-' : '';
  return `${sign}${Math.abs(v).toLocaleString('ko-KR')}${unit}`;
}

function Card({ title, subtitle, children }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-base font-semibold">{title}</h3>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}<div className="mt-4">{children}</div></section>;
}

function UploadCard({ fileType }) {
  const upload = useFinanceStore((s) => s.uploads[fileType.key]);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="font-semibold">{fileType.label}</p>
      <p className="mt-1 text-sm text-slate-500">{upload.fileName ?? '업로드된 파일 없음'}</p>
      <div className="mt-3 flex items-center gap-3">
        <label className="cursor-pointer rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white">
          파일 선택/교체
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(fileType.key, e.target.files[0])} />
        </label>
        <span className="text-xs text-slate-600">{upload.status === 'success' ? '업로드 성공' : upload.status === 'parsing' ? '파싱 중...' : upload.status === 'error' ? '업로드 실패' : '대기'}</span>
      </div>
      {upload.error && <p className="mt-2 text-sm text-rose-600">{upload.error}</p>}
    </div>
  );
}

function DashboardPage() {
  const { baseMonth, dashboard, warnings } = useFinanceStore((s) => ({ baseMonth: s.baseMonth, dashboard: s.dashboard, warnings: s.warnings }));
  const m = dashboard?.metrics ?? {};
  return (
    <div className="space-y-6">
      {warnings.map((w) => <div key={w} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{w}</div>)}
      <div className="grid gap-4 lg:grid-cols-4">
        <Card title="매출액(백만원)"><p className="text-2xl font-bold">{formatNumber(m.sales)}</p></Card>
        <Card title="영업이익(백만원)"><p className="text-2xl font-bold">{formatNumber(m.operatingProfit)}</p></Card>
        <Card title="법인세(백만원)"><p className="text-2xl font-bold">{formatNumber(m.taxExpense)}</p></Card>
        <Card title="당기순이익(백만원)"><p className="text-2xl font-bold">{formatNumber(m.netIncome)}</p></Card>
      </div>
      <Card title="기준 월 요약" subtitle="기준 월 변경 시 HLOOKUP 방식으로 월별 값 조회">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3 text-sm">기준월: {monthLabel(baseMonth)}</div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm">LNG 매출 부피(천㎥): {formatNumber(m.lngVolume)}</div>
        </div>
      </Card>
    </div>
  );
}

function UploadPage() {
  return (
    <div className="space-y-6">
      <Card title="원천 파일 업로드" subtitle="4개 파일을 각각 업로드하고 상태를 확인합니다.">
        <div className="grid gap-4 md:grid-cols-2">{FILE_TYPES.map((f) => <UploadCard key={f.key} fileType={f} />)}</div>
      </Card>
    </div>
  );
}

function ValidationPage() {
  const uploads = useFinanceStore((s) => s.uploads);
  const baseMonth = useFinanceStore((s) => s.baseMonth);
  const ready = Object.values(uploads).some((u) => u.status === 'success');
  return <Card title="검증 및 매핑" subtitle="업로드 성공 파일 기준으로 월/항목 매핑 검증을 수행합니다."><button disabled={!ready || !baseMonth} className={`rounded-xl px-4 py-2 text-sm ${ready ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>자동 매핑 실행</button><p className="mt-2 text-xs text-slate-500">{ready ? '실행 가능' : '파일 업로드 완료 후 실행할 수 있습니다.'}</p></Card>;
}

function SettingsPage() {
  return <Card title="운영 설정" subtitle="상태 기반 제어와 임계치를 설정합니다."><p className="text-sm text-slate-600">현재 버전은 파일/기준월/파싱 성공 여부에 따라 버튼 상태를 제어합니다.</p></Card>;
}

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [search, setSearch] = useState('');
  const baseMonth = useFinanceStore((s) => s.baseMonth);

  const filteredNav = useMemo(() => navItems.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-6 py-6"><h1 className="text-xl font-bold">재무보고서 자동화</h1></div>
          <div className="px-4 pt-4"><div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5"><Search className="h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="메뉴 검색" className="w-full bg-transparent text-sm outline-none" /></div></div>
          <nav className="flex-1 space-y-2 px-4 py-4">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const activeStyle = active === item.key;
              return <button key={item.key} onClick={() => setActive(item.key)} className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left ${activeStyle ? 'border-blue-200 bg-blue-50' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}><div className={`rounded-xl p-2 ${activeStyle ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}><Icon className="h-4 w-4" /></div><p className="text-sm font-semibold text-slate-900">{item.label}</p></button>;
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-8">
              <div className="flex items-center gap-2"><Database className="h-4 w-4 text-blue-600" /><p className="text-sm font-semibold">재무 대시보드</p></div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm"><p className="mb-1 text-xs font-medium text-slate-500">기준월 선택 (YYYY-MM)</p><input type="month" value={baseMonth} onChange={(e) => setBaseMonth(e.target.value)} className="rounded-xl border border-slate-200 px-2 py-1 text-sm" /></div>
            </div>
          </header>
          <main className="space-y-6 p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {active === 'dashboard' && <DashboardPage />}
              {active === 'upload' && <UploadPage />}
              {active === 'validation' && <ValidationPage />}
              {active === 'settings' && <SettingsPage />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
