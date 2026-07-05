/**
 * Appends Cloudinary's automatic-format/quality transform to any
 * Cloudinary-hosted URL so the CDN serves a right-sized, modern-format
 * (WebP/AVIF) image instead of the original upload. Non-Cloudinary URLs
 * (e.g. the Unsplash placeholders currently in seed data) pass through
 * unchanged, so this is always safe to call.
 */
export function optimizeImageUrl(url: string, width?: number): string {
  if (!url || !url.includes("cloudinary.com")) return url;
  const transform = width ? `w_${width},q_auto,f_auto` : "q_auto,f_auto";
  return url.replace("/upload/", `/upload/${transform}/`);
}
