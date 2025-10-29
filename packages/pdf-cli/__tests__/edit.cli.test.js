import { describe, it, expect, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

describe('pdf-cli edit command', () => {
  const testDir = path.join(__dirname, '../../../TestPDFFiles');
  const pdf1 = path.join(testDir, 'pdf1.pdf');
  const out = path.join(testDir, 'cli-edit.pdf');
  const cli = path.join(__dirname, '../bin/edit.js');

  afterAll(() => {
    if (fs.existsSync(out)) fs.unlinkSync(out);
  });

  it('rotates a page from CLI', () => {
  execSync(`node ${cli} ${pdf1} --rotate 1:90 -o ${out}`);
    expect(fs.existsSync(out)).toBe(true);
    const stats = fs.statSync(out);
    expect(stats.size).toBeGreaterThan(500);
  });

  it('fails with invalid page index for rotate', () => {
    expect(() => {
      execSync(`node ${cli} ${pdf1} --rotate 999:90 -o ${out}`);
    }).toThrow();
  });

  it('fails with no --rotate', () => {
    expect(() => {
      execSync(`node ${cli} ${pdf1} -o ${out}`);
    }).toThrow();
  });

  it('fails with invalid rotation value', () => {
    expect(() => {
      execSync(`node ${cli} ${pdf1} --rotate 1:abc -o ${out}`);
    }).toThrow();
  });

  it('fails with no output flag', () => {
    expect(() => {
      execSync(`node ${cli} ${pdf1} --rotate 1:90`);
    }).toThrow();
  });
});
