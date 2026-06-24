import { brandIdentity } from "../database-data/brandIdentity";

export function getBrandIdentity() {
  return brandIdentity;
}

export function getBrandIdentityByKey(key: string) {
  return brandIdentity.find((item) => item.key === key)?.value ?? "";
}