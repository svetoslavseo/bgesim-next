# Deployment Guide

Complete guide for deploying your static Next.js site to various platforms.

## Prerequisites

Before deployment, ensure you have:

1. ✅ Extracted all WordPress content (`npm run extract:all`)
2. ✅ Built the Next.js site successfully (`npm run build`)
3. ✅ Tested the static export in the `out/` directory

## Building for Production

```bash
# Build the static site
npm run build

# The output will be in the `out/` directory
# This directory contains all static HTML, CSS, JS, and assets
```

## Deployment Options

### Option 1: Vercel (Recommended)

**Automatic Deployment:**

1. Push your code to GitHub/GitLab/Bitbucket
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy
5. Your site will be live at `https://your-project.vercel.app`

**Manual Deployment:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Configuration:**

No additional configuration needed. Vercel automatically handles Next.js static exports.

### Option 2: Netlify

**Automatic Deployment:**

1. Push your code to GitHub/GitLab/Bitbucket
2. Visit [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
6. Deploy!

**Manual Deployment:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your site
npm run build

# Deploy
netlify deploy --prod --dir=out
```

**netlify.toml Configuration:**

```toml
[build]
  command = "npm run build"
  publish = "out"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/media/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

### Option 3: Railway

**Automatic Deployment:**

1. Push your code to GitHub
2. Visit [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the configuration from `nixpacks.toml`
6. The build will run automatically and your site will be live

**Configuration:**

The project includes `nixpacks.toml` which configures Railway to:
- Build the Next.js static export (`npm run build`)
- Serve the static files from `out/` directory (`npm start`)

**Custom Domain:**

1. In Railway project settings, click "Settings" → "Networking"
2. Click "Generate Domain" or add your custom domain
3. Railway provides SSL automatically

### Option 4: Cloudflare Pages

**Automatic Deployment:**

1. Push your code to GitHub/GitLab
2. Visit [pages.cloudflare.com](https://pages.cloudflare.com)
3. Click "Create a project"
4. Connect your repository
5. Configure build settings:
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
6. Deploy!

**Manual Deployment:**

```bash
# Install Wrangler CLI
npm install -g wrangler

# Build your site
npm run build

# Deploy
wrangler pages publish out --project-name=your-project-name
```

**Custom Domain:**

1. Go to your Cloudflare Pages project
2. Click "Custom domains"
3. Add your domain (e.g., travelesim.bg)
4. Update your DNS records as instructed

### Option 5: GitHub Pages

**Setup:**

1. Create a new repository or use an existing one
2. Add GitHub Actions workflow:

**.github/workflows/deploy.yml:**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
```

3. Enable GitHub Pages in repository settings
4. Select "GitHub Actions" as the source
5. Push to main branch to trigger deployment

**Custom Domain:**

1. Go to repository settings → Pages
2. Add your custom domain
3. Update DNS records with CNAME or A record

### Option 6: AWS S3 + CloudFront

**Setup:**

1. Create an S3 bucket
2. Enable static website hosting
3. Build and upload:

```bash
# Build
npm run build

# Upload to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache (if using)
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**CloudFront Configuration:**

1. Create a CloudFront distribution
2. Set S3 bucket as origin
3. Configure default root object: `index.html`
4. Set custom error responses:
   - 404 → /404.html (404)
   - 403 → /404.html (404)

### Option 7: Traditional Web Hosting

For traditional hosting (cPanel, Plesk, etc.):

```bash
# Build the site
npm run build

# Upload the `out/` directory contents to your web server
# via FTP, SFTP, or file manager

# Ensure .htaccess for proper routing (Apache):
```

**.htaccess:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect to trailing slash
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_URI} !(.*)/$
  RewriteRule ^(.*)$ $1/ [L,R=301]
  
  # Serve index.html for directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_URI} !(.*)/$
  RewriteRule ^(.*)$ $1/index.html [L]
  
  # 404 handling
  ErrorDocument 404 /404.html
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"
  ExpiresByType text/xml "access plus 0 seconds"
</IfModule>
```

## DNS Configuration

After deploying, point your domain to the hosting provider:

### For Vercel:
```
A record: 76.76.21.21
CNAME: cname.vercel-dns.com
```

### For Netlify:
```
A record: 75.2.60.5
CNAME: YOUR-SITE.netlify.app
```

### For Railway:
Railway provides automatic domain and SSL. Just add your custom domain in Railway dashboard.

### For Cloudflare Pages:
Cloudflare automatically manages DNS if your domain is on Cloudflare.

## Post-Deployment Checklist

After deployment, verify:

- [ ] All pages load correctly
- [ ] All images display properly
- [ ] Internal links work
- [ ] External links work
- [ ] Sitemap is accessible (`/sitemap.xml`)
- [ ] Robots.txt is accessible (`/robots.txt`)
- [ ] 404 page works
- [ ] Mobile responsiveness
- [ ] Page load speed (Lighthouse score)
- [ ] SEO meta tags present
- [ ] Open Graph tags work (test with Facebook Debugger)
- [ ] Twitter Card tags work (test with Twitter Card Validator)
- [ ] Structured data valid (test with Google Rich Results Test)

## Performance Optimization

### CDN Configuration

Most platforms provide CDN automatically, but ensure:

1. **Caching headers** are set correctly
2. **Gzip/Brotli compression** enabled
3. **HTTP/2 or HTTP/3** enabled
4. **Image optimization** working

### Monitoring

Set up monitoring for:

1. **Uptime monitoring**: UptimeRobot, Pingdom
2. **Analytics**: Google Analytics, Plausible
3. **Error tracking**: Sentry (if you add dynamic features later)
4. **Performance**: Google PageSpeed Insights, WebPageTest

## Continuous Deployment

### Automatic Rebuilds

For content updates, set up automatic rebuilds:

1. **Webhook on WordPress** (if keeping WordPress)
2. **Scheduled builds** (daily/weekly)
3. **Manual trigger** via CI/CD

### Example: Vercel with GitHub Actions

```yaml
name: Trigger Vercel Deploy

on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
  workflow_dispatch: # Manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Deploy
        run: |
          curl -X POST https://api.vercel.com/v1/integrations/deploy/[YOUR_DEPLOY_HOOK]
```

## Rollback Strategy

If something goes wrong:

### Vercel/Netlify
- Use the platform's UI to rollback to previous deployment
- Or redeploy a specific Git commit

### Manual Deployments
- Keep backup of previous `out/` directory
- Upload backup files to restore

## Security Headers

Ensure these headers are set (most platforms do this automatically):

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## SSL/HTTPS

All recommended platforms provide free SSL certificates. Ensure:

1. HTTPS is enabled
2. HTTP → HTTPS redirect is active
3. Certificate auto-renewal is enabled

## Cost Estimation

### Free Tier Limits:

- **Vercel**: 100GB bandwidth/month, unlimited builds
- **Netlify**: 100GB bandwidth/month, 300 build minutes/month
- **Cloudflare Pages**: Unlimited bandwidth, 500 builds/month
- **GitHub Pages**: 100GB bandwidth/month, public repos only

### Paid Plans:

- **Vercel Pro**: $20/month (1TB bandwidth)
- **Netlify Pro**: $19/month (1TB bandwidth)
- **Cloudflare Pages Pro**: $20/month (unlimited bandwidth)

## Support and Troubleshooting

Common issues and solutions:

### Build fails
- Check Node.js version (>=18.0.0)
- Verify all dependencies installed
- Check for TypeScript errors

### 404 errors after deployment
- Ensure trailing slashes configured
- Check routing configuration
- Verify all pages generated in `out/`

### Images not loading
- Check image paths (relative vs absolute)
- Verify images in `public/media/`
- Check image optimization settings

### Slow load times
- Enable compression
- Optimize images further
- Use CDN
- Check bundle size

For additional help, consult the documentation of your chosen platform.



