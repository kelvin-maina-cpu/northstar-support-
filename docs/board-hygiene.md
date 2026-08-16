# Board Hygiene — Why Tasks Were Getting Stuck

## What was happening
Issues #2, #3, #4 were sitting in "In Progress" on the project board even though the code for all three was already merged to `main`. The work was done — the board just never got updated to reflect it. `docs/architecture.md` §10 already lists "the GitHub task is moved to Done" as the last Definition-of-Done step, but a manual last step is exactly the kind of thing that gets skipped when you're focused on the next task.

## Fix 1 (recommended — no code, do this first)
GitHub Projects has built-in automation for exactly this. On the project board:
1. Go to **github.com/users/kelvin-maina-cpu/projects/1** → the **⋯** menu (top right) → **Workflows**
2. Turn on:
   - **Item closed → Status: Done**
   - **Pull request merged → Status: Done**
   - (optional) **Item reopened → Status: In Progress**

Once this is on, closing an issue or merging its PR moves the board card automatically — there's nothing to remember.

## Fix 2 (backstop, already added in this branch)
`.github/pull_request_template.md` now includes an explicit checklist item to move the linked board item to Done after merging. This catches it even for merges that don't go through "close issue" keywords, and it's a prompt that shows up right when someone's about to merge — the moment they're most likely to forget the follow-up step.

## Why not a custom GitHub Action instead
A custom Action syncing issue state → project status is possible, but this project board is **owned by a user account, not the repo/org**, so the default `GITHUB_TOKEN` in Actions can't write to it — it would need a personal access token with `project` scope stored as a repo secret. That's more moving parts (and another token to rotate) than necessary when GitHub's built-in workflow toggle does the same job with zero maintenance. Worth revisiting only if the team moves the board to an org-owned project later.
