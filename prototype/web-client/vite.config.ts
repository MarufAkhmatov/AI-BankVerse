import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: Number(process.env.PORT ?? 5173),
    strictPort: false,
    proxy: {
      "/api": {
        target: "http://localhost:4300",
        changeOrigin: true,
      },
    },
  },
});
