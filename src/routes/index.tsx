import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../kekal/layouts/MainLayout";
import AdminLayout from "../admin/layouts/AdminLayout";
import ProtectedRoute from "../admin/components/ProtectedRoute";
import { AuthProvider } from "../admin/hooks/AuthContext";

import HomePage from "../kekal/pages/HomePage";
import AboutPage from "../kekal/pages/AboutPage";
import CollectionsPage from "../kekal/pages/CollectionsPage";
import CollectionDetailPage from "../kekal/pages/CollectionDetailPage";
import ProductDetailPage from "../kekal/pages/ProductDetailPage";
import EventsPage from "../kekal/pages/EventsPage";
import EventDetailPage from "../kekal/pages/EventDetailPage";
import ContactPage from "../kekal/pages/ContactPage";
import UpcomingEventDetailsPage from "../kekal/pages/UpcomingEventDetailsPage";

import LoginPage from "../admin/pages/LoginPage";
import DashboardPage from "../admin/pages/DashboardPage";
import AdminCollectionsPage from "../admin/pages/CollectionsPage";
import AdminProductsPage from "../admin/pages/ProductsPage";
import AdminEventsPage from "../admin/pages/EventsPage";
import AdminUpcomingEventsPage from "../admin/pages/UpcomingEventsPage";
import BrandPage from "../admin/pages/BrandPage";
import PagesPage from "../admin/pages/PagesPage";
import NavigationPage from "../admin/pages/NavigationPage";
import UsersPage from "../admin/pages/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "collections", element: <CollectionsPage /> },
      { path: "collections/:slug", element: <CollectionDetailPage /> },
      { path: "products/:slug", element: <ProductDetailPage /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:slug", element: <EventDetailPage /> },
      { path: "upcoming-events/:slug", element: <UpcomingEventDetailsPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
  {
    path: "/admin/login",
    element: (
      <AuthProvider>
        <LoginPage />
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
      { index: true, element: <DashboardPage /> },
      { path: "collections", element: <AdminCollectionsPage /> },
      { path: "products", element: <AdminProductsPage /> },
      { path: "events", element: <AdminEventsPage /> },
      { path: "upcoming-events", element: <AdminUpcomingEventsPage /> },
      { path: "brand", element: <BrandPage /> },
      { path: "pages", element: <PagesPage /> },
      { path: "navigation", element: <NavigationPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
]);
