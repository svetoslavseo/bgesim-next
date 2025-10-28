# Plans Audit Summary - Fake Plans Detected

## Critical Finding ❌

The current `src/lib/sailyApi.ts` contains **42 FAKE PLANS** with fake identifiers that don't exist in Saily API.

These were manually added by the user, but they don't actually exist in Saily's system!

---

## What I Found

### Fake Plan Patterns:
- `saily_asia_pacific_2gb_7d`
- `saily_europe_2gb_7d`
- `saily_me_2gb_7d`
- `saily_americas_2gb_7d`
- `saily_global_1gb_7d`
- `saily_europe_me_2gb_7d`

**ALL these identifiers are FAKE!**

---

## The Problem

When users click "Купи Сега" on a fake plan:
1. Plan data gets sent to checkout
2. Checkout tries to redirect to Saily with fake `priceIdentifier`
3. Saily says "plan not found" 
4. User gets frustrated
5. No sale = lost revenue

---

## Verified Real Data (From Saily API)

### Serbia (RS)
✅ Has 5 country-specific plans ONLY
❌ Has NO regional plans in Saily API
❌ Has NO typical global plans (only long-duration ones like 365 days)

### Thailand (TH)
✅ Has 5 country-specific plans ONLY
❌ Has NO regional plans in Saily API

### Dubai (AE)
✅ Has 5 country-specific plans ONLY
❌ Has NO regional plans in Saily API

### Egypt (EG)
✅ Has 4 country-specific plans
❌ Should NOT have regional/global plans

### USA (US)
✅ Has 5 country-specific plans
❌ Should NOT have fake Americas plans

### UK (GB)
✅ Has 6 country-specific plans (including UNLIMITED)
❌ Should NOT have fake Europe plans

### Turkey (TR)
✅ Has 5 country-specific plans
❌ Should NOT have fake Europe & Middle East plans

---

## Recommended Solution

**REMOVE ALL plans with `saily_` prefix!**

### What to Keep:
- ✅ ONLY country-specific plans with real identifiers
- ✅ Real UUIDs (like `532eb9b7-a6a7-40e2-88ab-6622d12856dd`)
- ✅ Real priceIdentifiers (like `MTp...=`)

### What to Remove:
- ❌ Anything with `identifier: 'saily_...'`
- ❌ All fake regional plans
- ❌ All fake global plans

---

## Current Status

### Thailand - ✅ CLEANED
- Removed all 6 fake plans
- Only real country plans remain

### Serbia - ✅ CLEANED  
- Removed all 6 fake plans
- Only real country plans remain

### Dubai - ✅ CLEANED
- Removed all 6 fake plans
- Only real country plans remain

### Egypt - ❌ STILL HAS 6 FAKES

### USA - ❌ STILL HAS 6 FAKES

### UK - ❌ STILL HAS 6 FAKES

### Turkey - ❌ STILL HAS 6 FAKES

---

## Why This Matters

**Your screenshot shows Serbia prices:**
- ✅ 1GB, 3GB, 5GB - CORRECT (real plans)
- ❌ You added fake regional/global tabs that don't work

When users click those tabs and try to buy:
- Plan ID: `saily_europe_2gb_7d`
- Checkout fails because this ID doesn't exist
- Affiliate commission: $0
- User experience: Bad

---

## Next Steps

**Option 1: Remove all fakes manually**
- Go through each country
- Remove all `saily_*` identifiers
- Keep only real country plans

**Option 2: Use the script I created**
- `scripts/fetch-and-verify-all-plans.ts`
- Shows ONLY real plans from Saily
- Easy to copy-paste correct data

**Option 3: I can do it for you**
- Say the word and I'll remove all 42 fake plans
- Keep only verified real data
- Push the clean version to GitHub

---

## Commit Status

User added fake plans in recent edits, but hasn't committed yet.
**RECOMMENDATION:** Don't commit until all fakes are removed!

