import os
import math
from PIL import Image, ImageDraw, ImageFont

W, H = 960, 440
NUM_FRAMES = 50

# Load system fonts
font_title = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 16)
font_subtitle = ImageFont.truetype('C:\\Windows\\Fonts\\segoeui.ttf', 12)
font_badge = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 11)
font_director_title = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 13)
font_director_sub = ImageFont.truetype('C:\\Windows\\Fonts\\segoeui.ttf', 10)
font_card_num = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 10)
font_card_title = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 12)
font_card_body = ImageFont.truetype('C:\\Windows\\Fonts\\segoeui.ttf', 10)
font_card_status = ImageFont.truetype('C:\\Windows\\Fonts\\segoeuib.ttf', 9)
font_console = ImageFont.truetype('C:\\Windows\\Fonts\\consola.ttf', 11)

CARDS = [
    {
        "num": "01",
        "title": "Ideation & PRD",
        "skills": "brainstorming\nprd-architect",
        "color": (6, 182, 212),       # Cyan
        "hex": "#06b6d4",
        "msg": "[Phase 1/5] Swarm Director: Synthesizing PRD.md, ERD & Architecture Matrix...",
    },
    {
        "num": "02",
        "title": "UI/UX & Design",
        "skills": "senior-frontend\ntailwind-v4 • hig",
        "color": (168, 85, 247),     # Purple
        "hex": "#a855f7",
        "msg": "[Phase 2/5] Frontend Swarm: Scaffolding Tailwind v4, M3 tokens & glassmorphic UI...",
    },
    {
        "num": "03",
        "title": "Backend & DB",
        "skills": "js-backend • go\nmcp-architect",
        "color": (59, 130, 246),      # Blue
        "hex": "#3b82f6",
        "msg": "[Phase 3/5] Backend Swarm: Provisioning Hono/Bun APIs & Model Context Protocol...",
    },
    {
        "num": "04",
        "title": "Frontier AI & Voice",
        "skills": "voice-ai • graph-rag\nvector-db • evals",
        "color": (236, 72, 153),     # Pink / Magenta
        "hex": "#ec4899",
        "msg": "[Phase 4/5] AI Swarm: Ultra-low latency Voice (<300ms) & Neo4j GraphRAG active...",
    },
    {
        "num": "05",
        "title": "Hardening & Prod",
        "skills": "zero-to-prod\nproduction-hardener",
        "color": (16, 185, 129),     # Emerald Green
        "hex": "#10b981",
        "msg": "[Phase 5/5] QA Auditor: Running Zero-to-Prod gates — 140 Skills Certified (100%)",
    },
]

# Card layout
CARD_W = 168
CARD_H = 110
CARD_Y = 205
CARD_SPACING = 14
TOTAL_CARDS_W = len(CARDS) * CARD_W + (len(CARDS) - 1) * CARD_SPACING
START_X = (W - TOTAL_CARDS_W) // 2

for i, card in enumerate(CARDS):
    card["x1"] = START_X + i * (CARD_W + CARD_SPACING)
    card["x2"] = card["x1"] + CARD_W
    card["y1"] = CARD_Y
    card["y2"] = CARD_Y + CARD_H
    card["cx"] = card["x1"] + CARD_W // 2

DIRECTOR_CX = W // 2
DIRECTOR_CY = 112
DIRECTOR_W = 190
DIRECTOR_H = 64

def draw_lightning(draw, x, y, color='#38bdf8'):
    # Precise vector lightning bolt
    pts = [
        (x + 5, y),
        (x, y + 9),
        (x + 5, y + 9),
        (x + 2, y + 17),
        (x + 11, y + 6),
        (x + 6, y + 6),
        (x + 9, y)
    ]
    draw.polygon(pts, fill=color)

def draw_checkmark(draw, x, y, color='#10b981'):
    draw.line([(x, y + 4), (x + 3, y + 8)], fill=color, width=2)
    draw.line([(x + 3, y + 8), (x + 9, y)], fill=color, width=2)

def draw_play_arrow(draw, x, y, color):
    pts = [(x, y), (x + 7, y + 4), (x, y + 8)]
    draw.polygon(pts, fill=color)

frames = []

