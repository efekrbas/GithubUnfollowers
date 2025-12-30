#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DOCS = path.join(ROOT, 'docs');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');
const ASSETS_DIR = path.join(ROOT, 'assets');

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  for (const e of fs.readdirSync(p)) {
    const cur = path.join(p, e);
    const stat = fs.lstatSync(cur);
    if (stat.isDirectory()) rmrf(cur); else fs.unlinkSync(cur);
  }
  fs.rmdirSync(p);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src)) {
    const s = path.join(src, e);
    const d = path.join(dest, e);
    const stat = fs.lstatSync(s);
    if (stat.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

(function main() {
  // Clean docs
  if (fs.existsSync(DOCS)) rmrf(DOCS);
  fs.mkdirSync(DOCS, { recursive: true });

  // Copy public -> docs/
  copyDir(PUBLIC_DIR, DOCS);
  // Ensure dist under docs/dist -> copy bundle
  copyDir(DIST_DIR, path.join(DOCS, 'dist'));
  // Copy assets if present (for README images on GH pages)
  copyDir(ASSETS_DIR, path.join(DOCS, 'assets'));

  // Ensure index.html can fetch dist/dist.js. If paths were relative like ../dist/dist.js, rewrite to dist/dist.js
  const indexPath = path.join(DOCS, 'index.html');
  if (fs.existsSync(indexPath)) {
    try {
      const html = fs.readFileSync(indexPath, 'utf8');
      const updated = html.replace(/\.\.?\/dist\/dist\.js/g, 'dist/dist.js');
      fs.writeFileSync(indexPath, updated, 'utf8');
    } catch (e) {
      console.warn('Could not normalize index.html paths:', e.message);
    }
  }

  console.log('Exported GitHub Pages site to', DOCS);
})();
