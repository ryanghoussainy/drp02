import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import { getGame } from '../operations/Games';

interface Distance {
  km: number;
  miles: number;
}

export default function useDistanceAndRegion(gameId: string) {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [distance, setDistance] = useState<Distance | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

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

  useEffect(() => {
    if (!location || !latitude || !longitude) return;

    const toRad = (val: number) => (val * Math.PI) / 180;
    const { latitude: lat1, longitude: lon1 } = location;
    const { latitude: lat2, longitude: lon2 } = { latitude, longitude };

    // Haversine calculation
    const R = 6371; // Radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const km = R * c;
    const miles = km * 0.621371;
    setDistance({ km, miles });

    // Compute mid‐point and deltas for map region
    const midLatitude = (lat1 + latitude) / 2;
    const midLongitude = (lon1 + longitude) / 2;
    const latitudeDelta = Math.abs(lat1 - latitude) * 2 || 0.05;
    const longitudeDelta = Math.abs(lon1 - longitude) * 2 || 0.05;
    setMapRegion({
      latitude: midLatitude,
      longitude: midLongitude,
      latitudeDelta,
      longitudeDelta,
    });
  }, [location, latitude, longitude]);

  return { distance, mapRegion };
}
