# alphapsiaa.com: Alpha Psi Alumni Association

Website for the Alpha Psi Alumni Association (AΨAA), the local alumni association for alumni,
honorary, and life members of the Alpha Psi Chapter of Kappa Kappa Psi at West Texas A&M
University. Built 2026-09-28 for Dino (Dionicio Cardenas) from the AΨAA website doc and Drive photos.

- **Hosting:** GitHub Pages from the `main` branch root of `alphapsiaa-ui/alphapsiaa-ui.github.io`
  (a separate GitHub account from `bjgiller`). `CNAME` = `alphapsiaa.com`.
- **DNS:** Cloudflare zone `alphapsiaa.com`, proxied, SSL mode Full, plus a redirect rule
  `http://*` → `https://${1}`. The domain is verified on the alphapsiaa-ui GitHub account.
- **No build step.** Plain HTML/CSS/JS. Edit, commit, push, and it's live in about a minute.
- **Pushing:** the local clone has `credential.username=alphapsiaa-ui` and `credential.useHttpPath=true`,
  so Git Credential Manager uses the alphapsiaa-ui login, not bjgiller.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: photo collage hero, welcome, stats, join CTA, explore tiles, "Through the Years" photo strip |
| `about.html` | Mission (Bylaws 2.1), what we do, KKΨAA/SWDAA affiliation, bylaws link |
| `leadership.html` | 2026–27 Board, active chapter ARO, board structure + requirements, founding leadership + founding members |
| `history.html` | Omega Tau → Chapter No. 47 (Oct 25, 1947), petition images, charter members, timeline |
| `wilborn.html` | Rick "Big W" Wilborn memorial |
| `honors.html` | Directors of Bands, national/district leaders, national awards |
| `roster.html` | Searchable member roster (loads `data/roster.json`) |
| `programs.html` | Outstanding Alumni award, Convention Grant, Brother to Brother Scholarship, programs |
| `join.html` | Why join, eligibility, $15 dues, benefits, 3 steps to join |
| `contact.html` | mailto form (opens the visitor's email app) + social links |
| `resources.html` | Forms, bylaws PDF, 1947 petition PDF, fraternity links |
| `donate.html` | "Online giving coming soon" + the 10×10 Life Membership fundraiser (Givebutter) |
| `404.html` | Not-found page |

The **header and footer are copied into every page**. When you change the nav or footer,
change all 13 files (search for `nav-links` / `site-footer`). Nav links are root-absolute
(`/about`); body links and images are relative.

## Assets

- `assets/css/site.css`: the whole design. Tokens are at the top (`--maroon`, `--navy`, `--gold`;
  fonts Barlow Condensed / Inter / Libre Baskerville). The org colors are maroon and white; navy
  and gold come from the shield logo.
- `assets/js/site.js`: header, mobile nav, dropdowns, scroll reveal, lightbox (any element with
  `data-lightbox="img" data-caption="..."`), contact mailto form, and the roster search/filter.
- `assets/css/fontawesome-all.min.css` + `assets/webfonts/`: Font Awesome 5.9 (icons).
- `images/`: web-sized photos (max 1600px JPEG). `logo-512.png` / `logo-192.png` are the cropped
  shield (the 192 is also the favicon).
- `docs/`: `alpha-psi-aa-bylaws-2026.pdf`, `alpha-psi-petition-1947.pdf` (45 MB scan).
- `data/roster.json`: generated; don't hand-edit (see below).

## Updating the roster

The roster comes from the chapter's Google Sheet. From `C:\Programming` in Git Bash:
```bash
bash tools/alphapsiaa-roster/update-roster.sh
```
Then commit and push `data/roster.json`. The script publishes **only** name, class, initiation year,
offices held, and Honorary/Life tags. The sheet's Status column (Inactive/Expelled/...) and email
columns are deliberately never published, and expelled members are left off.

## Key links used on the site

- Email: alphapsiaa@kkpsi.org · Linktree: https://linktr.ee/alphapsiaa (the doc asks that general
  links point here)
- 2026–27 membership form:
  https://docs.google.com/forms/d/e/1FAIpQLSdZcljibCvj4TSsIaUbOGq02IVUL2E_RgC2-wnDgS-2Am0X7Q/viewform
- KKΨAA renew: https://www.kkpsiaa.org/renew-your-membership
- 10×10 fundraiser: https://givebutter.com/10x10-ayaa

## Content decisions to keep

- Founding date is **June 9, 2025** (confirmed; matches the bylaws).
- Dino asked for less of himself in the general photos. He appears where he's being honored
  (Leadership, Honors), not in the home hero/welcome images.
- Board cards say "Board of Directors" because individual titles haven't been provided yet. Each
  card has an HTML comment showing where to add `<p class="role">President</p>` etc.
- No online donation link exists yet.
