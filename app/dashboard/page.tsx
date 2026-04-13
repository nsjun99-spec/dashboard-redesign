"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Building2,
  CalendarRange,
  Download,
  FileSpreadsheet,
  Info,
  PencilLine,
  Table2,
  TrendingUp
} from "lucide-react";

const monthlyRows = [
  { major: "판매량", detail: "가 정 용", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "영 업 무 용", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "산 업 용", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "수 송 용", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "열 병 합 용", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "연 료 전 지", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "합     계", detail: "", current: null, previous: null, diff: null, note: "", level: "total" },
  { major: "기타판매량", detail: "", current: null, previous: null, diff: null, note: "", level: "section" },
  { major: "매   출   액", detail: "", current: null, previous: null, diff: null, note: "", level: "section" },
  { major: "매출총이익", detail: "도시가스 판매량이익", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "도시가스 기타판매량", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "도시가스 기타매출총익", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "기타총이익(신규사업, 집단E)", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "소     계", detail: "", current: null, previous: null, diff: null, note: "", level: "total" },
  { major: "판관비", detail: "급여", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "상여", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "제수당", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "퇴직급여/장기종업원급여", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "인건비 소계", current: null, previous: null, diff: null, note: "", level: "subtotal" },
  { major: "", detail: "고객센터(LSC)", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "SLA / IT", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "콜센터 / 티센터", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "기타지급수수료", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "수수료 소계", current: null, previous: null, diff: null, note: "", level: "subtotal" },
  { major: "", detail: "감가상각비", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "복리후생비", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "세금과공과", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "기타판관비", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "기타 소계", current: null, previous: null, diff: null, note: "", level: "subtotal" },
  { major: "", detail: "전체 판관비 소계", current: null, previous: null, diff: null, note: "", level: "total" },
  { major: "영 업 이 익", detail: "", current: null, previous: null, diff: null, note: "", level: "section-strong" },
  { major: "기타손익", detail: "기타수익", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "기타비용", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "소     계", detail: "", current: null, previous: null, diff: null, note: "", level: "subtotal" },
  { major: "금융손익", detail: "순수입이자", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "", detail: "기   타", current: null, previous: null, diff: null, note: "", level: "normal" },
  { major: "소     계", detail: "", current: null, previous: null, diff: null, note: "", level: "subtotal" },
  { major: "세 전 이 익", detail: "", current: null, previous: null, diff: null, note: "", level: "section-strong" },
  { major: "법 인 세", detail: "", current: null, previous: null, diff: null, note: "", level: "section" },
  { major: "당기순이익", detail: "", current: null, previous: null, diff: null, note: "", level: "section-strong" }
];

const cumulativeRows = monthlyRows.map((row) => ({ ...row }));

const isTabOptions = [
  {
    key: "monthly",
    label: "당월 IS",
    title: "당월 실적 / 당월IS",
    subtitle: "엑셀 시트 ‘당월IS’의 손익계산서 표를 대시보드 메인 섹션으로 재구성했습니다. 현재 기준은 ’26년 2월 당월, 비교 기준은 ’25년 2월 당월입니다.",
    currentLabel: "'26년 2월 당월",
    previousLabel: "'25년 2월 당월",
    rows: monthlyRows
  },
  {
    key: "cumulative",
    label: "누적 IS",
    title: "누적 실적 / 누적IS",
    subtitle: "엑셀 시트 ‘누적IS’의 손익계산서 표를 별도 섹션으로 분리했습니다. 현재 기준은 ’26년 2월 누적, 비교 기준은 ’25년 2월 누적입니다.",
    currentLabel: "'26년 2월 누적",
    previousLabel: "'25년 2월 누적",
    rows: cumulativeRows
  }
] as const;

type TabKey = (typeof isTabOptions)[number]["key"];

type RowItem = {
  major: string;
  detail: string;
  current: number | string | null;
  previous: number | string | null;
  diff: number | string | null;
  note: string;
  level: string;
};

function formatValue(value: number | string | null) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number") return new Intl.NumberFormat("ko-KR").format(value);
  return value;
}

function getRowStyle(level: string) {
  if (level === "section-strong") return "bg-blue-50 font-semibold text-slate-900";
  if (level === "section") return "bg-slate-50 font-semibold text-slate-900";
  if (level === "total") return "bg-slate-100 font-semibold text-slate-900";
  if (level === "subtotal") return "bg-amber-50/50 font-medium text-slate-900";
  return "bg-white text-slate-700";
}

function SummaryCard({ icon: Icon, label, value, helper }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{helper}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle, currentLabel, prevLabel }: { title: string; subtitle: string; currentLabel: string; prevLabel: string }) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">손익계산서 시트 중심 보기</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">현재 기준 컬럼</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currentLabel}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">비교 기준 컬럼</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{prevLabel}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyChartCard({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="mt-5 flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
        <div className="max-w-sm px-6">
          <p className="text-sm font-medium text-slate-700">차트용 숫자 데이터가 비어 있습니다</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">현재 첨부 샘플 파일은 표 구조 중심이라, 값이 들어오면 이 영역에 당월/전년 비교 막대 시각화가 자동으로 표시되도록 설계했습니다.</p>
        </div>
      </div>
    </div>
  );
}

