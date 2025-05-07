import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Quiz } from '@/types/lesson';
import { useProgressStore } from '@/store/useProgressStore';
import * as Haptics from 'expo-haptics';

interface QuizCardProps {
  quiz: Quiz;
  lessonId: number;
}

export default function QuizCard({ quiz, lessonId }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { addXp } = useProgressStore((state) => state.actions);
  
  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    // Award XP if correct
    if (option === quiz.answer) {
      addXp(10);
    }
  };
  
  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return styles.option;
    }
    
    if (option === quiz.answer) {
      return [styles.option, styles.correctOption];
    }
    
    if (option === selectedOption) {
      return [styles.option, styles.incorrectOption];
    }
    
    return styles.option;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz</Text>
      <Text style={styles.question}>{quiz.question}</Text>
      
      <View style={styles.optionsContainer}>
        {quiz.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => handleOptionSelect(option)}
            activeOpacity={0.8}
            disabled={isAnswered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {isAnswered && (
        <View style={styles.resultContainer}>
          {selectedOption === quiz.answer ? (
            <Text style={styles.correctText}>Correct! +10 XP</Text>
          ) : (
            <View>
              <Text style={styles.incorrectText}>Incorrect</Text>
              <Text style={styles.correctAnswerText}>
                The correct answer is: {quiz.answer}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  correctOption: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: colors.dark.success,
  },
  incorrectOption: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: colors.dark.error,
  },
  optionText: {
    color: colors.dark.text,
    fontSize: 15,
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  },
  correctText: {
    color: colors.dark.success,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  incorrectText: {
    color: colors.dark.error,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  correctAnswerText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});