for frame_idx in range(NUM_FRAMES):
    img = Image.new('RGB', (W, H), '#080c16')
    draw = ImageDraw.Draw(img)

    # 1. Subtle background grid
    for gx in range(0, W, 32):
        draw.line([(gx, 0), (gx, H)], fill='#0d1527', width=1)
    for gy in range(0, H, 32):
        draw.line([(0, gy), (W, gy)], fill='#0d1527', width=1)

    # 2. Header
    draw.line([(START_X, 48), (START_X + TOTAL_CARDS_W, 48)], fill='#1e293b', width=1)
    
    # Title & icon
    draw_lightning(draw, START_X + 2, 20, '#38bdf8')
    draw.text((START_X + 20, 18), 'VIBES PLUG', fill='#38bdf8', font=font_title)
    draw.text((START_X + 135, 21), '— Universal Agentic Swarm Workflow (2026 Edition)', fill='#94a3b8', font=font_subtitle)

    # 144+ Skills Badge (Pill)
    badge_text = '144+ SKILLS ACTIVE'
    badge_w, badge_h = 138, 24
    badge_x = START_X + TOTAL_CARDS_W - badge_w
    badge_y = 17
    draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], radius=12, fill='#6d28d9', outline='#8b5cf6', width=1)
    draw.text((badge_x + 14, badge_y + 4), badge_text, fill='#ffffff', font=font_badge)

    # Determine active phase (0 to 4)
    phase_idx = min(frame_idx // 10, 4)
    phase_progress = (frame_idx % 10) / 9.0

    # Overall progress percentage
    pct = int(((frame_idx + 1) / NUM_FRAMES) * 100)

    # 3. Connector Lines from Director to Cards
    for i, card in enumerate(CARDS):
        c_x = card["cx"]
        c_y = card["y1"]
        d_x = DIRECTOR_CX
        d_y = DIRECTOR_CY + DIRECTOR_H // 2

        if i < phase_idx:
            line_color = '#1e3a5f'
            width = 1
        elif i == phase_idx:
            line_color = card["hex"]
            width = 2
        else:
            line_color = '#131d2e'
            width = 1

        draw.line([(d_x, d_y), (c_x, c_y)], fill=line_color, width=width)

    # 4. Animated Data Particles on Active Line
    active_card = CARDS[phase_idx]
    src_x, src_y = DIRECTOR_CX, DIRECTOR_CY + DIRECTOR_H // 2
    dst_x, dst_y = active_card["cx"], active_card["y1"]

    for p_offset in [0.0, 0.48]:
        t = (phase_progress + p_offset) % 1.0
        px = src_x + (dst_x - src_x) * t
        py = src_y + (dst_y - src_y) * t
        col = active_card["color"]
        draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=col)
        draw.ellipse([px - 2, py - 2, px + 2, py + 2], fill='#ffffff')

    # 5. Director Node (Center)
    dir_x1 = DIRECTOR_CX - DIRECTOR_W // 2
    dir_x2 = DIRECTOR_CX + DIRECTOR_W // 2
    dir_y1 = DIRECTOR_CY - DIRECTOR_H // 2
    dir_y2 = DIRECTOR_CY + DIRECTOR_H // 2

    # Outer glow pulse
    pulse_size = int(math.sin(frame_idx * 0.3) * 3)
    draw.rounded_rectangle(
        [dir_x1 - 4 - pulse_size, dir_y1 - 4 - pulse_size, dir_x2 + 4 + pulse_size, dir_y2 + 4 + pulse_size],
        radius=16,
        outline='#4c1d95',
        width=1
    )
    # Main node box
    draw.rounded_rectangle([dir_x1, dir_y1, dir_x2, dir_y2], radius=12, fill='#111827', outline='#8b5cf6', width=2)
    # Icon and Title
    draw.text((dir_x1 + 18, dir_y1 + 14), 'SWARM DIRECTOR', fill='#f8fafc', font=font_director_title)
    draw.text((dir_x1 + 18, dir_y1 + 36), 'AGY • Claude Code • Cursor', fill='#c084fc', font=font_director_sub)
    # Pulsing status dot with margin
    dot_col = '#10b981' if (frame_idx % 6 < 4) else '#059669'
    draw.ellipse([dir_x2 - 20, dir_y1 + 15, dir_x2 - 12, dir_y1 + 23], fill=dot_col)

    # 6. Domain Cards
    for i, card in enumerate(CARDS):
        is_active = (i == phase_idx)
        is_completed = (i < phase_idx)
        x1, y1, x2, y2 = card["x1"], card["y1"], card["x2"], card["y2"]

        if is_active:
            bg_col = '#0e172a'
            border_col = card["hex"]
            border_w = 2
            draw.rounded_rectangle([x1 - 2, y1 - 2, x2 + 2, y2 + 2], radius=10, outline=border_col, width=1)
        elif is_completed:
            bg_col = '#0a101f'
            border_col = '#1e293b'
            border_w = 1
        else:
            bg_col = '#090d16'
            border_col = '#151f32'
            border_w = 1

        draw.rounded_rectangle([x1, y1, x2, y2], radius=8, fill=bg_col, outline=border_col, width=border_w)

        # Phase number pill
        pill_w, pill_h = 24, 16
        pill_x = x1 + 10
        pill_y = y1 + 10
        if is_active:
            pill_fill = card["hex"]
            pill_txt_col = '#ffffff'
        elif is_completed:
            pill_fill = '#10b981'
            pill_txt_col = '#ffffff'
        else:
            pill_fill = '#1e293b'
            pill_txt_col = '#64748b'

        draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=4, fill=pill_fill)
        draw.text((pill_x + 5, pill_y + 1), card["num"], fill=pill_txt_col, font=font_card_num)

        # Card Title
        title_col = '#f8fafc' if is_active else ('#cbd5e1' if is_completed else '#64748b')
        draw.text((pill_x + pill_w + 6, pill_y + 1), card["title"], fill=title_col, font=font_card_title)

        # Skills list
        skills_col = '#94a3b8' if (is_active or is_completed) else '#475569'
        draw.text((x1 + 10, y1 + 38), card["skills"], fill=skills_col, font=font_card_body, spacing=3)

        # Status indicator at bottom of card
        if is_completed:
            draw_checkmark(draw, x1 + 10, y2 - 17, '#10b981')
            draw.text((x1 + 24, y2 - 18), 'COMPLETED', fill='#10b981', font=font_card_status)
        elif is_active:
            draw_play_arrow(draw, x1 + 10, y2 - 16, card["hex"])
            draw.text((x1 + 22, y2 - 18), 'EXECUTING...', fill=card["hex"], font=font_card_status)
            draw.ellipse([x2 - 18, y2 - 16, x2 - 10, y2 - 8], fill=card["hex"])
        else:
            draw.ellipse([x1 + 11, y2 - 15, x1 + 16, y2 - 10], outline='#475569', width=1)
            draw.text((x1 + 22, y2 - 18), 'QUEUED', fill='#475569', font=font_card_status)

    # 7. Bottom Console & Execution Monitor
    bar_x1 = START_X
    bar_x2 = START_X + TOTAL_CARDS_W
    bar_y1 = 338
    bar_y2 = 418
    draw.rounded_rectangle([bar_x1, bar_y1, bar_x2, bar_y2], radius=8, fill='#0a101f', outline='#1e293b', width=1)

    # Console text with blinking cursor
    cursor = '█' if (frame_idx % 4 < 2) else ' '
    draw.text((bar_x1 + 16, bar_y1 + 14), active_card["msg"] + cursor, fill='#e2e8f0', font=font_console)

    # Progress bar track
    pb_x1 = bar_x1 + 16
    pb_x2 = bar_x2 - 16
    pb_y1 = bar_y1 + 42
    pb_y2 = pb_y1 + 16
    draw.rounded_rectangle([pb_x1, pb_y1, pb_x2, pb_y2], radius=4, fill='#0f172a', outline='#1e293b', width=1)

    # Progress bar fill
    fill_w = max(int((pb_x2 - pb_x1) * (pct / 100.0)), 14)
    fill_col = active_card["hex"]
    draw.rounded_rectangle([pb_x1 + 1, pb_y1 + 1, pb_x1 + fill_w - 1, pb_y2 - 1], radius=3, fill=fill_col)

    # Progress percentage label
    pct_text = f'{pct}% Complete'
    draw.text((pb_x2 - 82, pb_y1 + 2), pct_text, fill='#ffffff' if pct > 85 else '#94a3b8', font=font_card_num)

    frames.append(img)

# Save as animated GIF
PLUGIN_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_path = os.path.join(PLUGIN_ROOT, 'vibes-swarm-demo.gif')
frames[0].save(
    output_path,
    save_all=True,
    append_images=frames[1:],
    duration=80,
    loop=0,
    optimize=True
)

file_size = os.path.getsize(output_path)
print(f'Generated {output_path}: {file_size / 1024:.1f} KB, {NUM_FRAMES} frames')
