import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { SidebarProvider, useSidebar } from "../hooks/SidebarContext";
import styles from "./AdminLayout.module.css";

function AdminLayoutInner() {
  const { collapsed } = useSidebar();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={`${styles.main} ${collapsed ? styles.mainCollapsed : ""}`}>
        <TopBar />
        <main id="main-content" className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutInner />
    </SidebarProvider>
  );
}
