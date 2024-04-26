import { useAppDispatch } from '@/app/hooks';
import { resetTicketsListData } from '@/slice/tickets.slice';
import { resetTicketsCache } from '@/slice/ticketsCache.slice';
import { resetEventCache } from '@/slice/eventCache.slice';
import { resetMyTicketsCache } from '@/slice/myTicketsCache.slice';
import { resetMyCollectiblesCache } from '@/slice/myCollectiblesCache.slice';
import { resetCollectionDetailCache } from '@/slice/collectionDetailCache.slice';
import { resetCrowdFundCache } from '@/slice/crowdFundCache.slice';
import { setEventDataForSearch } from '@/slice/eventCache.slice';
import { resetMyRavesCache } from '@/slice/myRaves.slice';

export const useResetPageCache = () => {
  const dispatch = useAppDispatch();

  const handleResetPageCache = () => {
    dispatch(resetTicketsListData());
    dispatch(resetTicketsCache());
    dispatch(resetEventCache());
    dispatch(resetMyTicketsCache());
    dispatch(resetMyCollectiblesCache());
    dispatch(resetCollectionDetailCache());
    dispatch(resetCrowdFundCache());
    dispatch(setEventDataForSearch([]));
    dispatch(resetMyRavesCache());
  };

  return {
    handleResetPageCache
  };
};
