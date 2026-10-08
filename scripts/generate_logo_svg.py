import base64
import os

png_path = os.path.join(os.path.dirname(__file__), "..", "assets", "logo.png")
svg_path = os.path.join(os.path.dirname(__file__), "..", "assets", "logo.svg")

with open(png_path, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

svg_content = f'''<svg width="256" height="256" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image href="data:image/png;base64,{b64}" width="512" height="512" />
</svg>
'''

with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print("assets/logo.svg generated successfully!")
