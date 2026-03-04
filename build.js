const fs = require('fs');
const { marked } = require('marked');

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

// Build nav
const nav = sections.map(s =>
  `<button class="nav-item" data-section="${s.slug}">${s.title}</button>`
).join('\n');

// Build content panels
const content = sections.map(s =>
  `<div class="section-panel" id="${s.slug}">${s.content}</div>`
).join('\n');

// Inject into template
const output = template
  .replace('{{NAV}}', nav)
  .replace('{{CONTENT}}', content);

fs.writeFileSync('index.html', output);
console.log('✓ Built index.html from content.md');
