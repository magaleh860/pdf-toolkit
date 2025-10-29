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
  
  if (args.length < 2) {
    console.error('Usage: pdf-split <input.pdf> <output.pdf> [--pages 1,3,5-7]');
    console.error('');
    console.error('Options:');
    console.error('  --pages    Page numbers to extract (1-based). Default: all pages');
    console.error('             Examples: "1,3,5" or "1-3,5,7-10"');
    process.exit(2);
  }

  const inputFile = args[0];
  const outputFile = args[1];
  
  let pageIndices = null;
  
  // Parse optional --pages flag
  const pagesIdx = args.indexOf('--pages');
  if (pagesIdx !== -1 && args[pagesIdx + 1]) {
    const rangeStr = args[pagesIdx + 1];
    try {
      pageIndices = parsePageRanges(rangeStr);
    } catch (err) {
      console.error('Error parsing --pages:', err.message);
      process.exit(2);
    }
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
