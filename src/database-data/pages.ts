import type { Page } from "../database-types/page";

export const pages: Page[] = [
  {
    id: "1",
    name: "Home",
    route: "/",
  },

  {
    id: "2",
    name: "Collections",
    route: "/collections",
  },

  {
    id: "3",
    name: "About",
    route: "/about",
  },

  {
    id: "4",
    name: "Events",
    route: "/events",
  },

  {
    id: "5",
    name: "Contact",
    route: "/contact",
  },

  {
    id: "6",
    name: "Collection Details",
    route: "/collections/:slug",
  },

  {
    id: "7",
    name: "Product Details",
    route: "/products/:slug",
  },
];