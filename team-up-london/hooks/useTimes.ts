import { useState, useEffect } from 'react';
import Time from '../interfaces/Time';
import { getTimes } from '../operations/Times';

export default function useTimes() {
  const [times, setTimes] = useState<Time[]>([]);

  const refreshTimes = async () => {
    const fetchedTimes = await getTimes();
    setTimes(fetchedTimes);
  };

  useEffect(() => {
    refreshTimes();
  }, []);

  return { times };
}
