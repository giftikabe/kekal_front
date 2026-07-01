import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import { BrandProvider } from "../hooks/useBrand";
import styles from "./CustomerLayout.module.css";

export default function CustomerLayout() {
  return (
    <BrandProvider>
      <AnnouncementBar />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </BrandProvider>
  );
}
