# Auth

Use `auth/guard.js` for new pages. It validates Firebase Auth plus backend role claims through the `validateSession` Cloud Function. Avoid trusting only `localStorage` for protected routes.
