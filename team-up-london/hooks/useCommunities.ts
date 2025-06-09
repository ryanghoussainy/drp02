import { useCallback, useEffect, useState } from 'react';
import Community from '../interfaces/Community';
import { getCommunities } from '../operations/Communities';
import { useFocusEffect } from '@react-navigation/native';


export default function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);

  const refreshCommunities = async () => {
    const fetchedCommunities = await getCommunities();
    setCommunities(fetchedCommunities);
  };

  useFocusEffect(
    useCallback(() => {
      refreshCommunities();
    }, [])
  );

  return { communities, refreshCommunities };
}
