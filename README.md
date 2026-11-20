# Mimansa website v1.2: developer handoff

Plain HTML, CSS and a little JavaScript. No build step, no framework, no server code. Every link inside the site is relative, so the folder works at the domain root. The domain is **www.mimansa.work**.

Prepared 20 Nov 2026 from the version the founders (Vivek, Gaurav and Himanshu) have finalised. It replaces v1 and v1.1. See `AUDIT.md` for the checks run on this folder.

- **To preview:** open a terminal in this folder, run `python3 -m http.server 8000`, then open http://localhost:8000. Double-clicking the files also works, but downloads and some scripts behave better over a local server.
- **To host:** upload everything except `_images (reference only)` and the two `.md` files to any static host (Netlify, Cloudflare Pages, Vercel, GitHub Pages, S3 + CloudFront, cPanel). Point www.mimansa.work at it and turn on HTTPS. Set `404.html` as the not-found page if the host asks.

---

## Film links (YouTube, privacy-enhanced embeds)

| Story | Film | YouTube ID |
|---|---|---|
| 01 Two Letters on the Table | `stories/index.html#s1` | B5NF65vzB04 |
| 02 Resigned. Withdrawn. Resigned. | `stories/the-only-one-on-your-side.html` | 0Llu7Rk7YME |
| 03 The Notice Period from London | `#s3` | zmYrRb07xn8 |
| 04 It Wasn't My Signature, But It Was My Mistake | `#s4` | Toc2b9GI5JE |
| 05 Get It Done Today | `#s5` | n_Fzmv9GGn8 |
| 06 PFA the FIR | `#s6` | TVcI-GTrERA |
| 07 Paid Like Me | `#s7` | GBEz-oVff4o |
| 08 Termination Without Cause | coming soon | n/a |

On the Stories page each poster carries a `data-yt` attribute; clicking it swaps in the player.

Forms send an email via formsubmit.co (`FORM_ENDPOINT` in `assets/mm.js`, CC team@mimansa.work). The first submission sends an activation email that must be clicked once.

## 1. Rules from the founders (please keep)

- **Everything is free.** Nothing is locked behind a login. Signing up only gets you an email when a new article or story is out. There is no newsletter.
- **Do not change the authors' words** in the articles (`articles/article-NN.html`). Fix layout only.
- **Look:** ink `#1A1A1A`, saffron `#F2A900` (hover `#E09A00`), dark saffron for small text `#8A6100`, paper `#FAF8F4`, panel `#F0EDE6`, rules `#DDD8CE`. Yellow buttons always have dark text.
- **Fonts** (Google Fonts): Newsreader for text, IBM Plex Mono for small labels, Tiro Devanagari Hindi for the small Devanagari words.
- **Logo:** always use the real files (`logo.png` on light, `logo-dark.png` on dark). Never redraw or retype it. The logo is saffron; the older crimson version is retired.
- **Kyun, the loris mascot:** never in a box, card, circle or badge; he stands on his own thin ink ground line; no line passes through his body. He stays off the story film page.
- **Illustrations** show objects only, never people.
- **Words:** plain spoken English. The site says "Skills" (not toolkits or playbooks) and "steps" (not plays).

---

## 2. What is in the folder

