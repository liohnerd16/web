---
name: science-content-auto-adder
description: Automatically adds new science projects from a video URL. Use when provided with a YouTube or video link to research principles, create bilingual LaTeX explanations with diagrams, and update the database.
---

# Science Content Auto-Adder (GNZ)

## Overview
This skill automates the end-to-end process of adding new science experiments to **Green Night Zero (GNZ)**. It handles research, technical documentation, diagram generation, and system integration.

## Workflow

1. **Video Research**: Analyze the provided video URL to identify:
   - Project title and category.
   - Core scientific principles (laws of physics, chemical reactions, etc.).
   - Materials list and step-by-step assembly.
   - Source channel and original title.

2. **Technical Documentation (LaTeX)**:
   - Create entries in `server/database/latex-content.json` (keyed by title) with `en` and `vi` LaTeX content.
   - Use the [LaTeX Template](references/latex-template.md) for structure.
   - **MANDATORY**: Embed a Base64-encoded SVG diagram within the `\includegraphics` tag for the initial version.
   - **MANDATORY**: For external images (e.g., Google Drive), MUST use the proxy URL: `/api/proxy-image?url=...`.

3. **External Resources**:
   - Find 1-2 reputable reference links (Wikipedia, ScienceBuddies, etc.).
   - Find 2-3 affiliate links for key materials (Shopee/Lazada).

4. **Database Integration**:
   - Update `server/database/db.js` by adding the project to the `samples` array for persistence.
   - See [Database Schema](references/db-schema.md) for field details.
   - Run `node server/database/db.js` to apply changes and seed the database.

5. **Synchronization**:
   - Run `npm run sync-manifest` to auto-generate news updates (type='system') and update the project manifest.

## Guidelines
- **Safety First**: Always include a prominent `\subsection*{Safety Warning}` in LaTeX files.
- **Visuals**: Diagrams should be minimal SVG representations of the circuit or assembly.
- **Bilingual**: Ensure `titleVi`, `descriptionVi`, and `explanationVi` (raw) are accurate and natural.
