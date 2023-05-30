import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Timer = forwardRef(({ duration, onCompletion, onUpdate, reset }, ref) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reset) {
      // Reset the timer by pausing it
      setPaused(true);

      // Delay the start of the timer by a small amount to ensure reset takes effect
      const delay = setTimeout(() => {
        setPaused(false);
      }, 10);

      return () => clearTimeout(delay);
    }
  }, [reset]);

  // Expose the resetTimer function through the ref
  useImperativeHandle(ref, () => ({
    resetTimer() {
      setPaused(true);
      setTimeout(() => {
        setPaused(false);
        reset();
      }, 0);
    },
  }));

  return (
    <View style={styles.container}>
      <CountdownCircleTimer
        isPlaying={!paused}
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        onComplete={onCompletion}
        size={200}
        strokeWidth={10}
        trailColor="#ECECEC"
        strokeLinecap="butt"
        key={reset} // Add key prop to force re-render on reset
      >
        {({ remainingTime, color }) => (
          <Text style={{ color, fontSize: 40 }}>
            {formatTime(remainingTime)}
          </Text>
        )}
      </CountdownCircleTimer>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Timer;
