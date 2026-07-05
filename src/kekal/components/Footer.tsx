import { Link } from "react-router-dom";

import { useNavigation } from "../hooks/useNavigation";
import { useBrandIdentityByKey, useContactInfoByKey } from "../hooks/useBrand";

import styles from "./Footer.module.css";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export default function Footer() {
  const { data: navigationData } = useNavigation();
  const navigation: NavItem[] = (navigationData as NavItem[]) ?? [];

  const { value: siteName } = useBrandIdentityByKey("name");
  const { value: siteTitle } = useBrandIdentityByKey("title");
  const { value: tagline } = useBrandIdentityByKey("tagline");
  const { value: copyright } = useBrandIdentityByKey("copyright_text");
  // The brand's logo is managed in the admin console (Brand Settings →
  // Brand Identity) rather than bundled as a static asset, so it updates
  // everywhere the moment someone changes it there.
  const { value: logo } = useBrandIdentityByKey("logo");

  const { value: instagram } = useContactInfoByKey("instagram");
  const { value: tiktok } = useContactInfoByKey("tiktok");
  const { value: facebook } = useContactInfoByKey("facebook");
  const { value: address } = useContactInfoByKey("address");
  const { value: phone } = useContactInfoByKey("phone");
  const { value: email } = useContactInfoByKey("email");

  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <Link to="/" className={styles.logoLink} aria-label={`${siteName || "KEKAL"} home`}>
          {logo ? (
            <img
              src={logo}
              alt={siteName || "KEKAL"}
              className={styles.logoImage}
              loading="lazy"
              decoding="async"
              width={64}
              height={64}
            />
          ) : (
            <span className={styles.logoFallback}>{siteName || "KEKAL"}</span>
          )}
        </Link>
        <div className={styles.brandText}>
          <div className={styles.brandName}>{siteName}</div>
          <div className={styles.brandTitle}>{siteTitle}</div>
          <p className={styles.brandTagline}>{tagline}</p>
        </div>
      </div>

      <div className={styles.right}>
        <nav className={styles.navigation} aria-label="Footer">
          {navigation.map((item) => (
            <Link key={item.id} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.infoGrid}>
          <div className={styles.socials}>
            <h3>Social</h3>
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            {tiktok && (
              <a href={tiktok} target="_blank" rel="noreferrer">
                TikTok
              </a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
          </div>

          <div className={styles.address}>
            <h3>Address</h3>
            <p>{address}</p>
          </div>

          <div className={styles.contact}>
            <h3>Contact</h3>
            {phone && <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </div>
        </div>
      </div>

      <p className={styles.copyright}>{copyright}</p>
    </footer>
  );
}
