import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  UploadCloud,
  Database,
  Search,
  Plus,
  Save,
  FileText,
  Clock3,
  TrendingUp,
  TrendingDown,
  FolderOpen,
} from "lucide-react";

const navItems = [
  { key: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { key: "upload", label: "데이터 업로드", icon: UploadCloud },
  { key: "validation", label: "검증 및 매핑", icon: ShieldCheck },
  { key: "reports", label: "보고서 생성", icon: FileSpreadsheet },
  { key: "settings", label: "운영 설정", icon: Settings2 },
];

const statusTone = {
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  neutral: "bg-blue-50 text-blue-700 border-blue-200",
};

const months = ["2026-03", "2026-02", "2026-01"];

const uploads = [
  { type: "재무상태표", file: "BS_2026-03.xlsx", total: 182, success: 182, failed: 0, status: "ready" },
  { type: "손익계산서", file: "PL_2026-03.xlsx", total: 214, success: 212, failed: 2, status: "warning" },
  { type: "LNG 매출 부피/열량", file: "LNG_SALES_2026-03.xlsx", total: 98, success: 95, failed: 3, status: "warning" },
];

const validationRows = [
  { item: "매출액", source: "PL", mapped: "손익계산서 > 매출", value: "12,480,000,000", mom: "+8.4%", yoy: "+5.2%", issue: "정상", level: "ready" },
  { item: "영업이익", source: "PL", mapped: "손익계산서 > 영업이익", value: "1,920,000,000", mom: "+3.1%", yoy: "+2.6%", issue: "정상", level: "ready" },
  { item: "LNG 판매량", source: "매출명세서", mapped: "영업보고 > 판매량", value: "184,220", mom: "+31.2%", yoy: "+14.1%", issue: "급격한 증가", level: "warning" },
  { item: "지급수수료", source: "PL", mapped: "미매핑", value: "-", mom: "-", yoy: "-", issue: "매핑 필요", level: "warning" },
  { item: "감가상각비", source: "PL", mapped: "손익계산서 > 감가상각비", value: "880,000,000", mom: "-18.7%", yoy: "-2.1%", issue: "감소 원인 확인", level: "warning" },
];

const reports = [
  { name: "2026년 3월 월별 실적보고서", type: "실적보고서", version: "v0.9", status: "검토중", updated: "2026.04.05 16:20" },
  { name: "2026년 3월 이사회 영업보고서", type: "이사회 자료", version: "v0.7", status: "초안", updated: "2026.04.05 16:21" },
];

const mappingRules = [
  { sourceType: "PL", accountCode: "410100", accountName: "매출액", target: "실적보고서.sales", formula: "SUM", priority: 1 },
  { sourceType: "PL", accountCode: "520300", accountName: "영업이익", target: "실적보고서.operatingProfit", formula: "DIRECT", priority: 1 },
  { sourceType: "SALES", accountCode: "LNG_VOL", accountName: "LNG매출 부피", target: "영업보고.salesVolume", formula: "SUM", priority: 2 },
];

function Badge({ children, tone = "neutral" }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[tone]}`}>
      {children}
    </span>
  );
}

function Card({ title, subtitle, right, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function KpiCard({ title, value, note, tone, trend }) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : BarChart3;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-2xl p-2 ${tone === "warning" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>
          <TrendIcon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{note}</p>
    </div>
  );
}

function StepBar() {
  const steps = ["데이터 업로드", "검증 및 매핑", "보고서 미리보기", "다운로드/확정"];
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, idx) => (
        <div key={step} className={`rounded-2xl border p-4 ${idx === 0 ? "border-blue-200 bg-blue-50" : idx < 2 ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${idx === 0 ? "bg-blue-600 text-white" : idx < 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
              {idx + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{step}</p>
              <p className="mt-1 text-xs text-slate-500">업무 진행 상태 표시</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card
          title="2026년 3월 결산 보고 준비 상태"
          subtitle="월별 재무 원천 데이터 업로드 → 검증 → 보고서 생성 흐름"
          right={<Badge tone="pending">자료 수집 중</Badge>}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">기준월</p>
              <p className="mt-2 text-xl font-semibold">2026년 3월</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">마지막 생성</p>
              <p className="mt-2 text-xl font-semibold">2026.04.05 16:20</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">검토 포인트</p>
              <p className="mt-2 text-xl font-semibold text-amber-600">5건</p>
            </div>
          </div>
        </Card>

        <Card title="현재 상태 요약" subtitle="업로드, 검증, 생성 진행률">
          <div className="space-y-3">
            {[
              ["업로드 완료 여부", "3 / 4", "warning"],
              ["검증 오류 건수", "5건", "warning"],
              ["보고서 생성 상태", "초안 완료", "neutral"],
              ["데이터 저장 준비", "Supabase 연결 가능", "ready"],
            ].map(([label, value, tone]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-600">{label}</p>
                <Badge tone={tone}>{value}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <StepBar />

      <div className="grid gap-4 lg:grid-cols-4">
        <KpiCard title="당월 매출" value="₩12,480,000,000" note="전월 대비 +8.4%" tone="neutral" trend="up" />
        <KpiCard title="영업이익" value="₩1,920,000,000" note="전월 대비 +3.1%" tone="neutral" trend="up" />
        <KpiCard title="판매량" value="184,220" note="LNG 판매량 샘플 기준" tone="neutral" trend="flat" />
        <KpiCard title="이상 징후" value="2건" note="급증/급감 또는 대사 필요 항목" tone="warning" trend="down" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="최근 생성 보고서" subtitle="생성 이력과 상태 확인">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">보고서명</th>
                  <th className="px-4 py-3 text-left font-semibold">유형</th>
                  <th className="px-4 py-3 text-left font-semibold">버전</th>
                  <th className="px-4 py-3 text-left font-semibold">상태</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.name} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-4 font-medium text-slate-900">{r.name}</td>
                    <td className="px-4 py-4 text-slate-600">{r.type}</td>
                    <td className="px-4 py-4 text-slate-600">{r.version}</td>
                    <td className="px-4 py-4"><Badge tone={r.status === "검토중" ? "warning" : "pending"}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="자동화 방향" subtitle="업무 현실에 맞춘 3가지 플랜">
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">Plan A</p>
              <p className="mt-2 text-sm text-slate-600">SAP 직접 연동 후 버튼 한 번으로 보고서 생성</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="font-semibold text-slate-900">Plan B</p>
              <p className="mt-2 text-sm text-slate-600">SAP 원본 Excel/CSV 업로드 기반 자동 보고서 생성</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">Plan C</p>
              <p className="mt-2 text-sm text-slate-600">기존 엑셀 양식에 버튼을 두고 자동화 실행</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function UploadPage() {
  return (
    <div className="space-y-6">
      <Card title="파일 업로드" subtitle="재무상태표, 손익계산서, 매출 명세서 등 원천 파일을 업로드합니다.">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <UploadCloud className="h-7 w-7" />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-900">여기에 파일을 끌어오거나 선택하세요</p>
            <p className="mt-2 text-sm text-slate-500">CSV, XLSX 업로드 가능 · 여러 파일 동시 업로드 가능</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">파일 선택</button>
              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">예시 양식 다운로드</button>
            </div>
          </div>

          <div className="space-y-3">
            {uploads.map((u) => (
              <div key={u.file} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{u.type}</p>
                    <p className="mt-1 text-sm text-slate-500">{u.file}</p>
                  </div>
                  <Badge tone={u.status}>{u.status === "ready" ? "정상" : "검토 필요"}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">총 행수</p><p className="mt-1 font-semibold">{u.total}</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">성공</p><p className="mt-1 font-semibold text-emerald-600">{u.success}</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">실패</p><p className="mt-1 font-semibold text-rose-600">{u.failed}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="성공 데이터 미리보기" subtitle="정상 인식된 행 샘플">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left">기준월</th>
                  <th className="px-4 py-3 text-left">계정코드</th>
                  <th className="px-4 py-3 text-left">계정명</th>
                  <th className="px-4 py-3 text-left">금액</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["2026-03", "410100", "매출액", "12,480,000,000"],
                  ["2026-03", "520300", "영업이익", "1,920,000,000"],
                  ["2026-03", "LNG_VOL", "LNG매출 부피", "184,220"],
                ].map((row) => (
                  <tr key={row.join("")} className="border-t border-slate-200">
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-3 text-slate-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="실패 데이터 미리보기" subtitle="사용자가 다시 확인해야 하는 행">
          <div className="space-y-3">
            {[
              ["PL_2026-03.xlsx", "37행", "금액 형식이 잘못되었습니다"],
              ["LNG_SALES_2026-03.xlsx", "11행", "필수 컬럼이 없습니다: 열량"],
              ["LNG_SALES_2026-03.xlsx", "18행", "기준월 형식이 잘못되었습니다"],
            ].map(([file, row, msg]) => (
              <div key={file + row} className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{file} · {row}</p>
                  <Badge tone="warning">오류</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{msg}</p>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">저장</button>
              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">재업로드</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ValidationPage() {
  const [onlyIssues, setOnlyIssues] = useState(false);
  const rows = useMemo(() => (onlyIssues ? validationRows.filter((r) => r.level !== "ready") : validationRows), [onlyIssues]);

  return (
    <div className="space-y-6">
      <Card
        title="검증 및 매핑"
        subtitle="업로드된 값이 어떤 보고 항목에 들어가는지 확인하고, 누락/불일치/이상 변동을 검토합니다."
        right={
          <div className="flex flex-wrap gap-2">
            <button className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">자동 매핑 실행</button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">재검증</button>
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">자동 매핑률</p><p className="mt-2 text-2xl font-bold">92%</p></div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">누락 항목</p><p className="mt-2 text-2xl font-bold text-amber-600">3건</p></div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">이상 증감</p><p className="mt-2 text-2xl font-bold text-amber-600">2건</p></div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">중복 의심</p><p className="mt-2 text-2xl font-bold">0건</p></div>
        </div>
      </Card>

      <Card title="오류/경고 필터" subtitle="검토가 필요한 항목만 빠르게 볼 수 있습니다.">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setOnlyIssues((v) => !v)} className={`rounded-2xl px-4 py-2.5 text-sm font-medium ${onlyIssues ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
            누락 항목만 보기
          </button>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">오류 데이터 필터</button>
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">수동 수정/저장</button>
        </div>
      </Card>

      <Card title="검증 결과 표" subtitle="전월/전년 동월 대비 증감과 매핑 상태를 함께 확인합니다.">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {['항목', '원천', '매핑 대상', '값', '전월 대비', '전년 동월 대비', '검토 결과'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.item} className="border-t border-slate-200 bg-white">
                  <td className="px-4 py-4 font-medium text-slate-900">{row.item}</td>
                  <td className="px-4 py-4 text-slate-600">{row.source}</td>
                  <td className="px-4 py-4 text-slate-600">{row.mapped}</td>
                  <td className="px-4 py-4 text-slate-700">{row.value}</td>
                  <td className="px-4 py-4 text-slate-700">{row.mom}</td>
                  <td className="px-4 py-4 text-slate-700">{row.yoy}</td>
                  <td className="px-4 py-4"><Badge tone={row.level}>{row.issue}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card
        title="보고서 미리보기 및 생성"
        subtitle="실적보고서와 이사회 자료용 양식을 같은 데이터로 생성합니다."
        right={
          <div className="flex flex-wrap gap-2">
            <button className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">Excel 다운로드</button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">PDF 다운로드</button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">보고서 확정</button>
          </div>
        }
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">실적보고서</p>
                <h4 className="mt-1 text-lg font-semibold text-slate-900">2026년 3월 월별 실적보고서</h4>
              </div>
              <Badge tone="warning">검토중</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["매출", "₩12,480,000,000"],
                ["영업이익", "₩1,920,000,000"],
                ["판매량", "184,220"],
                ["증감 요인", "수동 코멘트 입력"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">요약 코멘트</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">전월 대비 매출은 증가했으며, LNG 판매량 급증과 일부 비용 감소 항목에 대한 확인이 필요합니다. 초기 버전에서는 이 영역을 사용자가 직접 입력합니다.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">이사회 자료</p>
                <h4 className="mt-1 text-lg font-semibold text-slate-900">2026년 3월 영업보고서</h4>
              </div>
              <Badge tone="pending">초안</Badge>
            </div>
            <div className="space-y-3">
              {[
                ["매출", "₩12,480,000,000", "+8.4%"],
                ["영업이익", "₩1,920,000,000", "+3.1%"],
                ["LNG 판매량", "184,220", "+31.2%"],
                ["주요 검토 포인트", "2건", "경고"],
              ].map(([label, value, delta]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 font-semibold text-slate-900">{value}</p>
                  </div>
                  <Badge tone={delta === "경고" ? "warning" : "neutral"}>{delta}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">미리보기 설명</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">초기 버전은 웹 화면 내 미리보기와 Excel 다운로드를 우선 지원하고, PDF는 브라우저 인쇄 또는 서버 렌더링으로 확장할 수 있게 설계합니다.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="매핑 규칙 관리" subtitle="계정 코드나 계정명 기준으로 보고서 항목 연결 규칙을 설정합니다.">
          <div className="mb-4 flex flex-wrap gap-2">
            <button className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">계정 매핑 규칙 추가</button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">수정</button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">삭제</button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['원천', '계정코드', '계정명', '대상 키', '수식', '우선순위'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mappingRules.map((r) => (
                  <tr key={r.accountCode} className="border-t border-slate-200 bg-white">
                    <td className="px-4 py-3 text-slate-700">{r.sourceType}</td>
                    <td className="px-4 py-3 text-slate-700">{r.accountCode}</td>
                    <td className="px-4 py-3 text-slate-700">{r.accountName}</td>
                    <td className="px-4 py-3 text-slate-700">{r.target}</td>
                    <td className="px-4 py-3 text-slate-700">{r.formula}</td>
                    <td className="px-4 py-3 text-slate-700">{r.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="검증 기준 및 템플릿" subtitle="운영 설정을 바꾸면 하드코딩 없이 화면/검증 동작을 조정할 수 있습니다.">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">전월 대비 경고 임계치</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">30%</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">전년 동월 대비 경고 임계치</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">20%</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">활성 템플릿 버전</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">board-v1 / monthly-v1</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">템플릿 업로드</button>
              <button className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">검증 기준 저장</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [search, setSearch] = useState("");

  const filteredNav = useMemo(() => {
    return navItems.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Finance Ops</p>
            <h1 className="mt-2 text-xl font-bold">재무보고서 자동화</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">월 결산 데이터를 업로드하고, 검증·매핑·보고서 생성까지 한 번에 처리하는 업무 시스템</p>
          </div>

          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="메뉴 검색" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-4">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const activeStyle = active === item.key;
              return (
                <button key={item.key} onClick={() => setActive(item.key)} className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${activeStyle ? "border-blue-200 bg-blue-50" : "border-transparent hover:border-slate-200 hover:bg-slate-50"}`}>
                  <div className={`mt-0.5 rounded-xl p-2 ${activeStyle ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">업무 흐름 기반 관리자 화면</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-6">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold">현재 목표</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Plan B를 먼저 완성하고, 나중에 SAP 직접 연동과 로그인/권한 기능으로 확장</p>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-semibold">업무형 관리자 대시보드</p>
                </div>
                <p className="mt-1 text-sm text-slate-500">흰색 배경 · 회색 구분선 · 포인트 블루</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className="mb-1 text-xs font-medium text-slate-500">기준월 선택</p>
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="min-w-[160px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none">
                    {months.map((month) => (
                      <option key={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"><Plus className="h-4 w-4" />새 보고서 생성</button>
                <Badge tone="ready">Supabase 확장 가능</Badge>
              </div>
            </div>
          </header>

          <main className="space-y-6 p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">전체 설계 미리보기</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight">재무보고서 자동화 서비스</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">원천 재무 데이터를 업로드하면 검증·매핑·보고서 생성까지 자동으로 이어지고, 사람은 마지막 검토만 하면 되도록 설계한 업무 시스템입니다.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"><FolderOpen className="h-4 w-4" />최근 업로드 보기</button>
                  <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"><AlertTriangle className="h-4 w-4" />오류 내역 확인</button>
                </div>
              </div>

              {active === "dashboard" && <DashboardPage />}
              {active === "upload" && <UploadPage />}
              {active === "validation" && <ValidationPage />}
              {active === "reports" && <ReportsPage />}
              {active === "settings" && <SettingsPage />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
