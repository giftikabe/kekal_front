import { useState, useEffect, useRef } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setState({ data: null, loading: true, error: null });
    fetcher()
      .then((data) => { if (mounted.current) setState({ data, loading: false, error: null }); })
      .catch((e) => { if (mounted.current) setState({ data: null, loading: false, error: e.message }); });
    return () => { mounted.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export function useMultiFetch<T extends Record<string, () => Promise<unknown>>>(
  fetchers: T,
  deps: unknown[] = []
): { data: { [K in keyof T]: Awaited<ReturnType<T[K]>> } | null; loading: boolean; error: string | null } {
  const [state, setState] = useState<{
    data: { [K in keyof T]: Awaited<ReturnType<T[K]>> } | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: true, error: null });

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setState({ data: null, loading: true, error: null });

    const keys = Object.keys(fetchers) as (keyof T)[];
    Promise.all(keys.map((k) => fetchers[k]()))
      .then((results) => {
        if (!mounted.current) return;
        const data = {} as { [K in keyof T]: Awaited<ReturnType<T[K]>> };
        keys.forEach((k, i) => { data[k] = results[i] as Awaited<ReturnType<T[typeof k]>>; });
        setState({ data, loading: false, error: null });
      })
      .catch((e) => { if (mounted.current) setState({ data: null, loading: false, error: e.message }); });

    return () => { mounted.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
