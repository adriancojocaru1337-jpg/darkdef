"""Migrate legacy raster artwork to WebP and remove superseded originals.

PNG masters are encoded losslessly. Existing JPEG artwork and disposable
preview sheets use high-quality lossy WebP, which avoids preserving JPEG
artifacts byte-for-byte while reducing deployment and archive size.
"""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
LEGACY_SUFFIXES = {".png", ".jpg", ".jpeg"}
COMPATIBILITY_EXCEPTIONS = {
    Path("favicon.png"),
    Path("og-image.png"),
}
OBSOLETE_FILES = {
    Path("assets/ui/endless-unlocked.jpg"),
    Path("enemy-sprites-preview.png"),
    Path("splitter-preview.png"),
    Path("tmp/terrain-current-contact.png"),
}
LOSSY_PNG_PREVIEWS = {
    Path("tmp/stage-backgrounds-v2-contact.png"),
}


def relative(path: Path) -> Path:
    return path.relative_to(ROOT)


def has_alpha(image: Image.Image) -> bool:
    return "A" in image.getbands() or "transparency" in image.info


def convert(source: Path) -> tuple[Path, int, int]:
    source_size = source.stat().st_size
    destination = source.with_suffix(".webp")
    if destination.exists():
        raise FileExistsError(f"Refusing to overwrite {relative(destination)}")

    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        alpha = has_alpha(image)
        image = image.convert("RGBA" if alpha else "RGB")
        lossy = source.suffix.lower() in {".jpg", ".jpeg"} or relative(source) in LOSSY_PNG_PREVIEWS
        if lossy:
            image.save(destination, "WEBP", quality=90, method=6)
        else:
            image.save(destination, "WEBP", lossless=True, method=6, exact=True)

    with Image.open(destination) as check:
        check.load()
        if check.format != "WEBP" or check.size != image.size:
            destination.unlink(missing_ok=True)
            raise ValueError(f"Invalid WebP output for {relative(source)}")

    destination_size = destination.stat().st_size
    source.unlink()
    return destination, source_size, destination_size


def main() -> None:
    for obsolete in sorted(OBSOLETE_FILES):
        target = ROOT / obsolete
        if target.exists():
            size = target.stat().st_size
            target.unlink()
            print(f"removed unused {obsolete} ({size:,} bytes)")

    candidates = sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and path.suffix.lower() in LEGACY_SUFFIXES
        and relative(path) not in COMPATIBILITY_EXCEPTIONS
    )

    original_bytes = 0
    webp_bytes = 0
    for source in candidates:
        destination, before, after = convert(source)
        original_bytes += before
        webp_bytes += after
        print(f"converted {relative(source)} -> {relative(destination)} ({before:,} -> {after:,})")

    print(
        f"converted {len(candidates)} files; "
        f"saved {original_bytes - webp_bytes:,} bytes "
        f"({original_bytes:,} -> {webp_bytes:,})"
    )
    print("kept compatibility files: favicon.png, og-image.png")


if __name__ == "__main__":
    main()
