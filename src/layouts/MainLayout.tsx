import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";

import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
