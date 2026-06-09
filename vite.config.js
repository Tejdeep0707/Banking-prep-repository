const fs = require('fs');
const path = require('path');
const { resolve } = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (err) {
        if (err.code === 'EBUSY') {
          console.warn(`Warning: file busy, skipped copying ${srcPath}`);
        } else {
          throw err;
        }
      }
    }
  }
}

const firebaseAppEntry = resolve(__dirname, 'node_modules/firebase/app/dist/esm/index.esm.js');
const firebaseAuthEntry = resolve(__dirname, 'node_modules/firebase/auth/dist/esm/index.esm.js');

/** @type {import('vite').UserConfig} */
module.exports = {
  root: '.',
  resolve: {
    alias: {
      'firebase/app': firebaseAppEntry,
      'firebase/auth': firebaseAuthEntry,
    },
    dedupe: ['firebase'],
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth'],
  },
  plugins: [
    {
      name: 'copy-resources',
      closeBundle() {
        copyDir(
          resolve(__dirname, 'RESOURCES'),
          resolve(__dirname, 'dist', 'RESOURCES')
        );
        copyDir(
          resolve(__dirname, 'data'),
          resolve(__dirname, 'dist', 'data')
        );
        if (fs.existsSync(resolve(__dirname, 'robots.txt'))) {
          fs.copyFileSync(resolve(__dirname, 'robots.txt'), resolve(__dirname, 'dist', 'robots.txt'));
        }
        if (fs.existsSync(resolve(__dirname, 'sitemap.xml'))) {
          fs.copyFileSync(resolve(__dirname, 'sitemap.xml'), resolve(__dirname, 'dist', 'sitemap.xml'));
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'auth.html'),
        courseIbps: resolve(__dirname, 'course-ibps.html'),
        courseSbi: resolve(__dirname, 'course-sbi.html'),
        courseRbi: resolve(__dirname, 'course-rbi.html'),
        contact: resolve(__dirname, 'contact.html'),
        interview: resolve(__dirname, 'interview.html'),
        notifications: resolve(__dirname, 'notifications.html'),
        mockTests: resolve(__dirname, 'mock-tests.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        refundPolicy: resolve(__dirname, 'refund-policy.html'),
      },
    },
  },
  server: {
    open: true,
  },
};
