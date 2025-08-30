import React, { useEffect, useState } from 'react';
import LottieAnimation from './LottieAnimation';
import SimpleWelcomeAnimation from './SimpleWelcomeAnimation';

interface SmartWelcomeAnimationProps {
  lottieSource: any;
  fallbackText?: string;
}

export default function SmartWelcomeAnimation({ 
  lottieSource, 
  fallbackText = "Welcome!" 
}: SmartWelcomeAnimationProps) {
  const [useSimpleAnimation, setUseSimpleAnimation] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Set a timeout to automatically fallback to simple animation
    // This prevents the app from hanging on complex Lottie animations
    const fallbackTimer = setTimeout(() => {
      if (!hasError) {
        setUseSimpleAnimation(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(fallbackTimer);
  }, [hasError]);

  // If we should use simple animation or if there was an error, show simple animation
  if (useSimpleAnimation || hasError) {
    return <SimpleWelcomeAnimation />;
  }

  // Try Lottie animation first
  return (
    <LottieAnimation 
      source={lottieSource}
      autoPlay={true}
      loop={true}
      fallbackText={fallbackText}
    />
  );
}
