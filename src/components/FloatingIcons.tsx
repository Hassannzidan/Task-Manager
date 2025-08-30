import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface FloatingIcon {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  x: number;
  y: number;
  delay: number;
}

const floatingIcons: FloatingIcon[] = [
  { id: 1, icon: 'time', size: 24, color: '#8B5CF6', x: width * 0.1, y: height * 0.2, delay: 0 },
  { id: 2, icon: 'calendar', size: 28, color: '#10B981', x: width * 0.85, y: height * 0.15, delay: 200 },
  { id: 3, icon: 'document-text', size: 22, color: '#F59E0B', x: width * 0.15, y: height * 0.7, delay: 400 },
  { id: 4, icon: 'checkmark-circle', size: 26, color: '#EF4444', x: width * 0.8, y: height * 0.65, delay: 600 },
  { id: 5, icon: 'book', size: 24, color: '#8B5CF6', x: width * 0.05, y: height * 0.4, delay: 800 },
  { id: 6, icon: 'list', size: 20, color: '#10B981', x: width * 0.9, y: height * 0.35, delay: 1000 },
  { id: 7, icon: 'pencil', size: 22, color: '#F59E0B', x: width * 0.25, y: height * 0.25, delay: 1200 },
  { id: 8, icon: 'folder', size: 26, color: '#8B5CF6', x: width * 0.75, y: height * 0.8, delay: 1400 },
];

export default function FloatingIcons() {
  const iconAnimations = useRef(
    floatingIcons.map(() => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.3),
      translateY: new Animated.Value(20),
      rotation: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const animations = floatingIcons.map((icon, index) => {
      const anim = iconAnimations[index];
      
      return Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 1000,
          delay: icon.delay,
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay: icon.delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 800,
          delay: icon.delay,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim.rotation, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotation, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
    });

    Animated.parallel(animations).start();
  }, [iconAnimations]);

  return (
    <View style={styles.container} pointerEvents="none">
      {floatingIcons.map((icon, index) => {
        const anim = iconAnimations[index];
        const rotate = anim.rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={icon.id}
            style={[
              styles.iconContainer,
              {
                left: icon.x,
                top: icon.y,
                opacity: anim.opacity,
                transform: [
                  { scale: anim.scale },
                  { translateY: anim.translateY },
                  { rotate },
                ],
              },
            ]}
            accessible={false}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          >
            <Ionicons
              name={icon.icon}
              size={icon.size}
              color={icon.color}
              accessible={false}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
