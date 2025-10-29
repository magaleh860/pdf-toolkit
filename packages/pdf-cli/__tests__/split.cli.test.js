import { describe, it, expect, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

describe('pdf-cli split command', () => {
  const testDir = path.join(__dirname, '../../../TestPDFFiles');
  const pdf1 = path.join(testDir, 'pdf1.pdf');
  const out = path.join(testDir, 'cli-split.pdf');
  const cli = path.join(__dirname, '../bin/split.js');

  afterAll(() => {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  });

  it('splits a PDF from CLI', () => {
  execSync(`node ${cli} ${pdf1} -p 1 -o ${out}`);
    expect(fs.existsSync(out)).toBe(true);
    const stats = fs.statSync(out);
    expect(stats.size).toBeGreaterThan(500);
  });

  it('fails with invalid page index', () => {
    expect(() => {
      execSync(`node ${cli} ${pdf1} -p 999 -o ${out}`);
    }).toThrow();
  });
});
