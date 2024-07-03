import React, { useEffect, useState } from 'react';
import fetchFromApi from '../utilities/api';

export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchFromApi('getCities', {});
        setCities(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return [cities, isLoading, error];
};
