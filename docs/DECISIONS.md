# Architecture & Implementation Decisions

This document records deliberate implementation choices made during the development of Student Schedule Planner.

## Decision 1: Hybrid Database Configuration (PostgreSQL + SQLite)
- **Context:** The specification states PostgreSQL is the primary target database, and Docker Compose should be provided. For developer ease of running and testing locally without requiring Docker or a running PostgreSQL service daemon, a clean fallback is necessary.
- **Decision:** If `DATABASE_URL` or `POSTGRES_DB` is specified in the environment, Django connects via PostgreSQL. Otherwise, it defaults to a local SQLite database at `backend/db.sqlite3`. A `docker-compose.yml` is provided for running PostgreSQL in Docker.
- **Consequence:** Zero friction when running local tests and running the app immediately out of the box, while remaining 100% compliant with PostgreSQL deployment.

## Decision 2: Custom User Model at Initialization
- **Context:** Django strongly advises setting `AUTH_USER_MODEL` before applying the very first migration to avoid painful retrospectives.
- **Decision:** Created `apps.accounts.User` extending `AbstractUser` with unique email from Day 1.

## Decision 3: Token-Based Design System (All 8 Presets)
- **Context:** The specification explicitly requires at least 8 themes (Paper, Mist, Sage, Lavender, Clay, Ocean, Graphite, Midnight) inspired by Ellipsus's calm typography-first aesthetic.
- **Decision:** Designed semantic CSS custom properties (`--canvas`, `--surface`, `--border-subtle`, `--fg-default`, etc.) applied via `data-theme` attribute on the HTML root element, persistent in `localStorage`.
