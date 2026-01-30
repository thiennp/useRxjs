import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/useBehaviorSubject.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "rxjs", "react/jsx-runtime"],
  outDir: "dist",
  minify: false,
});
