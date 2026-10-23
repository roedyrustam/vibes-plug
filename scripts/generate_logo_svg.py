import base64
import os
from PIL import Image, ImageDraw

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC_3D_JPG = r"C:\Users\roedy\.gemini\antigravity\brain\76504c5e-1d12-42d2-8075-4e7b268ee8de\vibes_plug_3d_logo_1792755272715.jpg"

def build_3d_logos():
    source_path = SRC_3D_JPG if os.path.exists(SRC_3D_JPG) else os.path.join(ROOT_DIR, "logo.jpg")
    img = Image.open(source_path).convert("RGBA")
    w, h = img.size

    # 1. Save full 1024x1024 3D logo with wordmark as logo.jpg
    logo_jpg_path = os.path.join(ROOT_DIR, "logo.jpg")
    img.convert("RGB").save(logo_jpg_path, "JPEG", quality=95)
    print(f"Saved {logo_jpg_path} ({w}x{h})")

    # 2. Crop 3D sculptural emblem (centered on 3D neural brain + titanium plug + orbital nodes, above wordmark)
    crop_box = (int(w * 0.16), int(h * 0.07), int(w * 0.84), int(h * 0.75))
    emblem = img.crop(crop_box).resize((512, 512), Image.Resampling.LANCZOS)

    for icon_rel in ["icon.png", os.path.join("assets", "icon.png")]:
        out_path = os.path.join(ROOT_DIR, icon_rel)
        emblem.save(out_path, "PNG", optimize=True)
        print(f"Saved {out_path} (512x512)")

    # 3. Create rounded squircle 3D app icon (Apple HIG / VSCode Marketplace style)
    mask = Image.new("L", (512, 512), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, 511, 511), radius=108, fill=255)

    rounded_emblem = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    rounded_emblem.paste(emblem, (0, 0), mask=mask)

    border_layer = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(border_layer)
    bdraw.rounded_rectangle((1, 1, 510, 510), radius=108, outline=(6, 182, 212, 95), width=2)
    rounded_emblem = Image.alpha_composite(rounded_emblem, border_layer)

    png_targets = [
        "logo.png",
        os.path.join("assets", "logo.png"),
        os.path.join("assets", "vibes-logo.png"),
        os.path.join("assets", "logo_transparent.png"),
        os.path.join("extensions", "vscode", "icon.png"),
        os.path.join("showcase", "vibes-logo.png"),
    ]
    for rel in png_targets:
        out_path = os.path.join(ROOT_DIR, rel)
        rounded_emblem.save(out_path, "PNG", optimize=True)
        print(f"Saved {out_path} (512x512 rounded 3D emblem)")

    # 4. Generate SVG wrappers
    png_path = os.path.join(ROOT_DIR, "assets", "logo.png")
    with open(png_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")

    svg_content = (
        '<svg width="256" height="256" viewBox="0 0 512 512" fill="none" '
        'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n'
        f'  <image href="data:image/png;base64,{b64}" width="512" height="512" />\n'
        '</svg>\n'
    )

    for svg_rel in ["logo.svg", os.path.join("assets", "logo.svg")]:
        svg_path = os.path.join(ROOT_DIR, svg_rel)
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        print(f"Saved {svg_path}")

if __name__ == "__main__":
    build_3d_logos()
