const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'objetivos-estrategicos-kr.html');
const destDir = path.join(__dirname, 'entrega-drawer-kr');

const htmlContent = fs.readFileSync(srcFile, 'utf8');

// Helper to extract via regex
function extractBlock(regex) {
  const match = htmlContent.match(regex);
  return match ? match[1] : '';
}

// 1. Extract CSS
const cssMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
let fullCss = cssMatch ? cssMatch[1] : '';

// Let's get only the drawer part. 
// Starting from /* ─── DRAWER (painel lateral KR) ───────────── */
// or just getting the whole thing since it includes KR listing and modal too.
// The user says "new-folha de estilo com classe drawer". Let's get everything after "/* ─── DRAWER" up to the end of style.
const drawerIndex = fullCss.indexOf('/* ─── DRAWER (painel lateral KR) ───────────── */');
let drawerCss = fullCss;
if (drawerIndex !== -1) {
    // Actually we need the KR list styles and modal styles as well. 
    // They start from "/* ─── KR List no Drawer ──────────────────── */" and "/* ─── Empty state ───────────────────────────── */" and "/* ─── MODAL Cadastro KR ─────────────────────── */"
    // Let's just find the start of Drawer CSS and keep everything below it, which includes modals and KR lists.
    const startCSS = fullCss.indexOf('/* ─── DRAWER (painel lateral KR) ───────────── */');
    drawerCss = fullCss.substring(startCSS);
}

// 2. Extract HTML (Drawer + Modal + Medicao Overlay)
// Basically everything from "<!-- ══════════════════════════════════════════" to <script>
const htmlMatch = htmlContent.match(/(<!-- ══════════════════════════════════════════\s*DRAWER[\s\S]*?)<script>/);
let drawerHtml = htmlMatch ? htmlMatch[1] : '';

// 3. Extract JS
const jsMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
let fullJs = jsMatch ? jsMatch[1] : '';

// Separate Mock Data and Logic
// Mock data is up to /* ─── Drawer ─────────────────────────────────── */
const breakIndex = fullJs.indexOf('/* ─── Drawer ─────────────────────────────────── */');
let mockDataJs = '';
let logicJs = '';

if (breakIndex !== -1) {
    mockDataJs = fullJs.substring(0, breakIndex);
    logicJs = fullJs.substring(breakIndex);
} else {
    logicJs = fullJs;
}

// Write files
fs.writeFileSync(path.join(destDir, 'drawer.css'), drawerCss.trim());
fs.writeFileSync(path.join(destDir, 'mock-data.js'), mockDataJs.trim());
fs.writeFileSync(path.join(destDir, 'drawer.js'), logicJs.trim());
fs.writeFileSync(path.join(destDir, 'drawer.html'), drawerHtml.trim());

console.log('Extraction complete.');
