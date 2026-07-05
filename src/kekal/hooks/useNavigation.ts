import { navigationApi } from "../api";
import { useAsync } from "./useAsync";

/** Returns all navigation items. */
export function useNavigation() {
  return useAsync(() => navigationApi.getAll(), "navigation");
}
