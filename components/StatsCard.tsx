import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Flame, Trophy, BookOpen } from 'lucide-react-native';
import { useProgressStore } from '@/store/useProgressStore';

export default function StatsCard() {
  const { streak, xp } = useProgressStore();
  const progress = useProgressStore((state) => state.progress);
  
  // Calculate completed lessons
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
          <Flame size={20} color={colors.dark.error} />
        </View>
        <View>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.statItem}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
          <BookOpen size={20} color={colors.dark.primary} />
        </View>
        <View>
          <Text style={styles.statValue}>{completedCount}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.statItem}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
          <Trophy size={20} color={colors.dark.secondary} />
        </View>
        <View>
          <Text style={styles.statValue}>{xp}</Text>
          <Text style={styles.statLabel}>XP Points</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
});