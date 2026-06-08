import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { normalizeApiList } from '../services/api';

const EMPTY_FALLBACK = [];

/**
 * useBackendData — generic hook that fetches from an API function.
 *
 * @param {Function} fetcher  - async (params) => data
 * @param {Array|Object} fallbackOrOptions - legacy fallback array, or options
 * @param {Object}   options  - { params, dependencies, refreshInterval, enabled }
 */
export default function useBackendData(fetcher, fallbackOrOptions = EMPTY_FALLBACK, options = {}) {
  const hasLegacyFallback = Array.isArray(fallbackOrOptions);
  const fallback = useMemo(
    () => (hasLegacyFallback ? fallbackOrOptions : (fallbackOrOptions.fallback || EMPTY_FALLBACK)),
    [fallbackOrOptions, hasLegacyFallback]
  );
  const resolvedOptions = hasLegacyFallback ? options : fallbackOrOptions;
  const {
    params,
    dependencies = [],
    refreshInterval = null,
    enabled = true,
  } = resolvedOptions;

  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(fallback.length ? 'fallback' : 'api-empty');
  const paramsKey = JSON.stringify(params || {});
  const dependenciesKey = JSON.stringify(dependencies || []);
  const fetcherRef = useRef(fetcher);
  const paramsRef = useRef(params);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    fetcherRef.current = fetcher;
    paramsRef.current = params;
    fallbackRef.current = fallback;
  }, [fetcher, params, fallback]);

  const load = useCallback(async () => {
    if (!enabled) {
      setData(fallbackRef.current);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current(paramsRef.current);
      const arr = normalizeApiList(result);
      if (arr && arr.length > 0) {
        setData(arr);
        setSource('api');
      } else if (
        Array.isArray(result) ||
        Array.isArray(result?.results) ||
        Array.isArray(result?.data) ||
        Array.isArray(result?.items)
      ) {
        setData([]);
        setSource('api-empty');
      } else {
        setData(fallbackRef.current);
        setSource(fallbackRef.current.length ? 'fallback' : 'api-empty');
      }
    } catch (err) {
      setError(err);
      setData(fallbackRef.current);
      setSource(fallbackRef.current.length ? 'fallback' : 'error');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load, paramsKey, dependenciesKey]);

  // Optional background polling
  useEffect(() => {
    if (!refreshInterval) return undefined;
    const id = setInterval(load, refreshInterval);
    return () => clearInterval(id);
  }, [load, refreshInterval]);

  return { data, loading, error, source, refresh: load };
}
