import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../kekal/layouts/MainLayout";
import AdminLayout from "../admin/layouts/AdminLayout";
import ProtectedRoute from "../admin/components/ProtectedRoute";
import { AuthProvider } from "../admin/hooks/AuthContext";

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
const CheckoutPage = lazy(() => import("../kekal/pages/CheckoutPage"));
const CheckoutSuccessPage = lazy(() => import("../kekal/pages/CheckoutSuccessPage"));
const ShippingPage = lazy(() => import("../kekal/pages/ShippingPage"));
const ReturnsPage = lazy(() => import("../kekal/pages/ReturnsPage"));
const SitotaPage = lazy(() => import("../kekal/pages/SitotaPage"));
const AcademiaPage = lazy(() => import("../kekal/pages/AcademiaPage"));

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
const DatabasePage = lazy(() => import("../admin/pages/DatabasePage"));
const CustomTableDataPage = lazy(() => import("../admin/pages/CustomTableDataPage"));
const CommercePage = lazy(() => import("../admin/pages/CommercePage"));

const PageBuilderPage = lazy(() => import("../admin/pages/PageBuilderPage"));
const ComponentLibraryPage = lazy(() => import("../admin/pages/ComponentLibraryPage"));

const TemplateEditorPage = lazy(() => import("../admin/pages/TemplateEditorPage"));
const NewPageBuilderPage  = lazy(() => import("../admin/pages/NewPageBuilderPage"));
// children:

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
      { path: "checkout", element: withSuspense(<CheckoutPage />) },
      { path: "checkout/success", element: withSuspense(<CheckoutSuccessPage />) },
      { path: "shipping", element: withSuspense(<ShippingPage />) },
      { path: "returns", element: withSuspense(<ReturnsPage />) },
      { path: "sitota", element: withSuspense(<SitotaPage />) },
      { path: "academia", element: withSuspense(<AcademiaPage />) },
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
      // Database Manager: create/delete custom tables (schema-level CRUD).
      { path: "database", element: withSuspense(<DatabasePage />) },
      // Custom Data: row-level CRUD on the data inside a custom table.
      // DatabasePage's "View Data" button navigates here via
      // navigate("/admin/custom-data", { state: { tableId } }), and the
      // Sidebar's "Custom Data" nav item links here directly too — this
      // path must match both of those exactly or you get a 404.
      { path: "custom-data", element: withSuspense(<CustomTableDataPage />) },
      { path: "commerce", element: withSuspense(<CommercePage />) },
      { path: "page-builder", element: withSuspense(<PageBuilderPage />) },
      { path: "component-library", element: withSuspense(<ComponentLibraryPage />) },
{ path: "template-editor/:id",  element: withSuspense(<TemplateEditorPage />) },
{ path: "template-editor",      element: withSuspense(<TemplateEditorPage />) },
{ path: "page-builder-v2", element: withSuspense(<NewPageBuilderPage />) },

    ],
  },
]);