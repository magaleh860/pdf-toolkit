const fs = require('fs');
const { PDFDocument, degrees } = require('pdf-lib');

async function mergeFiles(inputFiles, outPath) {
  if (!Array.isArray(inputFiles) || inputFiles.length === 0) {
    throw new Error('inputFiles must be a non-empty array of file paths');
  }

  const mergedPdf = await PDFDocument.create();

  for (const fp of inputFiles) {
    const bytes = fs.readFileSync(fp);
    const src = await PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(src, src.getPageIndices());
    pages.forEach(p => mergedPdf.addPage(p));
  }

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(outPath, mergedBytes);
  return outPath;
}

async function splitPages(inputFile, outPath, pageIndices) {
  if (!inputFile || !outPath) {
    throw new Error('inputFile and outPath are required');
  }
  if (!Array.isArray(pageIndices) || pageIndices.length === 0) {
    throw new Error('pageIndices must be a non-empty array of page numbers (0-based)');
  }

  const bytes = fs.readFileSync(inputFile);
  const srcPdf = await PDFDocument.load(bytes);
  const totalPages = srcPdf.getPageCount();

  // Validate page indices
  for (const idx of pageIndices) {
    if (idx < 0 || idx >= totalPages) {
      throw new Error(`Invalid page index ${idx}. Document has ${totalPages} pages (0-${totalPages - 1})`);
    }
  }

  const outPdf = await PDFDocument.create();
  const copiedPages = await outPdf.copyPages(srcPdf, pageIndices);
  copiedPages.forEach(p => outPdf.addPage(p));

  const outBytes = await outPdf.save();
  fs.writeFileSync(outPath, outBytes);
  return outPath;
}

async function editPages(inputFile, outPath, options = {}) {
  if (!inputFile || !outPath) {
    throw new Error('inputFile and outPath are required');
  }

  const { rotations = {}, deletions = [] } = options;

  const bytes = fs.readFileSync(inputFile);
  const pdfDoc = await PDFDocument.load(bytes);
  const totalPages = pdfDoc.getPageCount();

  // Apply rotations: { pageIndex: degrees, ... }
  for (const [pageIdxStr, rotation] of Object.entries(rotations)) {
    const pageIdx = parseInt(pageIdxStr, 10);
    if (pageIdx < 0 || pageIdx >= totalPages) {
      throw new Error(`Invalid page index ${pageIdx} for rotation. Document has ${totalPages} pages (0-${totalPages - 1})`);
    }
    const page = pdfDoc.getPage(pageIdx);
    const normalized = ((rotation % 360) + 360) % 360;
    page.setRotation(degrees(normalized));
  }

  // Remove pages (reverse order to avoid index shifting)
  const sortedDeletions = Array.from(new Set(deletions)).sort((a, b) => b - a);
  for (const idx of sortedDeletions) {
    if (idx < 0 || idx >= totalPages) {
      throw new Error(`Invalid page index ${idx} for deletion. Document has ${totalPages} pages (0-${totalPages - 1})`);
    }
    pdfDoc.removePage(idx);
  }

  const outBytes = await pdfDoc.save();
  fs.writeFileSync(outPath, outBytes);
  return outPath;
}

module.exports = { mergeFiles, splitPages, editPages };
