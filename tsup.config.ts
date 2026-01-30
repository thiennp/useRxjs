import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/useAsyncSubject.ts",
    "src/useBehaviorSubject.ts",
    "src/useObservable.ts",
    "src/useObservableCallback.ts",
    "src/useReplaySubject.ts",
    "src/useSubject.ts",
    "src/useSubscription.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "rxjs", "react/jsx-runtime"],
  outDir: "dist",
  minify: false,
});
