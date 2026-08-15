"""One-off generator for public/instagram/template-1080x1350.jpg.

Brand values mirror fullmotor/src/lib/og.tsx (ACCENT, INK, MUTED, PAPER and the
gauge mark). The routine that publishes to Instagram writes the post title into
the free text zone (see public/instagram/README.md).
"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = sys.argv[1]
FONT_BOLD = sys.argv[2]

W, H = 1080, 1350
ACCENT = (0x1F, 0x4F, 0xE0)
INK = (0x0E, 0x13, 0x1B)
MUTED = (0x6B, 0x76, 0x86)
PAPER = (0xF6, 0xF8, 0xFB)
GLOW = (0xED, 0xF2, 0xFF)

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


MARGIN = 80
draw_mark(MARGIN, 96, 112)

f_name = ImageFont.truetype(FONT_BOLD, 46)
f_site = ImageFont.truetype(FONT_BOLD, 26)
f_eyebrow = ImageFont.truetype(FONT_BOLD, 26)
f_footer = ImageFont.truetype(FONT_BOLD, 28)

d.text((MARGIN + 112 + 28, 108), "TodoMotor Uruguay", font=f_name, fill=INK)
d.text((MARGIN + 112 + 28, 108 + 58), "todomotor.uy", font=f_site, fill=MUTED)

# --- eyebrow above the text zone (letter-spaced by hand; Pillow has no tracking)
d.rounded_rectangle((MARGIN, 318, MARGIN + 72, 318 + 8), radius=4, fill=ACCENT)
xx = MARGIN
for ch in "NOTICIAS DEL MOTOR":
    d.text((xx, 338), ch, font=f_eyebrow, fill=ACCENT)
    xx += d.textlength(ch, font=f_eyebrow) + 4

# --- footer
d.line([(MARGIN, 1176), (W - MARGIN, 1176)], fill=(0xD9, 0xDF, 0xEA), width=2)
d.text((MARGIN, 1200), "Nota completa en todomotor.uy/blog", font=f_footer, fill=MUTED)
d.rectangle((0, H - 16, W, H), fill=ACCENT)

img.save(OUT, "JPEG", quality=90, optimize=True, subsampling=0)
print("wrote", OUT, img.size)
