import { Movement, Wod, WodMovement, WodType, DifficultyLevel, Category, MovementPattern } from '../types';
import { MOVEMENTS } from '../data/movements';

// ─── 내부 타입 ───────────────────────────────────────────────────────────────

interface MovementSlot {
  categories: Category[];
  patterns: MovementPattern[];
  /** RX 기준 개수. 난이도에 따라 스케일됨 */
  repsRx: number;
}

type RepStyle = 'pyramid' | 'rounds' | 'chipper' | 'amrap' | 'emom';

interface WodTemplateConfig {
  name: string;
  description: string;
  wodType: WodType;
  slots: MovementSlot[];
  repStyle: RepStyle;
  /** pyramid일 때 RX 라운드별 rep 목록 e.g. [21,15,9] */
  pyramidSchemeRx?: number[];
  /** rounds/amrap/emom일 때 총 라운드(분) 수 */
  rounds?: number;
  timeCap?: number;
}

// ─── WOD 템플릿 정의 ─────────────────────────────────────────────────────────
// 실제 크로스핏 벤치마크 WOD 구조를 참고했습니다.

const WOD_TEMPLATES: WodTemplateConfig[] = [
  // ── FOR TIME ───────────────────────────────────────────────

  {
    // Fran (21-15-9): Thruster + Pull-up
    name: 'Fran 스타일',
    description: '역도(full-body) + 체조(당기기) · 21-15-9',
    wodType: 'forTime',
    slots: [
      { categories: ['weightlifting'], patterns: ['total'], repsRx: 21 },
      { categories: ['gymnastics'], patterns: ['pull', 'total'], repsRx: 21 },
    ],
    repStyle: 'pyramid',
    pyramidSchemeRx: [21, 15, 9],
    timeCap: 10,
  },
  {
    // Isabel (30 reps): 올림픽 리프트 단일 동작
    name: 'Isabel 스타일',
    description: '올림픽 리프트 1가지 · 30회 For Time',
    wodType: 'forTime',
    slots: [
      { categories: ['weightlifting'], patterns: ['total'], repsRx: 30 },
    ],
    repStyle: 'chipper',
    timeCap: 8,
  },
  {
    // Helen: 400m Run + 21 KB Swing + 12 Pull-up × 3
    name: 'Helen 스타일',
    description: '유산소 + 힌지 + 당기기 · 3라운드',
    wodType: 'forTime',
    slots: [
      { categories: ['cardio'], patterns: ['mono'], repsRx: 400 },
      { categories: ['weightlifting'], patterns: ['hinge'], repsRx: 21 },
      { categories: ['gymnastics'], patterns: ['pull', 'total'], repsRx: 12 },
    ],
    repStyle: 'rounds',
    rounds: 3,
    timeCap: 15,
  },
  {
    // DT: Deadlift + Hang PC + Push Jerk × 5
    name: 'DT 스타일',
    description: '바벨 3종 콤플렉스(힌지→풀→푸시) · 5라운드',
    wodType: 'forTime',
    slots: [
      { categories: ['weightlifting'], patterns: ['hinge'], repsRx: 12 },
      { categories: ['weightlifting'], patterns: ['total'], repsRx: 9 },
      { categories: ['weightlifting'], patterns: ['push'], repsRx: 6 },
    ],
    repStyle: 'rounds',
    rounds: 5,
    timeCap: 12,
  },
  {
    // Chipper: 유산소 → 당기기 → 힌지 → 밀기 → 코어
    name: 'Chipper',
    description: '5가지 동작을 한 번씩 고반복으로',
    wodType: 'forTime',
    slots: [
      { categories: ['cardio'], patterns: ['mono'], repsRx: 50 },
      { categories: ['gymnastics'], patterns: ['pull', 'total'], repsRx: 40 },
      { categories: ['weightlifting'], patterns: ['hinge', 'total'], repsRx: 30 },
      { categories: ['gymnastics', 'weightlifting'], patterns: ['push'], repsRx: 20 },
      { categories: ['core', 'gymnastics'], patterns: ['core'], repsRx: 10 },
    ],
    repStyle: 'chipper',
    timeCap: 25,
  },
  {
    // Death by ladder: 체조 2종 10→1
    name: '래더 (10-1)',
    description: '2가지 동작 · 10-9-8…1 내림차순',
    wodType: 'forTime',
    slots: [
      { categories: ['gymnastics', 'weightlifting'], patterns: ['pull', 'total'], repsRx: 10 },
      { categories: ['gymnastics', 'weightlifting'], patterns: ['push', 'hinge', 'squat'], repsRx: 10 },
    ],
    repStyle: 'pyramid',
    pyramidSchemeRx: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    timeCap: 20,
  },
  {
    // 당기기 + 밀기 21-15-9 (HSPU + C2B 등)
    name: 'Push-Pull',
    description: '밀기 + 당기기 체조 · 21-15-9',
    wodType: 'forTime',
    slots: [
      { categories: ['gymnastics'], patterns: ['push'], repsRx: 21 },
      { categories: ['gymnastics'], patterns: ['pull'], repsRx: 21 },
    ],
    repStyle: 'pyramid',
    pyramidSchemeRx: [21, 15, 9],
    timeCap: 12,
  },

  // ── AMRAP ──────────────────────────────────────────────────

  {
    // Cindy: 5 Pull / 10 Push / 15 Squat
    name: 'Cindy 스타일',
    description: '체조 3종(당기기·밀기·스쿼트) · AMRAP',
    wodType: 'amrap',
    slots: [
      { categories: ['gymnastics'], patterns: ['pull', 'total'], repsRx: 5 },
      { categories: ['gymnastics'], patterns: ['push'], repsRx: 10 },
      { categories: ['gymnastics', 'weightlifting'], patterns: ['squat', 'total'], repsRx: 15 },
    ],
    repStyle: 'amrap',
    rounds: 20,
  },
  {
    // 역도 + 체조 + 유산소 AMRAP
    name: '파워 AMRAP',
    description: '역도 + 체조 + 유산소 · AMRAP',
    wodType: 'amrap',
    slots: [
      { categories: ['weightlifting'], patterns: ['total', 'hinge'], repsRx: 10 },
      { categories: ['gymnastics'], patterns: ['pull', 'push', 'total'], repsRx: 8 },
      { categories: ['cardio'], patterns: ['mono'], repsRx: 10 },
    ],
    repStyle: 'amrap',
    rounds: 15,
  },
  {
    // 코어 강화 AMRAP
    name: '코어 AMRAP',
    description: '코어 + 유산소 · AMRAP',
    wodType: 'amrap',
    slots: [
      { categories: ['core', 'gymnastics'], patterns: ['core'], repsRx: 15 },
      { categories: ['gymnastics', 'weightlifting'], patterns: ['total', 'push'], repsRx: 10 },
      { categories: ['cardio'], patterns: ['mono'], repsRx: 15 },
    ],
    repStyle: 'amrap',
    rounds: 12,
  },

  // ── EMOM ───────────────────────────────────────────────────

  {
    // 역도 EMOM
    name: '역도 EMOM',
    description: '올림픽 리프트 2종 교대 · EMOM',
    wodType: 'emom',
    slots: [
      { categories: ['weightlifting'], patterns: ['total'], repsRx: 5 },
      { categories: ['weightlifting'], patterns: ['hinge', 'push', 'squat'], repsRx: 8 },
    ],
    repStyle: 'emom',
    rounds: 16,
  },
  {
    // 체조 + 유산소 EMOM
    name: '인터벌 EMOM',
    description: '체조 + 유산소 교대 · EMOM',
    wodType: 'emom',
    slots: [
      { categories: ['gymnastics'], patterns: ['pull', 'push', 'total'], repsRx: 10 },
      { categories: ['cardio'], patterns: ['mono'], repsRx: 15 },
    ],
    repStyle: 'emom',
    rounds: 20,
  },
];

