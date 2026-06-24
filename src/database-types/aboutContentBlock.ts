/**
 * Long-form About page content sections.
 *
 * Typical blocks:
 * - brand_story
 * - designer_story
 * - craft_process
 * - vision_impact
 *
 * images can contain one or many images.
 */
export interface AboutContentBlock {
  id: string;

  key: string;

  title: string;

  content: string;

  images: string[];
}