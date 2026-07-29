"""Build runtime Act II mob art from generated three-view turnarounds."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "source" / "act2-mobs"
STATIC_DIR = ROOT / "assets2" / "enemies"
ANIMATED_DIR = STATIC_DIR / "animated"

FRAME_SIZE = 128
FRAME_COUNT = 12
CONTENT_SIZE = 110

MOBS = {
    "cinder_skirmisher": {
        "cuts": (489, 772),
        "height": 114,
        "width": 106,
        "sway": 1.15,
    },
    "hollow_binder": {
        "cuts": (415, 817),
        "height": 116,
        "width": 104,
        "sway": 0.65,
    },
    "ley_revenant": {
        "cuts": (489, 771),
        "height": 108,
        "width": 114,
        "sway": 0.55,
    },
}


def trim_transparent(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    solid = alpha.point(lambda value: 255 if value > 12 else 0)
    bbox = solid.getbbox()
    if not bbox:
        raise ValueError("Generated mob view contains no opaque pixels.")
    return image.crop(bbox)


def split_turnaround(name: str, cuts: tuple[int, int]) -> dict[str, Image.Image]:
    source = Image.open(SOURCE_DIR / f"{name}_alpha.webp").convert("RGBA")
    cut_one, cut_two = cuts
    return {
        "front": source.crop((0, 0, cut_one, source.height)),
        "side": source.crop((cut_one, 0, cut_two, source.height)),
        "back": source.crop((cut_two, 0, source.width, source.height)),
    }


def fit_character(
    image: Image.Image,
    max_width: int,
    max_height: int,
) -> Image.Image:
    image = trim_transparent(image)
    scale = min(max_width / image.width, max_height / image.height)
    size = (
        max(1, round(image.width * scale)),
        max(1, round(image.height * scale)),
    )
    return image.resize(size, Image.Resampling.LANCZOS)


def build_static_source(name: str, view: str, character: Image.Image) -> Path:
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    scale = min(460 / character.width, 476 / character.height)
    size = (
        max(1, round(character.width * scale)),
        max(1, round(character.height * scale)),
    )
    rendered = character.resize(size, Image.Resampling.LANCZOS)
    canvas.alpha_composite(
        rendered,
        ((512 - rendered.width) // 2, 500 - rendered.height),
    )
    suffix = "" if view == "front" else f"{view}_"
    output = STATIC_DIR / f"{name}_{suffix}rig_source.webp"
    canvas.save(output, "WEBP", lossless=True, method=6, exact=True)
    return output


def animated_frame(
    character: Image.Image,
    frame_index: int,
    view: str,
    sway_amount: float,
) -> Image.Image:
    phase = frame_index / FRAME_COUNT * math.tau
    stride = math.sin(phase)
    step = math.sin(phase * 2)
    bob = -round(abs(step) * (2.3 if view == "side" else 1.8))
    stretch = 1.0 + abs(step) * 0.012
    squash = 1.0 - abs(step) * 0.009
    transformed = character.resize(
        (
            max(1, round(character.width * squash)),
            max(1, round(character.height * stretch)),
        ),
        Image.Resampling.LANCZOS,
    )
    transformed = transformed.rotate(
        sway_amount * stride,
        resample=Image.Resampling.BICUBIC,
        expand=True,
        fillcolor=(0, 0, 0, 0),
    )

    frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    x = (FRAME_SIZE - transformed.width) // 2
    if view == "side":
        x += round(stride * 1.7)
    y = FRAME_SIZE - transformed.height - 4 + bob
    frame.alpha_composite(transformed, (x, y))
    return frame


def build_walk_sheet(
    name: str,
    view: str,
    character: Image.Image,
    sway_amount: float,
) -> Path:
    sheet = Image.new(
        "RGBA",
        (FRAME_SIZE * FRAME_COUNT, FRAME_SIZE),
        (0, 0, 0, 0),
    )
    for frame_index in range(FRAME_COUNT):
        frame = animated_frame(character, frame_index, view, sway_amount)
        sheet.alpha_composite(frame, (frame_index * FRAME_SIZE, 0))
    output = ANIMATED_DIR / f"{name}_{view}_walk.webp"
    sheet.save(output, "WEBP", lossless=True, method=6, exact=True)
    return output


def main() -> None:
    outputs: list[Path] = []
    for name, config in MOBS.items():
        views = split_turnaround(name, config["cuts"])
        for view, source in views.items():
            trimmed = trim_transparent(source)
            outputs.append(build_static_source(name, view, trimmed))
            fitted = fit_character(trimmed, config["width"], config["height"])
            outputs.append(
                build_walk_sheet(name, view, fitted, config["sway"])
            )

    for output in outputs:
        image = Image.open(output)
        print(f"{output.relative_to(ROOT).as_posix()}: {image.size} {image.mode}")


if __name__ == "__main__":
    main()
