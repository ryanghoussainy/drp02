import { useState, useEffect } from 'react';
import Community from '../interfaces/Community';
import { getCommunity } from '../operations/Communities';


export default function useCommunity(communityId: string) {
  const [community, setCommunity] = useState<Community | null>(null);

  const refreshCommunity = async (id: string) => {
    const fetchedCommunity = await getCommunity(id);
    setCommunity(fetchedCommunity);
  };

  useEffect(() => {
    if (communityId) {
      refreshCommunity(communityId);
    }
  }, [communityId]);

  return { community };
}