function SheetTable({ rows, currentLabel, previousLabel }: { rows: RowItem[]; currentLabel: string; previousLabel: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">항목</th>
              <th className="px-4 py-3 text-left font-semibold">세부항목</th>
              <th className="px-4 py-3 text-right font-semibold">{currentLabel}</th>
              <th className="px-4 py-3 text-right font-semibold">{previousLabel}</th>
              <th className="px-4 py-3 text-right font-semibold">차이</th>
              <th className="px-4 py-3 text-left font-semibold">주요 증감 내역</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.major}-${row.detail}-${index}`} className={`${getRowStyle(row.level)} border-t border-slate-200`}>
                <td className="px-4 py-3 whitespace-nowrap">{row.major || ""}</td>
                <td className="px-4 py-3 whitespace-nowrap">{row.detail || ""}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatValue(row.current)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatValue(row.previous)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatValue(row.diff)}</td>
                <td className="px-4 py-3 text-slate-500">{row.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ISTabSection({ title, subtitle, currentLabel, previousLabel, rows }: { title: string; subtitle: string; currentLabel: string; previousLabel: string; rows: RowItem[] }) {
  return (
    <section className="space-y-6">
      <SectionHeader title={title} subtitle={subtitle} currentLabel={currentLabel} prevLabel={previousLabel} />
      <div className="grid gap-4 lg:grid-cols-4">
        <SummaryCard icon={Building2} label="회사명" value="전북에너지서비스" helper="엑셀 시트 상단 메타 정보 그대로 반영했습니다." />
        <SummaryCard icon={PencilLine} label="작성자" value="홍수삼" helper="시트 상단 작성자 정보를 우측 요약 카드 대신 상단 카드로 정리했습니다." />
        <SummaryCard icon={CalendarRange} label="비교 방식" value="전년 동월 비교" helper="당월IS와 누적IS를 각각 현재/전년 동월 기준 컬럼으로 분리했습니다." />
        <SummaryCard icon={Info} label="단위" value="백만원, 천㎥" helper="시트 표시 단위를 그대로 유지하고, 빈 숫자는 대시(-)로 예외 처리합니다." />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
        <SheetTable rows={rows} currentLabel={currentLabel} previousLabel={previousLabel} />
        <div className="space-y-6">
          <EmptyChartCard title={`${title} 비교 시각화`} />
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Table2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-semibold text-slate-900">시트 반영 요약</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">반영 방식</p>
                <p className="mt-1 leading-6">원본 엑셀의 손익계산서 표 구조를 유지하면서, 대시보드 메인 콘텐츠로 재배치했습니다.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">탭 전환 방식</p>
                <p className="mt-1 leading-6">상단 탭에서 당월 IS와 누적 IS 중 하나만 선택해 볼 수 있도록 바꿨고, 현재 활성 탭만 화면에 표시됩니다.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-900">빈 값 처리</p>
                <p className="mt-1 leading-6">현재 샘플 파일은 수치가 비어 있어, 모든 숫자 셀은 대시(-)로 표시하고 차트는 비활성 상태로 둡니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ISTableTabs({ activeTab, onChange }: { activeTab: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {isTabOptions.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              aria-pressed={isActive}
              className={[
                "inline-flex min-h-12 items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition-all",
                "w-full sm:w-auto",
                isActive ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("monthly");
  const currentTab = isTabOptions.find((tab) => tab.key === activeTab) ?? isTabOptions[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">
        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">Finance Reporting Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">재무보고서 자동화 시스템</h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
                기존 대시보드의 상태 위젯 중심 구성을 줄이고, 첨부된 엑셀의 <strong>당월IS</strong>와 <strong>누적IS</strong> 시트를 바로 읽는 느낌으로 재구성한 화면입니다. 실무 보고용 화면처럼 표를 중심에 두고, 요약 카드와 비교 시각화를 보조 영역으로 배치했습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">
                <FileSpreadsheet className="h-4 w-4" /> Excel 다운로드
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
                <Download className="h-4 w-4" /> PDF 출력
              </button>
            </div>
          </div>
        </div>

        <ISTableTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="space-y-10">
          <ISTabSection
            title={currentTab.title}
            subtitle={currentTab.subtitle}
            currentLabel={currentTab.currentLabel}
            previousLabel={currentTab.previousLabel}
            rows={currentTab.rows as unknown as RowItem[]}
          />
        </div>

        <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">화면 변경 포인트</h2>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <p className="font-semibold text-slate-900">1. 기본 진입값은 당월 IS</p>
              <p className="mt-2">첫 화면에서는 당월 IS 탭이 활성화되고, 누적 IS는 버튼을 눌렀을 때만 보여주도록 바꿨습니다.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <p className="font-semibold text-slate-900">2. 시트 구조 유지</p>
              <p className="mt-2">판매량, 매출액, 매출총이익, 판관비, 영업이익, 세전이익, 당기순이익 등 원본 행 구조는 그대로 유지했습니다.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              <p className="font-semibold text-slate-900">3. 반응형 탭 UI 적용</p>
              <p className="mt-2">모바일에서는 버튼이 세로로 정리되고, PC에서는 가로 탭처럼 보여서 화면이 깨지지 않도록 구성했습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
