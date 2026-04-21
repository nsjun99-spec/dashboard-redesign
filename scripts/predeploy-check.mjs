import fs from 'node:fs';
import { execSync } from 'node:child_process';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  const app = read('src/App.jsx');
  const store = read('src/store/useFinanceStore.js');
  const vercel = JSON.parse(read('vercel.json'));

  assert(!app.includes('보고서 생성'), '사이드바에 "보고서 생성" 텍스트가 남아 있습니다.');
  assert(store.includes('재무상태표') && store.includes('손익계산서') && store.includes('LNG매출 부피') && store.includes('LNG매출 열량'), '4개 독립 업로드 항목이 모두 존재해야 합니다.');
  assert(app.includes('type="month"'), '기준월 선택 UI(type=month)가 필요합니다.');
  assert(vercel?.builds?.[0]?.use === '@vercel/static-build', 'vercel.json build 설정이 static-build가 아닙니다.');

  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ predeploy:check 통과 - 배포 전 필수 조건과 빌드가 정상입니다.');
} catch (error) {
  console.error(`\n❌ predeploy:check 실패 - ${error.message}`);
  process.exit(1);
}
