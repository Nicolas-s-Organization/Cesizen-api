import { build } from 'esbuild';

// Bundle l'API en un seul fichier ESM exécutable par Node.
// - format ESM : requis car le client Prisma (généré en ESM car le projet est "type": "module")
//   utilise import.meta.url. En CJS, cet appel renverrait undefined → crash au démarrage.
// - packages: external : les paquets de node_modules ne sont pas bundlés (installés via npm ci).
//   Le client Prisma généré (dans generated/, chemin relatif) EST bundlé par esbuild — pur TS,
//   aucun moteur natif au runtime grâce au driver-adapter @prisma/adapter-pg.
//
// Pas de banner __dirname : notre code utilise process.cwd() partout, plus aucune référence
// à __dirname dans le source app (cf. upload.middleware.ts et article.service.ts).
await build({
  entryPoints: ['app.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: 'dist/server.mjs',
  packages: 'external',
});
