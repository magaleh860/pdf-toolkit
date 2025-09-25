#!/usr/bin/env node
const path = require('path');
const { mergeFiles } = require('@pdf-toolkit/pdf-core');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3 || args[0] !== 'merge') {
    console.error('Usage: pdf-merge merge <out.pdf> <in1.pdf> [in2.pdf ...]');
    process.exit(2);
  }

  const out = args[1];
  const inputs = args.slice(2);
  try {
    await mergeFiles(inputs, out);
    console.log(`✅ Merged ${inputs.length} files -> ${out}`);
  } catch (err) {
    console.error('Error merging PDFs:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) main();
