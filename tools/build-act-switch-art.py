"""Build the two runtime act-selection emblems from generated source masters."""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "source-art" / "act-switches"
OUTPUT_DIR = ROOT / "assets" / "ui"
OUTPUT_SIZE = 320

EMBLEMS = {
    "act1-bastion-emblem-source.webp": "act1-emblem.webp",
    "act2-eastern-road-emblem-source.webp": "act2-emblem.webp",
}


def build_emblem(source_name: str, output_name: str) -> Path:
    image = Image.open(SOURCE_DIR / source_name).convert("RGB")
    side = min(image.size)
    left = (image.width - side) // 2
    top = (image.height - side) // 2
    image = image.crop((left, top, left + side, top + side))
    image = image.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)
    image = ImageEnhance.Contrast(image).enhance(1.04)
    image = image.filter(ImageFilter.UnsharpMask(radius=0.8, percent=75, threshold=3))

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / output_name
    image.save(output, "WEBP", lossless=True, method=6)
    return output


if __name__ == "__main__":
    for source, output in EMBLEMS.items():
        built = build_emblem(source, output)
        print(f"Built {built.relative_to(ROOT)}")
