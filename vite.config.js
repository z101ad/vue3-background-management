// import path from "path";
// import vue from "@vitejs/plugin-vue";
// // import { defineConfig } from "vite";
// export default {
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://127.0.0.1:8888/api/private/v1",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ""),
//       },
//     },
//   },
// };
