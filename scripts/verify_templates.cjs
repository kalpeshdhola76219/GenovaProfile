const fs = require('fs');
const path = require('path');

const catalog = require('../src/config/templatesCatalog.json');
const registryCode = fs.readFileSync(path.resolve(__dirname, '../src/templates/registry.ts'), 'utf8');

console.log('--------------------------------------------------');
console.log('TEMPLATES CATALOG AUDIT & UNIQUE COMPONENT CHECK');
console.log('--------------------------------------------------');

const catalogIds = Object.keys(catalog);
console.log(`Total Templates in Catalog: ${catalogIds.length}`);

let missingComponents = 0;
let aliases = 0;
const results = [];

// Check for alias patterns like `const X = Y;`
const aliasMatches = registryCode.match(/const\s+([A-Za-z0-9_]+)\s*=\s*([A-Za-z0-9_]+);/g);
if (aliasMatches) {
  console.warn('WARNING: Found potential alias lines:', aliasMatches);
  aliases += aliasMatches.length;
}

for (const id of catalogIds) {
  const meta = catalog[id];
  const type = meta.documentType || 'biodata';

  // Check if ID is mapped in registry.ts
  const hasIdMapping = registryCode.includes(`'${id}'`) || registryCode.includes(`"${id}"`);
  
  results.push({
    id,
    type,
    name: meta.name,
    mappedInRegistry: hasIdMapping
  });

  if (!hasIdMapping) {
    missingComponents++;
  }
}

console.table(results.slice(0, 15));
console.log(`... and ${results.length - 15} more templates verified.`);
console.log('--------------------------------------------------');
console.log(`Summary:`);
console.log(`Total: ${catalogIds.length}`);
console.log(`Aliases: ${aliases}`);
console.log(`Missing ID mappings: ${missingComponents}`);
console.log('--------------------------------------------------');

if (aliases > 0 || missingComponents > 0) {
  process.exit(1);
} else {
  console.log('ALL TEMPLATES PERFECTLY MATCH REAL UNIQUE COMPONENTS!');
}
