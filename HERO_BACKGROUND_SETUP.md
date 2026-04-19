# Cynevor Hero Background Image Setup

## Overview

The website now uses a shared, premium hero background system across all 8 pages. The system consists of:

- **Shared background image** at `assets/images/cynevor-hero.jpg`
- **Dark gradient overlay** ensuring text readability
- **Subtle radial highlight** for visual depth
- **Responsive behavior** with fixed attachment on desktop, scroll on mobile
- **Enhanced hero panels** with blur effect and premium styling

---

## Implementation Summary

### Files Updated

1. **assets/css/styles.css** (3 changes)
   - Updated `.hero` class to include background image URL with gradient overlay
   - Added `.hero--home` modifier for homepage (slightly taller: `var(--space-8) 0 var(--space-7)`)
   - Enhanced `.hero-panel` with `backdrop-filter: blur(10px)`, improved transparency, and stronger border
   - Updated z-index layering: pseudo-elements now use z-index 0 and 1, content uses z-index 2
   - Added `@media (max-width: 760px)` rule to switch `background-attachment: scroll` on mobile
   - Updated `--hero-overlay` gradient for better image compatibility

2. **index.html** (1 change)
   - Updated homepage hero from `<section class="hero">` to `<section class="hero hero--home">`
   - This makes the homepage hero slightly taller while keeping the visual consistency

3. **Other pages** (no changes needed)
   - about.html, mission.html, values.html, academy.html, careers.html, foundation.html, dei.html
   - All continue to use `<section class="hero">` with default inner-page sizing
   - Automatically inherit the new background image treatment

---

## Hero Background System Details

### CSS Architecture

```css
/* Shared Hero Background */
.hero {
  background:
    url("../images/cynevor-hero.jpg") center / cover no-repeat,
    linear-gradient(180deg, #0c1321 0%, #111b2e 100%);
  background-attachment: fixed; /* Parallax effect on desktop */
}

/* Dark overlay for text readability */
.hero::before {
  background: linear-gradient(135deg, rgba(13, 20, 35, 0.88), rgba(16, 24, 38, 0.82));
  z-index: 0;
}

/* Subtle radial highlight */
.hero::after {
  background: radial-gradient(circle at center, rgba(141, 168, 187, 0.15), transparent 68%);
  z-index: 1;
}

/* Content sits on top */
.hero > .container {
  position: relative;
  z-index: 2;
}

/* Homepage modifier - slightly taller */
.hero--home {
  padding: var(--space-8) 0 var(--space-7);
}

/* Inner pages - default height */
.hero {
  padding: var(--space-7) 0 var(--space-6);
}
```

### Hero Panel Styling

The hero summary panels now feature:

```css
.hero-panel {
  background: rgba(15, 23, 39, 0.75);        /* Semi-transparent dark */
  backdrop-filter: blur(10px);                /* Glassmorphism effect */
  -webkit-backdrop-filter: blur(10px);        /* Safari support */
  border: 1px solid rgba(141, 168, 187, 0.35); /* Subtle accent border */
  border-radius: var(--radius-md);            /* Consistent rounding */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4); /* Premium shadow */
  padding: var(--space-4);
}
```

---

## How to Add the Background Image

### 1. Prepare Your Image

Your hero background image should be:

- **Dimensions:** 1920px × 1080px (or larger for retina displays)
- **Format:** JPG (optimised for web, ~200-400KB)
- **Content:** Calm Welsh landscape—misty mountains, lake, dawn/dusk light, heritage feel
- **Tone:** Dark enough (valleys/shaded areas preferred) so white text remains readable
- **Style:** Premium, atmospheric, understated; avoids overly saturated colors

### 2. Save the Image File

Place your optimised image at:

```
cynevor/assets/images/cynevor-hero.jpg
```

### 3. Optional: Test & Adjust Overlays

If the background is too bright or too dark, adjust the overlay opacity in `styles.css`:

```css
.hero::before {
  background: linear-gradient(135deg, 
    rgba(13, 20, 35, 0.88),  /* Adjust this value: higher = darker */
    rgba(16, 24, 38, 0.82)   /* Adjust this value: higher = darker */
  );
}
```

The current values (0.88 and 0.82) should work for most landscape images. If text becomes too faint, increase to 0.92 and 0.86.

---

## Visual Effect Breakdown

The layered hero effect works as follows:

1. **Base layer:** The background image itself
2. **Overlay #1 (::before):** Dark gradient (z-index 0) that darkens the image uniformly for text contrast
3. **Overlay #2 (::after):** Subtle radial highlight (z-index 1) that adds depth and draws the eye to the top-center
4. **Content (container):** All text, headlines, and buttons (z-index 2) sit cleanly on top

---

## Responsive Behavior

### Desktop (980px and above)

- `background-attachment: fixed` creates a parallax scrolling effect
- Hero image stays in place while content scrolls
- Premium, immersive feel

### Tablet (760px–980px)

