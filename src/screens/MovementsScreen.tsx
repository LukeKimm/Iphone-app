import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput,
} from 'react-native';
import { MOVEMENTS, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/movements';
import { Category, DifficultyLevel } from '../types';

const CATEGORIES: (Category | 'all')[] = ['all', 'gymnastics', 'weightlifting', 'cardio', 'core'];

const UNIT_LABEL: Record<string, string> = {
  reps: '회', calories: 'Cal', meters: 'm', seconds: '초',
};

const DIFFICULTY_CONFIG: { key: DifficultyLevel; label: string; color: string }[] = [
  { key: 'beginner',     label: '입문',  color: '#4CAF50' },
  { key: 'intermediate', label: '중급',  color: '#FF9800' },
  { key: 'rx',           label: 'RX',    color: '#F44336' },
];

export default function MovementsScreen() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = MOVEMENTS.filter(m => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || m.nameKo.includes(q) || m.nameEn.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>동작 목록</Text>

      <TextInput
        style={styles.search}
        placeholder="동작 검색..."
        placeholderTextColor="#555"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catChip,
              activeCategory === cat && {
                backgroundColor: cat === 'all' ? '#FF6B35' : CATEGORY_COLORS[cat],
              },
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
              {cat === 'all' ? '전체' : CATEGORY_LABELS[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(m => {
          const expanded = expandedId === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={styles.card}
              onPress={() => setExpandedId(expanded ? null : m.id)}
              activeOpacity={0.8}
            >
              {/* 카테고리 컬러 바 */}
              <View style={[styles.catBar, { backgroundColor: CATEGORY_COLORS[m.category] }]} />

              <View style={styles.cardContent}>
                {/* 상단: 이름 + 토글 */}
                <View style={styles.headerRow}>
                  <View style={styles.nameWrap}>
                    <Text style={styles.nameKo}>{m.nameKo}</Text>
                    <Text style={styles.nameEn}>{m.nameEn}</Text>
                    {m.tips && <Text style={styles.tips}>{m.tips}</Text>}
                  </View>
                  <Text style={styles.toggle}>{expanded ? '▲' : '▼'}</Text>
                </View>

                {/* 난이도별 개수 (항상 표시) */}
                <View style={styles.repsRow}>
                  {DIFFICULTY_CONFIG.map(({ key, label, color }) => (
                    <View key={key} style={styles.repItem}>
                      <View style={[styles.diffDot, { backgroundColor: color }]} />
                      <Text style={styles.repLevel}>{label}</Text>
                      <Text style={styles.repNum}>
                        {m.defaultReps[key]}{UNIT_LABEL[m.unit]}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* 펼쳐지면 난이도별 수행 방법 표시 */}
                {expanded && (
                  <View style={styles.scalingSection}>
                    <View style={styles.divider} />
                    {DIFFICULTY_CONFIG.map(({ key, label, color }) => (
                      <View key={key} style={styles.scalingRow}>
                        <View style={[styles.scalingBadge, { backgroundColor: color }]}>
                          <Text style={styles.scalingBadgeText}>{label}</Text>
                        </View>
                        <Text style={styles.scalingText}>{m.scaling[key]}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  title: { fontSize: 28, fontWeight: '900', color: '#FFF', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  search: {
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: '#1E1E1E', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: '#333',
  },
  catScroll: { paddingHorizontal: 20, marginBottom: 16, flexGrow: 0 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 16, backgroundColor: '#2A2A2A',
    marginRight: 8, borderWidth: 1, borderColor: '#333',
  },
  catText: { color: '#888', fontWeight: '600', fontSize: 13 },
  catTextActive: { color: '#FFF' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row', backgroundColor: '#1E1E1E',
    borderRadius: 12, marginBottom: 10, overflow: 'hidden',
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  catBar: { width: 5 },
  cardContent: { flex: 1, padding: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  nameWrap: { flex: 1 },
  nameKo: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  nameEn: { fontSize: 12, color: '#666', marginTop: 2 },
  tips: { fontSize: 11, color: '#F9A825', marginTop: 2 },
  toggle: { color: '#555', fontSize: 12, paddingLeft: 8, paddingTop: 2 },
  repsRow: { flexDirection: 'row', marginTop: 10, gap: 16 },
  repItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  diffDot: { width: 7, height: 7, borderRadius: 3.5 },
  repLevel: { fontSize: 11, color: '#888' },
  repNum: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginVertical: 12 },
  scalingSection: {},
  scalingRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  scalingBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, minWidth: 36, alignItems: 'center',
  },
  scalingBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  scalingText: { flex: 1, fontSize: 13, color: '#CCC', lineHeight: 19 },
});
