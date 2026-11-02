# Mimansa website v1: developer handoff

Plain HTML, CSS and a little JavaScript. No build step, no framework, no server code. Every link is relative, so the folder works at the domain root or in a subfolder.

**To preview:** open a terminal in this folder and run `python3 -m http.server 8000`, then open http://localhost:8000.
**To host:** upload the whole folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, S3, cPanel). The domain is www.mimansa.work.

Prepared 30 Oct 2026 from the reviewed draft that Vivek, Gaurav and Himanshu signed off.

---

## 1. Rules from the founders (please keep)

- **Everything on the site is free.** Nothing is locked behind a login. "Join" is only for the fortnightly email and for following what a reader sent in.
- **Do not change the authors' words** in the articles (`articles/article-NN.html`). Fix layout only.
- **Kyun, the loris mascot:**
  - Never put him in a box, card, circle or badge.
  - Never put green under him.
  - He stands on his own thin ink ground line.
  - No line may pass through his body. Where he stands in a drawn scene, use the solid-body version: `k/raising-solid.png` on the home page door.
  - He stays off the resignation story page (`stories/the-only-one-on-your-side.html`).
- **Look:**
  - Paper `#F6F2E9`, sand `#EEE7DA`, cards `#FFFDF8`, ink `#24211C`, muted `#6C665C`, rules `#DCD4C4`, vermilion `#E0542A` / `#B9411A`.
  - Fonts (Google Fonts): Newsreader for text, IBM Plex Mono for small labels, Tiro Devanagari Hindi for the small Devanagari words.
  - English first; Devanagari only as a small second line.
  - Illustrations show objects only, never people.
- **Always use the real logo files**: `logo.png` and `logo-dark.png` (copies are in `articles/assets/`, originals in `assets/brand/`). Never redraw or retype the logo.

---

## 2. What is in the folder

| Path | What it is |
|---|---|
| `index.html` | Home: night hero → I Stories → II Articles → III Why Mimansa and how Kyun asks → IV Join |
| `about.html` | The name, the mark, Kyun, the three steps, the founders |
| `articles/index.html` + `article-01…10.html` | 10 articles. Each has a 2-minute version and the full article, switched in the reading bar (`articles/assets/article.js`) |
| `articles/assets/` | Article styles and script, logos, Kyun drawings (`kyun/*.webp`) |
| `stories/index.html` | 8 video stories. Story 02 links to the finished film page; the other 7 are "Video · soon" placeholders |
| `stories/the-only-one-on-your-side.html` | Story 02: trailer, full film, what happened, chapters, lessons |
| `media/` | `film.mp4` (480p draft copy, 13 MB), `reel.mp4` (trailer), `story-poster.jpg` |
| `toolkits/index.html` + 11 toolkit pages | 7 toolkits and 4 playbooks. Each page is self-contained (its sketches and Kyun are embedded) |
| `toolkits/files/<toolkit>/` | The 43 tools: one-page PDFs and one-tab Excel files, downloaded straight from the toolkit pages |
| `contribute.html` | "Tell Kyun": share a story, send an article, ask a question, reply, suggest a tool |
| `join.html`, `signin.html`, `account.html` | Sign-up for the letter, sign-in, the reader's page |
| `studio/index.html` | **Internal.** The team's form for sending articles, stories and toolkits |
| `plan.html` | **Internal.** How the founders plan to run the site |
| `k/` | Kyun drawings used on the home and About pages |
| `assets/mm.css`, `assets/mm.js` | Shared nav, forms, shared styles and settings (see section 3) |
| `assets/brand/` | Favicons and the original logo files |

---

## 3. What you need to wire up

All of these are marked in the code. Nothing else depends on a server.

### a) Forms (Tell Kyun and Studio)
- Every form goes through one function, `MM.submit` in `assets/mm.js`.
- At the top of `assets/mm.js`, set `FORM_ENDPOINT` to your form backend's URL, for example a Formspree endpoint, a Tally or Make webhook, or your own API.
- Each submission is sent as JSON with `POST`. It carries:
  - `kind`: story, article, question, reply, tool, or the Studio kinds article, story, toolkit, short
  - `source`: `community` or `team`
  - `title`
  - the form's fields
  - `createdAt`
  - `name`, `email` and `anonymous` from the "About you" box
- Until `FORM_ENDPOINT` is set, the forms show a polite "not sent" message with a "Copy my submission" button.
- File uploads in the forms only work inside the claude.ai draft. On the live site, either ask for a Google Drive link (the forms already have link fields) or add uploads in your backend.
- The Studio inbox table at the bottom of `studio/index.html` only works inside the claude.ai draft. On the live site the inbox is the founders' email or sheet. You can remove that table, or protect `studio/` with a password.

### b) Join and sign-in
- `join.html` and `signin.html` are front-ends only. Right now they just switch the page to "signed in" in the browser (`localStorage`, key `mimansa-role`).
- Connect them to whatever sends the fortnightly letter: Ghost, Mailchimp, Brevo or Buttondown. The founders' plan (`plan.html`) recommends Ghost(Pro).
- The small sign-up form on the home page sends people to `join.html` with their email filled in.
- Remove the line "Review draft: nothing was sent…" from both pages when this is wired up.

### c) The full film
- `media/film.mp4` is a small 480p copy for review.
- The full-quality film and three vertical reels are in Vivek's folder: `Mimansa Website Content/Stories/The Only One On Your Side/Video/`.
- Please host the film on YouTube or Vimeo and swap the `<video>` in `stories/the-only-one-on-your-side.html` for the embed. Keep the trailer, or use one of the reels.

### d) The 7 upcoming story videos
When each video is ready:
- In `stories/index.html`, turn its card (`id="s1"` … `id="s8"`) into a link, the same way card `s2` is done, and change the tag "Video · soon" to "Video · watch now".
- On the home page, do the same for the matching story card or row.

### e) Studio and plan pages
- `studio/` and `plan.html` are for the founders. Either leave them out of the public site or put them behind a password.
- They are not in the main nav. The footer links to them, so remove those footer links if you leave the pages out.

---

## 4. Small things to tidy

- **Polls** ("Where do you land?") record the click only on the page. Connect them to a backend if you want live results.
- **Author bylines:** every article still says "[Author name]". The founders will send the names.
- **Illustrations:** the article and toolkit sketches are layout drawings. Final illustrations will replace them; keep the same sizes (3:2).
- **The `Show design notes` button** on article pages is a review aid. Hide or remove it before launch.
- **Search engines:** add `robots.txt`, `sitemap.xml`, a `404.html` and social share images (`og:image`) when hosting.
- **Analytics:** add your snippet before `</head>` on every page.
- **Not in v1:** search, comments and dark mode for the home and join pages.

---

## 5. Quality checks done on this folder

- Every page was opened at 390px and 1280px wide. Nothing scrolls sideways, and the browser shows no script errors.
- All 936 local links and image references point to files that exist. All 43 tool downloads open.
- The fixed nav, the bottom "Join free" bar, the article short/full switch and the forms' fallback all work.

Questions on content or design go to Vivek (and Claude); this README and the founders' notes in `plan.html` describe every decision.
# mimansa