| Path | What it is |
|---|---|
| `index.html` | Home: night hero → Stories (all 8) → Articles (3 picks) → Why Mimansa → Sign up |
| `about.html` | The name, why we started, what we do, the founders |
| `articles/index.html`, `articles/article-01…10.html` | 10 articles. Each has a short version (key passages) and the full article, switched with one button. Each ends with links to the previous and next article |
| `articles/assets/` | Article styles and script (`article.css`, `article.js`), logos, Kyun drawings (`kyun/*.webp`) |
| `stories/index.html` | All 8 stories with their posters. Story 02 opens its film page; story 08 is marked "coming soon" |
| `stories/the-only-one-on-your-side.html` | Story 02: trailer, full film, what happened, chapters, lessons |
| `media/` | `film.mp4` (480p review copy, 13 MB), `reel.mp4` (trailer), `story-poster.jpg`, and `stories/` (the 8 posters) |
| `toolkits/index.html` + 11 skill pages | The 11 Skills. Each page is self-contained (its Kyun and logo are embedded) |
| `toolkits/files/<skill>/` | The tools to download (one-page PDFs and Excel files) and one Claude skill `.zip` per skill |
| `contribute.html` | "Tell Kyun": share a story, send an article, ask a question, reply to a piece, suggest a tool |
| `join.html`, `signin.html`, `account.html` | Sign up, sign in, the reader's page |
| `studio/index.html`, `plan.html` | **Internal**, for the founders. Marked `noindex` and blocked in `robots.txt` |
| `k/` | Kyun drawings used on the home and About pages |
| `assets/mm.css`, `assets/mm.js` | Shared styles, nav, forms, share button, downloads, settings |
| `assets/brand/` | Favicons, app icons, share image (`og-image.png`), master logo files |
| `assets/people/` | Founders' photos (About page and article bylines) |
| `404.html` | Page-not-found page |
| `robots.txt`, `sitemap.xml`, `site.webmanifest` | Search engines and phone home-screen settings |
| `_images (reference only)/` | **Not for upload.** A copy of every image in one place, including how the dark sections look. Open its `index.html` to browse them |

Every page already has its title, description, canonical address, share tags (Open Graph and X), favicon and theme colour.

---

## 3. What you need to wire up

### a) Forms (Tell Kyun and Studio)
- Every form goes through one function, `MM.submit` in `assets/mm.js`.
- At the top of `assets/mm.js`, set `FORM_ENDPOINT` to your form backend's URL (Formspree, a Tally or Make webhook, or your own API). Keep `DRAFT=false`.
- Each submission is sent as JSON with `POST`: `kind`, `source`, `title`, the form's fields, `createdAt`, and `name`, `email`, `anonymous`.
- Until `FORM_ENDPOINT` is set, forms show a polite "not sent" message with a "Copy my submission" button.
- File uploads in the forms need your backend; otherwise ask for a Google Drive link (the forms have link fields).

### b) Sign up and sign in
- `join.html` and `signin.html` are front-ends only. They switch the page to "signed in" in the browser (`localStorage`, key `mimansa-role`).
- Connect them to the email tool that sends "new article / new story" emails (Ghost, Mailchimp, Brevo or Buttondown).
- The sign-up box on the home page sends people to `join.html` with their email filled in.

### c) Videos
- Host the full film on YouTube and swap the `<video>` in `stories/the-only-one-on-your-side.html` for the embed. The full-quality film and reels are in Vivek's folder `Mimansa Website Content/Stories/`.
- The other story videos go on YouTube as they are ready. The founders will send the links. Then turn each story card (`id="s1"` … `id="s8"` in `stories/index.html`, and the matching card on the home page) into a link, the same way card `s2` is done. The play buttons are already on the cards.
- Story 08 (Termination Without Cause) shows "coming soon" and has no play button until its video is ready.

### d) Footer links
- Every footer shows "Reach us: team@mimansa.work · LinkedIn · YouTube". LinkedIn and YouTube are placeholders (`#linkedin`, `#youtube`). Replace them across all pages when the founders send the page addresses.

### e) Internal pages
- `studio/` and `plan.html` are for the founders. Leave them out of the upload, or put them behind a password.

---

## 4. Good to add when hosting

- Analytics: add your snippet before `</head>` on every page.
- Caching: long cache for images, fonts, `.css` and `.js`; short cache for `.html`.
- The skill pages are about 400 to 470 KB each because their pictures are embedded. They load fine, and the host's compression (gzip or Brotli) will shrink them.
- Polls were taken off the articles on 20 Nov 2026. Their text is kept in the founders' project notes in case they come back.

Questions on content or design go to Vivek.
