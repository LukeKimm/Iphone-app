import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Alert,
} from 'react-native';
import { Wod, WodType, DifficultyLevel, WodMovement } from '../types';
import { generateWod, WOD_TYPE_LABELS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../utils/wodGenerator';
import { MOVEMENTS } from '../data/movements';

const UNIT_LABEL: Record<string, string> = {
  reps: '회', calories: 'Cal', meters: 'm', seconds: '초',
};

const WOD_COLORS: Record<WodType, string> = {
  forTime: '#EF5350',
  amrap: '#42A5F5',
  emom: '#AB47BC',
};

function WodCard({ wod, onAdjust }: { wod: Wod; onAdjust: (movId: string, delta: number) => void }) {
  const labelForType = () => {
    if (wod.type === 'forTime') {
      return `${wod.rounds} Rounds${wod.timeCap ? ` (${wod.timeCap}분 제한)` : ''}`;
    }
    if (wod.type === 'amrap') return `${wod.rounds}분 AMRAP`;
    if (wod.type === 'emom') return `${wod.rounds}분 EMOM`;
    return '';
  };

  return (
    <View style={styles.wodCard}>
      <View style={[styles.wodHeader, { backgroundColor: WOD_COLORS[wod.type] }]}>
        <Text style={styles.wodType}>{WOD_TYPE_LABELS[wod.type]}</Text>
        <Text style={styles.wodSubtitle}>{labelForType()}</Text>
        <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[wod.difficulty] }]}>
          <Text style={styles.diffText}>{DIFFICULTY_LABELS[wod.difficulty]}</Text>
        </View>
      </View>

      <View style={styles.movementList}>
        {wod.movements.map((wm, idx) => (
          <View key={wm.movement.id} style={styles.wodRow}>
            <Text style={styles.wodIdx}>{idx + 1}</Text>
            <View style={styles.wodMoveName}>
              <Text style={styles.wodMoveNameKo}>{wm.movement.nameKo}</Text>
              <Text style={styles.wodMoveNameEn}>{wm.movement.nameEn}</Text>
            </View>
            <View style={styles.repControl}>
              <TouchableOpacity style={styles.repBtn} onPress={() => onAdjust(wm.movement.id, -1)}>
                <Text style={styles.repBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.repCenter}>
                <Text style={styles.repValue}>{wm.reps}</Text>
                <Text style={styles.repUnit}>{UNIT_LABEL[wm.unit] ?? wm.unit}</Text>
              </View>
              <TouchableOpacity style={styles.repBtn} onPress={() => onAdjust(wm.movement.id, 1)}>
                <Text style={styles.repBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function GeneratorScreen() {
  const [wodType, setWodType] = useState<WodType>('forTime');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [movCount, setMovCount] = useState(4);
  const [wod, setWod] = useState<Wod | null>(null);
  const [customReps, setCustomReps] = useState<Record<string, number>>({});

  const handleGenerate = useCallback(() => {
    const generated = generateWod(wodType, movCount, difficulty, [], customReps);
    setWod(generated);
    setCustomReps({});
  }, [wodType, movCount, difficulty, customReps]);

  const handleAdjustRep = useCallback((movId: string, delta: number) => {
    if (!wod) return;
    setWod(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        movements: prev.movements.map(wm =>
          wm.movement.id === movId
            ? { ...wm, reps: Math.max(1, wm.reps + delta) }
            : wm
        ),
      };
    });
  }, [wod]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>WOD 생성기</Text>

        {/* WOD Type */}
        <Text style={styles.sectionLabel}>운동 방식</Text>
        <View style={styles.row}>
          {(Object.keys(WOD_TYPE_LABELS) as WodType[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, wodType === t && { backgroundColor: WOD_COLORS[t] }]}
              onPress={() => setWodType(t)}
            >
              <Text style={[styles.chipText, wodType === t && styles.chipTextActive]}>
                {WOD_TYPE_LABELS[t]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty */}
        <Text style={styles.sectionLabel}>난이도</Text>
        <View style={styles.row}>
          {(Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[]).map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, difficulty === d && { backgroundColor: DIFFICULTY_COLORS[d] }]}
              onPress={() => setDifficulty(d)}
            >
              <Text style={[styles.chipText, difficulty === d && styles.chipTextActive]}>
                {d === 'beginner' ? '입문' : d === 'intermediate' ? '중급' : 'RX'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Movement Count */}
        <Text style={styles.sectionLabel}>동작 수</Text>
        <View style={styles.countRow}>
          <TouchableOpacity
            style={styles.countBtn}
            onPress={() => setMovCount(c => Math.max(2, c - 1))}
          >
            <Text style={styles.countBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.countValue}>{movCount}가지</Text>
          <TouchableOpacity
            style={styles.countBtn}
            onPress={() => setMovCount(c => Math.min(8, c + 1))}
          >
            <Text style={styles.countBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Generate Button */}
        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <Text style={styles.generateBtnText}>
            {wod ? '다시 생성 🔀' : 'WOD 생성 🎲'}
          </Text>
        </TouchableOpacity>

        {/* WOD Result */}
        {wod && (
          <>
            <WodCard wod={wod} onAdjust={handleAdjustRep} />
            <Text style={styles.hint}>개수를 탭해서 조절할 수 있어요</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 24 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#888', marginBottom: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#2A2A2A',
    borderWidth: 1, borderColor: '#333',
  },
  chipText: { color: '#AAA', fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: '#FFF' },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  countBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#2A2A2A', justifyContent: 'center', alignItems: 'center',
  },
  countBtnText: { color: '#FFF', fontSize: 24, lineHeight: 26 },
  countValue: { fontSize: 24, fontWeight: '800', color: '#FFF', minWidth: 70, textAlign: 'center' },
  generateBtn: {
    marginTop: 28, backgroundColor: '#FF6B35',
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
  },
  generateBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  wodCard: { marginTop: 24, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1E1E1E' },
  wodHeader: { padding: 16 },
  wodType: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  wodSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  diffBadge: {
    alignSelf: 'flex-start', marginTop: 8,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  diffText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  movementList: { padding: 12 },
  wodRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2A2A2A',
  },
  wodIdx: { width: 24, fontSize: 13, color: '#666', fontWeight: '700' },
  wodMoveName: { flex: 1 },
  wodMoveNameKo: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  wodMoveNameEn: { fontSize: 11, color: '#666', marginTop: 1 },
  repControl: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  repBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#333', justifyContent: 'center', alignItems: 'center',
  },
  repBtnText: { color: '#FFF', fontSize: 18, lineHeight: 20 },
  repCenter: { alignItems: 'center', minWidth: 48 },
  repValue: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  repUnit: { fontSize: 10, color: '#888' },
  hint: { textAlign: 'center', color: '#555', fontSize: 12, marginTop: 12 },
});
