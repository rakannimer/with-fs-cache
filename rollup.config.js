import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "ReactGoogleCharts"
    },
    {
      file: "dist/index.esm.js",
      format: "esm"
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs"
    }
  ],
  external: ["lru-cache", "mkdirp"],
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
