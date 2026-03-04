const fs = require('fs');
const { marked } = require('marked');

const LINE_HEIGHT = 1.4; // keep in sync with --line-height in style.css

const renderer = new marked.Renderer();

renderer.paragraph = (token) => {
  const lines = token.text.split('\n');
  const formatted = lines.map(line => {
    if (/^\d{4}[-–]?\d*\s*\|/.test(line)) {
      const [year, ...rest] = line.split('|');
      const content = marked.parseInline(rest.join('|').trim());
      return `<span class="entry"><span class="entry-year">${year.trim()}</span><span class="entry-text">${content}</span></span>`;
    }
    return `<span class="entry-full">${marked.parseInline(line)}</span>`;
  });
  return `<p>${formatted.join('')}</p>`;
};

marked.use({ renderer });

const template = fs.readFileSync('template.html', 'utf-8');
const markdown = fs.readFileSync('content.md', 'utf-8');

// Split into sections by h1
const sections = [];
const parts = markdown.split(/^# (.+)$/m);

for (let i = 1; i < parts.length; i += 2) {
  sections.push({
    title: parts[i].trim(),
    slug: parts[i].trim().toLowerCase().replace(/\s+/g, '-'),
    content: marked.parse(parts[i + 1].trim())
  });
}

// Cascade timing
// name is delay 0 (set in CSS at 0.3s)
// each nav item steps by 0.3s after that
const baseDelay = 0.3;  // name delay
const step = 0.2;       // gap between each element

// Build nav — each item gets its own delay
const nav = sections.map((s, i) => {
  const delay = baseDelay + step * (i + 1);
  return `<button class="nav-item" data-section="${s.slug}" style="animation-delay: ${delay}s">${s.title}</button>`;
}).join('\n');

// Footer gets a delay after the last nav item
const footerDelay = baseDelay + step * (sections.length + 1);

// Build content panels
const content = sections.map((s, i) => {
  const top = `${i * LINE_HEIGHT}em`;
  return `<div class="section-panel" id="${s.slug}" style="top: ${top}">${s.content}</div>`;
}).join('\n');

// Inject into template
let output = template
  .replace('{{NAV}}', nav)
  .replace('{{CONTENT}}', content)
  .replace('{{FOOTER_DELAY}}', `${footerDelay}s`);

fs.writeFileSync('index.html', output);
console.log('✓ Built index.html from content.md');