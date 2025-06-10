import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getGame } from '../operations/Games';

interface GameMapProps {
  mapRegion: Region | null;
  distance: { km: number; miles: number } | null;
  gameId: string;
  location: string;
}

export default function GameMap({ mapRegion, distance, gameId, location }: GameMapProps) {
  const [satelliteMode, setSatelliteMode] = useState(false);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (markerRef.current) {
      setTimeout(() => {
        markerRef.current.showCallout();
      }, 500);
    }
  }, [markerRef.current]);

  // Location coordinates for the game
  const [latitude, getLatitude] = useState<number | null>(null);
  const [longitude, getLongitude] = useState<number | null>(null);
  useEffect(() => {
    const fetchGame = async () => {
      const game = await getGame(gameId);
      if (game) {
        getLatitude(game.latitude);
        getLongitude(game.longitude);
      }
    };
    fetchGame();
  }, [gameId]);

  return (
    <View style={{ flex: 1 }}>
      {mapRegion && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mapRegion}
          showsUserLocation
          followsUserLocation
          shouldRasterizeIOS
          showsMyLocationButton
          mapType={satelliteMode ? 'hybrid' : 'standard'}
        >
          {latitude && longitude && (
            <Marker
              ref={markerRef}
              coordinate={{ latitude, longitude }}
              title="Game"
              description={location}
              tracksViewChanges={false}
            />
          )}
        </MapView>
      )}

      {distance && (
        <Text style={styles.distanceText}>
          <Text style={styles.tagText}>Distance to you: </Text>
          {distance.km.toFixed(2)} km / {distance.miles.toFixed(2)} mi
        </Text>
      )}

      <TouchableOpacity
        style={styles.toggleMap}
        onPress={() => setSatelliteMode((prev) => !prev)}
      >
        <MaterialCommunityIcons
          name={satelliteMode ? 'map' : 'satellite'}
          size={25}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  toggleMap: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  distanceText: {
    position: 'absolute',
    right: -1,
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 229,
    height: 20,
    margin: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  tagText: {
    fontWeight: 'bold',
  },
});
