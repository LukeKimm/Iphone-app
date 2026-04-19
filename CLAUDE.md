# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CrossFit WOD (Workout of the Day) generator — an Expo React Native app targeting iOS. Users can randomly generate WODs from a built-in CrossFit movement library, or manually select movements to build a custom WOD. Rep counts are adjustable per movement and scale by difficulty level.

## Commands

```bash
npx expo start          # Start dev server (scan QR with Expo Go on iPhone)
npx expo start --web    # Run in browser for quick UI iteration
npx tsc --noEmit        # TypeScript type check (no build step needed)
npm run android         # Android emulator
npm run ios             # iOS simulator (requires macOS + Xcode)
```

## Architecture

```
src/
  types/index.ts          # All shared TypeScript types (Movement, Wod, WodType, etc.)
  data/movements.ts       # Static CrossFit movement library (~40 movements, 4 categories)
  utils/wodGenerator.ts   # WOD generation logic: shuffle, balance by category, round counts
  screens/
    GeneratorScreen.tsx   # Quick random WOD tab — picks type/difficulty/count, generates
    CustomWodScreen.tsx   # 3-step flow: pick movements → settings → result
    MovementsScreen.tsx   # Browse/search the movement library
  components/
    MovementCard.tsx      # Reusable card with inline rep ±1 controls
```

**Data flow:** `MOVEMENTS` array in `data/movements.ts` is the single source of truth. `generateWod()` in `utils/wodGenerator.ts` samples from it, balancing across the 4 categories (gymnastics, weightlifting, cardio, core). WOD state is local to each screen — no global state library is used.

## Key Conventions

- **Movement categories**: `gymnastics | weightlifting | cardio | core` — each has a color defined in `CATEGORY_COLORS`
- **Difficulty levels**: `beginner | intermediate | rx` — each movement has `defaultReps` for all three levels
- **WOD types**: `forTime | amrap | emom` — round/time values are auto-calculated in `generateWod()` based on movement count
- **Rep units**: `reps | calories | meters | seconds` — displayed as `회 | Cal | m | 초`
- **Dark theme** throughout: background `#121212`, card `#1E1E1E`, accent `#FF6B35`
- All screens use `SafeAreaView` + `ScrollView`; no navigation between tabs uses params

## Adding Movements

Add entries to `MOVEMENTS` array in `src/data/movements.ts`. Required fields: `id` (unique kebab-case), `nameKo`, `nameEn`, `category`, `defaultReps` (all 3 levels), `unit`.
