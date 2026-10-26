const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, 'frontend/src');

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(walk(full));
    } else if (full.endsWith('.tsx') || full.endsWith('.ts') || full.endsWith('.css')) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk(srcDir);
const hexRegex = /#([0-9a-fA-F]{6})\b/g;

function hexToRgb(hex) {
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function isGreenish(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Dominant green
  if (g > r + 15 && g > b + 15) return true;
  // Mint / Light green / Teal
  if (g > 200 && g > r + 5 && g > b + 5) return true;
  // Dull sage
  if (g > r && g > b && (g - r > 10 || g - b > 10) && r < 240) return true;
  return false;
}

const results = {};

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hexRegex.exec(content)) !== null) {
    const hex = match[1];
    if (isGreenish(hex)) {
      const rel = path.relative(srcDir, file);
      if (!results[hex.toUpperCase()]) results[hex.toUpperCase()] = [];
      if (!results[hex.toUpperCase()].includes(rel)) {
        results[hex.toUpperCase()].push(rel);
      }
    }
  }
}

console.log(JSON.stringify(results, null, 2));
