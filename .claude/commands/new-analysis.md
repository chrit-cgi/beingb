Scaffold a new analysis task in beingb.

Ask me:
1. What should this analysis do? (e.g. summarize weekly reports, detect mood patterns)
2. What input does it need? (date range, user id, etc.)

Then:
- Create a new file in `lib/services/analysis/` with the analysis logic
- Export it from `lib/services/analysis/index.ts`
- Add a thin API route in `app/api/analysis/` that calls it
- The service function must be self-contained — no DB imports directly, use `lib/repo/`
