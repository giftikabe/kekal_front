import { useState, useEffect, useRef } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Generic hook that fetches data from an async function.
 * Re-fetches whenever the `key` string changes (include all params in the key).
 */
export function useAsync<T>(
  fetcher: () => Promise<T>,
  key: string,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const abortRef = useRef(false);

  useEffect(() => {
    abortRef.current = false;
    setState({ data: null, loading: true, error: null });

    fetcher()
      .then((data) => {
        if (!abortRef.current) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!abortRef.current) {
          setState({ data: null, loading: false, error });
        }
      });

    return () => {
      abortRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
