import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";

export default function MainLayout() {
  return (
    <>
      <AnnouncementBar />
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
