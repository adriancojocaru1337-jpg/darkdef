"""Build Varyn's runtime hero portrait from the generated source master."""

from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-art" / "hero" / "varyn-portrait-source.png"
OUTPUT = ROOT / "assets" / "ui" / "varyn-portrait.webp"
OUTPUT_SIZE = 512


def main() -> None:
    with Image.open(SOURCE) as source:
        image = source.convert("RGB")

    side = min(image.size)
    left = (image.width - side) // 2
    top = (image.height - side) // 2
    image = image.crop((left, top, left + side, top + side))
    image = image.resize((OUTPUT_SIZE, OUTPUT_SIZE), Image.Resampling.LANCZOS)
    image = ImageEnhance.Contrast(image).enhance(1.03)
    image = image.filter(ImageFilter.UnsharpMask(radius=0.8, percent=70, threshold=3))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT, "WEBP", lossless=True, method=6)
    print(f"Built {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
