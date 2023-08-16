import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const PlayPage = () => {
  const defaultDuration = 15; // Test duration in seconds
  const levels = [
    { smallBlind: 15, bigBlind: 30 },
    { smallBlind: 20, bigBlind: 40 },
    { smallBlind: 25, bigBlind: 50 },
  ];

  const [players, setPlayers] = useState([
    { id: 1, firstName: "John", lastName: "Doe", kills: 0, place: 0 },
    { id: 2, firstName: "Jane", lastName: "Smith", kills: 0, place: 0 },
    { id: 3, firstName: "Mike", lastName: "Johnson", kills: 0, place: 0 },
    { id: 4, firstName: "Sarah", lastName: "Williams", kills: 0, place: 0 },
    { id: 5, firstName: "David", lastName: "Brown", kills: 0, place: 0 },
    { id: 6, firstName: "Emily", lastName: "Jones", kills: 0, place: 0 },
  ]);

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
  const [playerListBorderColor, setPlayerListBorderColor] = useState('black');
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [eliminationOrder, setEliminationOrder] = useState([]);


  const dingSoundFile = require('../assets/ding.wav');
  const alarmSoundFile = require('../assets/alarm.mp3');
  const playerListTouchable = useState(false);

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
    // Remove non-digit characters from the input
      const digitsOnly = text.replace(/\D/g, '');

      // Format the input as HH:mm:ss
      let formattedTime = '';
      switch (digitsOnly.length) {
           case 0:
                formattedTime = '';
                break;
           case 1:
                formattedTime = digitsOnly;
                break;
           case 2:
                formattedTime = digitsOnly;
                break;
           case 3:
                formattedTime = digitsOnly.substring(0, 1) + ':' + digitsOnly.substring(1, 3)
                break;
           case 4:
                formattedTime = digitsOnly.substring(0, 2) + ':' + digitsOnly.substring(2, 4);
                break;
           case 5:
                formattedTime = digitsOnly.substring(0, 1) + ':' + digitsOnly.substring(1, 3) + ':' + digitsOnly.substring(3, 5);
                break;
           case 6:
                formattedTime = digitsOnly.substring(0, 2 )+ ':' + digitsOnly.substring(2, 4) + ':' + digitsOnly.substring(4, 6);
                break;
           case 7:
                formattedTime = digitsOnly.substring(0, 2 )+ ':' + digitsOnly.substring(2, 4) + ':' + digitsOnly.substring(4, 6);
                break;
      }

      setTimeInput(formattedTime);
  };

  const handleInputSubmit = () => {
    setDuration(parseInt(timeInput));
    setIsTimeEditing(false);
    let timeInSeconds = timeToSeconds(timeInput);
    setDuration(timeInSeconds === '' ? 0 : parseInt(timeInSeconds));
    setKey(prevKey => prevKey + 1); // Force re-render of Timer component
  };

  const timeToSeconds = (formattedTime) => {
    const timeParts = formattedTime.split(':');
    switch (timeParts.length) {
        case 1:
            return parseInt(timeParts[0]) || 0;
        case 2:
            return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) || 0;
        case 3:
            return parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]) || 0;
        default:
            return 0;
    }
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

  const handlePlayerClick = (index) => {
    setSelectedPlayerIndex(index);
  };


    const handleEliminateButtonClick = () => {
      if (selectedPlayerIndex !== null) {
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          const eliminatedPlayer = updatedPlayers.splice(
            selectedPlayerIndex,
            1
          )[0];

          const eliminatedPlayerCount = players.filter(player => player.eliminated).length;
          eliminatedPlayer.eliminated = true;
          eliminatedPlayer.place = players.length - eliminatedPlayerCount; // Assign place for eliminated player
          updatedPlayers.push(eliminatedPlayer);
          setSelectedPlayerIndex(null);

          updatedPlayers.sort((a, b) => a.place - b.place);

          // Check if there's only one active player left
          const activePlayers = updatedPlayers.filter(player => !player.eliminated);
          if (activePlayers.length === 1) {
            activePlayers[0].place = 1;
          }

          return updatedPlayers;
        });
      }
    };




    const handleAddKill = () => {
      if (selectedPlayerIndex !== null) {
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          updatedPlayers[selectedPlayerIndex].kills += 1;
          setSelectedPlayerIndex(null); // Reset selected player
          return updatedPlayers;
        });
      }
    };

  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.timerContainer}>
            <CountdownCircleTimer
              key={key}
              isPlaying={isTimerPlaying}
              duration={duration}
              colors={['#004777']}
              onComplete={handleTimerEnd}
              strokeWidth={10}
              trailColor="#ECECEC"
              strokeLine-cap="butt"
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
            <View><Text style={styles.playerListHeader}>Players</Text></View>
            {players.map((player, index) => (
              <TouchableOpacity
                key={player.id}
                style={[
                  styles.playerContainer,
                  selectedPlayerIndex === index && styles.selectedPlayerContainer,
                  player.eliminated && styles.eliminatedPlayerContainer,
                ]}
                onPress={player.eliminated ? null : () => handlePlayerClick(index)}
              >
                <Text style={styles.playerName}>
                  {player.firstName} {player.lastName}
                </Text>
                <Text style={styles.playerStats}>
                  Kills: {player.kills} | Place: {player.eliminated ? player.place : player.place === 1 ? '1' :  'Active'}
                </Text>
              </TouchableOpacity>
            ))}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.eliminateButton, { marginRight: 10 }]}
                  onPress={handleEliminateButtonClick}
                >
                  <Text style={styles.eliminateButtonText}>Eliminate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.killButton}
                  onPress={handleAddKill}
                >
                  <Text style={styles.killButtonText}>Add Kill</Text>
                </TouchableOpacity>
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
    fontWeight: 'bold',
    color: '#004777',
  },
  contentContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    color: '#004777',
  },
  scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
  },
  playerListHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: 250,
    alignSelf: 'center',
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
  },
  playerName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerStats: {
    fontSize: 12,
  },
  eliminateButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    maxWidth: 100,
  },
  eliminateButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedPlayerContainer: {
    borderColor: 'blue',
    borderWidth: 2,
  },
  eliminatedPlayerContainer: {
    borderColor: 'light-gray',
    borderWidth: 1,
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  killButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    maxWidth: 100,
  },
  killButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PlayPage;