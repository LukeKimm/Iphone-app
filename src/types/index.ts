export type Category = 'gymnastics' | 'weightlifting' | 'cardio' | 'core';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'rx';

export type RepUnit = 'reps' | 'calories' | 'meters' | 'seconds';

// push/pull/squat/hinge/total(올림픽), mono(유산소), core
export type MovementPattern = 'push' | 'pull' | 'squat' | 'hinge' | 'total' | 'mono' | 'core';

export interface Movement {
  id: string;
  nameKo: string;
  nameEn: string;
  category: Category;
  movementPattern: MovementPattern;
  defaultReps: {
    beginner: number;
    intermediate: number;
    rx: number;
  };
  unit: RepUnit;
  tips?: string;
  /** 난이도별 수행 방법 및 무게 기준 */
  scaling: {
    beginner: string;
    intermediate: string;
    rx: string;
  };
}

export interface WodMovement {
  movement: Movement;
  reps: number;           // 라운드당 개수 (또는 치퍼 총 개수)
  repScheme?: number[];   // e.g. [21, 15, 9] — 있으면 이걸 표시
  unit: RepUnit;
}

export type WodType = 'forTime' | 'amrap' | 'emom';

export interface Wod {
  id: string;
  type: WodType;
  templateName: string;
  templateDescription: string;
  movements: WodMovement[];
  rounds?: number;    // forTime: 라운드 수, amrap/emom: 분
  timeCap?: number;   // 분 (forTime only)
  difficulty: DifficultyLevel;
  createdAt: Date;
}
