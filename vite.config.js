import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  logLevel: "error",
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src")
    }
  },
  plugins: [react()]
});
