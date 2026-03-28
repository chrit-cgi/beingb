Run pre-push checks before pushing to GitHub.

Steps:
1. Run `npm run lint` — report any errors
2. Run `npm run build` — confirm production build succeeds
3. Run /review-claude-md — flag any drift
4. Check .gitignore — confirm .env.local and *.db are listed
5. Check for any hardcoded secrets or localhost URLs in source files

Report: all clear or list of issues to fix before pushing.
