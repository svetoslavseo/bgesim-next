# Saily Pricing Investigation - Turkey 5GB Plan

## Investigation Summary

**Status:** ✅ **RESOLVED** - Screenshot shows old pricing before update

---

## Price Discrepancy Explained

### Your Screenshot Shows: **21.95 лв**

This matches the **OLD PRICE** from before commit `2fe1b69`:

```
Old Turkey 5GB Plan:
- USD Price: $12.99
- Exchange Rate: 1.69 BGN/USD
- BGN Price: 12.99 × 1.69 = 21.95 лв ✅
```

### Current Live Price: **16.88 лв**

After the update to real Saily API data:

```
New Turkey 5GB Plan:
- USD Price: $9.99
- Exchange Rate: 1.69 BGN/USD
- BGN Price: 9.99 × 1.69 = 16.88 лв
```

### Price Reduction

✅ **23.1% DECREASE** - Better for customers!
- **USD:** $12.99 → $9.99 (-$3.00)
- **BGN:** 21.95 лв → 16.88 лв (-5.07 лв)

---

## Complete Checkout Flow Analysis

### Current Implementation

#### 1. Plan Selection
- User browses `/turcia` page
- Selects Turkey 5GB 30 days plan
- Plan data from `FALLBACK_PLANS`:

```typescript
{
  id: 'tr-3',
  name: 'Turkey 5GB 30 days',
  data: '5 GB',
  validity: '30 дни',
  priceUSD: 9.99,
  price: 9.99,
  currency: '$',
  identifier: 'd70f569a-34b6-4613-85f5-b85ed2e8b3ae',
  priceIdentifier: 'MTpXWEhQWFNkd1ktN2hBUDNOUnhxS0xvcHZITW16dUswdlZiaUJvMWcteGNRPTpQcmljZTozMTUyLlVTRC45OTk=',
  planType: 'country',
  coveredCountries: ['TR'],
}
```

#### 2. Currency Conversion
- **Default Rate:** 1.80 BGN/USD (fallback)
- **Current Rate:** 1.69 BGN/USD (from `/public/currency-rates.json`)
- Conversion happens in `CurrencyContext`:
  ```typescript
  // Starts with default
  USD_TO_BGN: 1.80
  
  // Then loads actual rates
  USD_TO_BGN: 1.69 (from API)
  ```

#### 3. Checkout Page (`/checkout`)
- URL: `/checkout?plan={encoded_plan_data}`
- Displays order summary in BGN
- Shows: 16.88 лв (9.99 × 1.69)

#### 4. Payment Redirect
When user clicks "Продължи":

```typescript
// Uses priceIdentifier (preferred) or identifier
const identifierToUse = plan.priceIdentifier || plan.identifier;

// Generates unique transaction ID
const transactionId = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);

// Creates Saily checkout URL
const sailyCheckoutUrl = 
  `https://saily.com/checkout/?planId=${identifierToUse}&aff_transaction_id=${transactionId}&aff_offer_id=101&aff_id=8080`;

// Wraps in affiliate link
const finalUrl = 
  `https://go.saily.site/aff_c?offer_id=101&aff_id=8080&url=${encodeURIComponent(sailyCheckoutUrl)}`;
