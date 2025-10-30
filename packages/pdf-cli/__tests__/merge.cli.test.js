import { describe, it, expect, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

describe('pdf-cli merge command', () => {
  const testDir = path.join(__dirname, '../../../TestPDFFiles');
  const pdf1 = path.join(testDir, 'pdf1.pdf');
  const pdf2 = path.join(testDir, 'pdf2.pdf');
  const out = path.join(testDir, 'cli-merged.pdf');
  const cli = path.join(__dirname, '../bin/merge.js');

  afterAll(() => {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  });

  it('merges two PDFs from CLI', () => {
    execSync(`node ${cli} ${pdf1} ${pdf2} -o ${out}`);
    expect(fs.existsSync(out)).toBe(true);
    const stats = fs.statSync(out);
    expect(stats.size).toBeGreaterThan(1000);
  });

  it('fails with missing file', () => {
    const missing = path.join(testDir, 'does-not-exist.pdf');
    expect(() => {
      execSync(`node ${cli} ${missing} ${pdf2} -o ${out}`);
    }).toThrow();
  });

  it('merges single PDF (should copy)', () => {
    execSync(`node ${cli} ${pdf1} -o ${out}`);
    expect(fs.existsSync(out)).toBe(true);
    fs.unlinkSync(out);
  });

  it('fails with no output flag', () => {
    expect(() => {
      execSync(`node ${cli} ${pdf1} ${pdf2}`);
    }).toThrow();
  });
});
