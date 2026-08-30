import esbuild from 'esbuild';
import fs from 'fs';

(async () => {
  await esbuild.build({
    platform: 'node',
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm',
    external: ['cloudflare:*'],
    plugins: [
      {
        // Workaround - rewrite 7z wasm loader code so it doesn't try to call createRequire, it fails because import.meta.url is undefined.
        name: 'simple-replace',
        setup(build) {
          let hasReplacedEnvironmentIsNode = false;
          let hasReplacedEnvironmentIsWorker = false;

          build.onStart(() => {
            hasReplacedEnvironmentIsNode = false;
            hasReplacedEnvironmentIsWorker = false;
          });

          build.onLoad({ filter: /\.js$/ }, async (args) => {
            let contents = await fs.promises.readFile(args.path, 'utf8');

            if (contents.match(/ENVIRONMENT_IS_NODE\s*=/)) {
              contents = contents.replace(
                /ENVIRONMENT_IS_NODE\s*=\s*/g,
                'ENVIRONMENT_IS_NODE=false&&'
              );
              hasReplacedEnvironmentIsNode = true;
            }

            if (contents.match(/ENVIRONMENT_IS_WORKER\s*=/)) {
              contents = contents.replace(
                /ENVIRONMENT_IS_WORKER\s*=\s*/g,
                'ENVIRONMENT_IS_WORKER=false&&'
              );
              hasReplacedEnvironmentIsWorker = true;
            }

            return { contents, loader: 'js' };
          });

          build.onEnd(async () => {
            if (!hasReplacedEnvironmentIsNode || !hasReplacedEnvironmentIsWorker) {
              throw new Error(
                'Output did not contain "ENVIRONMENT_IS_NODE=" or "ENVIRONMENT_IS_WORKER="'
              );
            }
          });
        },
      },
    ],
    loader: {
      '.wasm': 'copy',
    },
  });
})();
