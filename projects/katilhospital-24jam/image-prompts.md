# Image prompts — katilhospital-24jam (katilhospitalmurah.com.my)

Paste-ready prompts for the images the homepage revamp needs, and where each finished
file goes.

| | |
|---|---|
| **Fleet rules** | `docs/image-generation-prompts.md` — read once; this file does not repeat it |
| **Design direction** | Pending — options A / B / C in the revamp preview artifact |
| **Who generates** | whoever runs the image model, from these prompts. We resize, place, and wire alt text in `en`, `ms`, `zh`. |

---

## Do NOT generate these

- **Customer gallery and reviews.** They must be real deliveries and real customers.
  A generated "customer" photo on a page that says *gambar pelanggan* is a fake
  testimonial.
- **Product photos.** They must show the exact model the client rents out. Product
  photos are webcore rows (`product_photos.url`), not files in `public/`.
- **`public/og-*.png`.** Those are screenshots of the live hero (`scripts/og-shot.mjs`).

## Fix, don't generate (ask the client)

| Image | Problem | Ask for |
|---|---|---|
| `tilam-hospital-foam.png`, `tilam-angin-anti-decubitus.png` | Carry a "MedBed" badge — another brand inside our product photo | Clean photos without the badge |
| Katil Hospital Flexi II - 3 Fungsi | Uses the Manual 2-Fungsi photo — two products, two prices, one picture | A photo of the Flexi II itself |
| `public/brand/reviews/*`, `public/brand/gallery/*` | Watermark says "Katil Hospital 24 Jam"; the site is "Katil Hospital Murah" | Confirm it is the same business, or unwatermarked originals |

---

## Where to put finished images

Drop full-resolution originals (PNG) in `projects/katilhospital-24jam/brand_assets/generated/`
and say when they are there. We resize, name and place the web copies, and add the alt
text in all three locales. Keep every web copy under 300 KB.

---

## House style — prepend this block to every prompt below

```
STYLE: Photorealistic editorial photography, natural daylight, shot on a
full-frame camera with a 35mm or 50mm lens, shallow-to-medium depth of field.
Colour-graded clean and slightly cool — soft whites and hospital blues, not
warm yellow. No HDR, no over-sharpening, no lens flare, no vignette.

SETTING: Malaysia. Ordinary Malaysian homes — terrace houses and apartments,
tiled floors, window grilles, sheer curtains, ceiling fans, simple wooden
furniture. Tidy but lived-in, never a showroom.

PEOPLE (only where the slot asks): Malaysian — Malay, Chinese and Indian
Malaysians. Modest everyday clothes. Mid-action, absorbed in caring for the
patient or in the task. Never posed at camera, never smiling at the lens;
faces turned away, in profile, or out of frame.

EQUIPMENT: Home-care hospital bed with white frame, blue headboard and
footboard panels, aluminium side rails, lockable castor wheels.

NEGATIVE: no text, no watermark, no logo, no signage in any language, no
brand badges, no readable screens, no hospital ward unless the slot asks, no
nurses or doctors in uniform, no stethoscope props, no American or European
interiors, no stock-photo handshake, no thumbs-up, no fake grin, no crying,
no distorted hands, no extra fingers, no plastic skin, no AI sheen.
```

Two negatives matter most here. **No doctors or nurses** — the business delivers
beds; a white coat implies medical staff it does not employ. **No faces at camera** —
these images illustrate care at home; they are not testimonials and must never read
as one.

---

## Manifest

| # | Slot | File to write | Size | Used in | Alt key | Status |
|---|---|---|---|---|---|---|
| 1 | Hero background | `public/brand/hero/bg-home-care.png` | 2400×1400 | Option B hero | `imageAlt` | needed if B |
| 2 | Step 3 — hantar & pasang | `public/brand/steps/step-install.png` | 1600×1200 | Steps section, all options | `howItWorks.s3.imageAlt` (new) | needed |
| 3 | Final CTA background | `public/brand/gallery/final-cta-home.png` | 2400×1200 | Final CTA, replaces the stock ward photo | `finalCta.bgAlt` | needed |
| 4 | Auto bed handset | `public/brand/features/auto-handset.png` | 1600×1200 | Katil Auto feature strip / blog | set on use | optional |
| 5 | Air mattress at home | `public/brand/features/air-mattress-home.png` | 1600×1200 | Tilam section / blog inline | set on use | optional |

