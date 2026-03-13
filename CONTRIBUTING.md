# How Changes Work

This portfolio uses a **staging → production** pipeline with GitHub Pages and GitHub Actions.

## Branches

| Branch | Purpose | Deploys automatically? |
|--------|---------|----------------------|
| `master` | **Production** — the live site | ✅ Yes |
| `staging` | **Preview** — verify changes before going live | ✅ Yes |
| Feature branches / PRs | Propose changes | ❌ No (review only) |

## Workflow

```
Feature branch / PR  →  staging  →  master (live site)
```

1. **A change is proposed** — either via a Copilot PR or a manual branch.
2. **Review the PR** — look at the code diff on GitHub.
3. **Merge to `staging`** — this deploys the change so you can see it live at your GitHub Pages URL.
4. **Preview the site** — visit the deployed URL and check if you're happy.
5. **Happy?** → Merge `staging` into `master`. The production deploy runs automatically.
6. **Not happy?** → See below.

## If You Don't Like a Change

You have several options depending on the situation:

### Option A: Reject the PR entirely
- Simply **close the PR** without merging. Nothing changes.

### Option B: Ask for revisions on a PR
- **Leave a comment** on the PR describing what you'd like changed.
- Copilot (or a contributor) updates the PR, and you review again.

### Option C: Revert a change that's already on `staging`
- If something reached `staging` and you don't like it, just **don't merge it to `master`**.
- Push a fix or revert commit to `staging` to try a different approach.
- Your production site on `master` stays untouched.

### Option D: Revert a change that's already on `master` (production)
- Run: `git revert <commit-hash>` and push to `master`.
- The production site redeploys automatically with the change removed.

## Quick Reference

| I want to... | Do this |
|--------------|---------|
| See a change before it goes live | Merge the PR into `staging` |
| Approve a change for production | Merge `staging` into `master` |
| Reject a proposed change | Close the PR |
| Ask for modifications | Comment on the PR |
| Undo something on staging | Push a revert to `staging` |
| Undo something on production | Push a revert to `master` |
