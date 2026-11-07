import type { MetadataRoute } from "next";
import { BRAND_NAME } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: BRAND_NAME,
    description: "O'quv markazlar uchun ochiq kodli boshqaruv tizimi (CRM)",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F6FA",
    theme_color: "#5E2CA5",
    icons: [
      { src: "/api/branding/logo", sizes: "192x192" },
      { src: "/api/branding/logo", sizes: "512x512" },
    ],
  };
}
