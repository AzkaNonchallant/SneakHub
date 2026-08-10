---
name: Velocity Dark
colors:
  surface: "#131313"
  surface-dim: "#131313"
  surface-bright: "#393939"
  surface-container-lowest: "#0e0e0e"
  surface-container-low: "#1c1b1b"
  surface-container: "#201f1f"
  surface-container-high: "#2a2a2a"
  surface-container-highest: "#353534"
  on-surface: "#e5e2e1"
  on-surface-variant: "#e4beb4"
  inverse-surface: "#e5e2e1"
  inverse-on-surface: "#313030"
  outline: "#ab8980"
  outline-variant: "#5b4039"
  surface-tint: "#ffb5a0"
  primary: "#ffb5a0"
  on-primary: "#5f1500"
  primary-container: "#ff5722"
  on-primary-container: "#541200"
  inverse-primary: "#b02f00"
  secondary: "#c6c6c7"
  on-secondary: "#2f3131"
  secondary-container: "#454747"
  on-secondary-container: "#b4b5b5"
  tertiary: "#c8c6c5"
  on-tertiary: "#303030"
  tertiary-container: "#929090"
  on-tertiary-container: "#2a2a2a"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#ffdbd1"
  primary-fixed-dim: "#ffb5a0"
  on-primary-fixed: "#3b0900"
  on-primary-fixed-variant: "#862200"
  secondary-fixed: "#e2e2e2"
  secondary-fixed-dim: "#c6c6c7"
  on-secondary-fixed: "#1a1c1c"
  on-secondary-fixed-variant: "#454747"
  tertiary-fixed: "#e5e2e1"
  tertiary-fixed-dim: "#c8c6c5"
  on-tertiary-fixed: "#1b1c1c"
  on-tertiary-fixed-variant: "#474746"
  background: "#131313"
  on-background: "#e5e2e1"
  surface-variant: "#353534"
  success-green: "#4CAF50"
  warning-amber: "#FFC107"
  error-red: "#F44336"
  info-blue: "#2196F3"
  surface-elevated: "#1E1E1E"
  price-insight-neutral: "#9E9E9E"
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: "800"
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "800"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: "700"
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is built for a high-energy, premium sneaker marketplace. It balances the raw intensity of street culture with the analytical precision of a data-driven platform. The brand personality is **Energetic, Trustworthy, and Analytical**. It targets sneaker enthusiasts who value both style and technical verification.

The visual style is **Corporate Modern with High-Contrast / Bold** accents. It utilizes a predominantly dark color scheme to make colorful sneaker photography pop, while maintaining a clean, systematic structure that conveys transparency and intelligence through "Price Insights" and "Condition Scores."

Key visual principles:

- **Photography First:** Product images are the focal point, framed by high-contrast dark backgrounds.
- **Data Clarity:** Complex metrics (Match Scores, Trust Scores) are presented with technical precision using clean sans-serif typography.
- **Kinetic Accents:** The vibrant orange primary color is used sparingly but with high impact to drive action and highlight critical brand moments.

## Colors

The palette is anchored by a deep **#121212 (Neutral)** background to establish a premium, "night-mode" default. **Vibrant Orange (#FF5722)** serves as the high-energy primary color, reserved for primary CTAs, active states, and brand-critical indicators.

**Functional Color Strategy:**

- **Success/Active:** Use `#4CAF50` for "Verified" badges and "In Stock" indicators.
- **Price Insights:** Use the `#price-insight-neutral` (`#9E9E9E`) for market comparisons to maintain a non-judgmental, objective tone.
- **Scoring:** Condition and Match scores should utilize a semantic transition from `#error-red` (low) to `#warning-amber` (mid) to `#success-green` (high).
- **Text:** Primary text is `#FFFFFF` for maximum legibility against dark backgrounds, with secondary text in a muted gray to maintain hierarchy.

## Typography

This design system uses a triple-font approach to balance personality, readability, and technical data:

1.  **Plus Jakarta Sans (Headlines):** Friendly yet modern, used for high-impact marketing copy and section headers.
2.  **Hanken Grotesk (Body):** A sharp, contemporary sans-serif used for product descriptions and general UI text to ensure clarity at all sizes.
3.  **JetBrains Mono (Data & Scores):** A monospaced font used specifically for **Match Scores, Condition Scores, and Prices**. This reinforces the "analytical" side of the brand, making numerical data feel precise and calculated.

**Usage Notes:**

- Use `display-lg` for homepage heroes with tight letter spacing.
- Use `label-data` for all numerical scores (e.g., "98% Match").
- All status labels (e.g., "USED", "REFURBISHED") must use `label-caps`.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. It emphasizes generous vertical whitespace (Stack LG) between homepage sections to allow product categories to breathe.

**Layout Rules:**

- **Product Catalog:** Uses a responsive grid with a 24px gutter. On desktop, cards span 3 columns (4 per row). On mobile, cards span 2 columns (2 per row).
- **Dashboard Views:** Uses a "sidebar + main" fixed-fluid hybrid. The sidebar is fixed at 280px while the main content area expands.
- **Safe Zones:** High-contrast backgrounds must extend to the edges of the viewport, but content is constrained within the `container-max` (1280px).

## Elevation & Depth

To maintain a "High-End" feel, this design system avoids heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Surface Levels:**
    - **Level 0 (Base):** Deep black `#121212`.
    - **Level 1 (Cards/Surface):** Elevated surface `#1E1E1E`.
    - **Level 2 (Overlays/Modals):** Lighter surface `#2C2C2C` with a subtle 1px border of `#FFFFFF10`.
2.  **Glassmorphism:** Use backdrop blurs (20px) with 60% opacity on the navigation bar and "Search by Image" modals to maintain context of the underlying product grid.
3.  **Depth Indicators:** Instead of shadows, use subtle inner glows or "ghost borders" (1px solid with 10% white opacity) to define the edges of product cards against the dark background.

## Shapes

The shape language is **Soft (0.25rem)**. This "Sharp UI" approach ensures the marketplace feels professional, technical, and high-end, rather than overly "bubbly" or casual.

- **Product Cards:** Use a 4px (Soft) radius for the container and the image within.
- **Primary Buttons:** Maintain the 4px radius to match the technical aesthetic.
- **Status Badges:** Use "Pill" shapes (full roundedness) to clearly distinguish them from structural elements like cards and buttons.
- **Input Fields:** Sharp corners with a 2px radius for a precision-tool look.

## Components

### Product Cards

The centerpiece of the marketplace.

- **Structure:** Image container at the top, followed by a text stack.
- **Badges:** Top-left of the image for "Condition Score" (using JetBrains Mono). Top-right for "Match Score" % (using Primary Orange).
- **Price Insight:** Located below the price, using a small icon and muted gray text.

### Buttons

- **Primary:** Solid `#FF5722` with `#FFFFFF` text. No shadow, 4px radius.
- **Secondary/Search by Image:** Ghost style with `#FFFFFF20` border and icon.
- **Success Actions:** Solid `#4CAF50` for "Verified" or "Checkout" states.

### Status Badges

- Small, pill-shaped elements with a low-opacity background tint of their functional color (e.g., New = Success Green at 15% opacity with 100% opacity text).

### Input Fields

- Dark-themed inputs: `#1E1E1E` background with a 1px border that turns Primary Orange on focus. Labels use `label-caps` positioned above the field.

### Progress Scales (Scores)

- **Condition Meter:** A thin horizontal bar divided into segments (Upper, Outsole, etc.). Each segment fills based on the score, color-coded from Red to Green.
