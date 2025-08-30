import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LottieAnimationProps {
  source: any;
  autoPlay?: boolean;
  loop?: boolean;
  style?: any;
  fallbackText?: string;
}

export default function LottieAnimation({ 
  source, 
  autoPlay = true, 
  loop = true, 
  style,
  fallbackText = "Loading..."
}: LottieAnimationProps) {
  const animationRef = useRef<LottieView>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (autoPlay && animationRef.current && !hasError) {
      try {
        animationRef.current.play();
      } catch (error) {
        console.warn('Lottie animation play error:', error);
        setHasError(true);
      }
    }
  }, [autoPlay, hasError]);

  const handleAnimationFinish = () => {
    setIsLoading(false);
  };

  // If there's an error, show fallback
  if (hasError) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.fallbackText}>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LottieView
        ref={animationRef}
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        style={styles.animation}
        resizeMode="contain"
        onAnimationFinish={handleAnimationFinish}
        speed={1}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    position: 'relative',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  fallbackText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
  },
});
