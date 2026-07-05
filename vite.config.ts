import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split vendor code so route chunks (see routes/index.tsx lazy imports)
    // stay small and cache independently of the framework bundle.
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    // Fail the build (instead of silently shipping) if a chunk balloons —
    // catches accidental heavy imports before they hit production.
    chunkSizeWarningLimit: 600,
  },
});
