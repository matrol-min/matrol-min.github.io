// 빌드된 사이트를 국문/영문 각각 인쇄용 PDF로 변환합니다.
//   _site/index.html     -> cv-ko.pdf
//   _site/en/index.html  -> cv-en.pdf
const puppeteer = require('puppeteer');
const path = require('path');

const targets = [
  { src: '_site/index.html', out: 'cv-ko.pdf' },
  { src: '_site/en/index.html', out: 'cv-en.pdf' },
];

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  for (const t of targets) {
    const page = await browser.newPage();
    await page.goto('file://' + path.resolve(t.src), { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    await page.pdf({
      path: t.out,
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
    });
    await page.close();
    console.log('✅', t.out, '생성 완료');
  }
  await browser.close();
})();
