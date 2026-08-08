import { Link } from "react-router-dom";

import { useNavigation } from "../hooks/useNavigation";
import { useBrandIdentityByKey, useContactInfoByKey } from "../hooks/useBrand";

import styles from "./Footer.module.css";

import { useCommerce } from "../hooks/useCommerce";


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
  const { value: logo } = useBrandIdentityByKey("logo");

  const { value: instagram } = useContactInfoByKey("instagram");
  const { value: tiktok } = useContactInfoByKey("tiktok");
  const { value: facebook } = useContactInfoByKey("facebook");
  const { value: address } = useContactInfoByKey("address");
  const { value: phone } = useContactInfoByKey("phone");
  const { value: email } = useContactInfoByKey("email");

  const displayName = siteName || "KEKAL";

  const { isActive } = useCommerce();


  return (
    <footer className={styles.footer}>
      {/* Row 1 — four columns */}
      <div className={styles.row}>
        <div className={`${styles.col} ${styles.brandCol}`}>
          <Link
            to="/"
            className={styles.logoLink}
            aria-label={`${displayName} home`}
          >
            {logo ? (
              <img
                src={logo}
                alt={displayName}
                className={styles.logoImage}
                loading="lazy"
                decoding="async"
                width={48}
                height={48}
              />
            ) : (
              <span className={styles.logoFallback}>{displayName}</span>
            )}
          </Link>
          <div className={styles.brandName}>{siteName}</div>
          {siteTitle && <div className={styles.brandTitle}>{siteTitle}</div>}
          {tagline && <p className={styles.tagline}>{tagline}</p>}
        </div>

        <div className={styles.col}>
          <h3 className={styles.colLabel}>Navigate</h3>
          <ul className={styles.navList}>
            {navigation.map((item) => (
              <li key={item.id}>
                <Link to={item.href} className={styles.editorialLink}>
                  {item.label}
                </Link>
              </li>
            ))}
            {isActive && (

  <>

    <li><Link to="/shipping" className={styles.editorialLink}>Shipping Info</Link></li>

    <li><Link to="/returns" className={styles.editorialLink}>Return Policy</Link></li>

  </>

)}
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colLabel}>Connect</h3>
          <ul className={styles.navList}>
            {instagram && (
              <li>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.editorialLink}
                >
                  Instagram
                </a>
              </li>
            )}
            {tiktok && (
              <li>
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.editorialLink}
                >
                  TikTok
                </a>
              </li>
            )}
            {facebook && (
              <li>
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.editorialLink}
                >
                  Facebook
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colLabel}>Visit</h3>
          {address && (
            <address className={styles.addressText}>{address}</address>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className={styles.editorialLink}
            >
              {phone}
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className={styles.editorialLink}>
              {email}
            </a>
          )}
        </div>
      </div>

      {/* Row 2 — copyright */}
      <div className={styles.row2}>
        <p className={styles.copyright}>{copyright}</p>
      </div>
    </footer>
  );
}
