import type { SEO } from "./collection";
import type { SocialLinks } from "./social";

export interface Designer {

  name: string;

  title: string;

  portrait: string;

  shortBio: string;

  fullBio: string;

  email?: string;

  instagram?: string;

    socialLinks: SocialLinks;

  seo: SEO;
}