import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/",
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "icons", dest: "." },
        { src: "img", dest: "." },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        watchlist: resolve(__dirname, "watchlist.html"),
      },
    },
  },
});
