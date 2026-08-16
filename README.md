# Alkira UI Developer Take-Home

A React frontend that demonstrates a login → MFA → protected dashboard flow. Authentication is mocked in the client and uses two roles to show read-only vs read/write access on the dashboard.

Demo Video: https://youtu.be/akixrNIrg9o


## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Vitest
- React Testing Library

## Getting Started

```bash
npm install
npm run dev
```

The app runs locally on the Vite development server (typically `http://localhost:5173`).

## Running Tests

```bash
npm test
```

Tests cover authentication state transitions, route protection, dashboard role permissions, and login form validation.

## Demo Credentials

**Read-only user**

- Email: `readonly@alkira.test`
- Password: `password123`
- Role: Read Only

**Read/write user**

- Email: `editor@alkira.test`
- Password: `password123`
- Role: Read / Write

**MFA code:** `123456`

## Authentication Flow

```text
Login
  ↓
Credential verification
  ↓
MFA verification
  ↓
Protected Dashboard
```

Auth state uses two values:

- `pendingUser` — email/password were accepted, MFA is not complete
- `user` — MFA succeeded; the session is fully authenticated

Valid credentials set `pendingUser` and send the user to `/mfa`. A correct MFA code moves `pendingUser` into `user` and opens `/dashboard`. Logout clears both.

## Access Control

`ProtectedRoute` renders the dashboard only when `user` is set. `pendingUser` is not treated as authenticated, so a credentials-only session cannot open `/dashboard`.

Edit permission is derived from `user.role`:

- **Read-only** — can view network connections; Edit is visible but disabled
- **Read/write** — can view connections and rename them locally

## Design Decisions

**Mock authentication.** The exercise does not include a backend, so credential checks run against a local mock user list.

**Separate `pendingUser` and `user`.** Password success and MFA success are different steps. Keeping them as two values makes the MFA gate explicit and prevents a half-finished login from looking signed in.

**Client-side role checks.** There is no authorization service, so the dashboard derives `canEdit` from `user.role === 'read-write'`.

**No persistence.** Auth state lives in memory for this demo. A production app would typically use a backend session or a securely issued token.

## Project Structure

```text
src/
  auth/         authentication state and mock credentials
  pages/        route-level UI
  components/   reusable components
  validation.ts shared form validation
```

## Known Limitations

- Authentication is mocked locally.
- MFA uses a static demo code.
- Authentication state is not persisted across refreshes.
- No backend API or database is connected.
- Dashboard data is static demo data.
