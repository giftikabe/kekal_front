import { designerProfile } from "../database-data/designerProfile";

export function getDesignerProfile() {
  return designerProfile;
}

export function getDesignerProfileByKey(key: string) {
  return designerProfile.find((item) => item.key === key)?.value ?? "";
}