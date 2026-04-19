export type Category = 'gymnastics' | 'weightlifting' | 'cardio' | 'core';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'rx';

export type RepUnit = 'reps' | 'calories' | 'meters' | 'seconds';

export interface Movement {
  id: string;
  nameKo: string;
  nameEn: string;
  category: Category;
  defaultReps: {
    beginner: number;
    intermediate: number;
    rx: number;
  };
  unit: RepUnit;
  tips?: string;
}

export interface WodMovement {
  movement: Movement;
  reps: number;
  unit: RepUnit;
}

export type WodType = 'forTime' | 'amrap' | 'emom';

export interface Wod {
  id: string;
  type: WodType;
  movements: WodMovement[];
  rounds?: number;        // forTime: 라운드 수, amrap: 시간(분), emom: 시간(분)
  timeCap?: number;       // forTime: 시간 제한(분)
  difficulty: DifficultyLevel;
  createdAt: Date;
}
