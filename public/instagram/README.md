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
| `template-1080x1350.jpg` | 4:5 feed background (paper + gauge mark + eyebrow + footer), 61 KB |
| `template-story-1080x1920.jpg` | 9:16 story background, same design in the story safe area, 73 KB |
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
```

Edit the `LAYOUTS` dict in `scripts/make-instagram-template.py` to change the
design; if you move a text zone, update the table above — the routine reads it
from here.
