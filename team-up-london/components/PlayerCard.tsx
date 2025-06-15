import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Player from '../interfaces/Player';
import { SKILL_MAPPING } from '../constants/skills';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colours from '../config/Colours';

export default function PlayerCard({ player, cardPlayer, isHost, sportId, onPress }: {
  player: Player;
  cardPlayer: Player;
  isHost: boolean;
  sportId: string;
  onPress: () => void;
}) {
  // Get index of sport in cardPlayer's preferred sports
  const sportIndex = cardPlayer.preferred_sports_ids.indexOf(sportId);
  // Get skill level for the sport, default to 0 if not found
  const skillLevel = sportIndex !== -1 ? cardPlayer.preferred_sports_skill_levels[sportIndex] : 0;
  const skillLabel = SKILL_MAPPING[skillLevel] || '';
  return (
    <TouchableOpacity
      style={[
        styles.card,
        player.id === cardPlayer.id ? { borderWidth: 2, borderColor: 'green' } : { borderWidth: 2, borderColor: '#eee' },
      ]}
      onPress={player.id !== cardPlayer.id ? onPress : undefined}
    >
      <Ionicons name="person" size={24} color="black" />
      <Text style={styles.name}>{cardPlayer.name}</Text>
      <Text style={styles.role}>
        {isHost ? <Text style={styles.hostRole}>Host</Text> : 'Player'}
      </Text>
      <Text>Age: {cardPlayer.age}</Text>
      <Text>{cardPlayer.gender ? 'Male' : 'Female'}</Text>
      <View style={styles.skillContainer}>
        <Text style={styles.skillText}>{skillLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colours.accentBackground,
    borderRadius: 15,
    paddingVertical: 4,
    alignItems: 'center',
    marginHorizontal: 4,
    width: 90,
    shadowColor: Colours.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    marginBottom: 4,
    fontStyle: 'italic',
    color: Colours.success,
  },
  hostRole: {
    fontWeight: 'bold',
    color: Colours.accent,
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
