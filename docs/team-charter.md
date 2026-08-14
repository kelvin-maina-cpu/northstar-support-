# Northstar MVP — Team Charter

**Project:** Northstar Support Deflection MVP  
**Team Size:** 5 members  
**Sprint Duration:** 5 days  
**Repository:** Northstar Support MVP  
**Project Lead:** [Your GitHub Username]

---

## 1. Purpose

This Team Charter defines how the five-person team will communicate,
divide work, use GitHub, review code, manage deadlines, resolve conflicts,
and maintain a reliable audit trail throughout the Northstar MVP sprint.

The team will build a working Support Deflection MVP capable of handling
at least two of the following support categories:

1. Order status
2. Returns and refunds
3. Stock availability

The technical approach will be agreed upon by the team before feature
development begins.

---

# 2. Team Roles

| Member | Role | Primary Responsibility |
|---|---|---|
| [Member 1] | Project Lead / Integration | Architecture, coordination, integration and final review |
| [Member 2] | Frontend Developer | User interface and customer interaction |
| [Member 3] | Backend Developer | API endpoints and backend services |
| [Member 4] | Data / Business Logic Developer | Support logic, data and business rules |
| [Member 5] | QA / Documentation | Testing, verification and delivery documentation |

### Shared responsibility

Every member is responsible for:

- Completing assigned tasks.
- Keeping their GitHub activity traceable.
- Updating the Project Board on the same day as work occurs.
- Communicating blockers.
- Reviewing other members' work when requested.
- Following the Git workflow.
- Maintaining the quality of their contribution.

No member is responsible for an entire system component without
breaking the work into smaller board tasks.

---

# 3. Communication Rules

## Primary communication channel

The team will use:

**Primary:** [WhatsApp / Discord / Teams / Other]

**GitHub:** Source of truth for technical work, issues, pull requests,
reviews and task status.

Important technical decisions must be recorded in GitHub or the project
documentation rather than remaining only in private messages.

## Communication expectations

Members should:

1. Respond to important team messages within a reasonable period.
2. Report blockers as soon as they occur.
3. Inform the team when they cannot complete a task on time.
4. Avoid disappearing without communication.
5. Keep technical discussions professional and task-focused.

### Blocker rule

If a member is blocked for more than 30 minutes on a task, they should:

1. Attempt reasonable troubleshooting.
2. Document what they tried.
3. Notify the team.
4. Ask for assistance.

A blocker must not remain hidden until the deadline.

---

# 4. Work Assignment Rules

All development work must correspond to a GitHub Project Board task.

No member should begin a major feature that does not have a corresponding
board task.

Each task must contain:

- Task description
- Owner
- Priority
- Definition of Done
- Appropriate project status

## Anti-black-box rule

No board task should require more than four hours of work.

If a task is likely to exceed four hours, the task must be split into
smaller tasks.

Every task must have a single, checkable Definition of Done.

---

# 5. Git Branch Rules

The `main` branch is the protected production/integration branch.

Members must NOT directly push feature work to `main`.

Each task should use its own branch.

### Branch naming convention

Use:

`feature/NS-XX-short-description`

Examples:

`feature/NS-05-order-status-api`

`feature/NS-08-support-interface`

For bug fixes:

`fix/NS-XX-short-description`

For documentation:

`docs/NS-XX-short-description`

For testing:

`test/NS-XX-short-description`

The `NS-XX` identifier must correspond to the GitHub board/issue task.

---

# 6. Commit Rules

Every commit must follow:

`<type>: <what changed> - <why it matters>`

Examples:

`feat: add order status endpoint - enable shipment lookup`

`fix: handle unknown order IDs - prevent invalid API responses`

`test: add order status tests - verify supported order states`

`docs: document API contract - help frontend integration`

`refactor: simplify request validation - improve maintainability`

The following commit messages are NOT allowed:

- `wip`
- `updates`
- `changes`
- `final`
- `stuff`
- `fixes`
- `new changes`

Every commit should communicate what changed and why.

---

# 7. Pull Request Rules

All feature work must be submitted through a Pull Request.

A Pull Request should include:

1. What was implemented.
2. Why it was implemented.
3. GitHub task/issue reference.
4. Testing performed.
5. Known limitations, if any.

Example:

`Closes #15`

or

`Related to #15`

No member should merge their own work without the required review.

---

# 8. Code Review Rules

At least one other team member must review a Pull Request before it is
merged.

The reviewer should check:

- Correctness
- Requirements
- Code quality
- Security/basic safety concerns
- Tests where applicable
- Compatibility with the agreed architecture
- No unnecessary changes

Review comments should be constructive and specific.

The author must address important review comments before merging.

---

# 9. Project Board Rules

The Project Board is the team's work-tracking source of truth.

Statuses:

BACKLOG
↓
IN PROGRESS
↓
CODE REVIEW
↓
TESTING
↓
DONE

## Status update rule

Board status must be updated on the same day that the work occurs.

Members must NOT wait until the end of the sprint to update their tasks.

### Example

When work starts:

`BACKLOG → IN PROGRESS`

