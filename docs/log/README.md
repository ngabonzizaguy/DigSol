# DigSolutions Implementation Log

Living record of every implementation step, decision, and fix. Update as you go — this is the team's memory.

## Files

| File | Purpose |
|------|---------|
| [`IMPLEMENTATION_LOG.md`](./IMPLEMENTATION_LOG.md) | Chronological build log — what happened, when, why |
| [`DECISIONS.md`](./DECISIONS.md) | Architecture & design decisions (ADR-lite) |
| [`SETUP.md`](./SETUP.md) | Exact commands + config to reproduce setup |
| [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) | Errors encountered + fixes |
| [`COMPONENTS.md`](./COMPONENTS.md) | Component inventory + usage notes |
| [`ROUTES.md`](./ROUTES.md) | Route inventory + build status |

## How to use

- **Before changing anything:** scan `DECISIONS.md` for prior reasoning.
- **When something breaks:** check `TROUBLESHOOTING.md` first; if new, add it.
- **After any task:** append to `IMPLEMENTATION_LOG.md` with `## YYYY-MM-DD HH:MM — <action>`.
- Reference the master plan: [`../../../.cursor/plans/digsolutions_platform_blueprint_b5155bcb.plan.md`](../../../.cursor/plans/digsolutions_platform_blueprint_b5155bcb.plan.md) (do not edit it).
