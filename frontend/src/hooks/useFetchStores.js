import { useEffect, useState } from 'react';
import { fetchStores } from '../services/storeApi';

/**
 * Custom hook to fetch stores from the backend API.
 * @param {string} filterType 
 * @returns {object} { stores, loading, error }
 */
function useFetchStores(filterType) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetchStores(filterType)
      .then(data => {
        if (isMounted) {
          setStores(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [filterType]);

  return { stores, loading, error };
}

export default useFetchStores;
