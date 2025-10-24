# Currency Exchange Rates - Automatic Update Setup

This document explains how to set up automatic weekly updates for currency exchange rates (USD to BGN and USD to EUR).

## Overview

The application fetches exchange rates from the [ExchangeRate-API](https://www.exchangerate-api.com/) and stores them in `public/currency-rates.json`. The EUR to BGN rate is fixed at 1.96 (official BGN-EUR peg).

## Manual Update

To manually update the exchange rates, run:

```bash
npm run update-rates
```

This will fetch the latest rates and update the `public/currency-rates.json` file.

## Automatic Weekly Updates

### Windows (Task Scheduler)

1. Open **Task Scheduler** (search for it in Start menu)

2. Click **Create Basic Task** in the right panel

3. Configure the task:
   - **Name**: Update eSIM Currency Rates
   - **Description**: Weekly update of USD to BGN and EUR exchange rates
   - **Trigger**: Weekly, every Sunday at 00:00 (midnight)
   - **Action**: Start a program

4. For the **Action**, use these settings:
   - **Program/script**: `cmd.exe`
   - **Add arguments**: `/c cd /d "C:\Users\Svet\PythonProjects\wp-esim-bg-clone" && npm run update-rates`
   - **Start in**: `C:\Users\Svet\PythonProjects\wp-esim-bg-clone`

5. Click **Finish**

**Alternative PowerShell Command:**
```powershell
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument '/c cd /d "C:\Users\Svet\PythonProjects\wp-esim-bg-clone" && npm run update-rates'
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 00:00
Register-ScheduledTask -TaskName "Update eSIM Currency Rates" -Action $action -Trigger $trigger
```

### Linux/macOS (Cron)

1. Open your crontab for editing:
   ```bash
   crontab -e
   ```

2. Add this line to run every Sunday at midnight:
   ```cron
   0 0 * * 0 cd /path/to/wp-esim-bg-clone && npm run update-rates >> /path/to/wp-esim-bg-clone/logs/currency-update.log 2>&1
   ```

3. Save and exit

**Cron Schedule Breakdown:**
- `0 0 * * 0` = Every Sunday at 00:00
- `0 0 * * 1` = Every Monday at 00:00
- `0 3 * * 0` = Every Sunday at 03:00

## Verifying Updates

After the script runs, check:

1. **The JSON file** (`public/currency-rates.json`) should have an updated `lastUpdated` timestamp
2. **New rates** for USD_TO_BGN and USD_TO_EUR
3. **Logs** (if you set up logging) for any errors

## API Information

- **Service**: ExchangeRate-API
- **Endpoint**: `https://api.exchangerate-api.com/v4/latest/USD`
- **Free Tier**: 1,500 requests/month
- **Rate Limit**: No rate limit on free tier
- **Base Currency**: USD
- **Currencies Tracked**: BGN (Bulgarian Lev), EUR (Euro)

## Troubleshooting

### Script Fails to Run

1. Check Node.js is installed and accessible from command line:
   ```bash
   node --version
   npm --version
   ```

2. Verify the project path is correct

3. Ensure `tsx` is installed:
   ```bash
   npm install
   ```

### API Rate Limit

If you exceed 1,500 requests/month:
- Switch to a different free API provider (see alternatives below)
- Reduce update frequency (bi-weekly or monthly)
- Upgrade to a paid plan

### API Alternatives

If ExchangeRate-API is unavailable, you can modify `scripts/update-exchange-rates.ts` to use:

1. **Fixer.io** - `http://data.fixer.io/api/latest?access_key=YOUR_KEY`
2. **Open Exchange Rates** - `https://openexchangerates.org/api/latest.json?app_id=YOUR_KEY`
3. **CurrencyAPI** - `https://api.currencyapi.com/v3/latest?apikey=YOUR_KEY`

## Deployment Considerations

When deploying to production:

1. **Vercel/Netlify**: Set up a GitHub Action or cron job to commit updated rates
2. **VPS/Dedicated Server**: Use the cron setup above
3. **Consider**: Running the update during your build process (in CI/CD)

### GitHub Actions (Optional)

Create `.github/workflows/update-rates.yml`:

```yaml
name: Update Currency Rates

on:
  schedule:
    - cron: '0 0 * * 0' # Every Sunday at midnight UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  update-rates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run update-rates
      - name: Commit and push if changed
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add public/currency-rates.json
          git diff --quiet && git diff --staged --quiet || (git commit -m "Update currency rates" && git push)
```

## Fixed Rates

The EUR to BGN rate is **fixed at 1.96** (official Bulgarian Lev to Euro peg) and does not need to be updated.



