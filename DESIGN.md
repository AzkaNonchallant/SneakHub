---
name: Performance Elite
colors:
  surface: "#f9f9f9"
  surface-dim: "#dadada"
  surface-bright: "#f9f9f9"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f3f3"
  surface-container: "#eeeeee"
  surface-container-high: "#e8e8e8"
  surface-container-highest: "#e2e2e2"
  on-surface: "#1b1b1b"
  on-surface-variant: "#4c4546"
  inverse-surface: "#303030"
  inverse-on-surface: "#f1f1f1"
  outline: "#7e7576"
  outline-variant: "#cfc4c5"
  surface-tint: "#5e5e5e"
  primary: "#000000"
  on-primary: "#ffffff"
  primary-container: "#1b1b1b"
  on-primary-container: "#848484"
  inverse-primary: "#c6c6c6"
  secondary: "#5d5f5f"
  on-secondary: "#ffffff"
  secondary-container: "#dfe0e0"
  on-secondary-container: "#616363"
  tertiary: "#000000"
  on-tertiary: "#ffffff"
  tertiary-container: "#001b3f"
  on-tertiary-container: "#2b82f4"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#e2e2e2"
  primary-fixed-dim: "#c6c6c6"
  on-primary-fixed: "#1b1b1b"
  on-primary-fixed-variant: "#474747"
  secondary-fixed: "#e2e2e2"
  secondary-fixed-dim: "#c6c6c7"
  on-secondary-fixed: "#1a1c1c"
  on-secondary-fixed-variant: "#454747"
  tertiary-fixed: "#d7e2ff"
  tertiary-fixed-dim: "#abc7ff"
  on-tertiary-fixed: "#001b3f"
  on-tertiary-fixed-variant: "#00458f"
  background: "#f9f9f9"
  on-background: "#1b1b1b"
  surface-variant: "#e2e2e2"
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 72px
    fontWeight: "700"
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 32px
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "700"
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px
    letterSpacing: 0em
spacing:
  base: 4px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1280px
---

## Brand & Style

The design system is built on a foundation of **Athletic Minimalism** and **Technical Precision**. It draws inspiration from high-performance sportswear—prioritizing speed, clarity, and structural integrity. The interface must feel authoritative to establish trust in the resale market, while remaining dynamic enough to appeal to sneaker enthusiasts.

The aesthetic utilizes a high-contrast palette, heavy-weight condensed typography, and a "form follows function" layout. Visual interest is driven by sharp geometry and the strategic use of "Digital Blue" to highlight advanced technological features like AI-driven price prediction and image search.

## Colors

This design system utilizes a high-contrast monochromatic core to provide a premium, editorial feel that allows the product photography to remain the focal point.

- **Primary & Secondary:** Pure Black and White are used to create "high-energy" contrast. Use black for primary actions and white for spacious, clean backgrounds.
- **Digital Blue:** Reserved strictly for technology-led features (Match Score, Price Prediction, Search by Image) and primary call-to-action highlights.
- **Semantic Palette:** Success Green is used for "High Trust" ratings and authenticity confirmation. Warning Orange is utilized for volatility in price alerts. Neutral Grey is used for metadata and secondary "Used/Refurbished" labels to maintain hierarchy.

## Typography

The typographic system creates a tension between **Industrial Impact** and **Systematic Utility**.

- **Headlines:** Use Archivo Narrow in bold weights. The condensed nature of the font allows for large-scale type that feels aggressive and athletic. All major headlines should be set in Uppercase to mimic high-end performance branding.
- **Body & Data:** Use Inter for all functional text. It provides the necessary neutrality and legibility required for financial transactions and technical specifications.
- **Micro-copy:** Use the `label-bold` style for tags, condition scores, and categories to ensure they stand out even at small sizes.

## Layout & Spacing

The layout follows a **Rigid Grid** philosophy. It uses a 12-column grid for desktop and a 4-column grid for mobile.

- **Rhythm:** All spacing is based on a 4px baseline shift. Use 16px (base _ 4) for standard padding and 32px (base _ 8) for sectional breathing room.
- **Alignment:** Elements should feel "locked" into the grid. Product cards in lists should have zero-gap borders or consistent 20px gutters depending on the density required.
- **Mobile Reflow:** On mobile, high-impact imagery should bleed edge-to-edge where possible to maximize the visual impact of the sneakers.

## Elevation & Depth

This design system avoids traditional soft shadows in favor of **Layered Flatness** and **High-Contrast Outlines**.

- **Tonal Layers:** Depth is communicated through color blocking (e.g., a light grey background for the page with white cards sitting on top).
- **Outlines:** Use 1px solid black or light-grey borders to define elements. This reinforces the "technical" and "engineered" feel of the brand.
- **Hard Shadows:** If elevation is absolutely necessary for interactive elements (like a hovering card), use a 4px hard-drop shadow with 100% opacity, offset by 4px, rather than a soft blur.

## Shapes

The shape language is **Strictly Geometric**.

- **Sharp Corners:** All primary buttons, input fields, and product cards must have 0px border-radius. Sharp corners communicate precision, speed, and a modern architectural aesthetic.
- **Exceptions:** Circular indicators may be used only for numerical "Match Score" percentages or "Trust Score" gauges to provide a visual counterpoint to the otherwise rectangular UI.

## Components

- **Primary Buttons:** Solid black fill, white uppercase text, 0px radius. On hover, the button should invert (white fill, black text, black border).
- **Secondary Buttons (Tech):** Solid 'Digital Blue' fill with white text, used specifically for "Calculate Price Prediction" or "Search by Image."
- **Condition Score Badges:** Small rectangular tags with a neutral grey background and black bold text (e.g., "9.5/10").
- **Product Cards:** Minimalist design with a 1px border. The price should be displayed in a large Archivo Narrow weight. The "Match Score" is located in the top-right corner, highlighted in Digital Blue.
- **Trust Score Visualizations:** A horizontal bar or circular gauge using the Success Green for high scores, providing immediate visual reassurance for used/refurbished listings.
- **Input Fields:** 1px black border, sharp corners, using Inter for placeholder text. The active state should trigger a 2px Digital Blue bottom border.
