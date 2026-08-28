# Instagram templates

Assets served as static files (`https://todomotor.uy/instagram/...`) for the
"TodoMotor → Instagram" cloud routine, which shares published blog posts to
Instagram through `POST /api/admin/blog/{slug}/instagram` (feed) and
`POST /api/admin/blog/{slug}/instagram/story` (story), both in fullmotor_api.

Instagram only accepts JPEGs. A **feed** post must be between 4:5 and 1.91:1:
blog covers uploaded by the daily/editor routines (1280x800 JPEG) qualify, and
posts **without** a cover (a "Radar del día" on a day with no vehicle loaded)
get an image composed from the feed template plus the post title.

A **story** is a different picture, not a crop of the same one. It is displayed
9:16, so a 1280x800 cover would be letterboxed into a thin strip with grey
above and below — the story template exists so that never happens.

| File | Purpose |
|---|---|
| `template-1080x1350.jpg` | 4:5 feed background (paper + gauge mark + eyebrow + footer) |
| `template-story-1080x1920.jpg` | 9:16 story background, same design in the story safe area |
| `template-radar-story-1080x1920.jpg` | 9:16 story for the "Radar del día" — see below |
| `template-radar-photo-story-1080x1920.jpg` | the same with the top 920px free for the vehicle photo |
| `Inter-Bold.ttf` | Font for the title (Inter, SIL OFL — see `Inter-LICENSE.txt`) |

Palette and mark mirror `src/lib/og.tsx` (`ACCENT #1F4FE0`, `INK #0E131B`,
`MUTED #6B7686`, `PAPER #F6F8FB`).

## Text zone

Left aligned, top anchored, colour `#0E131B`, Inter Bold, x from **80 to 1000**
in both formats. Only the vertical band and the type sizes differ:

| | y range | Sizes to try | Max lines |
|---|---|---|---|
| feed | 400 → 1120 | 76 down to 56, step 4 | 5 |
| story | 800 → 1440 | 88 down to 60, step 4 | 6 |

The story band is not centred on the canvas on purpose. Instagram's own UI —
progress bar and account header on top, reply box at the foot — covers roughly
250 px at each end, and anything drawn there is sat on. The 800→1440 band, the
header at 300 and the footer at 1520 all sit inside that safe area.

Do **not** bottom-anchor the story title to fill the space under it: the
eyebrow stays put and a short title drifts away from it. The empty band below
the footer is where the reply box lands.

## The "Radar del día" templates

`Radar del día — 27 de agosto de 2026` is a title that says nothing to somebody
looking at a story. These two templates exist so the routine can put the actual
news there instead: it writes a headline at publish time from the post's
`excerpt`, and the date is demoted to a line under the eyebrow, where a date
belongs.

Pick by whether the post has a cover: **`radar-photo` when it does** (that is
the vehicle hero the daily routine already uploaded, and a photo is what stops
the scroll), **`radar` when it does not**. Never publish `radar-photo` with the
photo band empty.

The text always sits **below** the photo, never over it. A vehicle hero can
come back light or dark and overlaid type breaks on half of them.

Everything the template can hold is baked in — brand furniture, the `RADAR DEL
DÍA` eyebrow, the rules. The routine draws only what it decided:

| | `radar` | `radar-photo` |
|---|---|---|
| photo | — | paste into 0,0 → 1080,920, cropped to fill |
| date (26 px, `#6B7686`) | x 80, y 742 | x 80, y 1172 |
| headline (INK) | 80,820 → 1000,1160 · 76→52 · max 4 lines | 80,1250 → 1000,1540 · 72→52 · max 3 lines |
| bullets (38 px, accent dot at x 80, text at x 118) | from y 1254, max 2 | — |

The divider above the bullets is part of the `radar` template and sits at a
fixed y, so a one-line headline and a four-line one both look deliberate. That
also means **`radar` should always get at least one bullet** — otherwise the
rule hangs there with nothing under it.

## Snippet the routine uses (Pillow)

```python
import urllib.request
from PIL import Image, ImageDraw, ImageFont

BASE = "https://todomotor.uy/instagram/"
FORMATS = {
    # template file, text zone, size range, max lines
    "feed":  ("template-1080x1350.jpg",      (80, 400, 1000, 1120), (76, 55), 5),
    "story": ("template-story-1080x1920.jpg", (80, 800, 1000, 1440), (88, 59), 6),
}
urllib.request.urlretrieve(BASE + "Inter-Bold.ttf", "/tmp/Inter-Bold.ttf")


def compose(title, fmt="feed", out=None):
    tpl, zone, (big, small), max_lines = FORMATS[fmt]
    out = out or f"/tmp/instagram-{fmt}.jpg"
    urllib.request.urlretrieve(BASE + tpl, f"/tmp/{tpl}")
    img = Image.open(f"/tmp/{tpl}").convert("RGB")
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = zone
    for size in range(big, small, -4):
        font = ImageFont.truetype("/tmp/Inter-Bold.ttf", size)
        # wrap by measured width, not by character count
        lines, line = [], ""
        for word in title.split():
            test = (line + " " + word).strip()
            if d.textlength(test, font=font) <= (x1 - x0):
                line = test
            else:
                lines.append(line); line = word
        lines.append(line)
        lh = int(size * 1.15)
        if len(lines) <= max_lines and len(lines) * lh <= (y1 - y0):
            break
    y = y0
    for ln in lines:
        d.text((x0, y), ln, font=font, fill=(0x0E, 0x13, 0x1B))
        y += lh
    img.save(out, "JPEG", quality=88, optimize=True)
    return out
```

