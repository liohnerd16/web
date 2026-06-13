import { minify } from 'terser';
import CleanCSS from 'clean-css';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = (f) => join(root, 'public', f);

function walkSync(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkSync(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  // Minify JS
  const jsCode = readFileSync(src('script.js'), 'utf8');
  const jsResult = await minify(jsCode, {
    compress: { drop_console: false },
    mangle: { reserved: ['I18N'] }
  });
  writeFileSync(src('script.min.js'), jsResult.code);
  console.log(`JS: ${jsCode.length} B -> ${jsResult.code.length} B`);

  // Minify CSS
  const cssCode = readFileSync(src('styles.css'), 'utf8');
  const cssResult = new CleanCSS({ level: 2 }).minify(cssCode);
  writeFileSync(src('styles.min.css'), cssResult.styles);
  console.log(`CSS: ${cssCode.length} B -> ${cssResult.styles.length} B`);

  // Optimize SVGs
  const svgFiles = walkSync(join(root, 'public', 'assets', 'images')).filter(f => f.endsWith('.svg'));
  for (const f of svgFiles) {
    let svg = readFileSync(f, 'utf8');
    const originalSize = svg.length;
    svg = svg
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s+/g, '" ')
      .replace(/\s+"/g, '"')
      .trim();
    writeFileSync(f, svg);
    console.log(`SVG ${f}: ${originalSize} B -> ${svg.length} B`);
  }
}

main().catch(console.error);
