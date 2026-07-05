This folder is intentionally empty.

The brand logo and all other imagery are served from the CMS (Cloudinary /
the admin "Brand Settings" screen) rather than bundled as static files —
see `Footer.tsx`'s use of `useBrandIdentityByKey("logo")`. Keep local,
build-time assets here only for things that are genuinely static and not
editor-managed (e.g. a custom web font file, if you stop using Google Fonts).