- Uses `background-attachment: scroll` (switches at 760px via media query)
- Reduces jank and performance issues on smaller devices
- Image scrolls naturally with content

### Mobile (under 760px)

- Hero height: `var(--space-7) 0 var(--space-6)` (slightly compressed)
- `background-attachment: scroll` for smooth performance
- Background image still visible but optimised for smaller screens

---

## Accessibility & Performance Considerations

### Accessibility ✓

- **Text contrast:** Dark overlay ensures WCAG AA compliance with white/off-white text
- **Reduced motion:** No animations applied to the hero background; safe for `prefers-reduced-motion`
- **Keyboard navigation:** Hero content remains fully accessible
- **Alt text:** Background is decorative; content is semantic HTML

### Performance ✓

- **Parallax only on desktop:** Mobile uses scroll attachment to avoid janky effects
- **Background-attachment: fixed** supported on all modern browsers, but falls back gracefully
- **Single image file:** One optimised JPG reduces bandwidth (vs. multiple hi-res images)
- **CSS-only effects:** No JavaScript needed; minimal render impact

---

## Customisation Options

### 1. Adjust Overlay Intensity

Edit `--hero-overlay` in the `:root` section of `styles.css`:

```css
:root {
  --hero-overlay: linear-gradient(135deg, 
    rgba(13, 20, 35, 0.88),    /* Left side darkness */
    rgba(16, 24, 38, 0.82)     /* Right side darkness */
  );
}
```

- **Increase opacity** (e.g., 0.92) for darker, higher-contrast text
- **Decrease opacity** (e.g., 0.80) if your image is already very dark

### 2. Adjust Radial Highlight

Edit the `.hero::after` rule to change the subtle accent:

```css
.hero::after {
  background: radial-gradient(circle at center, 
    rgba(141, 168, 187, 0.15),  /* Increase to make brighter */
    transparent 68%
  );
}
```

### 3. Change Background Attachment Behaviour

If you don't want the parallax effect on desktop:

```css
.hero {
  background-attachment: scroll; /* Remove parallax */
}
```

### 4. Hero Panel Panel Blur Strength

Adjust the blur effect on the hero summary panel:

```css
.hero-panel {
  backdrop-filter: blur(10px);  /* Increase/decrease as needed */
}
```

---

## Hero Class System

| Page | Hero Class | Padding | Use Case |
|------|-----------|---------|----------|
| index.html | `hero hero--home` | `var(--space-8) 0 var(--space-7)` | Homepage—flagship, slightly taller |
| about.html | `hero` | `var(--space-7) 0 var(--space-6)` | Inner page—default height |
| mission.html | `hero` | `var(--space-7) 0 var(--space-6)` | Inner page—default height |
| values.html | `hero` | `var(--space-7) 0 var(--space-6)` | Inner page—default height |
| academy.html | `hero` | `var(--space-7) 0 var(--space-6)` | Inner page—default height |
| careers.html | `hero` | `var(--space-7) 0 var(--space-6)` | Inner page—default height |
| foundation.html | `hero` | `var(--space-7) 0 var(--space-6)` | Inner page—default height |
| dei.html | `hero` | `var(--space-7) 0 var(--space-6)` | Inner page—default height |

---

## Testing the System

### Before Adding Image

1. Open any page in the browser
2. Hero sections will show the fallback gradient (dark blue)
3. All text remains readable

### After Adding Image

1. Save `cynevor-hero.jpg` to `assets/images/`
2. Refresh the browser (hard refresh: Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Hero background image should appear across all pages
4. Test on different screen sizes and devices

---

## Browser Support

The hero background system works across all modern browsers:

- ✅ Chrome / Edge (88+)
- ✅ Firefox (87+)
- ✅ Safari (14+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** `backdrop-filter: blur()` is not supported in Firefox. The fallback is a semi-transparent background without blur—still readable and premium-looking.

---

## Next Steps

1. **Prepare a hero image** of a Welsh landscape (calm, misty, heritage feel)
2. **Optimise for web** (JPG, 1920×1080, ~200-400KB)
3. **Save to** `assets/images/cynevor-hero.jpg`
4. **Test on desktop and mobile** to ensure text readability
5. **Adjust overlay opacity** if needed for your specific image
6. **Share with stakeholders** for feedback on the cinematic feel

---

## Support & Troubleshooting

### Image not showing?

- Check the file path: `assets/images/cynevor-hero.jpg`
- Check file format: Must be JPG (not PNG or WebP without additional setup)
- Clear browser cache: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Text not readable?

- Increase overlay opacity in `--hero-overlay` (change 0.88 → 0.92)
- Use a darker section of your landscape image
- Ensure contrast ratio meets WCAG AA (4.5:1 for body text)

### Parallax jank on mobile?

- The system automatically switches to `background-attachment: scroll` below 760px
- If issues persist, reduce image file size or remove `background-attachment: fixed`

---

**Hero background system complete and ready for your branded image!**
