import { pageSeo } from "../database-data/pageSeo";

export function getPageSeo() {
  return pageSeo;
}

export function getSeoByRoute(route: string) {
  return pageSeo.find((s) => s.route === route);
}