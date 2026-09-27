import os, sys
sys.path.insert(0, os.path.expandvars("$HOME/workspace/.pylibs"))
from playwright.sync_api import sync_playwright

URL = "http://localhost:8899/index.html"
OUT = os.path.expandvars("$HOME/workspace/preloved_shop/check")
os.makedirs(OUT, exist_ok=True)

errors = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 390, "height": 844})  # HP
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(URL, wait_until="networkidle")
    pg.wait_for_timeout(1200)

    # 1. Hero cards
    cards = pg.query_selector_all(".hero-card")
    print("hero cards:", len(cards))
    imgs = pg.query_selector_all(".hero-card img")
    print("hero imgs:", len(imgs))
    for i, im in enumerate(imgs):
        src = im.get_attribute("src")
        print(f"  card{i+1} src={src} loaded={im.evaluate('e=>e.complete&&e.naturalWidth>0')}")
    pg.screenshot(path=f"{OUT}/hero-light.png")

    # 2. Klik hero card -> modal
    cards[0].click()
    pg.wait_for_timeout(800)
    modal_open = pg.evaluate("document.getElementById('productModal').classList.contains('open')")
    print("modal open after hero click:", modal_open)
    pg.screenshot(path=f"{OUT}/modal.png")
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(400)

    # 3. Dark mode
    theme = pg.evaluate("document.documentElement.getAttribute('data-theme')")
    print("initial theme:", theme)
    pg.click("#themeToggle")
    pg.wait_for_timeout(600)
    theme2 = pg.evaluate("document.documentElement.getAttribute('data-theme')")
    saved = pg.evaluate("localStorage.getItem('sugarcloset_theme')")
    print("after toggle:", theme2, "| saved:", saved)
    pg.screenshot(path=f"{OUT}/hero-dark.png")
    pg.evaluate("window.scrollTo(0, 1400)")
    pg.wait_for_timeout(600)
    pg.screenshot(path=f"{OUT}/mid-dark.png")
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    pg.wait_for_timeout(600)
    pg.screenshot(path=f"{OUT}/bottom-dark.png")

    # 4. Balik ke light, cek ikon toggle
    pg.click("#themeToggle")
    pg.wait_for_timeout(400)
    print("back to:", pg.evaluate("document.documentElement.getAttribute('data-theme')"))

    b.close()

print("console errors:", len(errors))
for e in errors[:8]:
    print("  ERR:", e[:160])
print("DONE")
