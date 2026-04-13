# dashboard-redesign

Finance Report Automation Preview

## 설치 및 실행

1. 프로젝트 루트로 이동

```bash
cd /workspaces/dashboard-redesign
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm run dev
```

4. 브라우저에서 열기

`http://localhost:5173`

## 배포

- Vercel이나 Netlify에 연결하면 자동으로 새 URL이 생성됩니다.
- 현재 코드베이스는 React + Vite + Tailwind 기반으로 구성되어 있습니다.

## Vercel 연결

1. Vercel 계정에 로그인합니다.
2. Vercel 대시보드에서 GitHub 저장소 `nsjun99-spec/dashboard-redesign`를 연결합니다.
3. 프레임워크는 `Vite` 또는 `React`로 자동 감지됩니다.
4. 빌드 명령: `npm run build`
5. 출력 디렉터리: `dist`

### CLI 배포

```bash
cd /workspaces/dashboard-redesign
npx vercel login
npx vercel --prod --confirm
```

> `npx vercel login`에서 생성된 코드를 `https://vercel.com/device`에 입력하여 인증을 완료해주세요.
