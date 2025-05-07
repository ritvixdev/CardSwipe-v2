import React, { useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Bookmark, Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useProgressStore } from '@/store/useProgressStore';
import { Lesson } from '@/types/lesson';
import { colors } from '@/constants/colors';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface LessonCardProps {
  lesson: Lesson;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

export default function LessonCard({ 
  lesson, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeUp,
  onSwipeDown
}: LessonCardProps) {
  const progress = useProgressStore((state) => state.progress);
  const { markAsCompleted, toggleBookmark } = useProgressStore((state) => state.actions);
  
  const lessonProgress = progress[lesson.id] || { completed: false, bookmarked: false };
  
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: false }
  );
  
  const handleStateChange = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    
    if (Math.abs(translationX) > Math.abs(translationY)) {
      // Horizontal swipe
      if (translationX > SWIPE_THRESHOLD) {
        // Swipe right - bookmark
        animateSwipe('right', () => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          onSwipeRight();
        });
      } else if (translationX < -SWIPE_THRESHOLD) {
        // Swipe left - mark as read
        animateSwipe('left', () => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          onSwipeLeft();
        });
      } else {
        resetPosition();
      }
    } else {
      // Vertical swipe
      if (translationY > SWIPE_THRESHOLD) {
        // Swipe down - previous lesson
        animateSwipe('down', () => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onSwipeDown();
        });
      } else if (translationY < -SWIPE_THRESHOLD) {
        // Swipe up - next lesson
        animateSwipe('up', () => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onSwipeUp();
        });
      } else {
        resetPosition();
      }
    }
  };
  
  const animateSwipe = (direction: 'left' | 'right' | 'up' | 'down', callback: () => void) => {
    const x = direction === 'right' ? width : direction === 'left' ? -width : 0;
    const y = direction === 'down' ? height : direction === 'up' ? -height : 0;
    
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x, y },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      callback();
      pan.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
    });
  };
  
  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };
  
  const handleCardPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/lesson/${lesson.id}`);
  };
  
  // Calculate rotation and opacity based on horizontal pan
  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  
  const cardOpacity = opacity;
  
  // Indicators for swipe directions
  const leftIndicatorOpacity = pan.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const rightIndicatorOpacity = pan.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const upIndicatorOpacity = pan.y.interpolate({
    inputRange: [-height / 6, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const downIndicatorOpacity = pan.y.interpolate({
    inputRange: [0, height / 6],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  // Card scale effect when moving
  const cardScale = Animated.add(
    1,
    Animated.multiply(
      Animated.add(
        Animated.multiply(pan.x, pan.x),
        Animated.multiply(pan.y, pan.y)
      ).interpolate({
        inputRange: [0, 10000],
        outputRange: [0, -0.05],
        extrapolate: 'clamp',
      }),
      -1
    )
  );
  
  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onEnded={handleStateChange}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotate },
              { scale: cardScale },
            ],
            opacity: cardOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.dark.card, 'rgba(40, 40, 40, 0.9)']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity 
            style={styles.cardContent} 
            activeOpacity={0.9}
            onPress={handleCardPress}
          >
            <View style={styles.header}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayText}>DAY {lesson.day}</Text>
              </View>
              <View style={styles.statusIcons}>
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
              </View>
            </View>
            
            <Text style={styles.title}>{lesson.title}</Text>
            <Text style={styles.summary}>{lesson.summary}</Text>
            
            <View style={styles.codePreview}>
              <Text style={styles.codeText}>
                {lesson.codeExample.split('\n').slice(0, 3).join('\n')}
                {lesson.codeExample.split('\n').length > 3 ? '\n...' : ''}
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Swipe indicators */}
          <Animated.View style={[styles.indicator, styles.leftIndicator, { opacity: leftIndicatorOpacity }]}>
            <Check size={32} color="#fff" />
            <Text style={styles.indicatorText}>Mark as Read</Text>
          </Animated.View>
          
          <Animated.View style={[styles.indicator, styles.rightIndicator, { opacity: rightIndicatorOpacity }]}>
            <Bookmark size={32} color="#fff" />
            <Text style={styles.indicatorText}>Bookmark</Text>
          </Animated.View>
          
          <Animated.View style={[styles.indicator, styles.upIndicator, { opacity: upIndicatorOpacity }]}>
            <ChevronUp size={32} color="#fff" />
            <Text style={styles.indicatorText}>Next Lesson</Text>
          </Animated.View>
          
          <Animated.View style={[styles.indicator, styles.downIndicator, { opacity: downIndicatorOpacity }]}>
            <ChevronDown size={32} color="#fff" />
            <Text style={styles.indicatorText}>Previous Lesson</Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: height * 0.8,
    alignSelf: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayBadge: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusIcons: {
    flexDirection: 'row',
  },
  statusIcon: {
    marginLeft: 8,
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
    marginBottom: 24,
    lineHeight: 24,
  },
  codePreview: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#e2e2e2',
    lineHeight: 18,
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIndicator: {
    left: 30,
    top: '50%',
    transform: [{ translateY: -30 }],
  },
  rightIndicator: {
    right: 30,
    top: '50%',
    transform: [{ translateY: -30 }],
  },
  upIndicator: {
    top: 30,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  downIndicator: {
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -30 }],
  },
  indicatorText: {
    color: '#fff',
    marginTop: 8,
    fontWeight: 'bold',
  },
});