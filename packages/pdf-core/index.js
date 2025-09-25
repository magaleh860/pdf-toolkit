const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

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

module.exports = { mergeFiles };
