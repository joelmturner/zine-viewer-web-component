import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/nav-bar.ts"),
      name: "NavBar",
      fileName: (format) => `nav-bar.${format}.js`,
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
