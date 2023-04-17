import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import ssr from 'vite-plugin-ssr/plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

const configPlugins = [
  react({
    jsxRuntime: 'automatic',
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        [
          '@emotion/babel-plugin',
          {
            autoLabel: 'dev-only',
            labelFormat: '[local]',
            cssPropOptimization: true,
          },
        ],
      ],
    },
  }),
  ssr(),
  tsconfigPaths(),
  cjsInterop({
    dependencies: ['@emotion/styled/base', '@emotion/*'],
  }),
];

const config = defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  if (mode === 'development') {
    configPlugins.push(
      visualizer({
        filename: './dist/report.html',
        open: true,
        brotliSize: true,
      })
    );
  }

  return {
    define: {
      'process.env': process.env,
    },
    plugins: configPlugins,
  };
});

export default config;
