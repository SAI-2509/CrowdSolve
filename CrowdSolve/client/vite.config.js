import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind on IPv4 so the displayed localhost URL works consistently on Windows.
    host: "0.0.0.0",
    port: 5173,
    strictPort: true
  }
});
