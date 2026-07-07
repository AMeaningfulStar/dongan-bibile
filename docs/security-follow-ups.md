# Security Follow-ups

This project now targets a clean package audit and removes the vulnerable PWA build pipeline. The items below are intentionally left as follow-up work because they require application-level design decisions, not package-only updates.

## API authorization

- `DELETE /api/keywords/[id]` currently trusts request data such as the query string `role`.
- Do not use client-provided role values as authorization proof.
- Replace this with server-verified authentication and authorization before allowing deletion.
- Confirm the caller identity on the server, then derive permissions from a trusted source such as Firebase Auth custom claims, Firestore/Realtime Database role records, or another server-controlled ACL.

## Environment files

- `.env` is tracked in the repository.
- Review all tracked values and confirm they are safe to expose.
- Move secrets, private keys, service account values, and deploy-only credentials to ignored local or platform-managed environment variables.
- Keep only public client configuration in tracked files, such as Firebase web config values that are intended for browser use.

## PWA service worker

- `next-pwa` was removed because its build pipeline introduced vulnerable dependencies.
- Do not recommit generated `public/sw.js` or `public/workbox-*.js` files.
- Reintroduce offline behavior during the mobile PWA UI work with a maintained service worker strategy.
- Before reintroducing a service worker, define caching rules for app shell, icons, Firebase-backed data, and version invalidation.

## Dependency overrides

- `package.json` includes dependency overrides to force patched transitive versions where upstream package ranges have not fully caught up.
- Revisit these overrides during future dependency updates.
- Remove an override only after `bun audit`, `bun run build`, and `bunx tsc --noEmit` still pass without it.
