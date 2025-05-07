import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Lesson } from '@/types/lesson';
import { useProgressStore } from '@/store/useProgressStore';
import { router } from 'expo-router';
import { Bookmark, Check, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface LessonListProps {
  lessons: Lesson[];
  showBookmarkedOnly?: boolean;
}

export default function LessonList({ lessons, showBookmarkedOnly = false }: LessonListProps) {
  const progress = useProgressStore((state) => state.progress);
  
  const filteredLessons = showBookmarkedOnly 
    ? lessons.filter(lesson => progress[lesson.id]?.bookmarked)
    : lessons;
  
  const handleLessonPress = (lesson: Lesson) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/lesson/${lesson.id}`);
  };
  
  if (filteredLessons.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {showBookmarkedOnly 
            ? "You haven't bookmarked any lessons yet." 
            : "No lessons available."}
        </Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={filteredLessons}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => {
        const lessonProgress = progress[item.id] || { completed: false, bookmarked: false };
        
        return (
          <TouchableOpacity 
            style={[
              styles.lessonItem,
              lessonProgress.completed && styles.completedLesson
            ]}
            onPress={() => handleLessonPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.lessonContent}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayText}>DAY {item.day}</Text>
              </View>
              
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonSummary} numberOfLines={2}>
                {item.summary}
              </Text>
            </View>
            
            <View style={styles.lessonActions}>
              {lessonProgress.completed && (
                <View style={styles.statusIcon}>
                  <Check size={16} color={colors.dark.success} />
                </View>
              )}
              
              {lessonProgress.bookmarked && (
                <View style={styles.statusIcon}>
                  <Bookmark size={16} color={colors.dark.primary} fill={colors.dark.primary} />
                </View>
              )}
              
              <ChevronRight size={20} color={colors.dark.textSecondary} />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  completedLesson: {
    borderLeftWidth: 4,
    borderLeftColor: colors.dark.success,
  },
  lessonContent: {
    flex: 1,
  },
  dayBadge: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 4,
  },
  lessonSummary: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  lessonActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: colors.dark.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});