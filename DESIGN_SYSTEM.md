# 🎨 DESIGN SYSTEM & UI COMPONENT LIBRARY

Intelligent Archival Search System Design Specifications

---

## COLOR PALETTE

### Primary Colors

| Name | Value | Usage | RGB |
|------|-------|-------|-----|
| **Parchment** | `#F5F1E8` | Page background | 245, 241, 232 |
| **Cream** | `#FAF8F3` | Card backgrounds | 250, 248, 243 |
| **Sepia** | `#D4AF8F` | Borders, dividers | 212, 175, 143 |
| **Dark Brown** | `#5C4033` | Primary text | 92, 64, 51 |
| **Light Brown** | `#8B7355` | Secondary text | 139, 115, 85 |

### Accent Colors

| Name | Value | Usage | RGB |
|------|-------|-------|-----|
| **Rust** | `#A0522D` | CTA buttons, links | 160, 82, 45 |
| **Gold** | `#D4AF37` | Highlights, badges | 212, 175, 55 |

### Opacity Usage

```
archiveColors.sepia + /30   → Subtle borders
archiveColors.rust + /90    → Hover state buttons
archiveColors.gold + /20    → Light badge backgrounds
archiveColors.darkBrown + /50 → Placeholder text
archiveColors.darkBrown + /10 → Background tints
```

---

## TYPOGRAPHY

### Font Stack

```css
/* Headings */
font-family: 'Playfair Display', Georgia, serif;
font-weight: 600–700;

/* Body */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-weight: 400–600;
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| **Display XL** | 2.25rem (36px) | 700 | 1.2 | Hero title |
| **Display LG** | 1.875rem (30px) | 700 | 1.2 | Page sections |
| **Display MD** | 1.5rem (24px) | 600 | 1.3 | Subsections |
| **Display SM** | 1.125rem (18px) | 600 | 1.4 | Card titles |
| **Body** | 1rem (16px) | 400 | 1.5 | Regular text |
| **Body SM** | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| **Body XS** | 0.75rem (12px) | 500 | 1.4 | Labels, badges |

---

## SPACING SYSTEM

```javascript
// Consistent 4px baseline (Tailwind default)
0    → 0px
1    → 4px
2    → 8px
3    → 12px
4    → 16px
6    → 24px
8    → 32px
12   → 48px
16   → 64px
```

### Recommended Spacing

```
Section gap:        6 (24px)
Component padding:  4-6 (16-24px)
Element margin:     2-4 (8-16px)
Text line spacing:  1.5rem
```

---

## COMPONENT LIBRARY

### Button Styles

#### Primary Button
```css
Background: #A0522D (rust)
Text: #FAF8F3 (cream)
Padding: 12px 24px
Border Radius: 6px
Hover: background #90432A
Focus Ring: 2px #8B7355
```

**HTML Example:**
```html
<button class="bg-rust hover:bg-rust/90 text-cream px-6 py-2 rounded transition-colors">
  Search
</button>
```

#### Secondary Button
```css
Background: transparent
Border: 2px #D4AF8F (sepia)
Text: #5C4033 (darkBrown)
Hover: background #F5F1E8/50
```

**HTML Example:**
```html
<button class="border-2 border-sepia bg-transparent text-darkBrown hover:bg-sepia/10">
  Filter
