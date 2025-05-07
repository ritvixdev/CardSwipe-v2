import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useProgressStore } from '@/store/useProgressStore';
import lessons from '@/data/lessons';
import { Bookmark, Check, ArrowLeft, ArrowRight } from 'lucide-react-native';
import QuizCard from '@/components/QuizCard';
import * as Haptics from 'expo-haptics';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams();
  const lessonId = parseInt(id as string);
  
  const progress = useProgressStore((state) => state.progress);
  const actions = useProgressStore((state) => state.actions);
  
  const lesson = lessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lesson not found</Text>
      </View>
    );
  }
  
  const lessonProgress = progress[lessonId] || { completed: false, bookmarked: false };
  
  const handleMarkAsCompleted = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    actions.markAsCompleted(lessonId);
  };
  
  const handleToggleBookmark = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    actions.toggleBookmark(lessonId);
  };
  
  // Find previous and next lessons
  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>DAY {lesson.day}</Text>
          </View>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.summary}>{lesson.summary}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              lessonProgress.completed && styles.activeActionButton
            ]}
            onPress={handleMarkAsCompleted}
          >
            <Check size={20} color={lessonProgress.completed ? '#fff' : colors.dark.text} />
            <Text style={[
              styles.actionText,
              lessonProgress.completed && styles.activeActionText
            ]}>
              {lessonProgress.completed ? 'Completed' : 'Mark as Completed'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              lessonProgress.bookmarked && styles.bookmarkedButton
            ]}
            onPress={handleToggleBookmark}
          >
            <Bookmark 
              size={20} 
              color={lessonProgress.bookmarked ? '#fff' : colors.dark.text}
              fill={lessonProgress.bookmarked ? '#fff' : 'transparent'}
            />
            <Text style={[
              styles.actionText,
              lessonProgress.bookmarked && styles.activeActionText
            ]}>
              {lessonProgress.bookmarked ? 'Bookmarked' : 'Bookmark'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Lesson Details</Text>
          <Text style={styles.detailsText}>{lesson.details}</Text>
          
          <Text style={styles.sectionTitle}>Code Example</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>{lesson.codeExample}</Text>
          </View>
          
          {lesson.quiz && (
            <QuizCard quiz={lesson.quiz} lessonId={lessonId} />
          )}
        </View>
        
        <View style={styles.navigation}>
          {prevLesson ? (
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <ArrowLeft size={20} color={colors.dark.text} />
              <View style={styles.navContent}>
                <Text style={styles.navLabel}>Previous</Text>
                <Text style={styles.navTitle} numberOfLines={1}>
                  Day {prevLesson.day}: {prevLesson.title}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          
          {nextLesson ? (
            <TouchableOpacity 
              style={[styles.navButton, styles.navButtonRight]}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <View style={styles.navContent}>
                <Text style={styles.navLabel}>Next</Text>
                <Text style={styles.navTitle} numberOfLines={1}>
                  Day {nextLesson.day}: {nextLesson.title}
                </Text>
              </View>
              <ArrowRight size={20} color={colors.dark.text} />
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  dayBadge: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeActionButton: {
    backgroundColor: colors.dark.success,
    borderColor: colors.dark.success,
  },
  bookmarkedButton: {
    backgroundColor: colors.dark.primary,
    borderColor: colors.dark.primary,
  },
  actionText: {
    color: colors.dark.text,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeActionText: {
    color: '#fff',
  },
  content: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 12,
    marginTop: 24,
  },
  detailsText: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    lineHeight: 24,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    color: '#e2e2e2',
    lineHeight: 20,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    padding: 16,
    borderRadius: 12,
    maxWidth: '48%',
  },
  navButtonRight: {
    justifyContent: 'flex-end',
  },
  navContent: {
    marginHorizontal: 8,
  },
  navLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.text,
  },
  errorText: {
    fontSize: 18,
    color: colors.dark.error,
    textAlign: 'center',
    marginTop: 24,
  },
});