```

**Final URL for Turkey 5GB:**
```
https://go.saily.site/aff_c?offer_id=101&aff_id=8080&url=https%3A%2F%2Fsaily.com%2Fcheckout%2F%3FplanId%3DMTpXWEhQWFNkd1ktN2hBUDNOUnhxS0xvcHZITW16dUswdlZiaUJvMWcteGNRPTpQcmljZTozMTUyLlVTRC45OTk%3D%26aff_transaction_id%3D{random}%26aff_offer_id%3D101%26aff_id%3D8080
```

---

## Implementation Quality Assessment

### ✅ **Correct Implementations**

1. **Proper Price Identifier Usage**
   - Uses `priceIdentifier` (preferred for checkout)
   - Falls back to `identifier` if needed

2. **Affiliate Link Structure**
   - Correct wrapper URL: `go.saily.site/aff_c`
   - Proper parameter encoding
   - Valid affiliate credentials:
     - `aff_id: 8080`
     - `offer_id: 101`

3. **Transaction Tracking**
   - Unique transaction IDs generated per checkout
   - Proper tracking parameters passed

4. **Currency Conversion**
   - Loads real exchange rates from external API
   - Falls back to default rates (1.80) if load fails
   - Converts USD → BGN in real-time

5. **User Experience**
   - Shows prices in BGN (local currency)
   - Intermediate checkout page for order review
   - Clear payment information display

### ⚠️ **Potential Improvements**

1. **Cache Busting**
   - Consider versioning exchange rate file
   - Add timestamp to URL to prevent stale caching

2. **Rate Update Notification**
   - Show "last updated" timestamp for exchange rates
   - Warn if rates are older than 24 hours

3. **Price Match Verification**
   - Add a check that Saily's displayed price matches your shown price
   - Log discrepancies for monitoring

---

## Git History

### Commit: `2fe1b69` - "Update FALLBACK_PLANS with real Saily API data for EG, US, TR"

**Changes to Turkey Plans:**

```diff
- priceUSD: 12.99  →  priceUSD: 9.99
- identifier: 'saily_tr_5gb_30d'  →  identifier: 'd70f569a-34b6-4613-85f5-b85ed2e8b3ae'
+ Added: priceIdentifier: 'MTpXWEhQWFNkd1ktN2hBUDNOUnhxS0xvcHZITW16dUswdlZiaUJvMWcteGNRPTpQcmljZTozMTUyLlVTRC45OTk='
```

This commit:
- ✅ Updated prices to match actual Saily API
- ✅ Added proper price identifiers for checkout
- ✅ Reduced prices (better for customers)
- ✅ Uses real Saily plan IDs

---

## Comparison: Your Site vs Direct Saily

### Your Implementation (Affiliate)
```
User Journey:
1. Browse travelesim.bg/turcia
2. Select plan → See 16.88 лв
3. Click "Купи Сега" → /checkout page
4. Review order in Bulgarian
5. Click "Продължи" → Redirect to Saily
6. Complete payment on Saily

Benefits:
✓ Bulgarian language interface
✓ Price in BGN (familiar currency)
✓ Order review page
✓ Earn affiliate commission
✓ Brand presence before checkout
```

### Direct Saily
```
User Journey:
1. Browse saily.com
2. Select plan → See in USD
3. Immediate checkout
4. Complete payment

Benefits:
✓ Fewer steps
✓ Direct to payment
```

**Your Value Addition:**
- Localized experience (Bulgarian language/currency)
- Educational content about eSIM
- Country-specific recommendations
- Order review before commitment
- Customer support in Bulgarian

---

## Current Exchange Rates

**Source:** `/public/currency-rates.json`

```json
{
  "rates": {
    "USD_TO_BGN": 1.69,
    "USD_TO_EUR": 0.861
  },
  "lastUpdated": "2025-10-24T10:44:15.764Z",
  "source": "ExchangeRate-API",
  "apiDate": "2025-10-24"
}
```

**Update Script:** `scripts/update-exchange-rates.ts`

---

## Conclusion

✅ **Everything is working correctly!**

The 21.95 лв price in your screenshot was from an older version of the site when the plan cost $12.99 USD. After updating to real Saily API data (commit `2fe1b69`), the price was reduced to $9.99 USD, which now displays as **16.88 лв** with the current exchange rate.

**Key Findings:**
1. Your checkout flow is correctly implemented
2. Affiliate links are properly formatted
3. Price conversion is accurate
4. The discrepancy was due to historical pricing
5. Current pricing is 23.1% cheaper (good for users!)

**Action Items:**
- ✅ No changes needed to logic
- 📸 Consider updating screenshots with current pricing
- 🔄 Ensure exchange rates update regularly
- 📊 Monitor that Saily prices match your displays

