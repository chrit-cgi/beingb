Run a smoke test against the deployed app.

Ask me: what is the current Sliplane URL? (or use NEXT_PUBLIC_URL if set)

Then use WebFetch to check:
1. GET / — should redirect to /report or /login
2. GET /api/auth/session — should return a response (not 500)
3. GET /api/reports — should return 401 (not logged in)
4. GET /api/analysis — should return 401 (not logged in)

Report: status code for each, pass/fail, and any unexpected responses.
