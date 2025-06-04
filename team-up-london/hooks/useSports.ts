import { useState, useEffect } from 'react';
import { getSports, Sport } from '../operations/Sports';

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
