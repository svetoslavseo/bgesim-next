# Design Color Standards

## Overview
This document defines the official color palette and usage guidelines for the BG eSIM website. All components, pages, and design elements should adhere to these color standards to ensure visual consistency and brand identity.

## Primary Color Palette

### Core Colors

#### Black (#000000)
- **Usage**: Primary background for sections, buttons, and high-contrast elements
- **Applications**: 
  - Header backgrounds
  - Primary button backgrounds
  - Text on light backgrounds
  - Section dividers
- **CSS Variable**: `--color-black`

#### Neon Yellow (#e5e900)
- **Usage**: Primary accent color for buttons, highlights, and interactive elements
- **Applications**:
  - Primary call-to-action buttons
  - Hover states for links and buttons
  - Highlight elements
  - Active states
- **CSS Variable**: `--color-neon-yellow`
- **Hover State**: `--color-neon-yellow-hover` (slightly darker shade)

#### Bright Pink (#f878cd)
- **Usage**: Secondary accent color for links, gradients, and decorative elements
- **Applications**:
  - Link colors
  - Gradient backgrounds
  - Decorative elements
  - Secondary highlights
- **CSS Variable**: `--color-bright-pink`

### Gradient Colors

#### Purple Gradient
- **From**: #9068BE
- **To**: #B07FB3
- **Usage**: Background gradients for sections and decorative elements
- **CSS Variables**: 
  - `--gradient-purple-start: #9068BE`
  - `--gradient-purple-end: #B07FB3`

#### Muted Gold/Beige (#c7c804)
- **Usage**: Subtle accent in gradients and background elements
- **Applications**:
  - Gradient overlays
  - Subtle background accents
- **CSS Variable**: `--color-muted-gold`

#### Teal/Blue (#018fa6)
- **Usage**: Section dividers and accent elements
- **Applications**:
  - Section separators
  - Accent borders
  - Secondary interactive elements
- **CSS Variable**: `--color-teal`

## Color Usage Guidelines

### Button Colors
- **Primary Buttons**: Black background (#000000) with white text
- **Primary Button Hover**: Neon yellow background (#e5e900) with black text
- **Secondary Buttons**: Bright pink background (#f878cd) with white text
- **Link Buttons**: Bright pink text (#f878cd) with neon yellow hover (#e5e900)

### Link Colors
- **Default Links**: Bright pink (#f878cd)
- **Hover State**: Neon yellow (#e5e900)
- **Visited Links**: Slightly muted bright pink

### Background Colors
- **Primary Background**: White (#ffffff)
- **Secondary Background**: Light gray (#f9fafb)
- **Accent Backgrounds**: Purple gradient (#9068BE to #B07FB3)
- **Section Backgrounds**: Black (#000000) for high-contrast sections

### Text Colors
- **Primary Text**: Dark gray (#1a1a1a) on light backgrounds
- **Secondary Text**: Medium gray (#6b7280)
- **Text on Dark**: White (#ffffff)
- **Accent Text**: Bright pink (#f878cd) or neon yellow (#e5e900)

## Implementation Standards

### CSS Variables
All colors should be defined as CSS custom properties in `variables.module.css`:

```css
:root {
  /* Core Colors */
  --color-black: #000000;
  --color-neon-yellow: #e5e900;
  --color-neon-yellow-hover: #d4d800;
  --color-bright-pink: #f878cd;
  --color-bright-pink-hover: #f56bb8;
  --color-muted-gold: #c7c804;
  --color-teal: #018fa6;
  
  /* Gradients */
  --gradient-purple-start: #9068BE;
  --gradient-purple-end: #B07FB3;
  --gradient-purple: linear-gradient(135deg, #9068BE 0%, #B07FB3 100%);
  
  /* Semantic Colors */
  --color-primary: var(--color-black);
  --color-primary-hover: var(--color-neon-yellow);
  --color-secondary: var(--color-bright-pink);
  --color-secondary-hover: var(--color-neon-yellow);
  --color-accent: var(--color-neon-yellow);
  --color-link: var(--color-bright-pink);
  --color-link-hover: var(--color-neon-yellow);
}
```

### Component Usage
- Use semantic color variables in components (e.g., `var(--color-primary)` instead of `#000000`)
- Ensure sufficient color contrast for accessibility (WCAG AA compliance)
- Test color combinations for readability and visual hierarchy

### Accessibility Considerations
- Maintain minimum contrast ratios of 4.5:1 for normal text
- Use high contrast (7:1) for important interactive elements
- Provide alternative visual cues beyond color for important information
- Test with color blindness simulators

## Brand Consistency

### Do's
- ✅ Use the defined color palette consistently across all pages
- ✅ Apply semantic color variables in CSS
- ✅ Maintain proper contrast ratios
- ✅ Use gradients sparingly and purposefully
- ✅ Test color combinations for accessibility

### Don'ts
- ❌ Use colors outside the defined palette
- ❌ Create new color variations without approval
- ❌ Use low contrast color combinations
- ❌ Overuse bright colors (neon yellow, bright pink)
- ❌ Ignore accessibility guidelines

## Examples

### Button Implementation
```css
.button-primary {
  background-color: var(--color-black);
  color: var(--color-white);
  border: 2px solid var(--color-black);
}

.button-primary:hover {
  background-color: var(--color-neon-yellow);
  color: var(--color-black);
  border-color: var(--color-neon-yellow);
}
```

### Link Implementation
```css
a {
  color: var(--color-bright-pink);
  text-decoration: none;
}

a:hover {
  color: var(--color-neon-yellow);
  text-decoration: underline;
}
```

### Gradient Background
```css
.hero-section {
  background: var(--gradient-purple);
}
```

## Maintenance

This color palette should be:
- Reviewed quarterly for brand alignment
- Updated only with design team approval
- Documented in all design systems
- Tested across all device types and browsers
- Validated for accessibility compliance

---

*Last Updated: [Current Date]*
*Version: 1.0*
*Maintained by: Development Team*
