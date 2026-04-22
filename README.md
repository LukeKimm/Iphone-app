# 🏋️ CrossFit WOD 생성기

크로스핏 운동을 더 스마트하게 — 랜덤 또는 커스텀으로 나만의 WOD를 만들어보세요.

---

## 📱 앱 미리보기

| 랜덤 WOD 생성 | 커스텀 WOD | 동작 목록 |
|:---:|:---:|:---:|
| 방식·난이도·동작 수를 고르면 자동 생성 | 원하는 동작을 직접 골라서 구성 | 40여 가지 동작을 카테고리별로 탐색 |

---

## ✨ 주요 기능

### 🎲 랜덤 WOD 생성
- **운동 방식** 선택 — For Time / AMRAP / EMOM
- **난이도** 선택 — 입문(Scaled) / 중급 / RX
- **동작 수** 선택 — 2 ~ 8가지
- 생성된 WOD의 개수를 **바로 ± 조절** 가능

### ✏️ 커스텀 WOD
- 내가 하고 싶은 동작만 직접 선택
- 선택한 동작 안에서 랜덤 배치
- 방식·난이도 설정 후 결과 확인

### 📋 동작 목록
- 약 **40가지** 크로스핏 동작 수록
- **카테고리 필터** (체조 / 역도 / 유산소 / 코어)
- **검색** 지원 (한글·영문)
- 난이도별 기본 개수 한눈에 확인

---

## 📲 iPhone에 앱으로 설치하기

> App Store 없이, **무료로** iPhone 홈 화면에 설치할 수 있습니다.

### 방법 1 — 이미 배포된 URL이 있다면 (가장 쉬움)

1. iPhone에서 **Safari** 로 앱 URL 접속
2. 하단 **공유 버튼** (□↑) 탭
3. **"홈 화면에 추가"** 탭
4. 이름 확인 후 **"추가"** 탭

홈 화면에 아이콘이 생기고, 탭하면 전체화면 앱처럼 실행됩니다.

---

### 방법 2 — 직접 배포하기 (Vercel 사용, 무료)

#### 준비물
- [Node.js](https://nodejs.org) 설치
- [Vercel 계정](https://vercel.com) (GitHub 계정으로 무료 가입)

#### 순서

**① 저장소 클론**
```bash
git clone https://github.com/lukekimm/iphone-app.git
cd iphone-app
```

**② 패키지 설치**
```bash
npm install
```

**③ Vercel CLI 설치** (처음 한 번만)
```bash
npm install -g vercel
```

**④ 빌드 & 배포**
```bash
npm run build:web
npx vercel dist --prod
```

> 처음 실행 시 Vercel 로그인 화면이 나타납니다. 이메일 또는 GitHub로 로그인하세요.

배포가 완료되면 터미널에 아래처럼 URL이 출력됩니다.

```
✅  Production: https://crossfit-wod-xxx.vercel.app
```

**⑤ iPhone Safari에서 해당 URL 접속 → 홈 화면에 추가**

---

## 🛠 개발 환경 설정

```bash
# 패키지 설치
npm install

# 개발 서버 시작 (브라우저)
npx expo start --web

# 개발 서버 시작 (Expo Go 앱으로 iPhone 실시간 테스트)
npx expo start
# → Expo Go 앱을 iPhone에 설치한 후 QR 코드 스캔

# 타입 체크
npx tsc --noEmit
```

---

## 🗂 프로젝트 구조

```
src/
├── types/index.ts          # 공유 타입 정의 (Movement, Wod, WodType 등)
├── data/movements.ts       # 크로스핏 동작 라이브러리 (~40가지)
├── utils/wodGenerator.ts   # WOD 생성 로직 (셔플, 카테고리 밸런싱)
├── screens/
│   ├── GeneratorScreen.tsx  # 랜덤 WOD 탭
│   ├── CustomWodScreen.tsx  # 커스텀 WOD 탭
│   └── MovementsScreen.tsx  # 동작 목록 탭
└── components/
    └── MovementCard.tsx     # 동작 카드 (개수 조절 포함)
```

---

## 🏃 동작 카테고리

| 카테고리 | 예시 |
|---|---|
| 🔴 체조 (Gymnastics) | 풀업, 머슬업, 토즈투바, 핸드스탠드 푸쉬업 |
| 🟢 역도 (Weightlifting) | 데드리프트, 파워 클린, 스러스터, 케틀벨 스윙 |
| 🔵 유산소 (Cardio) | 로잉, 에어 바이크, 더블언더, 달리기 |
| 🟡 코어 (Core) | 싯업, 토즈투바, 할로우 락, 플랭크 |

---

## ➕ 동작 추가하는 법

`src/data/movements.ts` 파일의 `MOVEMENTS` 배열에 항목을 추가하세요.

```typescript
{
  id: 'ring-row',              // 고유 ID (kebab-case)
  nameKo: '링 로우',
  nameEn: 'Ring Row',
  category: 'gymnastics',      // gymnastics | weightlifting | cardio | core
  defaultReps: {
    beginner: 15,
    intermediate: 20,
    rx: 25,
  },
  unit: 'reps',                // reps | calories | meters | seconds
}
```

---

## 🧰 기술 스택

| 항목 | 내용 |
|---|---|
| 프레임워크 | [Expo](https://expo.dev) + React Native |
| 언어 | TypeScript |
| 네비게이션 | React Navigation (Bottom Tabs) |
| 웹/PWA 배포 | Expo Web + Vercel |
| 스타일 | React Native StyleSheet (다크 테마) |

---

## 📝 라이선스

MIT
