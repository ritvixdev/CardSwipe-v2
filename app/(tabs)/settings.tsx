import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useProgressStore } from '@/store/useProgressStore';
import { 
  RefreshCw, 
  Trash2, 
  Github, 
  ExternalLink, 
  Info, 
  Heart,
  Shuffle
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { shuffleLessons } from '@/data/lessons';

export default function SettingsScreen() {
  const resetProgress = useProgressStore((state) => state.actions.resetProgress);
  
  const handleResetProgress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          onPress: () => {
            resetProgress();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleShuffleLessons = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Shuffle Lessons",
      "This will randomize the order of lessons for a fresh learning experience.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Shuffle", 
          onPress: () => {
            shuffleLessons();
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            Alert.alert("Lessons Shuffled", "Restart the app to see the new order.");
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your learning experience</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleShuffleLessons}>
            <View style={styles.settingContent}>
              <Shuffle size={22} color={colors.dark.text} />
              <Text style={styles.settingText}>Shuffle Lessons</Text>
            </View>
            <ExternalLink size={18} color={colors.dark.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleResetProgress}>
            <View style={styles.settingContent}>
              <RefreshCw size={22} color={colors.dark.text} />
              <Text style={styles.settingText}>Reset Progress</Text>
            </View>
            <ExternalLink size={18} color={colors.dark.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.settingItem, styles.dangerItem]}>
            <View style={styles.settingContent}>
              <Trash2 size={22} color={colors.dark.error} />
              <Text style={[styles.settingText, { color: colors.dark.error }]}>Clear All Data</Text>
            </View>
            <ExternalLink size={18} color={colors.dark.error} />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Info size={22} color={colors.dark.text} />
              <Text style={styles.settingText}>Version</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Github size={22} color={colors.dark.text} />
              <Text style={styles.settingText}>Source Code</Text>
            </View>
            <ExternalLink size={18} color={colors.dark.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Heart size={22} color={colors.dark.text} />
              <Text style={styles.settingText}>Support Development</Text>
            </View>
            <ExternalLink size={18} color={colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            JavaScript 30-Day SwipeLearn
          </Text>
          <Text style={styles.footerSubtext}>
            Based on Asabeneh's 30 Days of JavaScript
          </Text>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dangerItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.dark.text,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.dark.inactive,
    textAlign: 'center',
    marginTop: 4,
  },
});