import react from "@vitejs/plugin-react";
import fs from "fs";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  server: {
    host: "127.0.0.1",
  },
  // server: {
  //   https: {
  //     key: fs.readFileSync("localhost-key.pem"),
  //     cert: fs.readFileSync("localhost.pem"),
  //   },
  //   headers: {
  //     "Cross-Origin-Opener-Policy": "same-origin",
  //     "Cross-Origin-Embedder-Policy": "require-corp",
  //   },
  // },
});
