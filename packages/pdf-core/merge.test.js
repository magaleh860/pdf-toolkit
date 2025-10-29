import { describe, it, expect, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { mergeFiles, splitPages, editPages } from './index.js';

describe('PDF Core', () => {
  const testDir = path.join(__dirname, '../../TestPDFFiles');
  const pdf1 = path.join(testDir, 'pdf1.pdf');
  const pdf2 = path.join(testDir, 'pdf2.pdf');
  const out = path.join(testDir, 'test-merged.pdf');

  afterAll(() => {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  });

  it('merges two PDFs', async () => {
    await mergeFiles([pdf1, pdf2], out);
    expect(fs.existsSync(out)).toBe(true);
    const stats = fs.statSync(out);
    expect(stats.size).toBeGreaterThan(1000);
  });

  it('splits a PDF', async () => {
    const splitOut = path.join(testDir, 'test-split.pdf');
    await splitPages(pdf1, splitOut, [0]);
    expect(fs.existsSync(splitOut)).toBe(true);
    fs.unlinkSync(splitOut);
  });

  it('edits a PDF (rotate)', async () => {
    const editOut = path.join(testDir, 'test-edit.pdf');
    await editPages(pdf1, editOut, { rotations: { 0: 90 } });
    expect(fs.existsSync(editOut)).toBe(true);
    fs.unlinkSync(editOut);
  });

  it('throws on missing file for merge', async () => {
    const missing = path.join(testDir, 'does-not-exist.pdf');
    await expect(mergeFiles([missing, pdf2], out)).rejects.toThrow();
  });

  it('throws on invalid split page index', async () => {
    const splitOut = path.join(testDir, 'test-split-invalid.pdf');
    await expect(splitPages(pdf1, splitOut, [999])).rejects.toThrow();
  });

  it('throws on invalid edit page index', async () => {
    const editOut = path.join(testDir, 'test-edit-invalid.pdf');
    await expect(editPages(pdf1, editOut, { rotations: { 999: 90 } })).rejects.toThrow();
  });

  it('merges single PDF (should copy)', async () => {
    const singleOut = path.join(testDir, 'test-single-merged.pdf');
    await mergeFiles([pdf1], singleOut);
    expect(fs.existsSync(singleOut)).toBe(true);
    fs.unlinkSync(singleOut);
  });

  it('splits with empty indices (should fail or produce empty)', async () => {
    const splitOut = path.join(testDir, 'test-split-empty.pdf');
    await expect(splitPages(pdf1, splitOut, [])).rejects.toThrow();
  });

  it('edit with no changes (should copy)', async () => {
    const editOut = path.join(testDir, 'test-edit-noop.pdf');
    await editPages(pdf1, editOut, {});
    expect(fs.existsSync(editOut)).toBe(true);
    fs.unlinkSync(editOut);
  });
});
