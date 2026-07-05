import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../kekal/layouts/MainLayout";
import AdminLayout from "../admin/layouts/AdminLayout";
import ProtectedRoute from "../admin/components/ProtectedRoute";
import { AuthProvider } from "../admin/hooks/AuthContext";

// Every route is code-split with React.lazy so the initial bundle only
// contains what's needed to render the first page — the admin console in
// particular (charts-free but still sizeable with all its CRUD screens)
// never has to be downloaded by a storefront visitor, and vice versa.
const HomePage = lazy(() => import("../kekal/pages/HomePage"));
const AboutPage = lazy(() => import("../kekal/pages/AboutPage"));
const CollectionsPage = lazy(() => import("../kekal/pages/CollectionsPage"));
const CollectionDetailPage = lazy(() => import("../kekal/pages/CollectionDetailPage"));
const ProductDetailPage = lazy(() => import("../kekal/pages/ProductDetailPage"));
const EventsPage = lazy(() => import("../kekal/pages/EventsPage"));
const EventDetailPage = lazy(() => import("../kekal/pages/EventDetailPage"));
const ContactPage = lazy(() => import("../kekal/pages/ContactPage"));
const UpcomingEventDetailsPage = lazy(() => import("../kekal/pages/UpcomingEventDetailsPage"));
const NotFoundPage = lazy(() => import("../kekal/pages/NotFoundPage"));

const LoginPage = lazy(() => import("../admin/pages/LoginPage"));
const DashboardPage = lazy(() => import("../admin/pages/DashboardPage"));
const AdminCollectionsPage = lazy(() => import("../admin/pages/CollectionsPage"));
const AdminProductsPage = lazy(() => import("../admin/pages/ProductsPage"));
const AdminEventsPage = lazy(() => import("../admin/pages/EventsPage"));
const AdminUpcomingEventsPage = lazy(() => import("../admin/pages/UpcomingEventsPage"));
const BrandPage = lazy(() => import("../admin/pages/BrandPage"));
const PagesPage = lazy(() => import("../admin/pages/PagesPage"));
const NavigationPage = lazy(() => import("../admin/pages/NavigationPage"));
const UsersPage = lazy(() => import("../admin/pages/UsersPage"));

function PageFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: "about", element: withSuspense(<AboutPage />) },
      { path: "collections", element: withSuspense(<CollectionsPage />) },
      { path: "collections/:slug", element: withSuspense(<CollectionDetailPage />) },
      { path: "products/:slug", element: withSuspense(<ProductDetailPage />) },
      { path: "events", element: withSuspense(<EventsPage />) },
      { path: "events/:slug", element: withSuspense(<EventDetailPage />) },
      { path: "upcoming-events/:slug", element: withSuspense(<UpcomingEventDetailsPage />) },
      { path: "contact", element: withSuspense(<ContactPage />) },
      // Catch-all: previously a bad/typo'd URL rendered a blank page with
      // no way back. Every unmatched path now gets a real 404 experience.
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
  {
    path: "/admin/login",
    element: (
      <AuthProvider>
        {withSuspense(<LoginPage />)}
      </AuthProvider>
    ),
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: "collections", element: withSuspense(<AdminCollectionsPage />) },
      { path: "products", element: withSuspense(<AdminProductsPage />) },
      { path: "events", element: withSuspense(<AdminEventsPage />) },
      { path: "upcoming-events", element: withSuspense(<AdminUpcomingEventsPage />) },
      { path: "brand", element: withSuspense(<BrandPage />) },
      { path: "pages", element: withSuspense(<PagesPage />) },
      { path: "navigation", element: withSuspense(<NavigationPage />) },
      { path: "users", element: withSuspense(<UsersPage />) },
    ],
  },
]);
