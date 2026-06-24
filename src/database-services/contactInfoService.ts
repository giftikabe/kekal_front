import { contactInfo } from "../database-data/contactInfo";

export function getContactInfo() {
  return contactInfo;
}

export function getContactInfoByKey(key: string) {
  return contactInfo.find((item) => item.key === key)?.value ?? "";
}