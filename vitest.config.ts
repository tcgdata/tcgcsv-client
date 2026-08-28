import * as fs from 'node:fs';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    mockReset: true,
    coverage: {
      include: ['src/**/*.ts'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
        },
      },
    ],
  },
  plugins: [
    {
      name: 'vitest-wasm-module-loader',
      enforce: 'pre' as const,
      load(id: string) {
        if (id.endsWith('.wasm')) {
          const buffer = fs.readFileSync(id);
          const byteArray = Array.from(new Uint8Array(buffer));

          return {
            code: `
              const buffer = new Uint8Array(${JSON.stringify(byteArray)});
              const wasmModule = new WebAssembly.Module(buffer);
              export default wasmModule;
            `,
            map: { mappings: '' },
          };
        }
      },
    },
  ],
  ssr: {
    noExternal: ['7z-wasm'],
  },
});
