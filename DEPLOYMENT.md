# BookHub Deployment

BookHub is split into two deploys:

- Frontend: Vite React app in this folder.
- Backend: Express API in `backend/`.

## Backend on Render

Create a Render Web Service from the GitHub repo.

Settings:

- Root directory: `bookjhub/backend`
- Build command: `npm install`
- Start command: `npm start`

Environment variables:

- `FRONTEND_URL`: your deployed frontend URL, for example `https://your-app.vercel.app`
- `FIREBASE_SERVICE_ACCOUNT`: the full Firebase service account JSON as one value

After it deploys, open the Render URL. You should see:

```json
{ "message": "BookHub API running..." }
```

## Frontend on Vercel

Create a Vercel project from the same GitHub repo.

Settings:

- Framework preset: `Vite`
- Root directory: `bookjhub`
- Build command: `npm run build`
- Output directory: `dist`

Environment variables:

- `VITE_API_URL`: your deployed backend URL, for example `https://your-api.onrender.com`

Redeploy the frontend after setting `VITE_API_URL`.

## Local Check

Frontend:

```bash
npm run build
```

Backend:

```bash
cd backend
npm start
```
