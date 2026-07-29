"""Decode every WebP and enforce the project's raster-format policy."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
LEGACY_SUFFIXES = {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tif", ".tiff"}
ALLOWED_LEGACY = {
    Path("favicon.png"),
    Path("og-image.png"),
}


def main() -> None:
    legacy = {
        path.relative_to(ROOT)
        for path in ROOT.rglob("*")
        if path.is_file() and path.suffix.lower() in LEGACY_SUFFIXES
    }
    if legacy != ALLOWED_LEGACY:
        unexpected = sorted(str(path) for path in legacy - ALLOWED_LEGACY)
        missing = sorted(str(path) for path in ALLOWED_LEGACY - legacy)
        raise SystemExit(f"Raster policy mismatch; unexpected={unexpected}, missing={missing}")

    webp_files = sorted(ROOT.rglob("*.webp"))
    total_bytes = 0
    for path in webp_files:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            if image.format != "WEBP" or image.width < 1 or image.height < 1:
                raise ValueError(f"Invalid WebP image: {path.relative_to(ROOT)}")
        total_bytes += path.stat().st_size

    print(f"validated {len(webp_files)} WebP files ({total_bytes:,} bytes)")
    print("legacy compatibility exceptions: favicon.png, og-image.png")


if __name__ == "__main__":
    main()