And for the radar, which draws its own pieces on top of a baked template:

```python
RADAR = {
    "radar": dict(
        tpl="template-radar-story-1080x1920.jpg",
        date_y=742, headline=(80, 820, 1000, 1160), h_sizes=(76, 51), h_lines=4,
        bullets_y=1254,
    ),
    "radar-photo": dict(
        tpl="template-radar-photo-story-1080x1920.jpg", photo_h=920,
        date_y=1172, headline=(80, 1250, 1000, 1540), h_sizes=(72, 51), h_lines=3,
    ),
}
INK, MUTED, ACCENT = (0x0E, 0x13, 0x1B), (0x6B, 0x76, 0x86), (0x1F, 0x4F, 0xE0)


def compose_radar(titular, fecha, bullets=(), photo=None, fmt="radar",
                  out="/tmp/instagram-radar.jpg"):
    """`photo` is a local path to the post's cover, already downloaded."""
    L = RADAR[fmt]
    urllib.request.urlretrieve(BASE + L["tpl"], "/tmp/" + L["tpl"])
    img = Image.open("/tmp/" + L["tpl"]).convert("RGB")
    font = lambda sz: ImageFont.truetype("/tmp/Inter-Bold.ttf", sz)

    if L.get("photo_h"):
        if not photo:
            raise ValueError("radar-photo needs a photo; without one use fmt='radar'")
        ph_h = L["photo_h"]
        cov = Image.open(photo).convert("RGB")
        s = max(1080 / cov.width, ph_h / cov.height)          # crop to fill
        cov = cov.resize((int(cov.width * s), int(cov.height * s)), Image.LANCZOS)
        left, top = (cov.width - 1080) // 2, (cov.height - ph_h) // 2
        img.paste(cov.crop((left, top, left + 1080, top + ph_h)), (0, 0))

    d = ImageDraw.Draw(img)
    d.text((80, L["date_y"]), fecha, font=font(26), fill=MUTED)

    def wrap(text, f, width):
        lines, line = [], ""
        for w in text.split():
            t = (line + " " + w).strip()
            if d.textlength(t, font=f) <= width:
                line = t
            else:
                lines.append(line); line = w
        lines.append(line)
        return lines

    x0, y0, x1, y1 = L["headline"]
    big, small = L["h_sizes"]
    for sz in range(big, small, -4):
        f_h = font(sz)
        lines = wrap(titular, f_h, x1 - x0)
        lh = int(sz * 1.15)
        if len(lines) <= L["h_lines"] and len(lines) * lh <= (y1 - y0):
            break
    y = y0
    for ln in lines:
        d.text((x0, y), ln, font=f_h, fill=INK)
        y += lh

    if bullets and L.get("bullets_y"):
        y = L["bullets_y"]
        for b in bullets[:2]:
            d.ellipse((80, y + 16, 94, y + 30), fill=ACCENT)
            for ln in wrap(b, font(38), 860):
                d.text((118, y), ln, font=font(38), fill=INK)
                y += 48
            y += 22

    img.save(out, "JPEG", quality=88, optimize=True)
    return out
```

Then upload with `POST /api/admin/blog/images` (multipart field `images`) and
pass the returned URL as `imageUrl` in the publish body — or, for the feed, as
the post's `coverImage` (PATCH). **The story endpoint has no caption field**:
whatever the viewer has to read must be inside the image, and the API cannot
attach a link sticker, so `todomotor.uy/blog` in the footer is the only pointer
the viewer gets.

## Regenerating the templates

```bash
pip install Pillow
python scripts/make-instagram-template.py public/instagram/template-1080x1350.jpg public/instagram/Inter-Bold.ttf feed
python scripts/make-instagram-template.py public/instagram/template-story-1080x1920.jpg public/instagram/Inter-Bold.ttf story
python scripts/make-instagram-template.py public/instagram/template-radar-story-1080x1920.jpg public/instagram/Inter-Bold.ttf radar
python scripts/make-instagram-template.py public/instagram/template-radar-photo-story-1080x1920.jpg public/instagram/Inter-Bold.ttf radar-photo
```

Edit the `LAYOUTS` dict in `scripts/make-instagram-template.py` to change the
design; if you move a text zone, update the table above — the routine reads it
from here.
