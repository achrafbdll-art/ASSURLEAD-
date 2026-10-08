import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        diagnostic: resolve(__dirname, 'diagnostic.html'),
        approche: resolve(__dirname, 'approche.html'),
        processus: resolve(__dirname, 'processus.html'),
        realisations: resolve(__dirname, 'realisations.html'),
        realisation_el_omrani: resolve(__dirname, 'realisation-el-omrani.html'),
        creation_site_web_casablanca: resolve(__dirname, 'creation-site-web-casablanca.html'),
        creation_site_web_maroc: resolve(__dirname, 'creation-site-web-maroc.html'),
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

