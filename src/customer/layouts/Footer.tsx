/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBrand } from "../hooks/useBrand";
import { brandApi } from "../api";
import styles from "./Footer.module.css";

export default function Footer() {
  const { identity, navItems } = useBrand();
  const [contact, setContact] = useState<any[]>([]);

  useEffect(() => {
    brandApi.getContactInfo().then(setContact).catch(() => {});
  }, []);

  const brandName = identity["name"] || "KEKAL";
  const tagline = identity["tagline"] || "";
  const copyright = identity["copyright_text"] || `© ${brandName}. All rights reserved.`;

  const getContact = (key: string) => contact.find((c) => c.key === key)?.value || "";

  const socials = [
    { key: "instagram", label: "Instagram" },
    { key: "tiktok", label: "TikTok" },
    { key: "facebook", label: "Facebook" },
    { key: "linkedin", label: "LinkedIn" },
  ].filter((s) => getContact(s.key));

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand section */}
        <div className={styles.brandSection}>
          {/* Mobile: logo + name on one row, tagline below */}
          <div className={styles.brandTop}>
            <Link to="/" className={styles.brandName}>{brandName}</Link>
          </div>
          {tagline && <p className={styles.tagline}>{tagline}</p>}
        </div>

        {/* Nav links */}
        <nav className={styles.navSection} aria-label="Footer navigation">
          {navItems.map((item) => (
            <Link key={item.id} to={item.href} className={styles.navLink}>{item.label}</Link>
          ))}
        </nav>

        {/* Contact columns */}
        <div className={styles.contactSection}>
          {/* Socials */}
          {socials.length > 0 && (
            <div className={styles.contactCol}>
              <p className={styles.contactLabel}>Follow</p>
              {socials.map((s) => (
                <a key={s.key} href={getContact(s.key)} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          )}

          {/* Address */}
          {getContact("address") && (
            <div className={styles.contactCol}>
              <p className={styles.contactLabel}>Location</p>
              <p className={styles.contactText}>{getContact("address")}</p>
            </div>
          )}

          {/* Contact */}
          <div className={styles.contactCol}>
            <p className={styles.contactLabel}>Contact</p>
            {getContact("email") && <a href={`mailto:${getContact("email")}`} className={styles.contactLink}>{getContact("email")}</a>}
            {getContact("phone") && <a href={`tel:${getContact("phone")}`} className={styles.contactLink}>{getContact("phone")}</a>}
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className={styles.copyright}>
        <p className={styles.copyrightText}>{copyright}</p>
      </div>
    </footer>
  );
}
