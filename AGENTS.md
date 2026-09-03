# Repository workflow

- After every user-requested update to this repository, validate the in-scope changes, create a Git commit, and push the current branch to its configured upstream automatically.
- After a website change is pushed, also publish `site/` to the remote `gh-pages` branch with `git subtree push --prefix site origin gh-pages`, then verify the public URL responds successfully.
- For catalog or website changes, run `npm run build`, `npm run check`, and `git diff --check` before committing.
- Include only changes that belong to the current task. Preserve unrelated user changes.
- Never force-push or rewrite published history. If authentication, branch branch protection, merge conflicts, or validation prevent a normal push, stop and report the blocker clearly.
- In the final response, include the pushed branch and commit hash.
