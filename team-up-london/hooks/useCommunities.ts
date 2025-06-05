import { useState, useEffect } from 'react';
import Community from '../interfaces/Community';
import { getCommunities } from '../operations/Communities';


export default function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);

  const refreshCommunities = async () => {
    const fetchedCommunities = await getCommunities();
    setCommunities(fetchedCommunities);
  };

  useEffect(() => {
    refreshCommunities();
  }, []);

  return { communities, refreshCommunities };
}