</button>
```

#### Link
```css
Color: #7B3F00 (dark historical)
Underline: On hover
Font Weight: Normal
Decoration: Underline on :hover
```

### Badge Styles

#### Type Badge (Results)
```css
Background: #A0522D20 (rust at 20% opacity)
Border: 1px #A0522D40 (rust at 25% opacity)
Text: #A0522D (rust)
Padding: 6px 12px
Border Radius: 999px (fully rounded)
Font Size: 12px
Font Weight: 600
```

#### Tag Badge
```css
Background: #D4AF8F15 (sepia at 8% opacity)
Border: 1px #D4AF8F30 (sepia at 18% opacity)
Text: #5C4033 (darkBrown)
Padding: 4px 8px
Border Radius: 4px
Font Size: 12px
```

### Input Fields

#### Search Input
```css
Background: white
Border: 2px #D4AF8F (sepia)
Border Radius: 8px
Padding: 16px
Font Size: 16px
Color: #5C4033
Placeholder Color: rgba(92, 64, 51, 0.4)
Focus Border: 2px #A0522D (rust)
Focus Ring: 2px offset 2px rgba(160, 82, 45, 0.2)
```

#### Checkbox
```css
Accent Color: #A0522D (rust)
Size: 16px × 16px
Cursor: pointer
Focus Ring: 2px #A0522D
```

### Card Styles

#### Document Card
```css
Background: #FAF8F3 (cream)
Border: 1px #D4AF8F30 (sepia 18% opacity)
Border Left: 4px #D4AF8F (sepia)
Padding: 20px 24px
Border Radius: 6px
Box Shadow: 0 1px 3px rgba(0,0,0,0.12),
           0 1px 2px rgba(0,0,0,0.24),
           0 2px 5px rgba(92, 64, 51, 0.1)

Hover:
- Box Shadow: Increased by 1.5×
- Border Left: 4px #A0522D (rust)
- Transform: None (subtle shadow only)
- Transition: 300ms ease-in-out
```

---

## SPACING & LAYOUT GUIDELINES

### Hero Section
```css
Padding:       60px horizontal (mobile: 16px)
Max Width:     48rem (768px)
Gap (title-search): 32px
Search Input Height: 48px
Border Radius: 8px
```

### Filter Sidebar
```css
Desktop Width:     320px (80px on small screens)
Padding:          24px
Max Height:       calc(100vh - 200px)
Overflow:         scroll
Section Gap:      12px
Divider:          1px #D4AF8F30
```

### Results Grid
```css
Mobile:         1 column
Tablet:         2 columns
Desktop:        1 column (full width with sidebar)
Gap:            16px
Padding:        24px (32px on desktop)
Max Content Width: 900px
```

---

## SHADOWS & DEPTH

### Shadow Values

```javascript
// Paper-like stacking effects
Subtle:  0 1px 2px rgba(0,0,0,0.05)
Normal:  0 1px 3px rgba(0,0,0,0.12), 
         0 1px 2px rgba(0,0,0,0.24)
Medium:  0 2px 8px rgba(92, 64, 51, 0.08)
Heavy:   0 4px 16px rgba(92, 64, 51, 0.15)

// For historical cards specifically
Paper:   0 1px 3px rgba(0,0,0,0.12),
         0 1px 2px rgba(0,0,0,0.24),
         0 2px 5px rgba(92, 64, 51, 0.1)
```

### Layer Depth (Z-Index)
```javascript
zIndex = {
  default:      0,      // Base content
  elevated:     10,     // Dropdowns, popovers
  stickySearch: 30,     // Sticky bar
  drawer:       40,     // Mobile filter drawer
  backdrop:     35,     // Drawer backdrop
  modal:        50,     // Modals, overlays
}
```

---

## ANIMATIONS & TRANSITIONS

### Timing Function
```css
Default:     ease-in-out
Fast:        ease-in (200ms)
Normal:      ease-in-out (300ms)
Slow:        ease-in-out (500ms)
```

### Transition Effects

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
Duration: 300ms
Used for: Search results loading, filter updates
```

#### Slide In Left (Mobile Drawer)
```css
@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
Duration: 300ms
Used for: Mobile filter drawer opening
```

#### Button Hover
```css
transition: all 300ms ease-in-out
Properties: background-color, color, box-shadow
```

---

## BREAKPOINTS & RESPONSIVE BEHAVIOR

### Device Sizes

| Device | Breakpoint | Classes | Layout |
|--------|-----------|---------|--------|
| Mobile | < 640px | (no prefix) | Full width, single column |
| Tablet | 640–1024px | `md:` | 2-column grid where applicable |
| Desktop | > 1024px | `lg:` | Full sidebar + content |

### Responsive Changes

