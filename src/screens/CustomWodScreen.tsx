import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MOVEMENTS, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/movements';
import { Category, WodType, DifficultyLevel, Wod } from '../types';
import { generateWod, WOD_TYPE_LABELS, DIFFICULTY_LABELS, DIFFICULTY_COLORS, WOD_COLORS } from '../utils/wodGenerator';

const UNIT_LABEL: Record<string, string> = {
  reps: '회', calories: 'Cal', meters: 'm', seconds: '초',
};

const WOD_TYPE_COLORS: Record<WodType, string> = {
  forTime: '#EF5350',
  amrap: '#42A5F5',
  emom: '#AB47BC',
};

export default function CustomWodScreen() {
  const [step, setStep] = useState<'movements' | 'settings' | 'result'>('movements');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wodType, setWodType] = useState<WodType>('forTime');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [wod, setWod] = useState<Wod | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const toggleMovement = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (selectedIds.length < 2) return;
    const count = Math.min(selectedIds.length, 6);
    const generated = generateWod(wodType, count, difficulty, selectedIds);
    setWod(generated);
    setStep('result');
  };

  const handleAdjust = (movId: string, delta: number) => {
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
  };

  const filtered = MOVEMENTS.filter(m =>
    activeCategory === 'all' || m.category === activeCategory
  );

  const categories: (Category | 'all')[] = ['all', 'gymnastics', 'weightlifting', 'cardio', 'core'];

  if (step === 'result' && wod) {
    const labelForType = () => {
      if (wod.type === 'forTime') return `${wod.rounds} Rounds${wod.timeCap ? ` (${wod.timeCap}분 제한)` : ''}`;
      if (wod.type === 'amrap') return `${wod.rounds}분 AMRAP`;
      if (wod.type === 'emom') return `${wod.rounds}분 EMOM`;
      return '';
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setStep('settings')}>
              <Text style={styles.back}>← 뒤로</Text>
            </TouchableOpacity>
            <Text style={styles.title}>내 WOD</Text>
          </View>

          <View style={styles.wodCard}>
            <View style={[styles.wodHeader, { backgroundColor: WOD_TYPE_COLORS[wod.type] }]}>
              <Text style={styles.wodType}>{WOD_TYPE_LABELS[wod.type]}</Text>
              <Text style={styles.wodSub}>{labelForType()}</Text>
              <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[wod.difficulty] }]}>
                <Text style={styles.diffText}>{DIFFICULTY_LABELS[wod.difficulty]}</Text>
              </View>
            </View>

            {wod.movements.map((wm, idx) => (
              <View key={wm.movement.id} style={styles.wodRow}>
                <Text style={styles.idx}>{idx + 1}</Text>
                <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[wm.movement.category] }]} />
                <View style={styles.movName}>
                  <Text style={styles.nameKo}>{wm.movement.nameKo}</Text>
                  <Text style={styles.nameEn}>{wm.movement.nameEn}</Text>
                </View>
                <View style={styles.repCtrl}>
                  <TouchableOpacity style={styles.repBtn} onPress={() => handleAdjust(wm.movement.id, -1)}>
                    <Text style={styles.repBtnTxt}>−</Text>
                  </TouchableOpacity>
                  <View style={styles.repCenter}>
                    <Text style={styles.repVal}>{wm.reps}</Text>
                    <Text style={styles.repUnit}>{UNIT_LABEL[wm.unit]}</Text>
                  </View>
                  <TouchableOpacity style={styles.repBtn} onPress={() => handleAdjust(wm.movement.id, 1)}>
                    <Text style={styles.repBtnTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.hint}>개수를 탭해서 조절할 수 있어요</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={() => setStep('movements')}>
            <Text style={styles.resetBtnText}>처음부터 다시</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'settings') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setStep('movements')}>
              <Text style={styles.back}>← 뒤로</Text>
            </TouchableOpacity>
            <Text style={styles.title}>운동 설정</Text>
          </View>

          <Text style={styles.selectedInfo}>선택된 동작: {selectedIds.length}개</Text>

          <Text style={styles.sectionLabel}>운동 방식</Text>
          <View style={styles.chipRow}>
            {(Object.keys(WOD_TYPE_LABELS) as WodType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.chip, wodType === t && { backgroundColor: WOD_TYPE_COLORS[t] }]}
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>동작 선택</Text>
      <Text style={styles.subtitle}>WOD에 포함할 동작을 선택하세요 ({selectedIds.length}개 선택됨)</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, activeCategory === cat && { backgroundColor: cat === 'all' ? '#FF6B35' : CATEGORY_COLORS[cat as Category] }]}
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
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 16 },
  back: { color: '#FF6B35', fontSize: 16 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFF', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  subtitle: { fontSize: 13, color: '#666', paddingHorizontal: 20, marginBottom: 12 },
  selectedInfo: { fontSize: 14, color: '#888', marginBottom: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#2A2A2A', borderWidth: 1, borderColor: '#333' },
  chipTxt: { color: '#AAA', fontWeight: '600', fontSize: 14 },
  chipTxtActive: { color: '#FFF' },
  genBtn: { marginTop: 32, backgroundColor: '#FF6B35', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  genBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  catScroll: { paddingHorizontal: 20, marginBottom: 12, flexGrow: 0 },
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
  wodCard: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#1E1E1E' },
  wodHeader: { padding: 16 },
  wodType: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  wodSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  diffBadge: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  diffText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  wodRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  idx: { width: 22, fontSize: 13, color: '#666', fontWeight: '700' },
  catDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  movName: { flex: 1 },
  repCtrl: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  repBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  repBtnTxt: { color: '#FFF', fontSize: 18, lineHeight: 20 },
  repCenter: { alignItems: 'center', minWidth: 48 },
  repVal: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  repUnit: { fontSize: 10, color: '#888' },
  hint: { textAlign: 'center', color: '#555', fontSize: 12, marginTop: 12, marginBottom: 16 },
  resetBtn: { borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  resetBtnText: { color: '#888', fontSize: 15 },
});
