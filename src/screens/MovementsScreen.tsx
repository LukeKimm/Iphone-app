import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, TextInput,
} from 'react-native';
import { MOVEMENTS, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/movements';
import { Category } from '../types';

const CATEGORIES: (Category | 'all')[] = ['all', 'gymnastics', 'weightlifting', 'cardio', 'core'];

const UNIT_LABEL: Record<string, string> = {
  reps: '회', calories: 'Cal', meters: 'm', seconds: '초',
};

export default function MovementsScreen() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

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
        {filtered.map(m => (
          <View key={m.id} style={styles.card}>
            <View style={[styles.catBar, { backgroundColor: CATEGORY_COLORS[m.category] }]} />
            <View style={styles.cardContent}>
              <View style={styles.nameRow}>
                <Text style={styles.nameKo}>{m.nameKo}</Text>
                <Text style={styles.nameEn}>{m.nameEn}</Text>
              </View>
              {m.tips && <Text style={styles.tips}>{m.tips}</Text>}
              <View style={styles.repsRow}>
                {(['beginner', 'intermediate', 'rx'] as const).map(level => (
                  <View key={level} style={styles.repItem}>
                    <Text style={styles.repLevel}>
                      {level === 'beginner' ? '입문' : level === 'intermediate' ? '중급' : 'RX'}
                    </Text>
                    <Text style={styles.repNum}>
                      {m.defaultReps[level]}{UNIT_LABEL[m.unit]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
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
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  nameKo: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  nameEn: { fontSize: 12, color: '#666' },
  tips: { fontSize: 11, color: '#F9A825', marginTop: 3 },
  repsRow: { flexDirection: 'row', marginTop: 8, gap: 12 },
  repItem: { alignItems: 'center' },
  repLevel: { fontSize: 10, color: '#666', marginBottom: 2 },
  repNum: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