// ─── 유틸 ─────────────────────────────────────────────────────────────────────

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 난이도별 rep 스케일 (RX 기준) */
const DIFFICULTY_SCALE: Record<DifficultyLevel, number> = {
  beginner: 0.6,
  intermediate: 0.8,
  rx: 1.0,
};

function scaleReps(repsRx: number, difficulty: DifficultyLevel): number {
  const scaled = Math.round(repsRx * DIFFICULTY_SCALE[difficulty]);
  return Math.max(1, scaled);
}

function scaleScheme(scheme: number[], difficulty: DifficultyLevel): number[] {
  return scheme.map(r => Math.max(1, Math.round(r * DIFFICULTY_SCALE[difficulty])));
}

/**
 * 슬롯에 맞는 동작 풀에서 랜덤으로 1개 선택.
 * 패턴 우선 매칭 → 없으면 카테고리만 매칭 → 없으면 전체 풀에서 선택.
 */
function pickForSlot(
  slot: MovementSlot,
  pool: Movement[],
  alreadyPicked: Set<string>
): Movement | null {
  const available = pool.filter(m => !alreadyPicked.has(m.id));

  // 1차: 카테고리 + 패턴 모두 일치
  const strictMatch = available.filter(
    m => slot.categories.includes(m.category) && slot.patterns.includes(m.movementPattern)
  );
  if (strictMatch.length > 0) return shuffle(strictMatch)[0];

  // 2차: 카테고리만 일치
  const catMatch = available.filter(m => slot.categories.includes(m.category));
  if (catMatch.length > 0) return shuffle(catMatch)[0];

  // 3차: 패턴만 일치
  const patternMatch = available.filter(m => slot.patterns.includes(m.movementPattern));
  if (patternMatch.length > 0) return shuffle(patternMatch)[0];

  // 4차: 풀 전체에서 랜덤
  return available.length > 0 ? shuffle(available)[0] : null;
}

