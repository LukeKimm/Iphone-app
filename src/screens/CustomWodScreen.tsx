import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { MOVEMENTS, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/movements';
import { Category, WodType, DifficultyLevel, Wod } from '../types';
import { generateCustomWod, WOD_TYPE_LABELS, WOD_COLORS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../utils/wodGenerator';
import { WodResultCard } from '../components/WodResultCard';

const CATEGORIES: (Category | 'all')[] = ['all', 'gymnastics', 'weightlifting', 'cardio', 'core'];

export default function CustomWodScreen() {
  const [step, setStep] = useState<'movements' | 'settings' | 'result'>('movements');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wodType, setWodType] = useState<WodType>('forTime');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [wod, setWod] = useState<Wod | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const toggleMovement = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleGenerate = () => {
    const generated = generateCustomWod(selectedIds, wodType, difficulty);
    setWod(generated);
    setStep('result');
  };

  const handleAdjust = (movId: string, delta: number) => {
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
  };

  const filtered = MOVEMENTS.filter(
    m => activeCategory === 'all' || m.category === activeCategory
  );

  // ── Result ────────────────────────────────────────────────────────────────

  if (step === 'result' && wod) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => setStep('settings')}>
              <Text style={styles.back}>← 뒤로</Text>
            </TouchableOpacity>
            <Text style={styles.pageTitle}>내 WOD</Text>
          </View>
          <WodResultCard wod={wod} onAdjust={handleAdjust} />
          <TouchableOpacity style={styles.resetBtn} onPress={() => { setStep('movements'); setSelectedIds([]); }}>
            <Text style={styles.resetBtnText}>처음부터 다시</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Settings ──────────────────────────────────────────────────────────────

  if (step === 'settings') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => setStep('movements')}>
              <Text style={styles.back}>← 뒤로</Text>
            </TouchableOpacity>
            <Text style={styles.pageTitle}>운동 설정</Text>
          </View>
          <Text style={styles.selectedInfo}>선택된 동작: {selectedIds.length}개 · 최적 템플릿 자동 선택</Text>

          <Text style={styles.sectionLabel}>운동 방식</Text>
          <View style={styles.chipRow}>
            {(Object.keys(WOD_TYPE_LABELS) as WodType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, wodType === t && { backgroundColor: WOD_COLORS[t] }]}
                onPress={() => setWodType(t)}
              >
                <Text style={[styles.chipTxt, wodType === t && styles.chipTxtActive]}>
                  {WOD_TYPE_LABELS[t]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>난이도</Text>
          <View style={styles.chipRow}>
            {(Object.keys(DIFFICULTY_LABELS) as DifficultyLevel[]).map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, difficulty === d && { backgroundColor: DIFFICULTY_COLORS[d] }]}
                onPress={() => setDifficulty(d)}
              >
                <Text style={[styles.chipTxt, difficulty === d && styles.chipTxtActive]}>
                  {d === 'beginner' ? '입문' : d === 'intermediate' ? '중급' : 'RX'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.genBtn} onPress={handleGenerate}>
            <Text style={styles.genBtnText}>WOD 생성 🎲</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Movement Selection ────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle2}>동작 선택</Text>
      <Text style={styles.subtitle}>WOD에 포함할 동작을 선택하세요 ({selectedIds.length}개)</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catScrollContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catChip,
              activeCategory === cat && {
                backgroundColor: cat === 'all' ? '#FF6B35' : CATEGORY_COLORS[cat as Category],
              },
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.catTxt, activeCategory === cat && styles.catTxtActive]}>
              {cat === 'all' ? '전체' : CATEGORY_LABELS[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.movList}>
        {filtered.map(m => {
          const sel = selectedIds.includes(m.id);
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.movCard, sel && { borderColor: CATEGORY_COLORS[m.category], borderWidth: 2 }]}
              onPress={() => toggleMovement(m.id)}
            >
              <View style={[styles.catBar, { backgroundColor: CATEGORY_COLORS[m.category] }]} />
              <View style={styles.movContent}>
                <Text style={styles.nameKo}>{m.nameKo}</Text>
                <Text style={styles.nameEn}>{m.nameEn}</Text>
              </View>
              <View style={[styles.check, sel && { backgroundColor: CATEGORY_COLORS[m.category] }]}>
                {sel && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedIds.length >= 2 && (
        <View style={styles.fab}>
          <TouchableOpacity style={styles.fabBtn} onPress={() => setStep('settings')}>
            <Text style={styles.fabText}>다음 →  ({selectedIds.length}개 선택)</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scroll: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 14 },
  back: { color: '#FF6B35', fontSize: 16 },
  pageTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  pageTitle2: { fontSize: 26, fontWeight: '900', color: '#FFF', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  subtitle: { fontSize: 13, color: '#666', paddingHorizontal: 20, marginBottom: 12 },
  selectedInfo: { fontSize: 13, color: '#888', marginBottom: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 18, textTransform: 'uppercase', letterSpacing: 1 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: '#2A2A2A', borderWidth: 1, borderColor: '#333' },
  chipTxt: { color: '#888', fontWeight: '600', fontSize: 14 },
  chipTxtActive: { color: '#FFF' },
  genBtn: { marginTop: 32, backgroundColor: '#FF6B35', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  genBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  catScroll: { marginBottom: 12, flexGrow: 0, maxHeight: 44 },
  catScrollContent: { paddingHorizontal: 20, alignItems: 'center' },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: '#2A2A2A', marginRight: 8, borderWidth: 1, borderColor: '#333' },
  catTxt: { color: '#888', fontWeight: '600', fontSize: 13 },
  catTxtActive: { color: '#FFF' },
  movList: { paddingHorizontal: 20, paddingBottom: 100 },
  movCard: { flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 12, marginBottom: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A2A', alignItems: 'center' },
  catBar: { width: 5, alignSelf: 'stretch' },
  movContent: { flex: 1, padding: 12 },
  nameKo: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  nameEn: { fontSize: 11, color: '#666', marginTop: 2 },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#555', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkMark: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#121212', borderTopWidth: 1, borderTopColor: '#2A2A2A' },
  fabBtn: { backgroundColor: '#FF6B35', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  fabText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  resetBtn: { marginTop: 16, borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  resetBtnText: { color: '#666', fontSize: 15 },
});
