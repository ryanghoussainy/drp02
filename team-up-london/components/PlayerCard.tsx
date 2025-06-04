import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Text } from '@rneui/themed';
import Player from '../interfaces/Player';
import { SKILL_MAPPING } from '../constants/skills';

interface PlayerCardProps {
  player: Player;
  highlightYou: boolean;
  isHost: boolean;
}

export default function PlayerCard({ player, highlightYou, isHost }: PlayerCardProps) {
  const skillLabel = SKILL_MAPPING[player.skill_level] || '';
  return (
    <View
      style={[
        styles.card,
        highlightYou ? { borderWidth: 2, borderColor: 'green' } : { borderWidth: 2, borderColor: '#eee' },
      ]}
    >
      <Icon name="person" type="material" size={24} color="black" />
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
    color: 'purple',
    fontSize: 14,
    marginLeft: 4,
  },
});
