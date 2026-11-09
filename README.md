# Mimansa website: teaser mode (temporary)

Until launch, `main` serves **only** the teaser landing page (`index.html`).

- Every other URL falls back to the teaser: `404.html` redirects to `/`, and `_redirects` does the same on Netlify / Cloudflare Pages.
- The film plays from YouTube (`YT_ID` in `index.html`).
- Both forms (Notify me, Contact) send a simple "someone is interested" email to hitanshu@nudgeable.ai, with a copy to team@mimansa.work, via formsubmit.co (`MAIL_TO` / `MAIL_CC` in `index.html`). The first submission sends an activation email to hitanshu@nudgeable.ai, and you must click its link once.

## Restoring the full site at launch

The complete site (home, about, articles, stories, toolkits and the rest) is on the branch `full-site`:

    git checkout main
    git reset --hard full-site   # or merge full-site into main

Then decide whether to keep the teaser, for example as `teaser.html`.
