import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const PORT = 3000;  // mund ta lësh si numër

  return {
    server: {
      open: true,
      port: PORT
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: []
    },
    css: {
      preprocessorOptions: {
        scss: { charset: false },
        less: { charset: false }
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') atRule.remove();
              }
            }
          }
        ]
      }
    },
    base: API_URL,
    plugins: [react(), jsconfigPaths()]
  };
});
