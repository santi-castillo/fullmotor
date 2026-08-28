"""One-off generator for the Instagram templates in public/instagram/.

    python scripts/make-instagram-template.py OUT.jpg Inter-Bold.ttf [FORMAT]

Formats:

    feed         1080x1350 post background
    story        1080x1920 story background
    radar        1080x1920 story for the "Radar del día", which needs its own
                 furniture because the post title is only a date
    radar-photo  the same, with the top 920px left free for the vehicle photo

The radar templates exist for one reason: "Radar del día — 27 de agosto de
2026" is a title that says nothing. The routine writes a real headline at
publish time and draws it here, with the date demoted to a line under the
eyebrow where a date belongs.

Everything a template can hold is baked in (brand furniture, the eyebrow label,
the rules) so the routine only draws text it decided on: date, headline,
bullets, and the photo. Text sits *below* the photo, never over it — a vehicle
hero can be light or dark and overlaid type breaks on half of them.

Brand values mirror fullmotor/src/lib/og.tsx (ACCENT, INK, MUTED, PAPER and the
gauge mark). Zones are documented in public/instagram/README.md.
"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = sys.argv[1]
FONT_BOLD = sys.argv[2]
FORMAT = sys.argv[3] if len(sys.argv) > 3 else "feed"

ACCENT = (0x1F, 0x4F, 0xE0)
INK = (0x0E, 0x13, 0x1B)
MUTED = (0x6B, 0x76, 0x86)
PAPER = (0xF6, 0xF8, 0xFB)
GLOW = (0xED, 0xF2, 0xFF)
RULE = (0xD9, 0xDF, 0xEA)

MARGIN = 80

# Every coordinate lives here so the formats stay honestly comparable and the
# README can be read off one place. x is 80 -> 1000 in all of them.
LAYOUTS = {
    "feed": dict(
        size=(1080, 1350), eyebrow_label="NOTICIAS DEL MOTOR",
        mark_y=96, mark_size=112,
        name_size=46, site_size=26, eyebrow_size=26, footer_size=28,
        eyebrow_y=318, date_line=False,
        footer_y=1176, bar_h=16,
    ),
    "story": dict(
        size=(1080, 1920), eyebrow_label="NOTICIAS DEL MOTOR",
        # Pushed down past the progress bar and the account header.
        mark_y=300, mark_size=128,
        name_size=52, site_size=30, eyebrow_size=30, footer_size=32,
        eyebrow_y=700, date_line=False,
        footer_y=1520, bar_h=20,
    ),
    "radar": dict(
        size=(1080, 1920), eyebrow_label="RADAR DEL DÍA",
        mark_y=300, mark_size=128,
        name_size=52, site_size=30, eyebrow_size=30, footer_size=32,
        eyebrow_y=680, date_line=True,
        # Fixed so the divider can be baked in: the headline band ends at 1160
        # whether the headline runs one line or four.
        divider_y=1210,
        footer_y=1520, bar_h=20,
    ),
    "radar-photo": dict(
        size=(1080, 1920), eyebrow_label="RADAR DEL DÍA",
        photo_h=920,
        # Small mark under the photo: the picture is the brand signal here.
        mark_y=972, mark_size=80,
        name_size=40, site_size=0, eyebrow_size=30, footer_size=32,
        eyebrow_y=1110, date_line=True,
        footer_y=1570, bar_h=20,
    ),
}

if FORMAT not in LAYOUTS:
    sys.exit("format must be one of " + ", ".join(LAYOUTS) + "; got " + FORMAT)
L = LAYOUTS[FORMAT]
W, H = L["size"]

# --- background: paper with a soft radial glow top-right (og.tsx does the same)
img = Image.new("RGB", (W, H), PAPER)
glow = Image.new("L", (W, H), 0)
gd = ImageDraw.Draw(glow)
cx, cy, r = int(W * 0.9), int(-H * 0.05), int(W * 0.95)
gd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
glow = glow.filter(ImageFilter.GaussianBlur(220))
img = Image.composite(Image.new("RGB", (W, H), GLOW), img, glow)

d = ImageDraw.Draw(img)


def rr(box, radius, fill):
    d.rounded_rectangle(box, radius=radius, fill=fill)


# --- brand mark (48x48 viewBox scaled), top-left
def draw_mark(x, y, size):
    s = size / 48.0

    def P(px, py):
        return (x + px * s, y + py * s)

    rr((x + 1 * s, y + 1 * s, x + 47 * s, y + 47 * s), 12 * s, ACCENT)
    # gauge arc: center (24,25) r 13, from 150deg through the top to 30deg (+360)
    c = P(24, 25)
    R = 13 * s
    d.arc((c[0] - R, c[1] - R, c[0] + R, c[1] + R), start=150, end=390,
          fill=(255, 255, 255), width=max(2, int(round(3 * s))))
    tick = (255, 255, 255)
    for a, b in (((12.74, 18.5), (15.34, 20)), ((24, 12), (24, 15)), ((35.26, 18.5), (32.66, 20))):
        d.line([P(*a), P(*b)], fill=tick, width=max(1, int(round(1.6 * s))))
    d.line([P(21.5, 28.7), P(30.3, 16)], fill=(255, 255, 255), width=max(2, int(round(3 * s))))
    r3 = 3 * s
    d.ellipse((c[0] - r3, c[1] - r3, c[0] + r3, c[1] + r3), fill=(255, 255, 255))
    r1 = 1.3 * s
    d.ellipse((c[0] - r1, c[1] - r1, c[0] + r1, c[1] + r1), fill=ACCENT)


# The photo band is left as paper: the routine pastes the vehicle hero over it.
# A radar day with no vehicle uses the `radar` template instead, so this is
# never published empty.
if L.get("photo_h"):
    d.rectangle((0, 0, W, L["photo_h"]), fill=(0xE8, 0xEE, 0xF7))

draw_mark(MARGIN, L["mark_y"], L["mark_size"])

f_name = ImageFont.truetype(FONT_BOLD, L["name_size"])
f_eyebrow = ImageFont.truetype(FONT_BOLD, L["eyebrow_size"])
f_footer = ImageFont.truetype(FONT_BOLD, L["footer_size"])

name_x = MARGIN + L["mark_size"] + 28
name_y = L["mark_y"] + 12
d.text((name_x, name_y), "TodoMotor Uruguay", font=f_name, fill=INK)
if L["site_size"]:
    f_site = ImageFont.truetype(FONT_BOLD, L["site_size"])
    d.text((name_x, name_y + L["name_size"] + 12), "todomotor.uy", font=f_site, fill=MUTED)

# --- eyebrow above the text zone (letter-spaced by hand; Pillow has no tracking)
eb = L["eyebrow_y"]
d.rounded_rectangle((MARGIN, eb, MARGIN + 72, eb + 8), radius=4, fill=ACCENT)
xx = MARGIN
for ch in L["eyebrow_label"]:
    d.text((xx, eb + 20), ch, font=f_eyebrow, fill=ACCENT)
    xx += d.textlength(ch, font=f_eyebrow) + 4

# The date goes under the eyebrow, not in the headline: it is context, not news.
# Drawn by the routine (it changes daily) — this only reserves the line.

# A rule between the headline and the bullets, at a fixed y so it can be baked.
if L.get("divider_y"):
    d.line([(MARGIN, L["divider_y"]), (MARGIN + 120, L["divider_y"])], fill=ACCENT, width=6)

# --- footer
fy = L["footer_y"]
d.line([(MARGIN, fy), (W - MARGIN, fy)], fill=RULE, width=2)
# A story published through the API cannot carry a link sticker, so this URL is
# the only way a viewer can reach the article.
d.text((MARGIN, fy + 24), "Nota completa en todomotor.uy/blog", font=f_footer, fill=MUTED)
d.rectangle((0, H - L["bar_h"], W, H), fill=ACCENT)

img.save(OUT, "JPEG", quality=90, optimize=True, subsampling=0)
print("wrote", OUT, img.size, FORMAT)
