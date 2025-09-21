import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: "build",
  esbuildOptions(options) {
    options.alias = {
      "@": "./src",
    };
  },
});
