Modified from https://github.com/use-strict/7z-wasm

To build:

1. Run `./script/build-7z/build`
2. Manually update `src/7z/index.d.ts`, add `callMain(args: Array<string>): number;` to `WasmModule`
