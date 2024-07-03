import React, { useEffect, useState } from 'react';
import fetchFromApi from '../utilities/api';

export const useFeedHeader = () => {
  const [pickList, setPickList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchFromApi('login', {
          list_id: 9,
          city_id: 1,
        });
        setFeeds(data.response.feeditems);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return [pickList, isLoading, error];
};
