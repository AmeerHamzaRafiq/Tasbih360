import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
     manifest: {
        name: "Tasbih360",
        short_name: "Tasbih360",
        description: "Tasbih360 is a modern and convenient digital Tasbih counter app...",
        theme_color: "#141414",
        icons: [
          {
            src: "https://i.postimg.cc/CL9qWn3t/Tasbihfavicon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "https://i.postimg.cc/CL9qWn3t/Tasbihfavicon.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "https://i.postimg.cc/CL9qWn3t/Tasbihfavicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client/public"),
  build: {
    outDir: path.resolve(__dirname, "client/dev-dist"),
    emptyOutDir: true,
  },
});
