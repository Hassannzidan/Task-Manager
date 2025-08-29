import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';
import CharacterIllustration from '../components/CharacterIllustration';
import CustomButton from '../components/CustomButton';
import FloatingIcons from '../components/FloatingIcons';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  
  // Animation values
  const gradientAnim = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const characterScale = useRef(new Animated.Value(0.5)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Staggered entrance animations
    const animations = [
      // Background gradient animation
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      // Title fade in
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
      // Subtitle fade in
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 800,
        useNativeDriver: true,
      }),
      // Character zoom in
      Animated.spring(characterScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: 1000,
        useNativeDriver: true,
      }),
      // Button fade and scale in
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 800,
          delay: 1500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay: 1500,
          useNativeDriver: true,
        }),
      ]),
    ];

    Animated.parallel(animations).start();
  }, [gradientAnim, titleOpacity, subtitleOpacity, characterScale, buttonOpacity, buttonScale]);

  const handleLetsStart = () => {
    navigation.navigate('TaskManager');
  };



  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.gradientContainer, { opacity: gradientAnim }]}>
        <LinearGradient
          colors={['#E0E7FF', '#F3E8FF', '#FEF3C7']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Floating Icons Background */}
      <FloatingIcons />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title */}
        <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
          <Text style={styles.title}>Task Management</Text>
          <Text style={styles.titleAccent}>& To-Do List</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.subtitle}>
            This productive tool is designed to help you better manage your task project-wise conveniently!
          </Text>
        </Animated.View>

        {/* Character Illustration */}
        <Animated.View 
          style={[
            styles.characterContainer, 
            { transform: [{ scale: characterScale }] }
          ]}
        >
          <CharacterIllustration />
        </Animated.View>

        {/* Button */}
        <Animated.View 
          style={[
            styles.buttonContainer, 
            { 
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }]
            }
          ]}
        >
          <CustomButton
            title="Let's Start →"
            onPress={handleLetsStart}
            style={styles.letsStartButton}
            textStyle={styles.letsStartButtonText}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  titleAccent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B5CF6',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  subtitleContainer: {
    maxWidth: 320,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
  },
  letsStartButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  letsStartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
