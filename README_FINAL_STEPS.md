Run these commands to finish setup locally:

1. Install dependencies
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env.local
# edit .env.local and set NEXTAUTH_SECRET
```

3. Start development server
```bash
npm run dev
```

Then visit http://localhost:3000 and create an account.

Important: to decrypt content you must unlock the app with your password (same password used to sign in).

Security note: This app stores encryption passphrases only in memory for the session; no plaintext is persisted to any server in this demo.
