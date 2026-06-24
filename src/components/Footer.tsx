import { Link } from "react-router-dom";

import { getNavigation } from "../database-services/navigationService";
import { getBrandIdentityByKey } from "../database-services/brandIdentityService";
import { getContactInfoByKey } from "../database-services/contactInfoService";

import type { Navigation } from "../database-types/navigation";

import logo from "../assets/logo.jpeg";

import styles from "./Footer.module.css";

export default function Footer() {
  // ─── Navigation ────────────────────────────────────────────────────────────
  const navigation: Navigation[] = getNavigation();

  // ─── Brand ─────────────────────────────────────────────────────────────────
  const siteName = getBrandIdentityByKey("name");
  const tagline = getBrandIdentityByKey("tagline");
  const copyright = getBrandIdentityByKey("copyright_text");

  // ─── Contact & Socials ─────────────────────────────────────────────────────
  const instagram = getContactInfoByKey("instagram");
  const tiktok = getContactInfoByKey("tiktok");
  const facebook = getContactInfoByKey("facebook");
  const address = getContactInfoByKey("address");
  const phone = getContactInfoByKey("phone");
  const email = getContactInfoByKey("email");

  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Link to="/">
            <img
              src={logo}
              alt="KeKal"
              className={styles.logoImage}
            />
          </Link>
        </div>

        <h2>{siteName}</h2>

        <p>{tagline}</p>
      </div>

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

            <a href={instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>

            <a href={tiktok} target="_blank" rel="noreferrer">
              TikTok
            </a>

            <a href={facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>

          <div className={styles.address}>
            <h3>Address</h3>

            <p>{address}</p>
          </div>

          <div className={styles.contact}>
            <h3>Contact</h3>

            <p>{phone}</p>

            <p>{email}</p>
          </div>
        </div>
      </div>

      <p className={styles.copyright}>{copyright}</p>
    </footer>
  );
}
