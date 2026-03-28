Scaffold a new API route in beingb following the project conventions.

Ask me:
1. What is the route path? (e.g. /api/reports/summary)
2. What HTTP methods does it need?
3. What does it do?

Then:
- Create a thin route handler in `app/api/` — validate input, call service, return JSON only
- Create or update the service function in `lib/services/`
- Create or update the repo function in `lib/repo/` if DB access is needed
- Follow existing patterns in the codebase exactly
