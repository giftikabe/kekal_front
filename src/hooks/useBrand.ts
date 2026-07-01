/**
 * useBrand.ts
 *
 * Replaces:
 *   - brandIdentityService  → getBrandIdentity, getBrandIdentityByKey
 *   - brandMessageService   → getBrandMessages, getBrandMessageByKey
 *   - brandValueService     → getBrandValues
 *   - designerProfileService → getDesignerProfile, getDesignerProfileByKey
 *   - contactInfoService    → getContactInfo, getContactInfoByKey
 *   - aboutContentBlockService → getAboutContentBlocks
 */

import { useMemo } from "react";
import { brandApi } from "../api";
import { useAsync } from "./useAsync";

// ─── Brand Identity ───────────────────────────────────────────────────────────

/** Returns the full brand identity array. */
export function useBrandIdentity() {
  return useAsync(() => brandApi.getIdentity(), "brand-identity");
}

/**
 * Returns a single brand identity value by key.
 * Mirrors: getBrandIdentityByKey(key) → string
 */
export function useBrandIdentityByKey(key: string) {
  const { data, loading, error } = useAsync(
    () => brandApi.getIdentityByKey(key),
    `brand-identity-${key}`
  );
  // The API returns an object like { key, value } — extract just the value string
  const value: string = data?.value ?? "";
  return { value, loading, error };
}

// ─── Brand Messages ───────────────────────────────────────────────────────────

/** Returns all brand messages. */
export function useBrandMessages() {
  return useAsync(() => brandApi.getMessages(), "brand-messages");
}

/**
 * Returns a single brand message object by key.
 * Mirrors: getBrandMessageByKey(key) → { key, title, description, ... } | undefined
 */
export function useBrandMessageByKey(key: string) {
  return useAsync(() => brandApi.getMessageByKey(key), `brand-message-${key}`);
}

// ─── Brand Values ─────────────────────────────────────────────────────────────

/** Returns all brand values. Mirrors: getBrandValues() */
export function useBrandValues() {
  return useAsync(() => brandApi.getValues(), "brand-values");
}

// ─── Designer Profile ─────────────────────────────────────────────────────────

/** Returns the full designer profile array. */
export function useDesignerProfile() {
  return useAsync(() => brandApi.getDesignerProfile(), "designer-profile");
}

/**
 * Returns a single designer profile value by key.
 * Mirrors: getDesignerProfileByKey(key) → string
 */
export function useDesignerProfileByKey(key: string) {
  const { data, loading, error } = useAsync(
    () => brandApi.getDesignerProfile(),
    "designer-profile"
  );
  const value: string = useMemo(
    () => (data as any[])?.find((item) => item.key === key)?.value ?? "",
    [data, key]
  );
  return { value, loading, error };
}

// ─── Contact Info ─────────────────────────────────────────────────────────────

/** Returns all contact info items. Mirrors: getContactInfo() */
export function useContactInfo() {
  return useAsync(() => brandApi.getContactInfo(), "contact-info");
}

/**
 * Returns a single contact info value by key.
 * Mirrors: getContactInfoByKey(key) → string
 */
export function useContactInfoByKey(key: string) {
  const { data, loading, error } = useAsync(
    () => brandApi.getContactInfo(),
    "contact-info"
  );
  const value: string = useMemo(
    () => (data as any[])?.find((item) => item.key === key)?.value ?? "",
    [data, key]
  );
  return { value, loading, error };
}

// ─── About Content Blocks ─────────────────────────────────────────────────────

/** Returns all about-page content blocks. Mirrors: getAboutContentBlocks() */
export function useAboutContentBlocks() {
  return useAsync(() => brandApi.getAboutBlocks(), "about-content-blocks");
}
