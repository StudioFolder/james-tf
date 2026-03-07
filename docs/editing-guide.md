# Editing your website content

All content on james.tf is managed through a single file: **`content.md`** in your GitHub repository. This is the only file you need to touch. Changes go live automatically within about 30 seconds of saving.

---

## How to edit

1. Go to [github.com/StudioFolder/james-tf/blob/master/content.md](https://github.com/StudioFolder/james-tf/blob/master/content.md)
2. Click the **pencil icon** (top right of the file view) to edit
3. Make your changes
4. When done, scroll to the bottom, write a brief note describing what you changed (e.g. *"Add new writing entry"*), and click **Commit changes**

That's it. The site rebuilds and updates automatically.

---

## The structure of the file

The file is divided into named sections. Each section corresponds to a part of the website:

- `## bio-short`, `## bio-medium`, `## bio-long` — your three bio versions
- `# Projects`, `# Writing`, `# Press` — the main navigation sections
- `## Speaking`, `## Contact`, `## Portrait` — the secondary navigation sections
- `## footer` — the footer text

**Do not rename or delete these section headings.** The website depends on them.

---

## Adding or editing entries

Most content uses this format — a year, a pipe character, then the content:

```
2026 | Article title, *Publication Name*
```

For a linked title:

```
2026 | [Article title](https://url.com), *Publication Name*
```

For a year range:

```
2025-27 | Project title, Institution (City)
```

A few things to keep in mind:
- Always use ` | ` (space, pipe, space) to separate the year from the content
- Put publication names in italics by wrapping them in `*asterisks*`
- Add new entries at the **top** of the relevant section, so the most recent appears first
- Each entry should be on its own line

---

## Formatting

| What you want | How to write it |
|---|---|
| *Italic* | `*text*` |
| [A link](https://url.com) | `[text](https://url.com)` |
| *Italic link* | `[*text*](https://url.com)` |

---

## Editing the bio

The bio has three versions (short, medium, long) used by the `–` / `+` controls on the site. Edit each one independently under its heading. Normal paragraphs — no year/pipe format needed here.

To create a visible empty line between two paragraphs (as in the medium and long versions), end the first paragraph with two spaces followed by two blank lines:

```
First paragraph ending with two spaces  
  
Second paragraph starting here
```

A single blank line between paragraphs will not produce the empty line gap on the site — you need the two trailing spaces on the line above.

---

## Changing the portrait

The portrait section in `content.md` looks like this:

```
01 | /assets/images/james-tf-portrait-01.jpg | Caption text
```

The three parts are: an index number, the image path, and a caption. The site automatically generates a lightweight preview version of the image for display, while keeping the original available for download.

To update the portrait:

1. Upload the new hi-res image (JPG) to `assets/images/` in the repository — click **Add file → Upload files** from the repository root
2. If there is an existing preview file (same name with `-preview` before the extension, e.g. `james-tf-portrait-01-preview.jpg`), delete it from `assets/images/` — otherwise the old preview will persist
3. Update the filename in `content.md` under `## Portrait` to match the new file
4. Commit both changes — the site will regenerate the preview automatically on deploy

The caption supports basic formatting including line breaks written as `<br>`.

---

## What not to touch

- `index.html` — generated automatically, do not edit
- `template.html`, `build.js`, `style.css` — site code, leave to Studio Folder
- The section headings themselves (lines starting with `#` or `##`)

If something looks wrong after a commit, don't worry — every change is saved in the history and can be undone. Just get in touch with Studio Folder.

---

*Guide by Studio Folder, March 2026*
