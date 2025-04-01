import { resolve } from 'path';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['node_modules/', 'dist/'],
    include: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/modules/**/*.service.ts'],
      exclude: ['**/*.d.ts', '**/*.spec.ts', '**/*.e2e-spec.ts', 'src/main.ts'],
    },
    deps: {
      interopDefault: true,
      inline: [/@nestjs\/common/, /@nestjs\/core/, /@nestjs\/config/],
    },
    setupFiles: ['./test/setup.ts'],
    typecheck: {
      enabled: false,
    },
  },
  plugins: [
    tsconfigPaths(),
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      // Ensure Vitest correctly resolves TypeScript path aliases
      src: resolve(__dirname, './src'),
    },
  },
});
