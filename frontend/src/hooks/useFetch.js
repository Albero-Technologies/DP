import { useState, useEffect, useCallback, useRef } from "react";

// Simple in-memory cache: { cacheKey: { data, timestamp } }
const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 seconds

const useFetch = (fetchFn, deps = [], options = {}) => {
  const { cacheKey, ttl = CACHE_TTL } = options;
  const [data, setData] = useState(() => {
    // Return cached data instantly if available
    if (cacheKey && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(!data); // Don't show loading if we have cached data
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const run = useCallback(async (force = false) => {
    // Check cache first (skip if force refresh)
    if (!force && cacheKey && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < ttl) {
        setData(cached.data);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      const result = res.data ?? res;
      if (mountedRef.current) {
        setData(result);
        // Store in cache
        if (cacheKey) {
          cache.set(cacheKey, { data: result, timestamp: Date.now() });
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => { mountedRef.current = false; };
  }, [run]);

  return { data, loading, error, refetch: () => run(true) };
};

// Utility to clear specific cache entries (call after mutations)
export const clearCache = (key) => {
  if (key) cache.delete(key);
  else cache.clear();
};

export default useFetch;