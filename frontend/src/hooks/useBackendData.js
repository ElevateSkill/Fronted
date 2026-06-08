import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useBackendData — generic hook that fetches from an API function
 * and gracefully falls back to local data when the backend is unreachable.
 *
 * @param {Function} fetcher  - async (params) => data
 * @param {Array}    fallback - data to use if the request fails
 * @param {Object}   options  - { params, dependencies, refreshInterval, enabled }
 */
export default function useBackendData(fetcher, fallback = [], options = {}) {
  const {
    params,
    dependencies = [],
    refreshInterval = null,
    enabled = true,
  } = options;

  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('fallback'); // 'api' | 'fallback' | 'api-empty'
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    if (!enabled) {
      setData(fallback);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current(params);
      const arr = Array.isArray(result) ? result : (result?.results || result?.data || []);
      if (arr && arr.length > 0) {
        setData(arr);
        setSource('api');
      } else if (Array.isArray(result) || result?.results || result?.data) {
        // API returned successfully but with empty results
        setData([]);
        setSource('api-empty');
      } else {
        setData(fallback);
        setSource('fallback');
      }
    } catch (err) {
      setError(err);
      setData(fallback);
      setSource('fallback');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params || {}), enabled, ...dependencies]);

  useEffect(() => {
    load();
  }, [load]);

  // Optional background polling
  useEffect(() => {
    if (!refreshInterval) return undefined;
    const id = setInterval(load, refreshInterval);
    return () => clearInterval(id);
  }, [load, refreshInterval]);

  return { data, loading, error, source, refresh: load };
}
