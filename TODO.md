# Fix Dashboard/Admin Access

## Status: In Progress

### Steps:
1. [x] Fix middleware.ts: Change AUTH_SECRET to NEXTAUTH_SECRET
2. [x] Confirm DB role ADMIN for admin@devtrust.ru (user confirmed)
3. [x] Prisma generate (manual - restart server instead)
4. [ ] Restart dev server: Ctrl+C then npm run dev (or docker-compose)
5. [ ] Test: Login admin@devtrust.ru / admin123 → /dashboard → /admin

### Expected Result:
- Navbar shows user
- /dashboard loads (server auth works)
- /admin loads (role ADMIN)

## Root Cause:
Server-side NextAuth `auth()` ^ getToken mismatch: AUTH_SECRET vs NEXTAUTH_SECRET

