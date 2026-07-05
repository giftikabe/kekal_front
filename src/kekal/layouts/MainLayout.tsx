import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";

import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <div className={styles.shell}>
      {/* First focusable element on every page — lets keyboard/screen
          reader users jump past the announcement bar/header/nav straight
          to the content, instead of tabbing through the same chrome on
          every route. */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AnnouncementBar />
      <Header />

      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
