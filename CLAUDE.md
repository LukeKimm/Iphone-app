# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CrossFit WOD (Workout of the Day) generator — an Expo React Native app targeting iOS. Users can randomly generate WODs from a built-in CrossFit movement library, or manually select movements to build a custom WOD. Rep counts are adjustable per movement and scale by difficulty level.

## Commands

```bash
npx expo start          # Start dev server (scan QR with Expo Go on iPhone)
npx expo start --web    # Run in browser for quick UI iteration
npx tsc --noEmit        # TypeScript type check (no build step needed)
npm run build:web       # Export PWA build → dist/
npm run android         # Android emulator
npm run ios             # iOS simulator (requires macOS + Xcode)
```

## Architecture

```
src/
  types/index.ts          # All shared TypeScript types (Movement, Wod, WodType, etc.)
  data/movements.ts       # Static CrossFit movement library (~40 movements, 4 categories)
  utils/wodGenerator.ts   # Template-based WOD generation (see WOD Templates below)
  screens/
    GeneratorScreen.tsx   # Quick random WOD tab — picks type/difficulty, generates
    CustomWodScreen.tsx   # 3-step flow: pick movements → settings → result
    MovementsScreen.tsx   # Browse/search the movement library
  components/
    MovementCard.tsx      # Movement card for browse/select screens
    WodResultCard.tsx     # WOD result display with rep scheme + ±1 adjustment
```

**Data flow:** `MOVEMENTS` array in `data/movements.ts` is the single source of truth. `generateWod()` / `generateCustomWod()` in `utils/wodGenerator.ts` selects a WOD template and fills its slots with compatible movements. WOD state is local to each screen — no global state library.

## WOD Templates (core concept)

Instead of random movement selection, the generator uses **benchmark-inspired templates** (Fran, Helen, DT, Cindy, etc.). Each template defines:

- **Slots** — how many movements, what `category` and `movementPattern` each slot requires
- **Rep scheme** — `pyramid` (e.g. 21-15-9), `rounds` (fixed reps × N rounds), `chipper` (one-time-through), `amrap`, or `emom`

`generateWod(wodType, difficulty)` picks a random template matching the WOD type, then fills each slot by matching movements on pattern first, category second.

`generateCustomWod(selectedIds, wodType, difficulty)` scores all templates by how well the user's selected movements fill the slots, picks the best-scoring template.

## Movement Patterns

Each movement has a `movementPattern` that drives template slot matching:

| Pattern | Examples |
|---|---|
| `pull` | Pull-up, C2B |
| `push` | HSPU, Ring Dip, Push Press |
| `squat` | Front Squat, Box Jump |
| `hinge` | Deadlift, KB Swing |
| `total` | Thruster, Power Clean, Snatch (full-body Olympic lifts) |
| `mono` | Run, Row, Bike, Double Under (monostructural cardio) |
| `core` | Sit-up, TTB, Hollow Rock |

## Key Conventions

- **Movement categories**: `gymnastics | weightlifting | cardio | core` — each has a color in `CATEGORY_COLORS`
- **Difficulty levels**: `beginner | intermediate | rx` — reps scale at 0.6× / 0.8× / 1.0× of the template's RX reps
- **WOD types**: `forTime | amrap | emom`
- **Rep units**: `reps | calories | meters | seconds` — displayed as `회 | Cal | m | 초`
- **`repScheme?: number[]`** — when set (e.g. `[21, 15, 9]`), the UI displays the scheme string instead of a single rep count; ±1 adjustment shifts all values in the scheme
- **Dark theme** throughout: background `#121212`, card `#1E1E1E`, accent `#FF6B35`
- All screens use `SafeAreaView` + `ScrollView`; no navigation params between tabs

## Adding Movements

Add entries to `MOVEMENTS` in `src/data/movements.ts`. Required fields: `id` (unique kebab-case), `nameKo`, `nameEn`, `category`, `movementPattern`, `defaultReps` (all 3 levels), `unit`.

## Adding WOD Templates

Add entries to `WOD_TEMPLATES` in `src/utils/wodGenerator.ts`. Each slot should specify which `categories` and `patterns` are valid for that position — this is how movement compatibility is enforced.
