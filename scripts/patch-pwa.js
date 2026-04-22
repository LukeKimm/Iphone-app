#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const htmlPath = path.join(distDir, 'index.html');

let html = fs.readFileSync(htmlPath, 'utf8');

const pwaTags = `
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json" />
    <!-- iOS 홈화면 설치 지원 -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="WOD" />
    <link rel="apple-touch-icon" href="/assets/icon.png" />`;

// viewport에 viewport-fit=cover 추가
html = html.replace(
  'width=device-width, initial-scale=1, shrink-to-fit=no',
  'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
);

// </head> 직전에 PWA 태그 삽입
html = html.replace('</head>', pwaTags + '\n  </head>');

// body 배경색
html = html.replace(
  'html,\n      body {\n        height: 100%;\n      }',
  'html,\n      body {\n        height: 100%;\n        background-color: #121212;\n      }'
);

fs.writeFileSync(htmlPath, html);

// public/ 파일 복사
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  fs.readdirSync(publicDir).forEach(file => {
    fs.copyFileSync(path.join(publicDir, file), path.join(distDir, file));
    console.log(`Copied: ${file}`);
  });
}

// assets 복사 (아이콘 등)
const assetsDir = path.join(__dirname, '..', 'assets');
const distAssetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(distAssetsDir)) fs.mkdirSync(distAssetsDir, { recursive: true });
fs.readdirSync(assetsDir).forEach(file => {
  fs.copyFileSync(path.join(assetsDir, file), path.join(distAssetsDir, file));
});

console.log('PWA patch complete.');
