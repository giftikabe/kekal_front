import { useCallback, useEffect, useState } from "react";
import { customTablesApi } from "../api/client";

export interface CustomTableColumn {
  column_name: string;
  data_type: string;
}

export interface CustomTable {
  id: string;
  name: string;
  displayName: string;
  createdAt: string;
  // Present when the table list comes from GET /admin/custom-tables — lets
  // the Database Manager show, at a glance, whether columns actually got
  // saved instead of only finding out when Custom Data comes up empty.
  columns?: CustomTableColumn[];
}

/**
 * Shared hook for the custom-tables list.
 * Both Sidebar and DatabasePage import this so they stay in sync:
 * - DatabasePage calls `refresh()` after create/delete.
 * - Sidebar reads `tables` to render dynamic nav entries.
 *
 * Because each component mounts its own instance of this hook the list is
 * fetched independently per component. For a small admin-only list this is
 * fine; if you later want true cross-component sync, lift it to context.
 */
export function useCustomTables() {
  const [tables, setTables] = useState<CustomTable[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await customTablesApi.getAll();
      setTables(res.customTables || []);
    } catch {
      // Sidebar must not throw on auth failures during initial load
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tables, loading, refresh };
}