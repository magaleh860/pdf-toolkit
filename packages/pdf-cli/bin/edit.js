#!/usr/bin/env node
const { editPages } = require('@pdf-toolkit/pdf-core');

function parseRotations(rotateStr) {
  // Parse "1:90,2:180,3:-90" into { 0: 90, 1: 180, 2: -90 } (0-based indices)
  const rotations = {};
  const parts = rotateStr.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed.includes(':')) {
      throw new Error(`Invalid rotation format: ${trimmed}. Expected "page:degrees"`);
    }
    const [pageStr, degreesStr] = trimmed.split(':');
    const pageNum = parseInt(pageStr.trim(), 10);
    const degreesVal = parseInt(degreesStr.trim(), 10);
    
    if (isNaN(pageNum) || pageNum < 1) {
      throw new Error(`Invalid page number in rotation: ${pageStr}`);
    }
    if (isNaN(degreesVal)) {
      throw new Error(`Invalid degrees in rotation: ${degreesStr}`);
    }
    
    rotations[pageNum - 1] = degreesVal; // Convert to 0-based
  }
  
  return rotations;
}

function parseDeletions(deleteStr) {
  // Parse "1,3,5-7" into [0,2,4,5,6] (0-based indices)
  const indices = [];
  const parts = deleteStr.split(',');
  
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
  let rotations = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-o' && args[i + 1]) {
      outputFile = args[i + 1];
      i++;
    } else if (args[i] === '--rotate' && args[i + 1]) {
      try {
        rotations = parseRotations(args[i + 1]);
      } catch (err) {
        console.error('Error parsing --rotate:', err.message);
        process.exit(2);
      }
      i++;
    } else if (!inputFile) {
      inputFile = args[i];
    }
  }
  if (!inputFile || !outputFile) {
    console.error('Usage: pdf-edit <input.pdf> --rotate <page:deg,...> -o <output.pdf>');
    process.exit(2);
  }
  const options = {
    rotations: rotations || {},
    deletions: []
  };
  if (Object.keys(options.rotations).length === 0 && options.deletions.length === 0) {
    console.error('Error: At least one of --rotate or --delete must be specified');
    process.exit(2);
  }
  try {
    await editPages(inputFile, outputFile, options);
    const actions = [];
    if (Object.keys(options.rotations).length > 0) {
      actions.push(`${Object.keys(options.rotations).length} rotation(s)`);
    }
    if (options.deletions.length > 0) {
      actions.push(`${options.deletions.length} deletion(s)`);
    }
    console.log(`✅ Applied ${actions.join(' and ')} -> ${outputFile}`);
  } catch (err) {
    console.error('Error editing PDF:', err.message || err);
    process.exit(1);
  }
}

if (require.main === module) main();
