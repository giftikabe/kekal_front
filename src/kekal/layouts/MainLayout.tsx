import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AnnouncementBar from "../components/common/AnnouncementBar";

import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <div className={styles.shell}>
      <AnnouncementBar />
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
