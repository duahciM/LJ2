import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 的项目站点位于 https://<user>.github.io/<repo>/ 子路径下，
  // 使用相对基准路径，本地打开 dist/index.html 或部署到任意子目录都能正常加载。
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    // 构建为单个自包含的 dist/index.html（CSS/JS 全部内联），
    // 不依赖任何外部路径，可直接作为 GitHub Pages 的静态页面。
    outDir: "dist",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
