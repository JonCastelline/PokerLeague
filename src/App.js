import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../components/LoginPage';
import HomePage from '../components/HomePage';
import PlayPage from '../components/PlayPage';
import StandingsPage from '../components/StandingsPage';
import { useNavigation } from '@react-navigation/native';
LogBox.ignoreLogs(['Remote debugger']);

const Stack = createStackNavigator();

export default function App() {
    // Initialize players state using useState
    const [players, setPlayers] = useState([
        { id: 1, firstName: "John", lastName: "Doe", kills: 0, place: 0, bounties: 0, points: 5, hasBounty: false, playing: true },
        { id: 2, firstName: "Jane", lastName: "Smith", kills: 0, place: 0, bounties: 0, points: 11, hasBounty: false, playing: true },
        { id: 3, firstName: "Mike", lastName: "Johnson", kills: 0, place: 0, bounties: 0, points: 3, hasBounty: false, playing: true },
        { id: 4, firstName: "Sarah", lastName: "Williams", kills: 0, place: 0, bounties: 0, points: 11, hasBounty: false, playing: true },
        { id: 5, firstName: "David", lastName: "Brown", kills: 0, place: 0, bounties: 0, points: 0, hasBounty: false, playing: true },
        { id: 6, firstName: "Emily", lastName: "Jones", kills: 0, place: 0, bounties: 0, points: 6, hasBounty: false, playing: true },
    ]);

    // Calculate the player with the highest points and set hasBounty property
    const maxPoints = Math.max(...players.map(player => player.points));
    const playersWithBounties = players.map(player => ({
      ...player,
      hasBounty: player.points === maxPoints,
    }));

    const updatePlayers = (updatedPlayers) => {
        setPlayers(updatedPlayers);
    };

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Standings" component={StandingsPage} />
          <Stack.Screen name="Play">
            {props => <PlayPage {...props} players={playersWithBounties} updatePlayers={updatePlayers}/>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
