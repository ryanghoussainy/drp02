import { useState, useEffect } from 'react';
import { getSports } from '../operations/Sports';
import Sport from '../interfaces/Sport';

export default function useSports() {
  const [sports, setSports] = useState<Sport[]>([]);

  const refreshSports = async () => {
    const fetchedSports = await getSports();
    setSports(fetchedSports);
  };

  useEffect(() => {
    refreshSports();
  }, []);

  return { sports };
}
