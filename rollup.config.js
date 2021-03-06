import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "esm"
    },
    {
      file: "dist/index.js",
      format: "cjs"
    }
  ],
  external: ["lru-cache", "mkdirp", "lodash.memoize", "fs"],
  plugins: [
    typescript({
      typescript: require("typescript"),
      abortOnError: false,
      tsconfigOverride: {
        compilerOptions: {
          module: "esnext"
        }
      }
    })
  ]
};
