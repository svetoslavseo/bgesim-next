# Blog Post Layout Reference

## Component Order (Top to Bottom)

```
┌─────────────────────────────────────────────┐
│  1. BREADCRUMBS                             │
│  Home / Blog / Article Title                │
│  ───────────────────────────────────────    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  2. METADATA                                │
│  Публикувано: Oct 19, 2025                  │
│  • Актуализирано: Oct 20, 2025              │
│  • Uncategorized                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  3. HEADLINE (H1)                           │
│                                             │
│  Как да проверя дали имам роуминг?          │
│  Практично ръководство за                   │
│  Vivacom, Yettel и A1                       │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  4. AUTHOR LINE                             │
│  Автор: Васил Андреев                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  5. FEATURED IMAGE                          │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │    [Hero Image with Purple Overlay]  │ │
│  │                                       │ │
│  │         400px height (desktop)       │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  EXCERPT (Optional)                         │
│  │ Italic text with purple left border     │
│  │ Brief introduction to the article...    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  6. MAIN CONTENT                            │
│                                             │
│  Article body with headings, paragraphs,   │
│  lists, images, tables, etc.               │
│                                             │
│  • WordPress content styles                │
│  • Table of contents (if any)              │
│  • Embedded images                         │
│  • Formatted lists                         │
│  • Code blocks                             │
│  • Quotes                                  │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  TAGS SECTION (if any)                      │
│  ────────────────────────────────────────   │
│  Тагове:                                    │
│  [Tag 1] [Tag 2] [Tag 3]                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  7. AUTHOR BIO                              │
│  ╔═══════════════════════════════════════╗ │
│  ║  За автора                            ║ │
│  ║  ─────────────────────────────────    ║ │
│  ║                                       ║ │
│  ║  ┌──┐  Васил Андреев                 ║ │
│  ║  │👤│                                 ║ │
│  ║  └──┘  Васил Андреев е автор на      ║ │
│  ║        Travel eSIM BG,                ║ │
│  ║        специализиран в технологии...  ║ │
│  ║                                       ║ │
│  ╚═══════════════════════════════════════╝ │
└─────────────────────────────────────────────┘
```

## Design Specifications

### Colors

```css
/* Brand Purple */
--primary: #ad6ca5;

/* Text Colors */
--heading: #1a1a1a;
--body: #4b5563;
--meta: #6b7280;

/* Backgrounds */
--author-bio-bg: linear-gradient(135deg, #f8f4f7 0%, #faf9fb 100%);
--image-overlay: rgba(173, 108, 165, 0.81);
```

### Typography

```css
/* Headlines */
H1: 2.5rem / 700 weight / #1a1a1a
H2: 2rem / 600 weight / #1a1a1a
H3: 1.75rem / 600 weight / #1a1a1a

/* Body Text */
Paragraph: 1rem / 1.6 line-height / #4b5563
Meta: 0.875rem / #6b7280
Excerpt: 1.125rem / italic / #4b5563

/* Author */
Name: 1.25rem / 600 weight / #ad6ca5
Bio: 1rem / 1.7 line-height / #4b5563
```

### Spacing

```css
/* Vertical Rhythm */
Breadcrumbs margin-bottom: 1.5rem
Meta margin-bottom: 1rem
Headline margin-bottom: 1rem
Author margin-bottom: 2rem
Image margin-bottom: 2rem
Excerpt margin-bottom: 2rem
Content sections: 1.5-2rem
Author bio margin-top: 3rem
```

### Component Dimensions

```css
/* Featured Image */
Desktop: 400px height
Tablet: 300px height
Mobile: 250px height
Width: 100% (full container)

/* Author Avatar */
Desktop: 80px diameter
Mobile: 60px diameter
Border-radius: 50%
Border: 3px solid white

/* Author Bio Card */
Padding: 2rem (1.5rem mobile)
Border-radius: 12px
Border-left: 4px solid #ad6ca5
```

## Responsive Breakpoints

### Desktop (> 768px)
- Full layout
- Two-column author bio
- Large typography
- 400px featured image

### Tablet (768px)
- H1 reduces to 2rem
- Author bio becomes single column
- 300px featured image

### Mobile (480px)
- H1 reduces to 1.75rem
- Centered author bio
- 250px featured image
- Compact spacing

## Interactive Elements

### Breadcrumbs
- Hover: Purple color (#ad6ca5)
- Transition: 0.2s ease

### Author Name
- Color: Purple (#ad6ca5)
- Hover: Darker purple (#8b5683)
- Underline on hover

### Tags
- Background: #f3f4f6
- Hover: #e5e7eb
- Transition: 0.2s ease

## Accessibility Features

### ARIA Labels
```html
<nav aria-label="Breadcrumb">
<time datetime="2025-10-19">
<span aria-current="page">
```

### Semantic HTML
```html
<article>
  <nav> (breadcrumbs)
  <header> (title section)
  <div> (content)
  <footer> (tags + author bio)
</article>
```

### Keyboard Navigation
- All links are keyboard accessible
- Focus states visible
- Logical tab order

## Example Implementation

### Minimal Article
```tsx
<article>
  <Breadcrumbs />
  <div className="meta">Dates</div>
  <h1>Title</h1>
  <div className="author">Author Name</div>
  <BlogFeaturedImage />
  <div className="content">Body</div>
  <AuthorBio />
</article>
```

### Full Article with All Features
```tsx
<article>
  <Breadcrumbs items={breadcrumbs} />
  <div className="meta">
    <time>Published</time>
    <span>Updated</span>
    <span>Category</span>
  </div>
  <h1>Headline</h1>
  <div className="author">Author: Name</div>
  <BlogFeaturedImage src={image} />
  <div className="excerpt">Intro text</div>
  <div className="content">Article body</div>
  <div className="tags">[Tag1] [Tag2]</div>
  <AuthorBio name={author} avatar={avatar} />
</article>
```

## Testing URLs

1. http://localhost:3000/blog/kakvo-e-esim/
2. http://localhost:3000/blog/kak-da-proverq-dali-imam-rouming/
3. http://localhost:3000/blog/rouming-v-syrbia-ceni-paketi-esim-alternativi/

Visit any of these to see the complete redesigned layout in action!

