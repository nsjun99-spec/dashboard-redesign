# dashboard-redesign

재무보고서 자동화 웹사이트 (React + Vite + Tailwind)

## 1) 로컬 실행

```bash
cd /workspace/dashboard-redesign
npm install
npm run dev
```

브라우저: `http://localhost:5173`

---

## 2) 배포 전 점검(Pre-Deploy)

배포 직전에 아래 명령 1개만 실행하면,
- 필수 기능 문자열 체크(사이드바/업로드4분할/기준월 UI)
- Vercel 설정 체크
- 프로덕션 빌드
를 한 번에 확인합니다.

```bash
npm run predeploy:check
```

정상 통과 시:

```text
✅ predeploy:check 통과 - 배포 전 필수 조건과 빌드가 정상입니다.
```

---

## 3) Vercel 배포 설정

### 대시보드에서 프로젝트 연결
1. Vercel에서 Git 저장소 연결
2. Framework Preset: `Other` 또는 `Vite` 자동 감지
3. Build Command: `npm run build` (또는 `npm run vercel-build`)
4. Output Directory: `dist`

### 현재 vercel.json
- `@vercel/static-build` 사용
- SPA 라우팅을 `index.html`로 rewrite

---

## 4) CLI 배포

```bash
npx vercel login
npx vercel --prod --confirm
```

배포 완료 후 Vercel이 발급한 URL에서 아래를 확인하세요.

- 사이드바: `보고서 생성` 없음
- 업로드 4분할 카드 노출
- `.xlsx/.xls` 검증 메시지
- 기준월 변경 시 대시보드 값 재계산

---

## 5) 문제 해결 팁

- 업로드 파싱이 실패하면 네트워크/CSP 정책으로 외부 SheetJS CDN이 차단되었을 수 있습니다.
- 이 경우 브라우저 콘솔의 파서 로딩 에러 메시지를 확인해 허용 도메인 정책(CSP)을 조정하세요.
