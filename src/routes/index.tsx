import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import CollectionsPage from "../pages/CollectionsPage";
import CollectionDetailPage from "../pages/CollectionDetailPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";
import ContactPage from "../pages/ContactPage";
import UpcomingEventDetailsPage from "../pages/UpcomingEventDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",

    element: <MainLayout />,

    children: [
      {
        index: true,

        element: <HomePage />,
      },

      {
        path: "about",

        element: <AboutPage />,
      },

      {
        path: "collections",

        element: <CollectionsPage />,
      },

      {
        path: "collections/:slug",

        element: <CollectionDetailPage />,
      },

      {
        path: "products/:slug",

        element: <ProductDetailPage />,
      },

      {
        path: "events",

        element: <EventsPage />,
      },

      {
        path: "events/:slug",

        element: <EventDetailPage />,
      },

      {
        path: "upcoming-events/:slug",

        element: <UpcomingEventDetailsPage />,
      },

      {
        path: "contact",

        element: <ContactPage />,
      },
    ],
  },
]);