---

## 1 · Hero background (Option B)

White headline text sits on the left over a navy gradient, so the **left 45% must
be calm**.

```
{HOUSE STYLE BLOCK}

SUBJECT: Care at home the day after hospital discharge. In a Malaysian
terrace-house bedroom, an elderly Malay man rests half-reclined on a home-care
electric hospital bed, a wired handset controller clipped to the side rail. His
adult daughter, in a simple pastel tudung and casual blouse, leans in to adjust
the pillow behind his shoulders. Both faces in soft profile, turned toward each
other, not toward camera. Bedside table with a glass of water and a folded towel.

COMPOSITION: Wide 16:9. Bed and people in the RIGHT third. The LEFT 45% is a
plain pale wall and a sheer-curtained window, out of focus, mid-tone enough to
carry white text under a dark overlay. Eye level.

LIGHT: Late-morning daylight through sheer curtains from the right. Soft, even,
calm.
```

→ `public/brand/hero/bg-home-care.png` · 2400×1400

## 2 · Step 3 — hantar & pasang

```
{HOUSE STYLE BLOCK}

SUBJECT: Two delivery technicians in plain navy-blue polo shirts and dark work
trousers — no logos or text on the clothing — assembling a home-care hospital
bed in the living room of a Malaysian terrace house. One kneels to lock a castor
wheel, the other fits the aluminium side rail. Flattened cardboard packaging
stacked neatly by the wall. Faces down, absorbed in the work.

COMPOSITION: 4:3, medium-wide, bed centred, both technicians fully in frame.
Tiled floor visible. Nothing crossing the top quarter.

LIGHT: Bright overcast daylight from the front door, even and shadowless.
```

→ `public/brand/steps/step-install.png` · 1600×1200

## 3 · Final CTA background

Centred text over a ~85% navy overlay, so the **centre must be open** and the
original **dark**.

```
{HOUSE STYLE BLOCK}

SUBJECT: A prepared room waiting for a patient to come home. A made-up
home-care hospital bed with side rails lowered beside a window at dusk, a folded
blanket and pillow on it, a wheelchair parked at the foot. No people.

COMPOSITION: Wide 2:1. Bed low and to the right edge, wheelchair at the left
edge. The CENTRE of the frame is an open plain wall and floor.

LIGHT: Blue hour through the window, one warm bedside lamp just switched on.
Overall exposure DARK — a bright original turns muddy grey under the overlay.
```

→ `public/brand/gallery/final-cta-home.png` · 2400×1200

## 4 · Auto bed handset (optional)

```
{HOUSE STYLE BLOCK}

SUBJECT: Close-up of an adult hand pressing a button on the wired handset
controller of an electric hospital bed; the bed's white backrest with blue trim
is rising, softly out of focus behind. No readable labels or symbols on the
handset buttons.

COMPOSITION: 4:3, handset in the left third, sharp focus on the thumb and
buttons, background bokeh.

LIGHT: Soft window daylight from the left.
```

→ `public/brand/features/auto-handset.png` · 1600×1200

## 5 · Air mattress at home (optional)

```
{HOUSE STYLE BLOCK}

SUBJECT: A beige alternating-pressure air mattress with bubble cells laid on a
home-care hospital bed, its small white air pump hooked on the footboard with the
tube running to the mattress. Clean folded bedsheet at the foot of the bed.
Malaysian apartment bedroom. No people.

COMPOSITION: 4:3, three-quarter view from the foot of the bed, the pump in the
foreground right.

LIGHT: Bright even daylight, clean whites.
```

→ `public/brand/features/air-mattress-home.png` · 1600×1200
