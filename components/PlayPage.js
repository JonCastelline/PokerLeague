import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const PlayPage = () => {
  const defaultDuration = 15; // Test duration in seconds
  const levels = [
    { smallBlind: 15, bigBlind: 30 },
    { smallBlind: 20, bigBlind: 40 },
    { smallBlind: 25, bigBlind: 50 }
  ];

  const [duration, setDuration] = useState(defaultDuration);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isTimerPlaying, setIsTimerPlaying] = useState(false);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [sound, setSound] = useState(null);
  const [key, setKey] = useState(0); // Used to force re-render of Timer component
  const prevRemainingTimeRef = useRef(0);
  const [isTimeEditing, setIsTimeEditing] = useState(false);
  const [timeInput, setTimeInput] = useState(duration.toString());
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputTextSize, setInputTextSize] = useState(40);
  const [previousTextSize, setPreviousTextSize] = useState(40);

  const dingSoundFile = require('../assets/ding.wav');
  const alarmSoundFile = require('../assets/alarm.mp3');

  const playSound = async (soundFile) => {
    try {
      stopSound();
      const playingSound = new Audio.Sound();
      await playingSound.loadAsync(soundFile);
      await playingSound.playAsync();
      setSound(playingSound);
    } catch (error) {
      console.log('Error playing sound', error);
    }
  };

  const stopSound = async () => {
    try {
      if (sound !== null) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
    } catch (error) {
      console.log('Error stopping sound:', error);
    }
  };

  const handleTimerEnd = () => {
    playSound(alarmSoundFile);
    setIsTimerPlaying(false);
    setIsTimerExpired(true);
  };

  const handlePreviousLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(prevLevel => prevLevel - 1);
      stopSound();
      setIsTimerPlaying(false);
      setIsTimerExpired(false);
      setDuration(defaultDuration);
      setKey(prevKey => prevKey + 1); // Force re-render of Timer component
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prevLevel => prevLevel + 1);
      stopSound();
      setIsTimerPlaying(false);
      setIsTimerExpired(false);
      setDuration(defaultDuration);
      setKey(prevKey => prevKey + 1); // Force re-render of Timer component
    }
  };

  const handleStartPause = () => {
    if (isTimerExpired) {
      handleReset(); // Call handleReset when the timer is expired
    } else {
      setIsTimerPlaying(prevState => !prevState); // Toggle the timer play state
      stopSound();
    }
  };

  const handleReset = () => {
    stopSound();
    setIsTimerPlaying(false);
    setIsTimerExpired(false);
    setDuration(defaultDuration);
    setKey(prevKey => prevKey + 1); // Force re-render of Timer component
  };

  const handleTimePress = () => {
    setIsTimeEditing(true);
    setIsInputFocused(true);
    setPreviousTextSize(inputTextSize); // Store the previous text size
    setInputTextSize(20); // Set the smaller input text size
  };

  const handleInputChange = (text) => {
    setTimeInput(text);
  };

  const handleInputSubmit = () => {
    setDuration(parseInt(timeInput));
    setIsTimeEditing(false);
    setDuration(timeInput === '' ? 0 : parseInt(timeInput));
    setKey(prevKey => prevKey + 1); // Force re-render of Timer component
  };

  const handleInputBlur = () => {
    setIsTimeEditing(false);
    setIsInputFocused(false);
    setInputTextSize(previousTextSize); // Restore the previous text size
  };

  const renderTime = ({ remainingTime }) => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    let formattedTime = '';
    if (hours > 0) {
      formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes >= 10) {
      formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      formattedTime = `${seconds}`;
    }

    if (isTimeEditing) {
      return (
        <View style={styles.timerButton}>
          <TextInput
            style={[styles.countdownText, styles.input, { fontSize: inputTextSize }]}
            autoFocus={true}
            keyboardType="number-pad"
            value={timeInput}
            onChangeText={handleInputChange}
            onSubmitEditing={handleInputSubmit}
            onBlur={handleInputBlur}
            selectionColor="blue"
            selectTextOnFocus={true}
          />
        </View>
      );
    }

    if (remainingTime === 3 && remainingTime !== prevRemainingTimeRef.current) {
      playSound(dingSoundFile);
    }
    prevRemainingTimeRef.current = remainingTime;

    return (
      <TouchableOpacity onPress={handleTimePress} style={styles.timerButton}>
        <Text style={styles.countdownText}>{formattedTime}</Text>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.timerContainer}>
            <CountdownCircleTimer
              key={key}
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
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setDuration(remainingTime);
                    }}
                    style={styles.timerButton}
                  >
                    <Text style={styles.countdownText}>{renderTime({ remainingTime })}</Text>
                  </TouchableOpacity>
                </>
              )}
            </CountdownCircleTimer>
          </View>

          <View style={styles.contentContainer}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handlePreviousLevel}>
                  <Text style={styles.buttonText}>Prev</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleStartPause}>
                  <Text style={[styles.buttonText, isTimerExpired ? styles.resetButtonText : styles.startButtonText]}>
                    {isTimerPlaying ? 'Pause' : (isTimerExpired ? 'Reset' : 'Start')}
                  </Text>
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
            </ScrollView>
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
  input: {
    fontSize: 40,
    color: 'magenta',
  },
  scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
  },
});

export default PlayPage;