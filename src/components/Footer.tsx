import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getNavigation } from "../services/navigationService";
import { getSiteSettings } from "../services/siteSettingsService";

import type { NavigationItem } from "../types/navigation";
import type { SiteSettings } from "../types/siteSettings";

import logo from "../assets/logo.jpeg";

import styles from "./Footer.module.css";

export default function Footer() {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadFooterData() {
      const navigationData = await getNavigation();

      const siteSettingsData =
        await getSiteSettings();

      setNavigation(navigationData);

      setSiteSettings(siteSettingsData);
    }

    loadFooterData();
  }, []);

  if (!siteSettings) {
    return null;
  }

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

        <h2>{siteSettings.siteName}</h2>

        <p>{siteSettings.tagline}</p>
      </div>

      <div className={styles.right}>
        <nav className={styles.navigation}>
          {navigation.map((item) => (
            <Link
              key={item.id}
              to={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.infoGrid}>
          <div className={styles.socials}>
            <h3>Social</h3>

            <a
              href={siteSettings.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              href={siteSettings.tiktok}
              target="_blank"
              rel="noreferrer"
            >
              TikTok
            </a>

            <a
              href={siteSettings.facebook}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          </div>

          <div className={styles.address}>
            <h3>Address</h3>

            <p>{siteSettings.address}</p>
          </div>

          <div className={styles.contact}>
            <h3>Contact</h3>

            <p>{siteSettings.phone}</p>

            <p>{siteSettings.email}</p>
          </div>
        </div>
      </div>

      <p className={styles.copyright}>
        {siteSettings.copyright}
      </p>
    </footer>
  );
}