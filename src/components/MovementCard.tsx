import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Movement } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../data/movements';

interface Props {
  movement: Movement;
  reps?: number;
  onRepChange?: (delta: number) => void;
  showCategory?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}

export function MovementCard({ movement, reps, onRepChange, showCategory = true, selected, onToggle }: Props) {
  const catColor = CATEGORY_COLORS[movement.category];

  const unitLabel: Record<string, string> = {
    reps: '회',
    calories: 'Cal',
    meters: 'm',
    seconds: '초',
  };

  return (
    <TouchableOpacity
      style={[styles.card, selected !== undefined && { borderColor: selected ? catColor : '#333', borderWidth: 2 }]}
      onPress={onToggle}
      activeOpacity={onToggle ? 0.7 : 1}
    >
      <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
        <Text style={styles.categoryText}>
          {showCategory ? CATEGORY_LABELS[movement.category] : ''}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.nameKo}>{movement.nameKo}</Text>
        <Text style={styles.nameEn}>{movement.nameEn}</Text>
        {movement.tips && (
          <Text style={styles.tips}>{movement.tips}</Text>
        )}
      </View>

      {reps !== undefined && onRepChange && (
        <View style={styles.repControl}>
          <TouchableOpacity style={styles.repBtn} onPress={() => onRepChange(-1)}>
            <Text style={styles.repBtnText}>−</Text>
          </TouchableOpacity>
          <View style={styles.repDisplay}>
            <Text style={styles.repValue}>{reps}</Text>
            <Text style={styles.repUnit}>{unitLabel[movement.unit] ?? movement.unit}</Text>
          </View>
          <TouchableOpacity style={styles.repBtn} onPress={() => onRepChange(1)}>
            <Text style={styles.repBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {selected !== undefined && !onRepChange && (
        <View style={[styles.checkmark, selected && { backgroundColor: catColor }]}>
          {selected && <Text style={styles.checkmarkText}>✓</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  categoryBadge: {
    width: 6,
    alignSelf: 'stretch',
  },
  categoryText: {
    display: 'none',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  nameKo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nameEn: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  tips: {
    fontSize: 11,
    color: '#F9A825',
    marginTop: 3,
  },
  repControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    gap: 4,
  },
  repBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  repBtnText: {
    color: '#FFF',
    fontSize: 20,
    lineHeight: 22,
  },
  repDisplay: {
    alignItems: 'center',
    minWidth: 50,
  },
  repValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  repUnit: {
    fontSize: 11,
    color: '#888',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#555',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
