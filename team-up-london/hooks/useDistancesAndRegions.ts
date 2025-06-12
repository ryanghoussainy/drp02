import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import { getGame } from '../operations/Games';
import Game from '../interfaces/Game';

interface Distance {
  km: number;
  miles: number;
}

export default function useDistancesAndRegions(games: Game[]) {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [distances, setDistances] = useState<Distance[]>([]);
  const [mapRegions, setMapRegions] = useState<Region[]>([]);

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

  useEffect(() => {
    if (!location || !games.length) return;

    const toRad = (val: number) => (val * Math.PI) / 180;
    const { latitude: userLat, longitude: userLon } = location;
    const R = 6371; // Radius in km

    const calculatedDistances: Distance[] = [];
    const calculatedRegions: Region[] = [];

    games.forEach((game) => {
      if (game.latitude && game.longitude) {
        // Haversine calculation
        const dLat = toRad(game.latitude - userLat);
        const dLon = toRad(game.longitude - userLon);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(userLat)) * Math.cos(toRad(game.latitude)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const km = R * c;
        const miles = km * 0.621371;

        calculatedDistances.push({ km, miles });

        // Compute mid-point and deltas for map region
        const midLatitude = (userLat + game.latitude) / 2;
        const midLongitude = (userLon + game.longitude) / 2;
        const latitudeDelta = Math.abs(userLat - game.latitude) * 2 || 0.05;
        const longitudeDelta = Math.abs(userLon - game.longitude) * 2 || 0.05;

        calculatedRegions.push({
          latitude: midLatitude,
          longitude: midLongitude,
          latitudeDelta,
          longitudeDelta,
        });
      }
    });

    setDistances(calculatedDistances);
    setMapRegions(calculatedRegions);
  }, [location, games]);

  return { distances, mapRegions };
}