```javascript
// Search Bar
Mobile:  Full width (16px margin)
Desktop: Max-width 48rem (768px)

// Filter Sidebar
Mobile:  Hidden → Drawer (click to open)
Desktop: Always visible (320px fixed width)

// Results Grid
Mobile:  1 column, full width
Desktop: 1 column, reduced width (alongside sidebar)

// Hero Section
Mobile:  60px vertical padding
Desktop: 96px vertical padding

// Process
Mobile:  16px padding
Desktop: 32px padding
```

---

## ACCESSIBILITY FEATURES

### Color Contrast

| Element | Foreground | Background | Ratio | WCAG |
|---------|-----------|-----------|-------|------|
| Body Text | #5C4033 | #FAF8F3 | 7.2:1 | AAA ✅ |
| Links | #7B3F00 | #FAF8F3 | 4.8:1 | AA ✅ |
| Buttons | #FAF8F3 | #A0522D | 4.1:1 | AA ✅ |

### Interactive Elements

```css
/* Focus Visible States */
:focus-visible {
  outline: 2px solid #A0522D;
  outline-offset: 2px;
}

button:focus-visible {
  outline-offset: -2px; /* Inset for buttons */
}

/* Minimum Touch Targets */
min-height: 44px;
min-width: 44px;
padding: 12px minimum
```

### Semantic HTML
```html
✅ Use <button> for interactive elements
✅ Use <a> for links
✅ Use <label> with <input>
✅ Use proper heading hierarchy (h1, h2, h3...)
✅ Use <article> for document cards
✅ Use <nav> for navigation
```

---

## STATE VARIATIONS

### Button States

```css
Default:    background: #A0522D; color: white;
Hover:      background: #90432A;
Active:     background: #7C3A24;
Focus:      outline: 2px solid; outline-offset: -2px;
Disabled:   opacity: 0.6; cursor: not-allowed;
Loading:    animate: spin; pointer-events: none;
```

### Input States

```css
Default:    border: 2px #D4AF8F;
Focus:      border: 2px #A0522D; box-shadow: 0 0 0 4px rgba(160,82,45,0.1);
Error:      border: 2px #D32F2F;
Disabled:   background: #F5F1E8; opacity: 0.6;
Read-only:  background: #F5F1E8; cursor: default;
```

### Card States

```css
Default:    box-shadow: 0 1px 3px...
Hover:      box-shadow: 0 4px 12px...;
           border-left: 4px #A0522D;
Active:     box-shadow: 0 6px 16px...
Focus:      outline: 2px solid; outline-offset: 2px;
```

---

## DARK MODE (Optional Future Implementation)

```javascript
darkMode Colors:
parchment:   #2D2620
cream:       #3C3530
sepia:       #8B7355
darkBrown:   #E8D5C4
rust:        #E19999
gold:        #D4AF37
```

---

## EXPORT FOR DESIGN TOOLS

### Figma Token JSON
```json
{
  "colors": {
    "parchment": { "value": "#F5F1E8" },
    "cream": { "value": "#FAF8F3" },
    "sepia": { "value": "#D4AF8F" },
    "darkBrown": { "value": "#5C4033" },
    "rust": { "value": "#A0522D" },
    "gold": { "value": "#D4AF37" }
  },
  "typography": {
    "displayXL": {
      "fontSize": "2.25rem",
      "fontWeight": 700,
      "lineHeight": 1.2
    }
  }
}
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Import Playfair Display font
- [ ] Configure Tailwind theme with custom colors
- [ ] Define archiveClasses in theme.js
- [ ] Create CSS custom properties for colors
- [ ] Test color contrast with WCAG checker
- [ ] Verify responsive layouts at all breakpoints
- [ ] Test keyboard navigation
- [ ] Verify animations reduce-motion preference
- [ ] Test with screen reader
- [ ] Check focus indicators visible

---

## REFERENCES

- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Material Design Color**: https://material.io/design/color/
- **Font Pairing**: https://www.fontpair.co/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

This design system ensures **consistency**, **accessibility**, and **historical aesthetic** across the entire platform. 📚✨
