import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    '7z': 'src/7z/index.js',
  },
  format: ['esm'],
});
