import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Player from '../interfaces/Player';
import { SKILL_MAPPING } from '../constants/skills';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colours from '../config/Colours';

interface PlayerCardProps {
  player: Player;
  isYou: boolean;
  isHost: boolean;
  sportId: string;
}

export default function PlayerCard({ player, isYou, isHost, sportId }: PlayerCardProps) {
  // Get index of sport in player's preferred sports
  const sportIndex = player.preferred_sports_ids.indexOf(sportId);
  // Get skill level for the sport, default to 0 if not found
  const skillLevel = sportIndex !== -1 ? player.preferred_sports_skill_levels[sportIndex] : 0;
  const skillLabel = SKILL_MAPPING[skillLevel] || '';
  return (
    <View
      style={[
        styles.card,
        isYou ? { borderWidth: 2, borderColor: 'green' } : { borderWidth: 2, borderColor: '#eee' },
      ]}
    >
      <Ionicons name="person" size={24} color="black" />
      <Text style={styles.name}>{player.name}</Text>
      <Text style={styles.role}>
        {isHost ? <Text style={styles.hostRole}>Host</Text> : 'Player'}
      </Text>
      <Text>Age: {player.age}</Text>
      <Text>{player.gender ? 'Male' : 'Female'}</Text>
      <View style={styles.skillContainer}>
        <Text style={styles.skillText}>{skillLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingVertical: 4,
    alignItems: 'center',
    marginHorizontal: 4,
    width: 90,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  hostRole: {
    fontWeight: 'bold',
  },
  skillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  skillText: {
    color: Colours.primary,
    fontSize: 14,
    marginLeft: 4,
  },
});
