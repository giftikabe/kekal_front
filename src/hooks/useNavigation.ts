/**
 * useNavigation.ts
 *
 * Replaces:
 *   - navigationService → getNavigation
 */

import { navigationApi } from "../api";
import { useAsync } from "./useAsync";

/** Returns all navigation items. Mirrors: getNavigation() */
export function useNavigation() {
  return useAsync(() => navigationApi.getAll(), "navigation");
}
