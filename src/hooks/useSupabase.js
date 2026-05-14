import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

/**
 * useSupabase - A custom hook for standardized data fetching from Supabase
 * Centralizes loading states, error handling, and query construction.
 */
const useSupabase = (table, options = {}) => {
  const [data, setData] = useState(options.single ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const optionsKey = JSON.stringify(options);

  const fetchData = useCallback(async () => {
    if (!table) {
      setData(options.single ? null : []);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select('*');

      if (options.filter) {
        query = query[options.filter.operator](options.filter.column, options.filter.value);
      }

      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending });
      }

      if (options.single) {
        query = query.single();
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setData(result || (options.single ? null : []));
    } catch (err) {
      console.error(`useSupabase Error (${table}):`, err);
      setError(err);
      setData(options.single ? null : []);
    } finally {
      setLoading(false);
    }
  }, [table, optionsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useSupabase;
