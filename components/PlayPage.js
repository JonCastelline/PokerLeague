import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const PlayPage = () => {
  const alarmSound = new Audio.Sound();
  const defaultDuration = 5; // Test duration in seconds
  const levels = [
    { smallBlind: 15, bigBlind: 30 },
    { smallBlind: 20, bigBlind: 40 },
    { smallBlind: 25, bigBlind: 50 }
  ];

  const [duration, setDuration] = useState(defaultDuration);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isTimerPlaying, setIsTimerPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const playAlarm = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(require('../assets/alarm.mp3'));
          setSound(sound);
          await sound.playAsync();
        } catch (error) {
          console.log('Error playing sound', error);
        }
      };

  const timerRef = useRef(null);


  // Play the alarm sound
  const playAlarmSound = async () => {
       try {
         const { sound } = await Audio.Sound.createAsync(require('../assets/alarm.mp3'));
         setSound(sound);
         await sound.playAsync();
       } catch (error) {
         console.log('Error playing sound', error);
       }
     };

  // Stop the alarm sound
  const stopAlarmSound = async () => {
    try {
      await alarmSound.unloadAsync();
    } catch (error) {
      console.log('Error stopping alarm sound:', error);
    }
  };

  // Handle timer expiration
  const handleTimerEnd = () => {
    playAlarmSound();
    setIsTimerPlaying(false);
  };

  // Handle previous level button press
  const handlePreviousLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(prevLevel => prevLevel - 1);
      stopAlarmSound();
      setIsTimerPlaying(false);
      setDuration(defaultDuration);
    }
  };

  // Handle next level button press
  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prevLevel => prevLevel + 1);
      stopAlarmSound();
      setIsTimerPlaying(false);
      setDuration(defaultDuration);
    }
  };

  // Handle start/pause button press
  const handleStartPause = () => {
    if (isTimerPlaying) {
      setIsTimerPlaying(false);
    } else {
      setIsTimerPlaying(true);
    }
  };

  // Handle reset button press
  const handleReset = () => {
    stopAlarmSound();
    setIsTimerPlaying(false);
    setDuration(defaultDuration);
  };

  // Render the component
  return (
      <View style={styles.container}>
        <View style={styles.timerContainer}>
          <CountdownCircleTimer
            key={duration}
            isPlaying={isTimerPlaying}
            duration={duration}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            onComplete={handleTimerEnd}
            strokeWidth={10}
            trailColor="#ECECEC"
            strokeLinecap="butt"
            size={200}
          >
            {({ remainingTime }) => (
              <TouchableOpacity
                onPress={() => {
                  setDuration(remainingTime);
                }}
                style={styles.timerButton}
              >
                <Text style={styles.countdownText}>{remainingTime}</Text>
              </TouchableOpacity>
            )}
          </CountdownCircleTimer>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePreviousLevel}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleStartPause}>
              <Text style={[styles.buttonText, styles.startButtonText]}>
                {isTimerPlaying ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleNextLevel}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level: {currentLevel + 1}</Text>
          </View>

          <View style={styles.blindContainer}>
            <View style={styles.blindTextContainer}>
              <Text>Small Blind: {levels[currentLevel].smallBlind}</Text>
            </View>
            <View style={styles.blindTextContainer}>
              <Text>Big Blind: {levels[currentLevel].bigBlind}</Text>
            </View>
          </View>
          <View style={styles.levelContainer}>
              <Text style={styles.levelText}>Next Level: </Text>
            </View>

            <View style={styles.blindContainer}>
              <View style={styles.blindTextContainer}>
                <Text>Next Small Blind: {levels[currentLevel + 1]?.smallBlind}</Text>
              </View>
              <View style={styles.blindTextContainer}>
                <Text>Next Big Blind: {levels[currentLevel + 1]?.bigBlind}</Text>
              </View>
            </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    padding: 10,
  },
  countdownText: {
    fontSize: 40,
    color: 'magenta',
  },
  contentContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    //marginTop: 20,
  },
  buttonContainer: {
   flexDirection: 'row',
   justifyContent: 'center',
   marginVertical: 10,
 },
  button: {
    borderWidth: 1,
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startButtonText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  levelText: {
    fontWeight: 'bold',
  },
  blindContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  blindTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});



export default PlayPage;