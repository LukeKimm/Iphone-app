import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Wod, WodType, DifficultyLevel } from '../types';
import { generateWod, WOD_TYPE_LABELS, WOD_COLORS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../utils/wodGenerator';
import { WodResultCard } from '../components/WodResultCard';

export default function GeneratorScreen() {
  const [wodType, setWodType] = useState<WodType>('forTime');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [wod, setWod] = useState<Wod | null>(null);

  const handleGenerate = useCallback(() => {
    setWod(generateWod(wodType, difficulty));
  }, [wodType, difficulty]);

  const handleAdjustRep = useCallback((movId: string, delta: number) => {
    setWod(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        movements: prev.movements.map(wm => {
          if (wm.movement.id !== movId) return wm;
          if (wm.repScheme) {
            return {
              ...wm,
              reps: Math.max(1, wm.reps + delta),
              repScheme: wm.repScheme.map(r => Math.max(1, r + delta)),
            };
          }
          return { ...wm, reps: Math.max(1, wm.reps + delta) };
        }),
      };
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>WOD 생성기</Text>

        {/* WOD 방식 */}
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

        {/* 난이도 */}
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

        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <Text style={styles.generateBtnText}>{wod ? '다시 생성 🔀' : 'WOD 생성 🎲'}</Text>
        </TouchableOpacity>

        {wod && (
          <View style={styles.resultWrap}>
            <WodResultCard wod={wod} onAdjust={handleAdjustRep} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 18, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: '#2A2A2A', borderWidth: 1, borderColor: '#333' },
  chipText: { color: '#888', fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: '#FFF' },
  generateBtn: { marginTop: 28, backgroundColor: '#FF6B35', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  generateBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  resultWrap: { marginTop: 24 },
});
