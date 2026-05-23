# Open Blockers / Watchlist

## 2026-05-22 — Supabase free-tier 2-project limit
- Org `N.Guy org` already has 2 projects (`kcart_final`, `Greenride`).
- Paused `kcart_final` — paused projects still count against the limit per the MCP error.
- User chose to delete `kcart_final` manually in the Supabase dashboard to free a slot.
- All migrations + admin code are ready; just need to create the new project once a slot is free.
- Then: capture URL/keys → `.env.local`, run `apply_migration` for the 4 SQL files, invite first admin.
