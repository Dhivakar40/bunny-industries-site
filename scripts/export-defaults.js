/**
 * scripts/export-defaults.js
 *
 * Generates scripts/default-content-snapshot.json from defaultContent.ts.
 * Run this once, then commit the snapshot so the seed script can use it
 * without a TypeScript compiler.
 *
 *   node --experimental-transform-types scripts/export-defaults.js
 *   OR
 *   npx tsx scripts/export-defaults.js
 */

import defaultContent from '../src/content/defaultContent.ts';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, 'default-content-snapshot.json');

writeFileSync(outPath, JSON.stringify(defaultContent, null, 2), 'utf8');
console.log('✓ Snapshot written to', outPath);
