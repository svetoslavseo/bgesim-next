# Font Standards Documentation

## Overview
This document outlines the standardized font system implemented across the website. The font system has been designed for optimal readability, performance, and brand consistency.

## Font System

### 1. Headings & Titles: Quicksand
- **Font Family**: `'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Usage**: All headings (h1, h2, h3, h4, h5, h6), page titles, section titles
- **Weights Available**: 300, 400, 500, 600, 700
- **Characteristics**: Modern, friendly, excellent for headings and titles
- **CSS Variable**: `--font-family-heading`

### 2. Body Text: Lato Regular
- **Font Family**: `'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`
- **Usage**: All body text, paragraphs, general content
- **Weights Available**: 300, 400, 700 (normal and italic)
- **Characteristics**: Highly readable, professional, excellent for body text
- **CSS Variable**: `--font-family-primary`

### 3. CTAs & Buttons: Inter Semibold
- **Font Family**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Usage**: Buttons, call-to-action elements, interactive elements
- **Weights Available**: 400, 500, 600, 700
- **Default Weight**: 600 (Semibold)
- **Characteristics**: Clean, modern, excellent for UI elements
- **CSS Variable**: `--font-family-button`

## Implementation Details

### CSS Variables
```css
:root {
  --font-family-primary: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-heading: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-button: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Global Styles
```css
/* Body text uses Lato */
body {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Headings use Quicksand */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Buttons use Inter Semibold */
button {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 600;
}
```

## Performance Optimizations

### Font Loading Strategy
- **Google Fonts Import**: Optimized with `display=swap` for better performance
- **Font Display**: All fonts use `font-display: swap` for optimal loading
- **Fallback Fonts**: System fonts as fallbacks for better performance
- **Local Fonts**: Fallback to local fonts when available

### Critical CSS
- Font declarations are included in critical CSS for above-the-fold content
- Optimized loading prevents layout shifts

## Usage Guidelines

### When to Use Each Font

#### Quicksand (Headings)
- Page titles
- Section headings
- Card titles
- Navigation items (if styled as headings)
- Hero text

#### Lato (Body Text)
- Paragraphs
- List items
- Form labels
- General content
- Descriptions

#### Inter (Buttons & CTAs)
- Button text
- Call-to-action buttons
- Form buttons
- Interactive elements
- Navigation buttons

### Font Weight Guidelines

#### Quicksand Weights
- **300 (Light)**: Subtle headings, secondary titles
- **400 (Regular)**: Standard headings
- **500 (Medium)**: Emphasized headings
- **600 (Semibold)**: Primary headings (default)
- **700 (Bold)**: Hero titles, main headings

#### Lato Weights
- **300 (Light)**: Subtle body text, captions
- **400 (Regular)**: Standard body text (default)
- **700 (Bold)**: Emphasized body text, important content

#### Inter Weights
- **400 (Regular)**: Secondary buttons
- **500 (Medium)**: Standard buttons
- **600 (Semibold)**: Primary buttons (default)
- **700 (Bold)**: Important CTAs, primary actions

## Responsive Considerations

### Mobile Optimization
- Font sizes are optimized for mobile devices
- Line heights adjusted for better readability on small screens
- Touch targets sized appropriately for mobile interaction

### Breakpoint Adjustments
```css
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
}
```

## Accessibility

### Readability
- High contrast ratios maintained
- Sufficient line spacing for readability
- Appropriate font sizes for all screen sizes

### Screen Reader Support
- Semantic HTML structure maintained
- Proper heading hierarchy
- Alt text for images

## Maintenance

### Adding New Fonts
1. Update `src/styles/fonts.css` with new font imports
2. Add font variables to `src/styles/variables.module.css`
3. Update global styles in `src/styles/globals.css`
4. Update this documentation

### Font Updates
- Monitor Google Fonts for updates
- Test font rendering across browsers
- Verify performance impact
- Update fallback fonts as needed

## Browser Support

### Supported Browsers
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

### Fallback Strategy
- System fonts used as fallbacks
- Graceful degradation for older browsers
- Progressive enhancement for modern browsers

## Performance Metrics

### Target Metrics
- **Font Load Time**: < 100ms
- **Layout Shift**: < 0.1
- **First Contentful Paint**: Optimized with font-display: swap

### Monitoring
- Regular performance audits
- Font loading optimization
- User experience testing

## Troubleshooting

### Common Issues
1. **Fonts not loading**: Check Google Fonts import URL
2. **Layout shifts**: Ensure font-display: swap is set
3. **Performance issues**: Optimize font loading strategy
4. **Rendering issues**: Check fallback fonts

### Debug Tools
- Chrome DevTools Fonts panel
- Network tab for font loading
- Performance tab for layout shifts
- Lighthouse for performance audits

## Future Considerations

### Potential Updates
- Variable fonts implementation
- Self-hosted fonts for better performance
- Advanced font loading strategies
- Dark mode font optimizations

### Scalability
- Font system designed for easy expansion
- Modular CSS structure
- Consistent naming conventions
- Documentation maintenance

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintainer**: Development Team
