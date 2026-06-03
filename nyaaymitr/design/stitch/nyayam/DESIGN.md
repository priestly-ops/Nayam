---
name: Nyayam
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#45464e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#505e7f'
  primary: '#000518'
  on-primary: '#ffffff'
  primary-container: '#0f1e3c'
  on-primary-container: '#7886aa'
  inverse-primary: '#b8c6ed'
  secondary: '#a83900'
  on-secondary: '#ffffff'
  secondary-container: '#fe6a2a'
  on-secondary-container: '#5b1b00'
  tertiary: '#0b0600'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a1d00'
  on-tertiary-container: '#a8811d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b8c6ed'
  on-primary-fixed: '#0b1b38'
  on-primary-fixed-variant: '#394666'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb59a'
  on-secondary-fixed: '#380d00'
  on-secondary-fixed-variant: '#802a00'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#eec058'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  hindi-body:
    fontFamily: Noto Sans Devanagari
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.8'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system for this platform balances the gravity of the legal profession with the warmth of a community-focused service. It is designed to evoke a sense of **Institutional Trust** and **Approachable Authority**.

The aesthetic follows a **Corporate Modern** style enriched by high-contrast editorial typography. It prioritizes clarity and legibility to reduce the cognitive load often associated with legal processes. Visual elements are structured and precise, using a mix of deep navy for stability and saffron for energetic guidance. The experience should feel like stepping into a well-organized, prestigious office that remains welcoming to every citizen.

## Colors
The palette is rooted in the "Deep Navy" primary, representing wisdom and the depth of the law. "Saffron" serves as the primary action color, providing a warm, high-visibility contrast that guides the user toward key interactions. "Gold" is used sparingly for highlights, achievements, and premium tiers to signify value and excellence.

**Usage Guidelines:**
- **Primary (Navy):** Used for navigation bars, primary text, and grounding elements.
- **Secondary (Saffron):** Reserved for primary Call-to-Actions (CTAs) and active status indicators.
- **Tertiary (Gold):** Used for iconography accents and subtle borders on featured content.
- **Backgrounds:** Maintain a clean white background for readability, using light grey for section staggering.

## Typography
The typography strategy utilizes a "Serif for Headlines, Sans for Body" pairing to establish a traditional yet modern hierarchy. 

**Playfair Display** provides the authoritative, editorial voice required for legal headings. **DM Sans** is used for all functional text to ensure high legibility in dense legal documents. **Noto Sans Devanagari** is integrated to provide a seamless multilingual experience for Hindi users, with adjusted line-heights (1.8) to accommodate the taller character strokes of the script. 

Always ensure a minimum contrast ratio of 4.5:1 for body text against backgrounds.

## Layout & Spacing
The design system employs a **12-column Fluid Grid** for desktop and a **4-column Fluid Grid** for mobile. 

A strict 8px spatial scale governs the rhythm of the UI. Vertical rhythm is maintained by using 24px (lg) or 40px (xl) between major sections. For internal component spacing, use 16px (md) as the standard padding. To accommodate legal documents, use wider margins (64px) on desktop to create a focused, centered reading experience that prevents eye fatigue.

## Elevation & Depth
This design system uses **Tonal Layers** supplemented by **Ambient Shadows** to create a structured hierarchy. Depth is not used for decoration but to indicate "interactability" and "priority."

- **Level 0 (Base):** White background. No shadow.
- **Level 1 (Cards):** Use a soft, diffused shadow (0px 4px 20px rgba(15, 30, 60, 0.05)) to separate content blocks from the background.
- **Level 2 (Hover/Active):** Increase shadow spread and add a subtle 1px border in the Primary Navy at 10% opacity.
- **Level 3 (Modals/Popovers):** Deeper shadow (0px 12px 32px rgba(15, 30, 60, 0.12)) with a 40% backdrop blur on the layer beneath to keep the user focused on the legal task at hand.

## Shapes
The shape language is defined by **Rounded** corners, specifically targeting an 8px to 12px range. 

- **Standard Elements (Inputs, Buttons):** 8px radius (0.5rem).
- **Containers (Cards, Sections):** 16px radius (1rem) for a softer, more modern enclosure.
- **Feedback Elements (Toasts):** 12px radius (0.75rem).

Avoid sharp 0px corners to maintain the "approachable" brand pillar, but also avoid pill-shapes for main structural elements to keep the "professional" tone.

## Components
Consistent component styling ensures the platform feels reliable and cohesive.

- **Buttons:** 
  - *Primary:* Saffron background, White text. Bold weight. 8px radius.
  - *Secondary:* Navy background, White text. For less urgent actions.
  - *Tertiary:* Transparent background, Navy text with a Gold bottom border (2px) on hover.
- **Input Fields:** 
  - Use a 1px border (#DEE2E6). On focus, the border shifts to Saffron with a 2px outer glow. Labels should always be visible above the input, never just as placeholder text.
- **Cards:** 
  - White surface with a Level 1 shadow. Headers within cards should use Playfair Display (headline-sm).
- **Chips:** 
  - Used for "Legal Categories" (e.g., Family Law, Property). Use a light Navy tint (5% opacity) with Navy text.
- **Progress Indicators:** 
  - For long legal filings, use a "Stepped" progress bar using Gold to indicate completed steps and Saffron for the active step.
- **Legal Badges:** 
  - Small icons or labels using the Gold tertiary color to denote verified lawyers or certified documents.