When implementation is complete and PR is opened:

`IN PROGRESS → CODE REVIEW`

After review:

`CODE REVIEW → TESTING`

After successful verification:

`TESTING → DONE`

A task should only be marked DONE when its Definition of Done has been
satisfied.

---

# 10. Deadlines

The project follows the Northstar five-day sprint.

## Day 1 — Setup

Complete:

- Team Charter
- Project Board
- Architecture
- API/interface agreements
- Task ownership
- Priorities
- Definitions of Done

## Days 2–3 — Build

Members execute their assigned tasks according to the board.

All development must use the agreed Git workflow.

## Day 4 — Checkpoint

The team reviews:

- Commit history
- Board activity
- Contribution balance
- Task-to-commit traceability
- Remaining blockers
- MVP completeness

Any contribution imbalance must be addressed immediately.

## Day 5 — Delivery

Complete:

- Working MVP
- Testing
- Documentation
- Go-Live Readiness Note
- Audit trail
- Final review

---

# 11. Contribution Balance

The team will aim for balanced, visible contribution across all five
members.

Contribution will be evaluated using evidence such as:

- Commits
- Pull Requests
- Code reviews
- Documentation
- Testing
- Board activity
- Other clearly attributable project work

Members should not intentionally concentrate all meaningful work in one
person.

A member may assist another member, but the contribution should remain
visible and attributable.

---

# 12. Blockers and Escalation

A member who encounters a blocker must communicate it promptly.

### First level

The member reports the blocker to the team and requests assistance.

### Second level

If the blocker remains unresolved, the Project Lead coordinates a
resolution or redistributes part of the task.

### Third level

If a member has no visible project activity for two consecutive days,
the team immediately follows the escalation process rather than waiting
until the deadline.

The escalation process is:

1. Contact the member directly.
2. Determine whether there is a legitimate blocker.
3. Provide assistance where possible.
4. Reassign unfinished work if necessary.
5. Record the decision in the project activity/board where appropriate.

---

# 13. Conflict Resolution

Technical disagreements should be resolved using the following process:

### Step 1 — Discuss

The members involved explain their positions and the technical reasons
behind them.

### Step 2 — Refer to project requirements

The team checks:

- Project requirements
- Architecture
- API contracts
- Definition of Done
- Existing documentation

### Step 3 — Team decision

If disagreement remains, the Project Lead facilitates a decision based on
the project requirements, maintainability and delivery timeline.

### Step 4 — Document

Important architectural decisions are documented so the same disagreement
does not repeatedly occur.

Personal disagreements must not interfere with project delivery.

---

# 14. AI / Vibe-Coding Rules

AI tools may be used to assist development, but the team member using
the AI remains responsible for the resulting work.

Members must:

- Understand the code they submit.
- Review AI-generated code before committing it.
- Test generated code.
- Check dependencies before adding them.
- Avoid blindly accepting AI suggestions.
- Avoid committing secrets, API keys or credentials.
- Ensure generated code follows the project architecture.
- Be able to explain their implementation during review.

AI must not be used to fabricate project activity or commits.

The GitHub history must accurately represent the work performed by the
team member.

---

# 15. Security and Secrets

The following must never be committed to GitHub:

- API keys
- Passwords
- Database credentials
- Access tokens
- Private keys
- `.env` files containing secrets

Use `.env.example` for required environment variables.

Example:

`DATABASE_URL=your_database_url_here`

Actual credentials must remain in local environment configuration.

---

# 16. Definition of Done

A task can be moved to DONE only when:

1. Its implementation is complete.
2. Its Definition of Done is satisfied.
3. Required testing has been performed.
4. The Pull Request has been reviewed.
5. Required review comments have been resolved.
6. The change is merged into the appropriate branch.
7. The Project Board status has been updated.

---

# 17. Daily Team Check-In

The team should conduct a short daily check-in.

Each member reports:

### Yesterday
What did I complete?

### Today
What am I working on?

### Blockers
What is preventing progress?

The purpose is coordination, not surveillance.

---

# 18. Final Delivery Requirements

Before final submission, the team must verify:

- MVP works end-to-end.
- At least two required support categories are functional.
- Major known issues are documented.
- Go-Live Readiness Note is complete.
- GitHub commit history is intact.
- Pull Requests and reviews are visible.
- Project Board history is accurate.
- Individual contributions are traceable.
- No secrets are committed.
- All team members have made meaningful contributions.

---

# 19. Team Agreement

By signing below, each member confirms that they have read,
understood and agreed to follow this Team Charter.

| Member | GitHub Username | Role | Signature | Date |
|---|---|---|---|---|
| [Member 1] | [Kelvin Maina] | Project Lead / Integration | | |
| [Member 2] | [Mary Sharnice] | Frontend Developer | | |
| [Member 3] | [Jacob Njihia] | Backend Developer | | |
| [Member 4] | [Mercylyne Ongach ] | Data / Business Logic | | |
| [Member 5] | [Bbossa mukisa] | QA / Documentation | | |

---

**Charter Version:** 1.0  
**Project:** Northstar Support Deflection MVP
