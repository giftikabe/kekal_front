import { Link } from "react-router-dom";

import { useNavigation } from "../hooks/useNavigation";
import { useBrandIdentityByKey } from "../hooks/useBrand";
import { useContactInfoByKey } from "../hooks/useBrand";

import type { Navigation } from "../database-types/navigation";

import logo from "../assets/logo.jpeg";

import styles from "./Footer.module.css";

export default function Footer() {
  const { data: navigationData } = useNavigation();
  const navigation: Navigation[] = (navigationData as Navigation[]) ?? [];

  const { value: siteName } = useBrandIdentityByKey("name");
  const { value: siteTitle } = useBrandIdentityByKey("title");
  const { value: tagline } = useBrandIdentityByKey("tagline");
  const { value: copyright } = useBrandIdentityByKey("copyright_text");

  const { value: instagram } = useContactInfoByKey("instagram");
  const { value: tiktok } = useContactInfoByKey("tiktok");
  const { value: facebook } = useContactInfoByKey("facebook");
  const { value: address } = useContactInfoByKey("address");
  const { value: phone } = useContactInfoByKey("phone");
  const { value: email } = useContactInfoByKey("email");

  return (
    <footer className={styles.footer}>
      {/* ─── Column 1: logo + name + title + tagline ─── */}
      <div className={styles.brand}>
        <Link to="/" className={styles.logoLink}>
          <img
            src={logo}
            alt={siteName || "KEKAL"}
            className={styles.logoImage}
          />
        </Link>
        <div className={styles.brandText}>
          <div className={styles.brandName}>{siteName}</div>
          <div className={styles.brandTitle}>{siteTitle}</div>
          <p className={styles.brandTagline}>{tagline}</p>
        </div>
      </div>

      {/* ─── Column 2: nav + info grid ─── */}
      <div className={styles.right}>
        <nav className={styles.navigation}>
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
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
          </div>
        </div>
      </div>

      <p className={styles.copyright}>{copyright}</p>
    </footer>
  );
}
