# 🏋️ CrossFit WOD 생성기

크로스핏 운동을 더 스마트하게 — 벤치마크 WOD 구조를 기반으로 나만의 WOD를 만들어보세요.

---

## 📱 앱 미리보기

| 랜덤 WOD 생성 | 커스텀 WOD | 동작 목록 |
|:---:|:---:|:---:|
| 방식·난이도를 고르면 벤치마크 구조로 자동 생성 | 원하는 동작을 직접 골라 최적 구조 자동 매칭 | 40여 가지 동작을 카테고리별로 탐색 |

---

## ✨ 주요 기능

### 🎲 랜덤 WOD 생성
- **운동 방식** 선택 — For Time / AMRAP / EMOM
- **난이도** 선택 — 입문(Scaled) / 중급 / RX
- Fran·Helen·Cindy 등 **실제 벤치마크 WOD 구조**를 기반으로 생성
- 생성된 WOD의 개수를 **바로 ± 조절** 가능

### ✏️ 커스텀 WOD
- 내가 하고 싶은 동작만 직접 선택
- 선택한 동작들의 패턴을 분석해 **가장 잘 맞는 WOD 구조 자동 선택**
- 방식·난이도 설정 후 결과 확인

### 📋 동작 목록
- 약 **40가지** 크로스핏 동작 수록
- **카테고리 필터** (체조 / 역도 / 유산소 / 코어)
- **검색** 지원 (한글·영문)
- 난이도별 기본 개수 한눈에 확인

---

## 🧩 WOD 템플릿 시스템

단순 랜덤 배치 대신, **실제 크로스핏 벤치마크 WOD의 구조(템플릿)** 를 참고해서 생성합니다.
각 템플릿은 어떤 패턴의 동작이 몇 개, 어떤 rep 방식으로 구성되는지를 정의합니다.

| 템플릿 | 구조 | Rep 방식 | 참고 WOD |
|---|---|---|---|
| **Fran 스타일** | 역도(full-body) + 체조(당기기) | 21-15-9 | Fran |
| **Helen 스타일** | 유산소 + 힌지 + 당기기 | 3 Rounds | Helen |
| **DT 스타일** | 힌지 → 풀(Olympic) → 밀기 | 5 Rounds 12-9-6 | DT |
| **Isabel 스타일** | 올림픽 리프트 1가지 | 30회 For Time | Isabel, Grace |
| **Chipper** | 유산소→당기기→힌지→밀기→코어 | 5가지 1회씩 | Various |
| **래더 10-1** | 체조/역도 2가지 | 10-9-8…1 | Various |
| **Push-Pull** | 체조 밀기 + 당기기 | 21-15-9 | Various |
| **Cindy 스타일** | 당기기·밀기·스쿼트 | AMRAP 20분 | Cindy, Mary |
| **파워 AMRAP** | 역도 + 체조 + 유산소 | AMRAP 15분 | Various |
| **코어 AMRAP** | 코어 + 밀기 + 유산소 | AMRAP 12분 | Various |
| **역도 EMOM** | 올림픽 리프트 2종 교대 | 16분 EMOM | Various |
| **인터벌 EMOM** | 체조 + 유산소 교대 | 20분 EMOM | Various |

### 동작 패턴 매칭

각 동작에는 `movementPattern`이 부여되어 있어, 템플릿 슬롯에 **의미 있는 동작만** 배치됩니다.

| 패턴 | 예시 동작 |
|---|---|
| `pull` (당기기) | 풀업, 체스트 투 바 |
| `push` (밀기) | HSPU, 링 딥, 푸쉬 프레스 |
| `squat` (스쿼트) | 프론트 스쿼트, 박스 점프 |
| `hinge` (힌지) | 데드리프트, 케틀벨 스윙 |
| `total` (전신) | 스러스터, 파워 클린, 스내치 |
| `mono` (유산소) | 달리기, 로잉, 에어 바이크 |
| `core` (코어) | 싯업, 토즈투바, 할로우 락 |

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
├── types/index.ts          # 공유 타입 정의 (Movement, Wod, MovementPattern 등)
├── data/movements.ts       # 크로스핏 동작 라이브러리 (~40가지, 패턴 포함)
├── utils/wodGenerator.ts   # WOD 템플릿 정의 및 생성 로직
├── screens/
│   ├── GeneratorScreen.tsx  # 랜덤 WOD 탭
│   ├── CustomWodScreen.tsx  # 커스텀 WOD 탭
│   └── MovementsScreen.tsx  # 동작 목록 탭
└── components/
    ├── MovementCard.tsx     # 동작 카드 (선택/탐색용)
    └── WodResultCard.tsx    # WOD 결과 카드 (rep 방식별 표시 + ±조절)
```

---

## ➕ 동작 추가하는 법

`src/data/movements.ts` 파일의 `MOVEMENTS` 배열에 항목을 추가하세요.

```typescript
{
  id: 'ring-row',              // 고유 ID (kebab-case)
  nameKo: '링 로우',
  nameEn: 'Ring Row',
  category: 'gymnastics',      // gymnastics | weightlifting | cardio | core
  movementPattern: 'pull',     // push | pull | squat | hinge | total | mono | core
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
