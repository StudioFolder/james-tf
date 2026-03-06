const fs = require('fs');
const { marked } = require('marked');

const renderer = new marked.Renderer();

renderer.paragraph = (token) => {
  const lines = token.text.split('\n');
  const formatted = lines.map(line => {
    if (/^\d{2}\s*\|/.test(line)) {
      const parts = line.split('|');
      const id = parts[0].trim();
      const src = parts[1].trim();
      const caption = parts[2] ? marked.parseInline(parts[2].trim()) : '';
      return `<span class="entry-portrait" data-id="${id}" data-src="${src}"><span class="entry-trigger">View</span>, <a class="entry-download" href="${src}" download>Download</a><span class="entry-caption">${caption}</span></span>`;
    }
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

// Split into sections by heading level
const primary = [];
const secondary = [];

const sectionRegex = /^(#{1,2}) (.+)$/gm;
const parts = markdown.split(sectionRegex);

for (let i = 1; i < parts.length; i += 3) {
  const level = parts[i].trim();
  const title = parts[i + 1].trim();
  const body = parts[i + 2] || '';
  const section = {
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    content: marked.parse(body.trim())
  };
  if (level === '#') primary.push(section);
  else if (level === '##') secondary.push(section);
}

const specialSlugs = ['footer', 'bio-short', 'bio-medium', 'bio-long'];
const footerSection = secondary.find(s => s.slug === 'footer');
const bioShort = secondary.find(s => s.slug === 'bio-short');
const bioMedium = secondary.find(s => s.slug === 'bio-medium');
const bioLong = secondary.find(s => s.slug === 'bio-long');
const navPrimary = primary.filter(s => !specialSlugs.includes(s.slug));
const navSecondary = secondary.filter(s => !specialSlugs.includes(s.slug));
const navSections = [...navPrimary, ...navSecondary];

if (!bioShort || !bioMedium || !bioLong) {
  console.warn('⚠ One or more bio sections missing from content.md');
}

// Cascade timing
// name is delay 0 (set in CSS at 0.3s)
// each nav item steps by 0.2s after that
const baseDelay = 0.3;  // name delay
const step = 0.2;

// Full cascade sequence: name(0) → bio(1) → bio-controls(2) → primary nav → secondary nav → footer
const nameDelay    = baseDelay + step * 0;
const bioDelay     = baseDelay + step * 1;
const bioCtrlDelay = baseDelay + step * 2;
const navOffset    = 3;

const navPrimaryHtml = navPrimary.map((s, i) => {
  const delay = baseDelay + step * (navOffset + i);
  return `<div class="nav-row"><button class="nav-item" data-section="${s.slug}" aria-expanded="false" style="animation-delay: ${delay}s"><span class="nav-indicator">–</span><span class="nav-label">${s.title}</span></button><div class="section-panel" id="${s.slug}">${s.content}</div></div>`;
}).join('\n');

const navSecondaryHtml = navSecondary.map((s, i) => {
  const delay = baseDelay + step * (navOffset + navPrimary.length + i);
  return `<div class="nav-row"><button class="nav-item" data-section="${s.slug}" aria-expanded="false" style="animation-delay: ${delay}s"><span class="nav-indicator">–</span><span class="nav-label">${s.title}</span></button><div class="section-panel" id="${s.slug}">${s.content}</div></div>`;
}).join('\n');

const footerDelay = baseDelay + step * (navOffset + navSections.length);

// Footer content
const footerContent = footerSection ? footerSection.content : '';

// Inject into template
function wordCount(html) {
  return html.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
}

const bioShortContent = bioShort ? bioShort.content : '';
const bioMediumContent = bioMedium ? bioMedium.content : '';
const bioLongContent = bioLong ? bioLong.content : '';
const bioShortWords = bioShort ? wordCount(bioShortContent) : 0;
const bioMediumWords = bioMedium ? wordCount(bioMediumContent) : 0;
const bioLongWords = bioLong ? wordCount(bioLongContent) : 0;

let output = template
  .replace('{{NAV_PRIMARY}}', navPrimaryHtml)
  .replace('{{NAV_SECONDARY}}', navSecondaryHtml)
  .replace('{{NAME_DELAY}}', `${nameDelay}s`)
  .replace('{{BIO_DELAY}}', `${bioDelay}s`)
  .replace('{{BIO_CONTROLS_DELAY}}', `${bioCtrlDelay}s`)
  .replace('{{FOOTER_DELAY}}', `${footerDelay}s`)
  .replace('{{FOOTER}}', footerContent)
  .replace('{{BIO_SHORT}}', bioShortContent)
  .replace('{{BIO_MEDIUM}}', bioMediumContent)
  .replace('{{BIO_LONG}}', bioLongContent)
  .replace('{{BIO_SHORT_WORDS}}', bioShortWords)
  .replace('{{BIO_MEDIUM_WORDS}}', bioMediumWords)
  .replace('{{BIO_LONG_WORDS}}', bioLongWords);

fs.writeFileSync('index.html', output);
console.log('✓ Built index.html from content.md');