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
  { key: 'beginner',     label: '입문', color: '#4CAF50' },
  { key: 'intermediate', label: '중급', color: '#FF9800' },
  { key: 'rx',           label: 'RX',   color: '#F44336' },
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

      {/* ── 고정 헤더 (스크롤에 영향 안 받음) ── */}
      <View style={styles.fixedHeader}>
        <Text style={styles.title}>동작 목록</Text>

        <TextInput
          style={styles.search}
          placeholder="동작 검색..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScrollContent}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catChip,
                activeCategory === cat && {
                  backgroundColor: cat === 'all' ? '#FF6B35' : CATEGORY_COLORS[cat as Category],
                  borderColor: 'transparent',
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
      </View>

      {/* ── 스크롤 목록 ── */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filtered.map(m => {
          const expanded = expandedId === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={styles.card}
              onPress={() => setExpandedId(expanded ? null : m.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.catBar, { backgroundColor: CATEGORY_COLORS[m.category] }]} />

              <View style={styles.cardContent}>
                {/* 한 줄 기본 레이아웃 */}
                <View style={styles.row}>
                  {/* 동작 이름 */}
                  <Text style={styles.nameKo} numberOfLines={1}>{m.nameKo}</Text>

                  {/* 난이도별 개수 뱃지 */}
                  <View style={styles.badges}>
                    {DIFFICULTY_CONFIG.map(({ key, label, color }) => (
                      <View key={key} style={[styles.badge, { backgroundColor: color + '22' }]}>
                        <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
                        <Text style={styles.badgeRep}>
                          {m.defaultReps[key]}{UNIT_LABEL[m.unit]}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* 펼침 토글 */}
                  <Text style={styles.toggle}>{expanded ? '▲' : '▼'}</Text>
                </View>

                {/* 펼쳐진 상세 */}
                {expanded && (
                  <View style={styles.detail}>
                    <Text style={styles.nameEn}>{m.nameEn}</Text>
                    {m.tips && <Text style={styles.tips}>{m.tips}</Text>}
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

  /* 고정 헤더 */
  fixedHeader: {
    backgroundColor: '#121212',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  title: {
    fontSize: 28, fontWeight: '900', color: '#FFF',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  search: {
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: '#1E1E1E', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: '#333',
  },
  catScrollContent: { paddingHorizontal: 20, paddingBottom: 8 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 16, backgroundColor: '#2A2A2A',
    marginRight: 8, borderWidth: 1, borderColor: '#333',
  },
  catText: { color: '#888', fontWeight: '600', fontSize: 13 },
  catTextActive: { color: '#FFF' },

  /* 스크롤 목록 */
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },

  /* 카드 */
  card: {
    flexDirection: 'row', backgroundColor: '#1E1E1E',
    borderRadius: 12, marginBottom: 8, overflow: 'hidden',
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  catBar: { width: 5 },
  cardContent: { flex: 1, paddingHorizontal: 12, paddingVertical: 11 },

  /* 기본 한 줄 레이아웃 */
  row: { flexDirection: 'row', alignItems: 'center' },
  nameKo: { flex: 1, fontSize: 15, fontWeight: '700', color: '#FFF', marginRight: 8 },
  badges: { flexDirection: 'row', gap: 4 },
  badge: {
    alignItems: 'center', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
  },
  badgeLabel: { fontSize: 9, fontWeight: '700' },
  badgeRep: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  toggle: { color: '#555', fontSize: 11, marginLeft: 8 },

  /* 펼쳐진 상세 */
  detail: { marginTop: 10 },
  nameEn: { fontSize: 12, color: '#666' },
  tips: { fontSize: 11, color: '#F9A825', marginTop: 3 },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginVertical: 10 },
  scalingRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 7, gap: 10 },
  scalingBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, minWidth: 36, alignItems: 'center',
  },
  scalingBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  scalingText: { flex: 1, fontSize: 13, color: '#CCC', lineHeight: 19 },
});
