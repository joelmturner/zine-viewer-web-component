import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/zine-viewer.ts"),
      name: "ZineViewer",
      fileName: format => `zine-viewer.${format}.js`,
      formats: ["es"],
      sourcemap: true,
    },
    rollupOptions: {
      output: {
        format: "es",
      },
    },
  },
});
