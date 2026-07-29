"""Build Varyn's eight-direction battlefield animation sheet.

The runtime sheet keeps five authored directions and mirrors the three
right-facing intermediate rows for their left-facing counterparts.  The first
five rows contain a twenty-frame walk cycle; the next five contain a dedicated
twenty-frame sword attack built from the matching generated strike turnaround.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
IDLE_SOURCE = ROOT / "source-art" / "hero" / "varyn-battlefield-5view-alpha.webp"
ATTACK_SOURCE = ROOT / "source-art" / "hero" / "varyn-battlefield-5view-attack-v2-alpha.webp"
OUTPUT = ROOT / "assets" / "ui" / "varyn-battlefield-walk.webp"

FRAME_SIZE = 128
WALK_FRAME_COUNT = 20
ATTACK_FRAME_COUNT = 20
CONTENT_WIDTH = 112
CONTENT_HEIGHT = 112
VIEWS = ("front", "frontQuarter", "side", "backQuarter", "back")


def trim_transparent(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    solid = alpha.point(lambda value: 255 if value > 12 else 0)
    bbox = solid.getbbox()
    if not bbox:
        raise ValueError("Generated hero view contains no opaque pixels.")
    return image.crop(bbox)


def split_turnaround(source_path: Path) -> dict[str, Image.Image]:
    source = Image.open(source_path).convert("RGBA")
    alpha = source.getchannel("A")
    solid = alpha.point(lambda value: 255 if value > 12 else 0)
    pixels = solid.load()

    def find_seed(expected_x: int, expected_y: int) -> tuple[int, int]:
        if pixels[expected_x, expected_y]:
            return expected_x, expected_y
        for radius in range(2, 121, 2):
            left = max(0, expected_x - radius)
            right = min(source.width - 1, expected_x + radius)
            top = max(0, expected_y - radius)
            bottom = min(source.height - 1, expected_y + radius)
            for x in range(left, right + 1, 2):
                if pixels[x, top]:
                    return x, top
                if pixels[x, bottom]:
                    return x, bottom
            for y in range(top, bottom + 1, 2):
                if pixels[left, y]:
                    return left, y
                if pixels[right, y]:
                    return right, y
        raise ValueError(f"Could not find an opaque seed in {source_path.name}.")

    views: dict[str, Image.Image] = {}
    expected_y = round(source.height * 0.4)
    for index, view in enumerate(VIEWS):
        expected_x = round(source.width * (index + 0.5) / len(VIEWS))
        seed = find_seed(expected_x, expected_y)
        component = solid.copy()
        ImageDraw.floodfill(component, seed, 128, thresh=0)
        component = component.point(lambda value: 255 if value == 128 else 0)
        component_alpha = ImageChops.multiply(alpha, component)
        bbox = component_alpha.getbbox()
        if not bbox:
            raise ValueError(f"Generated {view} view contains no opaque pixels.")
        isolated = source.copy()
        isolated.putalpha(component_alpha)
        views[view] = isolated.crop(bbox)
    return views


def fit_character(image: Image.Image) -> Image.Image:
    image = trim_transparent(image)
    scale = min(CONTENT_WIDTH / image.width, CONTENT_HEIGHT / image.height)
    size = (
        max(1, round(image.width * scale)),
        max(1, round(image.height * scale)),
    )
    return image.resize(size, Image.Resampling.LANCZOS)


def normalize_view(character: Image.Image, view: str) -> Image.Image:
    # Generated intermediate views look toward screen-left. Normalize them to
    # face right; runtime canvas mirroring supplies the opposite diagonals.
    if view in {"frontQuarter", "side", "backQuarter"}:
        return character.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    return character


def transformed_character(
    character: Image.Image,
    *,
    scale_x: float = 1.0,
    scale_y: float = 1.0,
    rotation: float = 0.0,
) -> Image.Image:
    transformed = character.resize(
        (
            max(1, round(character.width * scale_x)),
            max(1, round(character.height * scale_y)),
        ),
        Image.Resampling.LANCZOS,
    )
    if abs(rotation) > 0.01:
        transformed = transformed.rotate(
            rotation,
            resample=Image.Resampling.BICUBIC,
            expand=True,
            fillcolor=(0, 0, 0, 0),
        )
    return transformed


def compose_frame(
    character: Image.Image,
    *,
    x_offset: float = 0.0,
    y_offset: float = 0.0,
) -> Image.Image:
    frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    x = (FRAME_SIZE - character.width) // 2 + round(x_offset)
    y = FRAME_SIZE - character.height - 4 + round(y_offset)
    frame.alpha_composite(character, (x, y))
    return frame


def walk_frame(character: Image.Image, frame_index: int, view: str) -> Image.Image:
    phase = frame_index / WALK_FRAME_COUNT * math.tau
    stride = math.sin(phase)
    step = math.sin(phase * 2)
    toe_phase = math.sin(phase * 2 + math.pi / 3)
    diagonal = view in {"frontQuarter", "backQuarter"}

    # Twenty samples make the stronger movement from v0.11.19 visibly smooth.
    # The extra toe phase prevents the motion from feeling like a simple scale
    # pulse while the grounded idle frame remains perfectly stable.
    bob = -abs(step) * (7.2 if view == "side" else 6.2)
    bob -= max(0.0, toe_phase) * 1.1
    sway = (3.1 if view == "side" else 2.6 if diagonal else 2.0) * stride
    stretch = 1.0 + abs(step) * 0.034
    squash = 1.0 - abs(step) * 0.024
    drift = stride * (4.4 if view == "side" else 3.5 if diagonal else 1.5)

    transformed = transformed_character(
        character,
        scale_x=squash,
        scale_y=stretch,
        rotation=sway,
    )
    return compose_frame(transformed, x_offset=drift, y_offset=bob)


def attack_frame(
    idle_character: Image.Image,
    strike_character: Image.Image,
    frame_index: int,
    view: str,
) -> Image.Image:
    progress = frame_index / max(1, ATTACK_FRAME_COUNT - 1)
    diagonal = view in {"frontQuarter", "backQuarter"}
    directional = view == "side" or diagonal

    # Wind-up: the normal sword position draws back with the whole upper body.
    if progress < 0.20:
        windup = math.sin(progress / 0.20 * math.pi / 2)
        transformed = transformed_character(
            idle_character,
            scale_x=1.0 - windup * 0.018,
            scale_y=1.0 + windup * 0.015,
            rotation=-windup * (5.0 if directional else 3.5),
        )
        return compose_frame(
            transformed,
            x_offset=-windup * (2.5 if directional else 1.0),
            y_offset=-windup * 0.8,
        )

    # Contact and follow-through use the authored slash pose. Rotating and
    # translating it across these frames creates a readable blade sweep even
    # after the sheet is reduced to the 46px runtime character.
    if progress < 0.78:
        strike = (progress - 0.20) / 0.58
        ease = math.sin(strike * math.pi)
        rotation = 7.0 - strike * 14.0
        transformed = transformed_character(
            strike_character,
            scale_x=1.0 + ease * 0.035,
            scale_y=1.0 - ease * 0.018,
            rotation=rotation if directional else rotation * 0.72,
        )
        return compose_frame(
            transformed,
            x_offset=(1.5 + ease * 5.2) if directional else ease * 2.0,
            y_offset=-ease * 2.2,
        )

    # Recovery returns to the original guard without leaving a frozen strike
    # frame between rapid attacks.
    recover = (progress - 0.78) / 0.22
    remaining = 1.0 - recover
    transformed = transformed_character(
        idle_character,
        scale_x=1.0 - remaining * 0.012,
        scale_y=1.0 + remaining * 0.01,
        rotation=remaining * (3.0 if directional else 2.0),
    )
    return compose_frame(
        transformed,
        x_offset=remaining * (2.0 if directional else 0.8),
        y_offset=-remaining * 0.6,
    )


def main() -> None:
    idle_views = split_turnaround(IDLE_SOURCE)
    attack_views = split_turnaround(ATTACK_SOURCE)
    sheet = Image.new(
        "RGBA",
        (FRAME_SIZE * WALK_FRAME_COUNT, FRAME_SIZE * len(VIEWS) * 2),
        (0, 0, 0, 0),
    )

    for row, view in enumerate(VIEWS):
        idle_character = normalize_view(fit_character(idle_views[view]), view)
        strike_character = normalize_view(fit_character(attack_views[view]), view)

        for frame_index in range(WALK_FRAME_COUNT):
            sheet.alpha_composite(
                walk_frame(idle_character, frame_index, view),
                (frame_index * FRAME_SIZE, row * FRAME_SIZE),
            )

        attack_row = row + len(VIEWS)
        for frame_index in range(ATTACK_FRAME_COUNT):
            sheet.alpha_composite(
                attack_frame(idle_character, strike_character, frame_index, view),
                (frame_index * FRAME_SIZE, attack_row * FRAME_SIZE),
            )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUTPUT, "WEBP", lossless=True, method=6, exact=True)
    print(f"Built {OUTPUT.relative_to(ROOT)}: {sheet.size} {sheet.mode}")


if __name__ == "__main__":
    main()
