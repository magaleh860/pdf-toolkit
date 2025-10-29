#!/usr/bin/env node
const path = require('path');
const { mergeFiles } = require('@pdf-toolkit/pdf-core');

async function main() {
  const args = process.argv.slice(2);
  let out = null;
  const inputs = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' && args[i + 1]) {
      out = args[i + 1];
      i++;
    } else {
      inputs.push(args[i]);
    }
  }
  if (!out || inputs.length < 1) {
    console.error('Usage: pdf-merge <input1.pdf> [input2.pdf ...] -o <output.pdf>');
    process.exit(2);
  }
  try {
    await mergeFiles(inputs, out);
    console.log(`✅ Merged ${inputs.length} files -> ${out}`);
  } catch (err) {
    console.error('Error merging PDFs:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) main();
