const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

async function mergePDFs() {
  // Load the PDFs
  const pdf1Bytes = fs.readFileSync("pdf1.pdf");
  const pdf2Bytes = fs.readFileSync("pdf2.pdf");

  const pdf1 = await PDFDocument.load(pdf1Bytes);
  const pdf2 = await PDFDocument.load(pdf2Bytes);

  // Create a new PDF
  const mergedPdf = await PDFDocument.create();

  // Copy all pages from pdf1
  const pdf1Pages = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
  pdf1Pages.forEach((page) => mergedPdf.addPage(page));

  // Copy all pages from pdf2
  const pdf2Pages = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
  pdf2Pages.forEach((page) => mergedPdf.addPage(page));

  // Save the merged PDF
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync("Receipts.pdf", mergedPdfBytes);

  console.log("✅ Successfully merged into merged.pdf");
}

mergePDFs();
