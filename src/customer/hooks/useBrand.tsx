/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { brandApi, navigationApi } from "../api";

interface BrandData {
  identity: Record<string, string>;
  navItems: { id: string; label: string; href: string; order: number }[];
}

const BrandContext = createContext<BrandData>({
  identity: {},
  navItems: [],
});

function arrayToMap(arr: any[]): Record<string, string> {
  return arr.reduce((acc, item) => { acc[item.key] = item.value; return acc; }, {} as Record<string, string>);
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BrandData>({ identity: {}, navItems: [] });

  useEffect(() => {
    Promise.all([brandApi.getIdentity(), navigationApi.getAll()])
      .then(([identity, nav]) => {
        setData({
          identity: arrayToMap(identity as any[]),
          navItems: (nav as any[]).sort((a, b) => a.order - b.order),
        });
      })
      .catch(() => {});
  }, []);

  return (
    <BrandContext.Provider value={data}>
      {children}
    </ BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
