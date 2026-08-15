# Instagram template

Assets served as static files (`https://todomotor.uy/instagram/...`) for the
"TodoMotor → Instagram" cloud routine, which shares published blog posts to
Instagram through `POST /api/admin/blog/{slug}/instagram` (fullmotor_api).

Instagram only accepts JPEGs between 4:5 and 1.91:1. Blog covers uploaded by
the daily/editor routines (1280x800 JPEG) qualify; posts **without** a cover
(a "Radar del día" on a day with no vehicle loaded) get an image composed
from this template plus the post title.

| File | Purpose |
|---|---|
| `template-1080x1350.jpg` | 4:5 branded background (paper + gauge mark + eyebrow + footer), 61 KB |
| `Inter-Bold.ttf` | Font for the title (Inter, SIL OFL — see `Inter-LICENSE.txt`) |

Palette and mark mirror `src/lib/og.tsx` (`ACCENT #1F4FE0`, `INK #0E131B`,
`MUTED #6B7686`, `PAPER #F6F8FB`).

## Text zone

Write the title inside **x 80 → 1000, y 400 → 1120** (920 px wide, 720 px
tall), colour `#0E131B`, Inter Bold, left aligned, top anchored. Start at 76 px
and step down to 56 px until the wrapped title fits in at most 5 lines.

## Snippet the routine uses (Pillow)

```python
import textwrap, urllib.request
from PIL import Image, ImageDraw, ImageFont

BASE = "https://todomotor.uy/instagram/"
urllib.request.urlretrieve(BASE + "template-1080x1350.jpg", "/tmp/template.jpg")
urllib.request.urlretrieve(BASE + "Inter-Bold.ttf", "/tmp/Inter-Bold.ttf")

def compose(title, out="/tmp/instagram.jpg"):
    img = Image.open("/tmp/template.jpg").convert("RGB")
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 80, 400, 1000, 1120
    for size in range(76, 55, -4):
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
        if len(lines) <= 5 and len(lines) * lh <= (y1 - y0):
            break
    y = y0
    for ln in lines:
        d.text((x0, y), ln, font=font, fill=(0x0E, 0x13, 0x1B))
        y += lh
    img.save(out, "JPEG", quality=88, optimize=True)
    return out
```

Then upload with `POST /api/admin/blog/images` (multipart field `images`) and
pass the returned URL either as the post's `coverImage` (PATCH) or as
`imageUrl` in the Instagram publish body.

## Regenerating the template

```bash
pip install Pillow
python scripts/make-instagram-template.py public/instagram/template-1080x1350.jpg public/instagram/Inter-Bold.ttf
```

Edit `scripts/make-instagram-template.py` to change the design; keep the size
and the text zone so the routine's snippet keeps working.
