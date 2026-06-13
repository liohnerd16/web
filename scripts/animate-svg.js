const fs = require('fs');
const path = require('path');

const ANIMATION_DEFS = `<style>
@keyframes flow {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
@keyframes dash {
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
}
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
.animate-flow { animation: flow 2s linear infinite; }
.animate-flow-reverse { animation: flow 2s linear infinite; animation-direction: reverse; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-pulse-fast { animation: pulse 1s ease-in-out infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-blink { animation: blink 1.5s step-end infinite; }
.animate-dash { animation: dash 1.5s linear infinite; stroke-dasharray: 10 6; }
.animate-breathe { animation: breathe 4s ease-in-out infinite; }
</style>`;

const SPIN_KW = /(?:motor|engine|turbine|fan|propeller|rotor|wheel|gear|M₁|M₂|M₃|M₄)/i;
const FLOW_KW = /(?:arrow|flow|current|stream|gas|liquid|pipe|tubus|fluxus|fluid)/i;
const PULSE_KW = /(?:flame|fire|heat|spark|light|glow|active|warning|danger)/i;
const FLOAT_KW = /(?:bubble|particle|gas|smoke|steam|vapor|fumi|aer)/i;
const BLINK_KW = /(?:indicator|led|signal|status|alert|nota)/i;

function textNear(svg, index, radius) {
  const start = Math.max(0, index - radius);
  const end = Math.min(svg.length, index + radius);
  const ctx = svg.slice(start, end);
  const texts = [];
  const re = /<text[^>]*>([^<]*)<\/text>/gi;
  let m;
  while ((m = re.exec(ctx)) !== null) {
    texts.push(m[1]);
  }
  return texts.join(' ');
}

function extractSvgCoords(tag) {
  const cx = parseFloat((tag.match(/cx\s*=\s*"([\d.]+)"/i) || [])[1]);
  const cy = parseFloat((tag.match(/cy\s*=\s*"([\d.]+)"/i) || [])[1]);
  return { cx, cy };
}

function addClass(tag, cls, style) {
  if (tag.includes('class=')) {
    return tag.replace(/class\s*=\s*"([^"]*)"/, (m, existing) => {
      if (existing.includes(cls)) return m;
      return `class="${existing} ${cls}"`;
    });
  }
  const styleAttr = style ? ` style="${style}"` : '';
  return tag.replace(/(\/?\s*>)$/, ` class="${cls}"${styleAttr}$1`);
}

function detectElements(svg) {
  const additions = [];

  svg.replace(/<(line|path|circle|rect|polygon|polyline|ellipse)[^>]*\/?>/gi, (match, tagName) => {
    const idx = svg.indexOf(match);
    const texts = textNear(svg, idx, 250);
    const hasArrow = /marker-end\s*=\s*"url\(#[^"]*arrow/i.test(match);

    if (hasArrow && (FLOW_KW.test(texts) || /dasharray/.test(match))) {
      const cls = 'animate-flow';
      const replaced = addClass(match, cls);
      if (replaced !== match) additions.push({ from: match, to: replaced });
      return;
    }

    if (tagName === 'circle' || tagName === 'ellipse') {
      const r = parseInt((match.match(/[rc]\s*=\s*"(\d+)"/i) || [])[1], 10);

      if (r && r >= 12 && r <= 30 && SPIN_KW.test(texts)) {
        const { cx, cy } = extractSvgCoords(match);
        const origin = (cx && cy) ? `transform-origin:${cx}px ${cy}px` : 'transform-origin:center';
        if (!match.includes('animate-spin')) {
          const replaced = addClass(match, 'animate-spin', origin);
          if (replaced !== match) additions.push({ from: match, to: replaced });
        }
        return;
      }

      if (r && r <= 8 && FLOAT_KW.test(texts)) {
        if (!match.includes('animate-float')) {
          const replaced = addClass(match, 'animate-float');
          if (replaced !== match) additions.push({ from: match, to: replaced });
        }
        return;
      }

      if (r && r <= 5 && BLINK_KW.test(texts)) {
        if (!match.includes('animate-blink')) {
          const replaced = addClass(match, 'animate-blink');
          if (replaced !== match) additions.push({ from: match, to: replaced });
        }
        return;
      }
    }

    if (tagName === 'circle' || tagName === 'ellipse') {
      const r = parseInt((match.match(/[rc]\s*=\s*"(\d+)"/i) || [])[1], 10);
      if (r && r <= 6 && PULSE_KW.test(texts)) {
        if (!match.includes('animate-pulse')) {
          const replaced = addClass(match, 'animate-pulse-fast');
          if (replaced !== match) additions.push({ from: match, to: replaced });
        }
        return;
      }
    }

    if (tagName === 'rect' && PULSE_KW.test(texts)) {
      if (!match.includes('animate-pulse')) {
        const replaced = addClass(match, 'animate-pulse');
        if (replaced !== match) additions.push({ from: match, to: replaced });
      }
      return;
    }

    if (hasArrow) {
      const cls = 'animate-dash';
      if (!match.includes(cls)) {
        const replaced = addClass(match, cls);
        if (replaced !== match) additions.push({ from: match, to: replaced });
      }
      return;
    }
  });

  return additions;
}

function animateSvg(svg) {
  if (/<style[^>]*>[\s\S]*?@keyframes\s+(?:flow|spin|pulse|float|blink|dash|breathe)/.test(svg)) {
    return svg;
  }

  const insertPos = svg.indexOf('</defs>');
  if (insertPos !== -1) {
    svg = svg.slice(0, insertPos + 7) + ANIMATION_DEFS + svg.slice(insertPos + 7);
  } else {
    const svgTagEnd = svg.indexOf('>', svg.indexOf('<svg'));
    svg = svg.slice(0, svgTagEnd + 1) + '\n' + ANIMATION_DEFS + svg.slice(svgTagEnd + 1);
  }

  const additions = detectElements(svg);
  for (const a of additions) {
    if (a.from && a.to) {
      svg = svg.replace(a.from, a.to);
    }
  }

  return svg;
}

function processFile(filePath, dryRun) {
  const svg = fs.readFileSync(filePath, 'utf8');
  const result = animateSvg(svg);
  const changed = result !== svg;

  if (dryRun) {
    return { changed };
  }

  if (changed) {
    fs.writeFileSync(filePath, result, 'utf8');
    return { changed: true };
  }
  return { changed: false };
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--check');
  const singleFile = args.find(a => a.endsWith('.svg') && !a.startsWith('-'));

  let files = [];
  if (singleFile) {
    if (!fs.existsSync(singleFile)) {
      const dir = path.join(__dirname, '..', 'public', 'assets', 'images', 'projects');
      files = [path.join(dir, singleFile)];
    } else {
      files = [singleFile];
    }
  } else {
    const dir = path.join(__dirname, '..', 'public', 'assets', 'images', 'projects');
    files = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).map(f => path.join(dir, f));
  }

  let changedCount = 0;
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const result = processFile(f, dryRun);
    const rel = path.relative(path.join(__dirname, '..'), f);
    if (result.changed) {
      if (dryRun) {
        console.log(`[WOULD_ANIMATE] ${rel}`);
      } else {
        console.log(`[ANIMATED] ${rel}`);
      }
      changedCount++;
    }
  }

  if (dryRun) {
    console.log(`\n${changedCount} file(s) would be animated.`);
    if (changedCount > 0) {
      console.log('Run `node scripts/animate-svg.js` to apply animations.');
    }
  } else {
    console.log(`\nAnimated ${changedCount} file(s).`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { animateSvg };
