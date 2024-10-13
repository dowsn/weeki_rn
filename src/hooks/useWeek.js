import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import fetchFromApi from '../utils/api';
import { useUserContext } from './useUserContext';

export const useWeek = () => {
  const { user, setUser, theme } = useUserContext();
  const [weekData, setWeekData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);



 const fetchWeek = useCallback(async () => {
   try {
     setLoading(true);

     const response = await fetchFromApi('week', {
       user_id: user.userId,
     });

     if (!response || !response.response) {

     }

     const pickListsArray = pickListsData.response.listitems;

     // this needs to take
     const firstPickListId = pickListsArray[user.selectedPickListIndex].id;

     setPickLists(pickListsArray);

     if (pickListsArray.length > 0) {
       const feedsData = await withTimeout(
         fetchFromApi('getPicksForPickList', {
           list_id: firstPickListId,
           city_id: user.selectedCityId,
         }),
         20000,
       );

       setFeeds(feedsData.response.feeditems);
     }
   } catch (error) {
     setError(error.message);
   } finally {user.selectedPickListIndex;
     setLoading(false);
   }
 }, [user.selectedCityId, user.selectedPickListIndex]);



  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return [pickLists, feeds, isLoading, error ];
};
