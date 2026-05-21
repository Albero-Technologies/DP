import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // All /api requests from React → forwarded to Express on :5000
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
