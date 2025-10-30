# PDF Toolkit

**Privacy-first PDF toolkit** — merge, split, rotate, and edit PDF files without uploading them to shady online services.  
Built with React, Node.js, and pdf-lib.

---

## Features
-  **Privacy-first**: all operations run 100% locally, no files leave your machine.
-  **Toolkit**: merge, split, rotate, and delete pages.
-  **Multiple interfaces**:
  - CLI (`pdf-cli`) for developers and automation
  - Web app (React + Vite) for quick visual use
  - Core library (`pdf-core`) for programmatic use

---

## Quick Start

### CLI

Run commands from the project root:

```bash
# Display help
node pdf

# Merge PDFs
node pdf merge output.pdf input1.pdf input2.pdf input3.pdf

# Split/extract specific pages (1-based page numbers)
node pdf split input.pdf output.pdf --pages 1,3,5-7

# Edit PDF: rotate and/or delete pages
node pdf edit input.pdf output.pdf --rotate 1:90,2:180 --delete 3,5-7
```

**Command Reference:**

| Command | Description | Example |
|---------|-------------|---------|
| `merge` | Combine multiple PDFs into one | `node pdf merge out.pdf file1.pdf file2.pdf` |
| `split` | Extract specific pages | `node pdf split in.pdf out.pdf --pages 1-3,5` |
| `edit`  | Rotate/delete pages | `node pdf edit in.pdf out.pdf --rotate 1:90 --delete 2` |

**Page number formats:**
- Single pages: `1,3,5`
- Ranges: `1-5` (pages 1 through 5)
- Combined: `1,3-5,7,10-12`
- All page numbers are **1-based** (first page = 1)

**Rotation angles:**
- `90` - rotate 90° clockwise
- `180` - rotate 180°
- `270` or `-90` - rotate 90° counter-clockwise

### Web UI

Start the development server:

```bash
cd apps/web-ui
pnpm dev
```

Then open http://localhost:5173 in your browser.

Features:
- Drag and drop PDFs
- Visual page thumbnails
- Dark/light mode
- Fully responsive

---

## Project Structure

This is a pnpm monorepo with workspace packages:

```
pdf-toolkit/
├── packages/
│   ├── pdf-core/        # Core PDF manipulation functions
│   └── pdf-cli/         # Command-line interface
├── apps/
│   ├── web-ui/          # React web application
│   └── api-service/     # (Future) REST API
└── pdf                  # CLI wrapper script
```

---

## Development

```bash
# Install dependencies
pnpm install

# Run web UI in dev mode
pnpm -F @pdf-toolkit/web-ui dev

# Build web UI for production
pnpm -F @pdf-toolkit/web-ui build

# Test CLI commands
node pdf merge test.pdf file1.pdf file2.pdf
```

---

## License

MIT

---

## Privacy

All PDF operations run entirely in your browser (web UI) or on your local machine (CLI). **No files are ever uploaded to any server.** Your documents stay private.
