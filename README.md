# Encrypted Diary (Frontend Demo)

This demo shows a Next.js frontend that performs client-side encryption of diary notes.

Features:
- Next.js App Router (TypeScript)
- Client-side encryption using WebCrypto (PBKDF2 -> AES-GCM)
- NextAuth Credentials provider (demo, with in-memory user store)
- TailwindCSS + Framer Motion + Lucide icons

How it works
- Diary contents are encrypted in the browser before being sent to the server.
- The encryption key is derived from a user-provided passphrase using PBKDF2.
- Only ciphertext, iv, and salt are stored on the server — server operators can't read diary plaintexts.

NOTE: This is a frontend-focused demo. The backend stores data in memory and is NOT for production use.

Getting started

1. Install dependencies

```bash
npm install
```

2. Create `.env.local` based on `.env.example`.

3. Run the development server

```bash
npm run dev
```

Security notes
- This demo uses PBKDF2 and AES-GCM in the WebCrypto API for zero-knowledge encryption.
- For production, prefer Argon2 for KDF and a hardened backend storage.

Design
- Dark, neon cyberpunk theme with glassmorphism
- Uses Tailwind for styling and Framer Motion for subtle animations
