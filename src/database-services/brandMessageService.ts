import { brandMessages } from "../database-data/brandMessages";

export function getBrandMessages() {
  return brandMessages;
}

export function getBrandMessageByKey(key: string) {
  return brandMessages.find((item) => item.key === key);
}