import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Timer = ({ duration, onCompletion }) => {
  const [paused, setPaused] = useState(false);

  return (
    <View style={styles.container}>
      <CountdownCircleTimer
        isPlaying={!paused}
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        onComplete={onCompletion}
        renderText={(remainingTime) => formatTime(remainingTime)}
        updateInterval={1}
      >
        {({ remainingTime, color }) => (
          <Text style={{ color, fontSize: 40 }}>
            {formatTime(remainingTime)}
          </Text>
        )}
      </CountdownCircleTimer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Timer;
