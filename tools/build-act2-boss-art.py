"""Build runtime Act II boss sprites and title cards from generated source art.

The source directory contains:
  - bossN_turnaround.webp: original three-view chroma-key generation
  - bossN_alpha.webp: the same image after remove_chroma_key.py
  - bossN_splash.webp: cinematic portrait without title text

Runtime output:
  - assets2/enemies/animated/bossN_{front,side,back}_walk.webp
  - assets/ui/boss-stageN.webp
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "source" / "act2-bosses"
SPRITE_DIR = ROOT / "assets2" / "enemies" / "animated"
UI_DIR = ROOT / "assets" / "ui"

FRAME_SIZE = 128
FRAME_COUNT = 12
CONTENT_SIZE = 110

# Generated views are not mathematically equal thirds because weapons and cloaks
# extend into the gutters. These cuts follow the empty visual valleys in each
# approved turnaround and prevent adjacent poses from bleeding into a sprite.
VIEW_CUTS = {
    7: (472, 784),
    8: (447, 820),
    9: (443, 813),
    10: (447, 804),
    11: (505, 752),
    12: (470, 795),
}

BOSS_TITLES = {
    7: ("COMMANDER", "OREN"),
    8: ("ASH", "SHEPHERD"),
    9: ("HOLLOW", "SAINT"),
    10: ("IRON", "PROCESSION"),
    11: ("LEYBOUND", "TITAN"),
    12: ("LORD MARSHAL", "VAEL"),
}

TITLE_PALETTES = {
    7: ((255, 224, 153), (207, 98, 34), (68, 27, 10)),
    8: ((255, 226, 148), (221, 119, 28), (67, 36, 10)),
    9: ((240, 226, 255), (162, 112, 211), (42, 24, 58)),
    10: ((219, 247, 255), (75, 177, 205), (12, 43, 55)),
    11: ((255, 217, 255), (205, 84, 222), (52, 16, 63)),
    12: ((255, 241, 182), (211, 150, 48), (69, 39, 9)),
}


def find_title_font() -> Path:
    candidates = (
        Path("C:/Windows/Fonts/georgiab.ttf"),
        Path("C:/Windows/Fonts/cambriab.ttf"),
        Path("C:/Windows/Fonts/timesbd.ttf"),
    )
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("No suitable serif title font was found.")


TITLE_FONT = find_title_font()


def trim_transparent(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    solid = alpha.point(lambda value: 255 if value > 12 else 0)
    bbox = solid.getbbox()
    if not bbox:
        raise ValueError("Generated view contains no opaque pixels.")
    return image.crop(bbox)


def fit_character(image: Image.Image) -> Image.Image:
    max_width = CONTENT_SIZE
    max_height = 116
    scale = min(max_width / image.width, max_height / image.height)
    size = (
        max(1, round(image.width * scale)),
        max(1, round(image.height * scale)),
    )
    return image.resize(size, Image.Resampling.LANCZOS)


def animated_frame(character: Image.Image, frame_index: int, view: str) -> Image.Image:
    phase = frame_index / FRAME_COUNT * math.tau
    stride = math.sin(phase)
    step = math.sin(phase * 2)
    bob = -round(abs(step) * 2.0)
    sway = (0.8 if view == "side" else 0.45) * stride
    stretch = 1.0 + abs(step) * 0.012
    squash = 1.0 - abs(step) * 0.008

    transformed = character.resize(
        (
            max(1, round(character.width * squash)),
            max(1, round(character.height * stretch)),
        ),
        Image.Resampling.LANCZOS,
    )
    transformed = transformed.rotate(
        sway,
        resample=Image.Resampling.BICUBIC,
        expand=True,
        fillcolor=(0, 0, 0, 0),
    )

    frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    x = (FRAME_SIZE - transformed.width) // 2
    if view == "side":
        x += round(stride * 1.4)
    y = FRAME_SIZE - transformed.height - 4 + bob
    frame.alpha_composite(transformed, (x, y))
    return frame


def build_walk_sheet(stage: int, view: str, source: Image.Image) -> Path:
    character = fit_character(trim_transparent(source))
    sheet = Image.new(
        "RGBA",
        (FRAME_SIZE * FRAME_COUNT, FRAME_SIZE),
        (0, 0, 0, 0),
    )
    for frame_index in range(FRAME_COUNT):
        frame = animated_frame(character, frame_index, view)
        sheet.alpha_composite(frame, (frame_index * FRAME_SIZE, 0))

    output = SPRITE_DIR / f"boss{stage}_{view}_walk.webp"
    sheet.save(output, "WEBP", lossless=True, method=6, exact=True)
    return output


def split_turnaround(stage: int) -> dict[str, Image.Image]:
    source = Image.open(SOURCE_DIR / f"boss{stage}_alpha.webp").convert("RGBA")
    cut_one, cut_two = VIEW_CUTS[stage]
    return {
        "front": source.crop((0, 0, cut_one, source.height)),
        "side": source.crop((cut_one, 0, cut_two, source.height)),
        "back": source.crop((cut_two, 0, source.width, source.height)),
    }


def fitted_font(text: str, max_width: int, preferred_size: int) -> ImageFont.FreeTypeFont:
    size = preferred_size
    while size >= 48:
        font = ImageFont.truetype(str(TITLE_FONT), size)
        bbox = font.getbbox(text, stroke_width=0)
        if bbox[2] - bbox[0] <= max_width:
            return font
        size -= 4
    return ImageFont.truetype(str(TITLE_FONT), 48)


def title_mask(
    size: tuple[int, int],
    lines: tuple[str, str],
) -> tuple[Image.Image, list[tuple[str, ImageFont.FreeTypeFont, int, int]]]:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    preferred = 112 if len(lines[0]) > 10 else 132
    fonts = (
        fitted_font(lines[0], 900, preferred),
        fitted_font(lines[1], 900, 150),
    )
    heights = []
    for text, font in zip(lines, fonts):
        bbox = draw.textbbox((0, 0), text, font=font)
        heights.append(bbox[3] - bbox[1])
    gap = 12
    total_height = sum(heights) + gap
    y = 865 - total_height // 2
    placements = []
    for text, font, height in zip(lines, fonts, heights):
        bbox = draw.textbbox((0, 0), text, font=font)
        width = bbox[2] - bbox[0]
        x = (size[0] - width) // 2 - bbox[0]
        placements.append((text, font, x, y - bbox[1]))
        draw.text((x, y - bbox[1]), text, font=font, fill=255)
        y += height + gap
    return mask, placements


def make_title_gradient(
    size: tuple[int, int],
    top: tuple[int, int, int],
    bottom: tuple[int, int, int],
) -> Image.Image:
    gradient = Image.new("RGBA", size)
    pixels = gradient.load()
    for y in range(size[1]):
        t = y / max(1, size[1] - 1)
        color = tuple(round(a + (b - a) * t) for a, b in zip(top, bottom))
        for x in range(size[0]):
            pixels[x, y] = (*color, 255)
    return gradient


def add_title_card(stage: int) -> Path:
    source = Image.open(SOURCE_DIR / f"boss{stage}_splash.webp").convert("RGB")
    poster = ImageOps.fit(
        source,
        (1000, 1500),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    ).convert("RGBA")

    # A feathered smoke band keeps every generated environment behind the title
    # readable without replacing or hiding the boss artwork.
    band = Image.new("RGBA", poster.size, (0, 0, 0, 0))
    band_pixels = band.load()
    for y in range(680, 1070):
        edge = min((y - 680) / 120, (1070 - y) / 120, 1.0)
        alpha = round(max(0.0, edge) * 178)
        for x in range(poster.width):
            horizontal = 0.82 + 0.18 * math.sin(math.pi * x / poster.width)
            band_pixels[x, y] = (4, 4, 8, round(alpha * horizontal))
    poster = Image.alpha_composite(poster, band)

    lines = BOSS_TITLES[stage]
    top, bottom, stroke = TITLE_PALETTES[stage]
    mask, placements = title_mask(poster.size, lines)

    draw = ImageDraw.Draw(poster)
    for text, font, x, y in placements:
        draw.text(
            (x + 4, y + 7),
            text,
            font=font,
            fill=(0, 0, 0, 205),
            stroke_width=8,
            stroke_fill=(0, 0, 0, 205),
        )
        draw.text(
            (x, y),
            text,
            font=font,
            fill=stroke,
            stroke_width=6,
            stroke_fill=(8, 5, 5, 245),
        )

    gradient = make_title_gradient(poster.size, top, bottom)
    poster = Image.composite(gradient, poster, mask)

    output = UI_DIR / f"boss-stage{stage}.webp"
    poster.convert("RGB").save(output, "WEBP", quality=90, method=6)
    return output


def main() -> None:
    outputs: list[Path] = []
    for stage in range(7, 13):
        views = split_turnaround(stage)
        for view_name, view_image in views.items():
            outputs.append(build_walk_sheet(stage, view_name, view_image))
        outputs.append(add_title_card(stage))

    for output in outputs:
        image = Image.open(output)
        relative = output.relative_to(ROOT)
        print(f"{relative.as_posix()}: {image.size} {image.mode}")


if __name__ == "__main__":
    main()
