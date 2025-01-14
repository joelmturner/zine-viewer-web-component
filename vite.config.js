import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/zine-viewer.ts"),
      name: "NavBar",
      fileName: format => `zine-viewer.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["lit"],
      output: {
        globals: {
          lit: "Lit",
        },
      },
    },
  },
});
