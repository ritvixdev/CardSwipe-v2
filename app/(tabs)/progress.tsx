import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useProgressStore } from '@/store/useProgressStore';
import lessons from '@/data/lessons';
import ProgressBar from '@/components/ProgressBar';
import StatsCard from '@/components/StatsCard';
import { Calendar, CheckCircle2 } from 'lucide-react-native';

export default function ProgressScreen() {
  const progress = useProgressStore((state) => state.progress);
  
  // Calculate completed lessons
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalLessons = lessons.length;
  
  // Group lessons by completion status
  const completedLessons = lessons.filter(lesson => progress[lesson.id]?.completed);
  const remainingLessons = lessons.filter(lesson => !progress[lesson.id]?.completed);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your JavaScript learning journey</Text>
        </View>
        
        <StatsCard />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Progress</Text>
          <ProgressBar />
          
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{completedCount}</Text>
              <Text style={styles.progressStatLabel}>Completed</Text>
            </View>
            
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{totalLessons - completedCount}</Text>
              <Text style={styles.progressStatLabel}>Remaining</Text>
            </View>
            
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{totalLessons}</Text>
              <Text style={styles.progressStatLabel}>Total</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Completed</Text>
          
          {completedLessons.length > 0 ? (
            <View style={styles.completedList}>
              {completedLessons.slice(0, 3).map(lesson => (
                <View key={lesson.id} style={styles.completedItem}>
                  <CheckCircle2 size={20} color={colors.dark.success} />
                  <View style={styles.completedItemContent}>
                    <Text style={styles.completedItemTitle}>Day {lesson.day}: {lesson.title}</Text>
                    <Text style={styles.completedItemDate}>
                      {progress[lesson.id]?.lastViewed 
                        ? new Date(progress[lesson.id]?.lastViewed!).toLocaleDateString() 
                        : 'Recently'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={32} color={colors.dark.textSecondary} />
              <Text style={styles.emptyStateText}>
                You haven't completed any lessons yet.
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          
          {remainingLessons.length > 0 ? (
            <View style={styles.upNextList}>
              {remainingLessons.slice(0, 3).map(lesson => (
                <View key={lesson.id} style={styles.upNextItem}>
                  <Text style={styles.upNextItemDay}>DAY {lesson.day}</Text>
                  <Text style={styles.upNextItemTitle}>{lesson.title}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle2 size={32} color={colors.dark.success} />
              <Text style={styles.emptyStateText}>
                Congratulations! You've completed all lessons.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  progressStatLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginTop: 4,
  },
  completedList: {
    gap: 12,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.dark.success,
  },
  completedItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  completedItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark.text,
  },
  completedItemDate: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginTop: 4,
  },
  upNextList: {
    gap: 12,
  },
  upNextItem: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
  },
  upNextItemDay: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.dark.primary,
    marginBottom: 8,
  },
  upNextItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark.text,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.dark.card,
    borderRadius: 12,
  },
  emptyStateText: {
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
});