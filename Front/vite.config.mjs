import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';  // Sigurohuni që të ketë një vlerë fallback
  const PORT = '3000';  // Nuk është e nevojshme ta vendosni si string, por është gjithsesi e saktë

  return {
    server: {
      open: true,
      port: PORT
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: [
        // mund të shtoni alias këtu nëse është e nevojshme
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
        },
        less: {
          charset: false
        }
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    base: API_URL,  // Kjo përdor API_URL që mund të jetë një vlerë e saktë ose "/"
    plugins: [react(), jsconfigPaths()]
  };
});
