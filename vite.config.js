import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

import { handleOmarChat } from './src/server/omarService.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function omarApiPlugin() {
  return {
    name: 'omar-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/omar', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const result = await handleOmarChat({
              message: data.message || '',
              history: data.history || [],
              lang: data.lang || 'fr'
            });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [omarApiPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        diagnostic: resolve(__dirname, 'diagnostic.html'),
        approche: resolve(__dirname, 'approche.html'),
        realisations: resolve(__dirname, 'realisations.html'),
        realisation_el_omrani: resolve(__dirname, 'realisation-el-omrani.html'),
        realisation_sechkili: resolve(__dirname, 'realisation-sechkili.html'),
        creation_site_web_casablanca: resolve(__dirname, 'creation-site-web-casablanca.html'),
        expertise: resolve(__dirname, 'expertise.html'),
        rabat: resolve(__dirname, 'rabat.html'),
        marrakech: resolve(__dirname, 'marrakech.html'),
        tanger: resolve(__dirname, 'tanger.html'),
        fes: resolve(__dirname, 'fes.html'),
        agadir: resolve(__dirname, 'agadir.html'),
        referencement_seo_casablanca: resolve(__dirname, 'referencement-seo-casablanca.html'),
        generation_leads_assurance_maroc: resolve(__dirname, 'generation-leads-assurance-maroc.html'),
      },
    },
  },
});

