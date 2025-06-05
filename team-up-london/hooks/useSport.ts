import { useState, useEffect } from 'react';
import { getSport} from '../operations/Sports';
import Sport from '../interfaces/Sport';

export default function useSport(sportId: string) {
  const [sport, setSport] = useState<Sport | null>(null);

  const refreshSport = async () => {
    const fetchedSport = await getSport(sportId);
    setSport(fetchedSport);
  };

  useEffect(() => {
    refreshSport();
  }, []);

  return { sport };
}
