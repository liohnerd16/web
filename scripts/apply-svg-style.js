/**
 * Applies or checks 18th-century scientific illustration style on Base64 SVGs in .tex files.
 * Usage:
 *   node scripts/apply-svg-style.js --all     Transform all non-styled SVGs
 *   node scripts/apply-svg-style.js --check   Only check, report un-styled files
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXPLANATIONS = path.join(ROOT, 'public', 'explanations');

const PARCHMENT_BG = '#F8F4E8';
const DARK_INK = '#3E2723';
const FONT_SERIF = "Georgia, 'Times New Roman', serif";

const HATCH_DEFS = `<defs>
  <pattern id="hatch-dense" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="4" stroke="${DARK_INK}" stroke-width="0.5" opacity="0.3"/>
  </pattern>
  <pattern id="hatch-light" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
    <line x1="0" y1="0" x2="0" y2="5" stroke="${DARK_INK}" stroke-width="0.4" opacity="0.2"/>
  </pattern>
  <pattern id="stipple" width="6" height="6" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="0.4" fill="${DARK_INK}" opacity="0.2"/>
    <circle cx="4" cy="3" r="0.3" fill="${DARK_INK}" opacity="0.15"/>
  </pattern>
</defs>`;

function styleIssues(svg) {
  const issues = [];
  if (!/fill\s*=\s*"#(?:EDE0C8|F8F4E8)"/i.test(svg))
    issues.push('missing parchment background (#EDE0C8 or #F8F4E8)');
  if (!/font-family\s*=\s*"[^"]*(?:Georgia|Times New Roman|serif)[^"]*"/i.test(svg))
    issues.push('missing serif font-family (Georgia/Times New Roman)');
  if (!/<pattern[^>]*id\s*=\s*"hatch/i.test(svg))
    issues.push('missing hatch pattern definitions');
  if (/font-family\s*=\s*"Arial"/i.test(svg))
    issues.push('uses Arial font (must use serif)');
  if (/(?:stroke|fill)\s*=\s*"(?:red|blue|green|yellow|orange|purple|pink)"/i.test(svg))
    issues.push('uses named bright color(s) instead of dark ink');
  return issues;
}

function addParchmentBg(svg, w, h) {
  const bw = parseInt(w, 10) || 400;
  const bh = parseInt(h, 10) || 300;
  const border = `<rect x="18" y="18" width="${bw - 36}" height="${bh - 36}" fill="none" stroke="${DARK_INK}" stroke-width="0.8"/><rect x="22" y="22" width="${bw - 44}" height="${bh - 44}" fill="none" stroke="${DARK_INK}" stroke-width="0.4"/><path d="M 18 18 L 28 18 L 18 28 Z M ${bw - 18} 18 L ${bw - 28} 18 L ${bw - 18} 28 Z M 18 ${bh - 18} L 28 ${bh - 18} L 18 ${bh - 28} Z M ${bw - 18} ${bh - 18} L ${bw - 28} ${bh - 18} L ${bw - 18} ${bh - 28} Z" fill="${DARK_INK}" opacity="0.5"/>`;
  svg = svg.replace(/<rect[^>]*fill\s*=\s*"#f8f9fa"[^>]*\/?>/gi, '');
  svg = svg.replace(/<rect[^>]*fill\s*=\s*"#f5f5f5"[^>]*\/?>/gi, '');
  svg = svg.replace(/<rect[^>]*fill\s*=\s*"#ffffff"[^>]*\/?>/gi, '');
  svg = svg.replace(/<rect[^>]*fill\s*=\s*"#fff"[^>]*\/?>/gi, '');
  svg = svg.replace(/(<svg[^>]*>)/i, `$1<rect width="${bw}" height="${bh}" fill="${PARCHMENT_BG}"/>${border}`);
  return svg;
}

function addHatchDefs(svg) {
  if (/<pattern[^>]*id\s*=\s*"hatch/i.test(svg)) return svg;
  svg = svg.replace(/(<svg[^>]*>)/i, `$1${HATCH_DEFS}`);
  return svg;
}

function fixFonts(svg) {
  svg = svg.replace(/font-family\s*=\s*"Arial"/gi, `font-family="${FONT_SERIF}"`);
  svg = svg.replace(/font-family\s*=\s*'Arial'/gi, `font-family='${FONT_SERIF}'`);
  return svg;
}

function fixColors(svg) {
  const map = {
    '#f44336': DARK_INK, '#f44': DARK_INK,
    '#ffeb3b': DARK_INK, '#2196f3': DARK_INK,
    '#e53e37': DARK_INK, '#b87333': DARK_INK,
    '#4a5568': DARK_INK,
    '#cccccc': '#aaaaaa',
    '#333333': DARK_INK, '#333': DARK_INK,
    '#444444': DARK_INK, '#444': DARK_INK,
    '#666666': DARK_INK, '#666': DARK_INK,
    '#999999': DARK_INK, '#999': DARK_INK,
    '#000000': '#222222', '#000': '#222222',
  };
  for (const [from, to] of Object.entries(map)) {
    const re = new RegExp(`(?:fill|stroke)\\s*=\\s*"${from}"`, 'gi');
    svg = svg.replace(re, (m) => {
      const attr = m.startsWith('fill') ? 'fill' : 'stroke';
      return `${attr}="${to}"`;
    });
  }
  // Named colors → dark ink
  svg = svg.replace(/(fill|stroke)\s*=\s*"red"/gi, `$1="${DARK_INK}"`);
  svg = svg.replace(/(fill|stroke)\s*=\s*"blue"/gi, `$1="${DARK_INK}"`);
  svg = svg.replace(/(fill|stroke)\s*=\s*"green"/gi, `$1="${DARK_INK}"`);
  svg = svg.replace(/(fill|stroke)\s*=\s*"yellow"/gi, `$1="${DARK_INK}"`);
  svg = svg.replace(/(fill|stroke)\s*=\s*"orange"/gi, `$1="${DARK_INK}"`);
  svg = svg.replace(/(fill|stroke)\s*=\s*"purple"/gi, `$1="${DARK_INK}"`);
  svg = svg.replace(/(fill|stroke)\s*=\s*"pink"/gi, `$1="${DARK_INK}"`);
  // Background colors
  svg = svg.replace(/fill\s*=\s*"#f8f9fa"/gi, `fill="${PARCHMENT_BG}"`);
  svg = svg.replace(/fill\s*=\s*"#f5f5f5"/gi, `fill="${PARCHMENT_BG}"`);
  svg = svg.replace(/fill\s*=\s*"#fff"/gi, `fill="${PARCHMENT_BG}"`);
  svg = svg.replace(/fill\s*=\s*"#ffffff"/gi, `fill="${PARCHMENT_BG}"`);
  return svg;
}

function italicizeText(svg) {
  svg = svg.replace(/<text\s/gi, '<text font-style="italic" ');
  return svg;
}

function transformSvg(svg) {
  const vb = svg.match(/viewBox\s*=\s*["']\s*(\d+)\s+\d+\s+(\d+)\s+(\d+)/i);
  const w = vb ? vb[2] : '400';
  const h = vb ? vb[3] : '300';
  svg = addParchmentBg(svg, w, h);
  svg = addHatchDefs(svg);
  svg = fixFonts(svg);
  svg = fixColors(svg);
  svg = italicizeText(svg);
  return svg;
}

function decodeB64Svg(b64string) {
  const clean = b64string.replace(/^data:image\/svg\+xml;base64,/, '');
  return Buffer.from(clean, 'base64').toString('utf8');
}

function encodeB64Svg(xml) {
  return 'data:image/svg+xml;base64,' + Buffer.from(xml, 'utf8').toString('base64');
}

function processFile(filePath, doFix) {
  const text = fs.readFileSync(filePath, 'utf8');
  const re = /\\includegraphics\s*(?:\[([^\]]*)\])?\s*\{([^}]+)\}/g;
  const results = [];
  let result = text;
  let changed = false;

  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    const assetPath = m[2].trim();
    if (!assetPath.startsWith('data:image/svg+xml;base64,')) continue;
    const label = m[1] || '';
    const svg = decodeB64Svg(assetPath);
    const issues = styleIssues(svg);

    if (doFix && issues.length > 0) {
      const newSvg = transformSvg(svg);
      const newB64 = encodeB64Svg(newSvg);
      result = result.replace(m[0], `\\includegraphics[${label}]{${newB64}}`);
      changed = true;
    } else if (!doFix && issues.length > 0) {
      results.push({ label, issues });
    }
  }

  if (doFix && changed) {
    fs.writeFileSync(filePath, result, 'utf8');
    return { fixed: true };
  }
  return { issues: results };
}

function main() {
  const mode = process.argv[2];
  if (mode !== '--all' && mode !== '--check') {
    console.error('Usage: node scripts/apply-svg-style.js --all | --check');
    process.exit(1);
  }

  const doFix = mode === '--all';
  const texFiles = fs.readdirSync(EXPLANATIONS)
    .filter(f => f.endsWith('.tex'))
    .map(f => path.join(EXPLANATIONS, f));

  let fixedCount = 0;
  let failFiles = [];

  for (const tf of texFiles) {
    const rel = path.relative(ROOT, tf);
    const res = processFile(tf, doFix);

    if (doFix) {
      if (res.fixed) { console.log(`[FIX]  ${rel}`); fixedCount++; }
    } else {
      if (res.issues.length > 0) {
        console.log(`[FAIL] ${rel}`);
        for (const r of res.issues) {
          console.log(`       "${r.label}": ${r.issues.join(', ')}`);
        }
        failFiles.push(rel);
      }
    }
  }

  if (doFix) {
    console.log(`\nFixed ${fixedCount} file(s).`);
    if (fixedCount > 0) console.log('Run `npm run check-style` to verify.');
  } else {
    const pass = texFiles.length - failFiles.length;
    console.log(`\nStyle check: ${pass}/${texFiles.length} files pass.`);
    if (failFiles.length > 0) {
      console.log('Run `node scripts/apply-svg-style.js --all` to auto-fix.');
      process.exit(1);
    }
  }
}

module.exports = { transformSvg, decodeB64Svg, encodeB64Svg, styleIssues };

if (require.main === module) {
  main();
}