// ─── 메인 생성 함수 ────────────────────────────────────────────────────────────

export function generateWod(
  wodType: WodType,
  difficulty: DifficultyLevel,
  selectedMovementIds: string[] = []
): Wod {
  const pool = selectedMovementIds.length > 0
    ? MOVEMENTS.filter(m => selectedMovementIds.includes(m.id))
    : MOVEMENTS;

  // wodType에 맞는 템플릿 후보 선택
  const candidates = WOD_TEMPLATES.filter(t => t.wodType === wodType);
  const template = shuffle(candidates)[0];

  const pickedIds = new Set<string>();
  const wodMovements: WodMovement[] = [];

  for (const slot of template.slots) {
    const movement = pickForSlot(slot, pool, pickedIds);
    if (!movement) continue;
    pickedIds.add(movement.id);

    const baseReps = scaleReps(slot.repsRx, difficulty);

    let repScheme: number[] | undefined;
    if (template.repStyle === 'pyramid' && template.pyramidSchemeRx) {
      repScheme = scaleScheme(template.pyramidSchemeRx, difficulty);
    }

    wodMovements.push({
      movement,
      reps: baseReps,
      repScheme,
      unit: movement.unit,
    });
  }

  return {
    id: Date.now().toString(),
    type: wodType,
    templateName: template.name,
    templateDescription: template.description,
    movements: wodMovements,
    rounds: template.rounds,
    timeCap: template.timeCap,
    difficulty,
    createdAt: new Date(),
  };
}

/**
 * 커스텀 WOD: 선택된 동작들로 가장 잘 맞는 템플릿을 찾아 적용.
 * 슬롯 매칭 점수가 가장 높은 템플릿을 선택.
 */
export function generateCustomWod(
  selectedMovementIds: string[],
  wodType: WodType,
  difficulty: DifficultyLevel
): Wod {
  const pool = MOVEMENTS.filter(m => selectedMovementIds.includes(m.id));
  if (pool.length === 0) return generateWod(wodType, difficulty, []);

  const candidates = WOD_TEMPLATES.filter(t => t.wodType === wodType);

  // 각 템플릿에 대해 슬롯 충족 점수 계산
  function scoreTemplate(tmpl: WodTemplateConfig): number {
    const used = new Set<string>();
    let score = 0;
    for (const slot of tmpl.slots) {
      const m = pickForSlot(slot, pool, used);
      if (!m) continue;
      used.add(m.id);
      // 패턴까지 일치하면 2점, 카테고리만 1점
      const patternHit = slot.patterns.includes(m.movementPattern);
      const catHit = slot.categories.includes(m.category);
      score += patternHit && catHit ? 2 : catHit ? 1 : 0;
    }
    return score;
  }

  const scored = candidates.map(t => ({ template: t, score: scoreTemplate(t) }));
  scored.sort((a, b) => b.score - a.score);

  // 상위 점수 동점 템플릿 중 랜덤
  const topScore = scored[0].score;
  const topCandidates = scored.filter(s => s.score === topScore).map(s => s.template);
  const template = shuffle(topCandidates)[0];

  const pickedIds = new Set<string>();
  const wodMovements: WodMovement[] = [];

  for (const slot of template.slots) {
    const movement = pickForSlot(slot, pool, pickedIds);
    if (!movement) continue;
    pickedIds.add(movement.id);

    const baseReps = scaleReps(slot.repsRx, difficulty);
    let repScheme: number[] | undefined;
    if (template.repStyle === 'pyramid' && template.pyramidSchemeRx) {
      repScheme = scaleScheme(template.pyramidSchemeRx, difficulty);
    }

    wodMovements.push({
      movement,
      reps: baseReps,
      repScheme,
      unit: movement.unit,
    });
  }

  return {
    id: Date.now().toString(),
    type: wodType,
    templateName: template.name,
    templateDescription: template.description,
    movements: wodMovements,
    rounds: template.rounds,
    timeCap: template.timeCap,
    difficulty,
    createdAt: new Date(),
  };
}

// ─── 표시용 상수 ──────────────────────────────────────────────────────────────

export const WOD_COLORS: Record<WodType, string> = {
  forTime: '#EF5350',
  amrap: '#42A5F5',
  emom: '#AB47BC',
};

export const WOD_TYPE_LABELS: Record<WodType, string> = {
  forTime: 'For Time',
  amrap: 'AMRAP',
  emom: 'EMOM',
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: '입문 (Scaled)',
  intermediate: '중급 (Intermediate)',
  rx: 'RX',
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  rx: '#F44336',
};
