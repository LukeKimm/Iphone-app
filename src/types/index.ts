export type Category = 'gymnastics' | 'weightlifting' | 'cardio' | 'core';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'rx';

export type RepUnit = 'reps' | 'calories' | 'meters' | 'seconds';

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
  scaling: {
    beginner: string;
    intermediate: string;
    rx: string;
  };
}

export interface WodMovement {
  movement: Movement;
  reps: number;
  repScheme?: number[];
  unit: RepUnit;
  /** 이 WOD에서만 적용되는 스케일링 설명 (바벨 공유 시 통일 무게로 덮어씀) */
  scalingOverride?: string;
}

export type WodType = 'forTime' | 'amrap' | 'emom';

export interface Wod {
  id: string;
  type: WodType;
  templateName: string;
  templateDescription: string;
  movements: WodMovement[];
  rounds?: number;
  timeCap?: number;
  difficulty: DifficultyLevel;
  createdAt: Date;
  /** 복수 바벨 동작이 있을 때 공통 무게 안내 */
  barbellNote?: string;
}
