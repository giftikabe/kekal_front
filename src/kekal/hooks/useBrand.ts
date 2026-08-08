import { useMemo } from "react";
import { brandApi } from "../api";
import { useAsync } from "./useAsync";
import { statsApi } from "../api";


// ─── Brand Identity ───────────────────────────────────────────────────────────

export function useBrandIdentity() {
  return useAsync(() => brandApi.getIdentity(), "brand-identity");
}

export function useBrandIdentityByKey(key: string) {
  const { data, loading, error } = useAsync(
    () => brandApi.getIdentityByKey(key),
    `brand-identity-${key}`,
  );
  const value: string = (data as any)?.value ?? "";
  return { value, loading, error };
}

// ─── Brand Messages ───────────────────────────────────────────────────────────

export function useBrandMessages() {
  return useAsync(() => brandApi.getMessages(), "brand-messages");
}

export function useBrandMessageByKey(key: string) {
  return useAsync(() => brandApi.getMessageByKey(key), `brand-message-${key}`);
}

// ─── Brand Values ─────────────────────────────────────────────────────────────

export function useBrandValues() {
  return useAsync(() => brandApi.getValues(), "brand-values");
}

// ─── Designer Profile ─────────────────────────────────────────────────────────

export function useDesignerProfile() {
  return useAsync(() => brandApi.getDesignerProfile(), "designer-profile");
}

export function useDesignerProfileByKey(key: string) {
  const { data, loading, error } = useAsync(
    () => brandApi.getDesignerProfile(),
    "designer-profile",
  );
  const value: string = useMemo(
    () => (data as any[])?.find((item) => item.key === key)?.value ?? "",
    [data, key],
  );
  return { value, loading, error };
}

// ─── Contact Info ─────────────────────────────────────────────────────────────

export function useContactInfo() {
  return useAsync(() => brandApi.getContactInfo(), "contact-info");
}

export function useContactInfoByKey(key: string) {
  const { data, loading, error } = useAsync(
    () => brandApi.getContactInfo(),
    "contact-info",
  );
  const value: string = useMemo(
    () => (data as any[])?.find((item) => item.key === key)?.value ?? "",
    [data, key],
  );
  return { value, loading, error };
}

// ─── About Content Blocks ─────────────────────────────────────────────────────

export function useAboutContentBlocks() {
  return useAsync(() => brandApi.getAboutBlocks(), "about-content-blocks");
}


export function useBrandStats() {
  return useAsync(() => statsApi.getAll(), 'brand-stats');
}