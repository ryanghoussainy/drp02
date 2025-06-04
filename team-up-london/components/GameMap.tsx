import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Icon } from '@rneui/themed';
import { GAME_LOCATION } from '../constants/maps';

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
          <Marker
            ref={markerRef}
            coordinate={GAME_LOCATION[gameId]}
            title="Game"
            description={location}
          />
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
        <Icon
          name={satelliteMode ? 'map' : 'satellite'}
          type="material"
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
