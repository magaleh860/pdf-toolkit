#!/usr/bin/env node
const { splitPages } = require('@pdf-toolkit/pdf-core');

function parsePageRanges(rangeStr) {
  // Parse "1,3,5-7,10" into [0,2,4,5,6,9] (0-based indices)
  const indices = [];
  const parts = rangeStr.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      // Range like "5-7"
      const [start, end] = trimmed.split('-').map(s => parseInt(s.trim(), 10));
      if (isNaN(start) || isNaN(end) || start > end || start < 1) {
        throw new Error(`Invalid range: ${trimmed}`);
      }
      for (let i = start; i <= end; i++) {
        indices.push(i - 1); // Convert to 0-based
      }
    } else {
      // Single page like "3"
      const pageNum = parseInt(trimmed, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        throw new Error(`Invalid page number: ${trimmed}`);
      }
      indices.push(pageNum - 1); // Convert to 0-based
    }
  }
  
  return [...new Set(indices)].sort((a, b) => a - b);
}

async function main() {
  const args = process.argv.slice(2);
  let inputFile = null;
  let outputFile = null;
  let pageIndices = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' && args[i + 1]) {
      outputFile = args[i + 1];
      i++;
    } else if (args[i] === '-p' && args[i + 1]) {
      try {
        pageIndices = parsePageRanges(args[i + 1]);
      } catch (err) {
        console.error('Error parsing -p:', err.message);
        process.exit(2);
      }
      i++;
    } else if (!inputFile) {
      inputFile = args[i];
    }
  }
  if (!inputFile || !outputFile) {
    console.error('Usage: pdf-split <input.pdf> -o <output.pdf> [-p 1,3,5-7]');
    process.exit(2);
  }

  try {
    // If no pages specified, extract all pages
    if (!pageIndices) {
      const fs = require('fs');
      const { PDFDocument } = require('pdf-lib');
      const bytes = fs.readFileSync(inputFile);
      const pdf = await PDFDocument.load(bytes);
      const count = pdf.getPageCount();
      pageIndices = Array.from({ length: count }, (_, i) => i);
    }

    await splitPages(inputFile, outputFile, pageIndices);
    console.log(`✅ Extracted ${pageIndices.length} page(s) -> ${outputFile}`);
  } catch (err) {
    console.error('Error splitting PDF:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) main();
