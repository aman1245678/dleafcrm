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

// Exact mapping of green / teal codes to brand palette
const replacements = [
  // 1. Kanban Header Teal/Mint (#D9F2EF) -> Clean Light Brand Header (#FFF1F7 / #F8FAFC)
  [/D9F2EF/gi, 'FFF1F7'],

  // 2. Button border dark forest green (#265342) -> Dark Slate / Brand Pink Border
  [/265342/gi, '334155'],

  // 3. MCP Server dark forest terminal backgrounds
  [/0D261D/gi, '090D16'],
  [/091A14/gi, '090D16'],
  [/A8C2A5/gi, '94A3B8'],
  [/88A896/gi, '64748B'],

  // 4. Modals / Store / Subscription / Setup lingering green tones
  [/374A36/gi, '334155'],
  [/5C7A65/gi, '64748B'],
  [/0A1712/gi, '0F172A'],
  [/264E40/gi, '334155'],
  [/8DAA8A/gi, '94A3B8'],

  // 5. Deep green accents (#126B4A, #059669, #15803D, #047857, #16A34A, #0D9488, #0F766E) -> Brand Pink / Brand Orange
  [/126B4A/gi, 'EE0979'],
  [/059669/gi, 'EE0979'],
  [/15803D/gi, 'EE0979'],
  [/047857/gi, 'EE0979'],
  [/16A34A/gi, 'EE0979'],
  [/0D9488/gi, 'EE0979'],
  [/0F766E/gi, 'D8086C'],

  // 6. Light green / mint pill badges & tags (#DCFCE7, #CCFBF1, #99F6E4, #D1FAE5, #A7F3D0, #BBF7D0) -> Brand Light Pink / Orange Pills
  [/DCFCE7/gi, 'FFF1F7'],
  [/CCFBF1/gi, 'FFF1F7'],
  [/99F6E4/gi, 'FFE4EF'],
  [/D1FAE5/gi, 'FFF1F7'],
  [/A7F3D0/gi, 'FFE4EF'],
  [/BBF7D0/gi, 'FFF1F7']
];

let updatedCount = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  for (const [regex, rep] of replacements) {
    content = content.replace(regex, rep);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log('Fixed greens in:', path.relative(srcDir, file));
  }
}

console.log('Total files fixed:', updatedCount);
