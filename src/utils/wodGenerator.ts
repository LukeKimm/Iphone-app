import { Movement, Wod, WodMovement, WodType, DifficultyLevel } from '../types';
import { MOVEMENTS } from '../data/movements';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getBalancedMovements(
  availableMovements: Movement[],
  count: number
): Movement[] {
  const byCategory = {
    gymnastics: availableMovements.filter(m => m.category === 'gymnastics'),
    weightlifting: availableMovements.filter(m => m.category === 'weightlifting'),
    cardio: availableMovements.filter(m => m.category === 'cardio'),
    core: availableMovements.filter(m => m.category === 'core'),
  };

  const selected: Movement[] = [];

  // 카테고리당 최소 1개씩 포함 (가능한 경우)
  const categories = shuffle(Object.keys(byCategory)) as (keyof typeof byCategory)[];
  for (const cat of categories) {
    if (selected.length >= count) break;
    const pool = byCategory[cat].filter(m => !selected.includes(m));
    if (pool.length > 0) {
      selected.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  // 나머지는 전체 풀에서 랜덤
  const remaining = availableMovements.filter(m => !selected.includes(m));
  const shuffledRemaining = shuffle(remaining);
  while (selected.length < count && shuffledRemaining.length > 0) {
    selected.push(shuffledRemaining.shift()!);
  }

  return shuffle(selected);
}

export function generateWod(
  wodType: WodType,
  movementCount: number,
  difficulty: DifficultyLevel,
  selectedMovementIds: string[],
  customReps?: Record<string, number>
): Wod {
  const pool = selectedMovementIds.length > 0
    ? MOVEMENTS.filter(m => selectedMovementIds.includes(m.id))
    : MOVEMENTS;

  const movements = getBalancedMovements(pool, movementCount);

  const wodMovements: WodMovement[] = movements.map(m => ({
    movement: m,
    reps: customReps?.[m.id] ?? m.defaultReps[difficulty],
    unit: m.unit,
  }));

  let rounds: number | undefined;
  let timeCap: number | undefined;

  if (wodType === 'forTime') {
    rounds = movementCount <= 3 ? 5 : movementCount <= 5 ? 3 : 1;
    timeCap = rounds * movementCount * 2;
  } else if (wodType === 'amrap') {
    rounds = movementCount <= 3 ? 10 : 15;
  } else if (wodType === 'emom') {
    rounds = movements.length * 2;
  }

  return {
    id: Date.now().toString(),
    type: wodType,
    movements: wodMovements,
    rounds,
    timeCap,
    difficulty,
    createdAt: new Date(),
  };
}

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
