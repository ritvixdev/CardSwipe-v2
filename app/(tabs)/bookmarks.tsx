import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import lessons from '@/data/lessons';
import LessonList from '@/components/LessonList';
import { Bookmark } from 'lucide-react-native';

export default function BookmarksScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarked Lessons</Text>
        <Text style={styles.subtitle}>Your saved JavaScript lessons</Text>
      </View>
      
      <LessonList lessons={lessons} showBookmarkedOnly={true} />
      
      <View style={styles.emptyStateContainer}>
        <Bookmark size={64} color="rgba(255, 255, 255, 0.1)" />
        <Text style={styles.emptyStateText}>
          Swipe right on a lesson card to bookmark it for later
        </Text>
      </View>
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
  emptyStateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 24,
    opacity: 0.5,
  },
  emptyStateText: {
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});