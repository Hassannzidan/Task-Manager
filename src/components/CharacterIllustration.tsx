import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CharacterIllustration() {
  return (
    <View style={styles.container}>
      {/* Character Body */}
      <View style={styles.character}>
        {/* Head */}
        <View style={styles.head}>
          <View style={styles.face}>
            <View style={styles.eye} />
            <View style={styles.eye} />
            <View style={styles.mouth} />
          </View>
        </View>
        
        {/* Body */}
        <View style={styles.body}>
          {/* Arms */}
          <View style={styles.armLeft} />
          <View style={styles.armRight} />
          
          {/* Hands */}
          <View style={styles.handLeft} />
          <View style={styles.handRight} />
        </View>
        
        {/* Legs */}
        <View style={styles.legs}>
          <View style={styles.leg} />
          <View style={styles.leg} />
        </View>
      </View>
      
      {/* Laptop */}
      <View style={styles.laptop}>
        <View style={styles.laptopScreen}>
          <View style={styles.screenContent}>
            <Ionicons name="grid" size={16} color="#8B5CF6" />
            <Ionicons name="checkmark-circle" size={12} color="#10B981" />
            <Ionicons name="time" size={14} color="#F59E0B" />
          </View>
        </View>
        <View style={styles.laptopBase} />
        <View style={styles.laptopKeyboard} />
      </View>
      
      {/* Desk */}
      <View style={styles.desk} />
      
      {/* Chair */}
      <View style={styles.chair}>
        <View style={styles.chairSeat} />
        <View style={styles.chairBack} />
      </View>
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
  character: {
    alignItems: 'center',
    zIndex: 3,
  },
  head: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1F2937',
    marginHorizontal: 2,
  },
  mouth: {
    width: 12,
    height: 2,
    backgroundColor: '#1F2937',
    borderRadius: 1,
    marginTop: 4,
  },
  body: {
    width: 60,
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  armLeft: {
    position: 'absolute',
    left: -8,
    top: 10,
    width: 6,
    height: 25,
    backgroundColor: '#FBBF24',
    borderRadius: 3,
    transform: [{ rotate: '-20deg' }],
  },
  armRight: {
    position: 'absolute',
    right: -8,
    top: 10,
    width: 6,
    height: 25,
    backgroundColor: '#FBBF24',
    borderRadius: 3,
    transform: [{ rotate: '20deg' }],
  },
  handLeft: {
    position: 'absolute',
    left: -12,
    top: 32,
    width: 8,
    height: 8,
    backgroundColor: '#FBBF24',
    borderRadius: 4,
  },
  handRight: {
    position: 'absolute',
    right: -12,
    top: 32,
    width: 8,
    height: 8,
    backgroundColor: '#FBBF24',
    borderRadius: 4,
  },
  legs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  leg: {
    width: 8,
    height: 30,
    backgroundColor: '#1E40AF',
    borderRadius: 4,
  },
  laptop: {
    position: 'absolute',
    bottom: 20,
    zIndex: 2,
    alignItems: 'center',
  },
  laptopScreen: {
    width: 80,
    height: 50,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6B7280',
  },
  screenContent: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  laptopBase: {
    width: 90,
    height: 6,
    backgroundColor: '#6B7280',
    borderRadius: 3,
    marginTop: 2,
  },
  laptopKeyboard: {
    width: 85,
    height: 4,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    marginTop: 1,
  },
  desk: {
    position: 'absolute',
    bottom: 0,
    width: 160,
    height: 8,
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
    zIndex: 1,
  },
  chair: {
    position: 'absolute',
    bottom: 8,
    zIndex: 1,
  },
  chairSeat: {
    width: 50,
    height: 6,
    backgroundColor: '#6B7280',
    borderRadius: 3,
  },
  chairBack: {
    width: 6,
    height: 40,
    backgroundColor: '#6B7280',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 2,
  },
});
