const fs = require('fs');
const path = require('path');

const dirName = process.argv[2];

if (!dirName) {
  console.error('❌ 폴더명을 입력해주세요!');
  process.exit(1);
}

const fullPath = path.resolve(process.cwd(), dirName);

fs.mkdirSync(fullPath, { recursive: true });
console.log(`✅ 폴더 재 생성됨: ${fullPath}`);
