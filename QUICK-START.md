# ⚡ Quick Start - 5 Minutes to Running Site

## Step 1: Install (2 minutes)

```bash
npm install
```

## Step 2: Extract Data (5-10 minutes)

```bash
npm run extract:all
```

Wait for it to complete. You'll see:
- ✓ WordPress data fetched
- ✓ Media downloaded  
- ✓ Fonts extracted
- ✓ Content transformed

## Step 3: Run (Instant)

```bash
npm run dev
```

Open: **http://localhost:3000**

## ✅ Done!

Your WordPress site is now running on Next.js!

---

## 🚀 Deploy to Production (10 minutes)

### Option A: Vercel (Easiest)

```bash
npm run build
npx vercel --prod
```

### Option B: Netlify

```bash
npm run build
npx netlify deploy --prod --dir=out
```

### Option C: Any Static Host

```bash
npm run build
# Upload the 'out/' folder to your web server
```

---

## 📚 Need More Details?

- Full guide: [GETTING-STARTED.md](./GETTING-STARTED.md)
- Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)  
- Complete info: [README.md](./README.md)

---

## 🆘 Something Not Working?

### No content showing?
```bash
npm run extract:all
```

### Build errors?
```bash
npm run type-check
npm run lint
```

### Still stuck?
Check [PROJECT-SUMMARY.md](./PROJECT-SUMMARY.md) for troubleshooting.

---

**That's it! Your WordPress site is now on Next.js! 🎉**



