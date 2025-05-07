import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { useProgressStore } from '@/store/useProgressStore';
import lessons from '@/data/lessons';

export default function ProgressBar() {
  const progress = useProgressStore((state) => state.progress);
  
  // Calculate completed lessons
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalLessons = lessons.length;
  const percentComplete = (completedCount / totalLessons) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          {completedCount} of {totalLessons} completed
        </Text>
        <Text style={styles.percentText}>{Math.round(percentComplete)}%</Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${percentComplete}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  percentText: {
    color: colors.dark.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.dark.primary,
    borderRadius: 4,
  },
});