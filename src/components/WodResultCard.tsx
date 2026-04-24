import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wod, WodMovement } from '../types';
import { WOD_TYPE_LABELS, WOD_COLORS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../utils/wodGenerator';
import { CATEGORY_COLORS } from '../data/movements';

const UNIT_LABEL: Record<string, string> = {
  reps: '회', calories: 'Cal', meters: 'm', seconds: '초',
};

interface Props {
  wod: Wod;
  onAdjust: (movId: string, delta: number) => void;
}

function headerSubtitle(wod: Wod): string {
  switch (wod.type) {
    case 'forTime':
      if (wod.rounds && wod.rounds > 1) return `${wod.rounds} Rounds For Time${wod.timeCap ? `  ·  ${wod.timeCap}분 제한` : ''}`;
      return `For Time${wod.timeCap ? `  ·  ${wod.timeCap}분 제한` : ''}`;
    case 'amrap':
      return `${wod.rounds}분 AMRAP`;
    case 'emom':
      return `${wod.rounds}분 EMOM`;
  }
}

function RepDisplay({ wm, onAdjust }: { wm: WodMovement; onAdjust: (delta: number) => void }) {
  const unit = UNIT_LABEL[wm.unit] ?? wm.unit;

  const repLabel = wm.repScheme
    ? wm.repScheme.join(' - ') + ' ' + unit
    : `${wm.reps} ${unit}`;

  return (
    <View style={styles.repControl}>
      <TouchableOpacity style={styles.repBtn} onPress={() => onAdjust(-1)}>
        <Text style={styles.repBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.repLabel}>{repLabel}</Text>
      <TouchableOpacity style={styles.repBtn} onPress={() => onAdjust(1)}>
        <Text style={styles.repBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export function WodResultCard({ wod, onAdjust }: Props) {
  const headerColor = WOD_COLORS[wod.type];

  return (
    <View style={styles.card}>
      {/* 헤더 */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <View style={styles.headerTop}>
          <Text style={styles.typeName}>{WOD_TYPE_LABELS[wod.type]}</Text>
          <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[wod.difficulty] }]}>
            <Text style={styles.diffText}>{DIFFICULTY_LABELS[wod.difficulty]}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{headerSubtitle(wod)}</Text>
        <Text style={styles.templateName}>{wod.templateName}  ·  {wod.templateDescription}</Text>
      </View>

      {/* 동작 리스트 */}
      <View style={styles.body}>
        {wod.movements.map((wm, idx) => (
          <View
            key={wm.movement.id}
            style={[styles.row, idx < wod.movements.length - 1 && styles.rowBorder]}
          >
            <Text style={styles.idx}>{idx + 1}</Text>
            <View style={[styles.catDot, { backgroundColor: CATEGORY_COLORS[wm.movement.category] }]} />
            <View style={styles.nameCol}>
              <Text style={styles.nameKo}>{wm.movement.nameKo}</Text>
              <Text style={styles.nameEn}>{wm.movement.nameEn}</Text>
              <Text style={styles.scalingHint}>{wm.movement.scaling[wod.difficulty]}</Text>
            </View>
            <RepDisplay wm={wm} onAdjust={delta => onAdjust(wm.movement.id, delta)} />
          </View>
        ))}
      </View>

      <Text style={styles.hint}>± 버튼으로 개수를 바로 조절할 수 있어요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#1E1E1E' },
  header: { padding: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  typeName: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  diffText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  templateName: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6 },
  body: { paddingHorizontal: 12, paddingTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  idx: { width: 22, fontSize: 13, color: '#555', fontWeight: '700' },
  catDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  nameCol: { flex: 1 },
  nameKo: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  nameEn: { fontSize: 11, color: '#555', marginTop: 2 },
  repControl: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  repBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  repBtnText: { color: '#FFF', fontSize: 18, lineHeight: 20 },
  repLabel: { fontSize: 14, fontWeight: '700', color: '#FFF', textAlign: 'center', minWidth: 80 },
  scalingHint: { fontSize: 11, color: '#F9A825', marginTop: 3 },
  hint: { textAlign: 'center', color: '#444', fontSize: 11, paddingVertical: 10 },
});
