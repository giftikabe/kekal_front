const CLOUD_NAME = "dkewwryqv";
const UPLOAD_PRESET = "kekal_library";
const FOLDER = "kekal";

export interface CloudinaryResult {
  secure_url: string;
  public_id: string;
}

export async function uploadImage(file: File): Promise<CloudinaryResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", FOLDER);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  return res.json();
}

export async function deleteImage(publicId: string): Promise<void> {
  // Note: deletion requires signed requests (backend).
  // For now we just remove from UI — full deletion handled via Cloudinary dashboard
  // or future backend endpoint.
  console.warn("Image deletion queued for:", publicId);
}

export function getOptimizedUrl(url: string, width = 800): string {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}
