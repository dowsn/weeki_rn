import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import fetchFromApi from '../utilities/api';

export const useFeed = () => {
  const [user, setUser] = useContext(UserContext);
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [pickLists, setPickLists] = useState([]);


 const fetchData = useCallback(async () => {
   try {
     console.log(user);
     setLoading(true);

     const pickListsData = await fetchFromApi('getPickListsForCityID', {
       user_id: user.userId,
       city_id: user.selectedCityId,
     });

     if (!pickListsData) {
       throw new Error('No data');
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

 const withTimeout = (promise, timeout) => {
   return new Promise((resolve, reject) => {
     const timer = setTimeout(() => {
`       reject(new Error('Request timed out'));
`     }, timeout);

     promise
       .then((value) => {
         clearTimeout(timer);
         resolve(value);
       })
       .catch((error) => {
         clearTimeout(timer);
         reject(error);
       });
   });
 };

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return [pickLists, feeds, isLoading, error ];
};
