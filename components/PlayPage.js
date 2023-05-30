import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Level from './Level';

const levels = [
  { id: 1, smallBlind: 15, bigBlind: 30 },
  { id: 2, smallBlind: 20, bigBlind: 40 },
  { id: 3, smallBlind: 25, bigBlind: 50 },
];

const PlayPage = () => {
  const [currentLevel, setCurrentLevel] = useState(0);

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
  };

  const handleStartPause = () => {
    console.log('Start/Pause button pressed')
  };

  const handleNextLevel = () => {
    console.log('Next Level button pressed');
    setCurrentLevel(currentLevel + 1);
  };

  const handlePrevLevel = () => {
    console.log('Previous Level button pressed');
    setCurrentLevel(currentLevel - 1);
  };

  return (
    <View>
      <Level
        smallBlind={levels[currentLevel].smallBlind}
        bigBlind={levels[currentLevel].bigBlind}
        nextSmallBlind={levels[currentLevel + 1]?.smallBlind || levels[currentLevel].smallBlind}
        nextBigBlind={levels[currentLevel + 1]?.bigBlind || levels[currentLevel].bigBlind}
        duration={3}
        onCompletion={() => console.log('Level completed')}
        onStartPause={handleStartPause}
        onNextLevel={handleNextLevel}
        onPrevLevel={handlePrevLevel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default PlayPage;
