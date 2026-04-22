# node-backend-project

A Node.js + Express backend scaffold built while learning production-grade backend architecture. Covers auth, file uploads, media storage, and MongoDB integration — **incomplete and not actively maintained**, but kept as a reference for the patterns and stack decisions explored during the build.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT + bcrypt |
| File Uploads | Multer |
| Media Storage | Cloudinary |
| Misc | cookie-parser, cors, dotenv |
| Dev | Nodemon, Prettier |

---

## Project Structure

```
node-backend-project/
├── public/
│   └── temp/          # Temporary local storage before Cloudinary upload
├── src/
│   └── ...            # App logic (controllers, models, routes, utils, etc.)
├── .env               # Environment variables (not committed)
├── .gitignore
├── .prettierignore
├── package.json
└── Readme.md
```

---

## What Was Being Built

A REST API backend with:

- **User auth** — register/login with hashed passwords (bcrypt) and JWT-based sessions via HTTP-only cookies
- **File upload pipeline** — Multer handles local temp storage → Cloudinary handles persistent media storage
- **MongoDB models** — Mongoose schemas with aggregation pagination support (`mongoose-aggregate-paginate-v2`)
- **CORS + cookie support** — configured for cross-origin requests with credentials

---

## Status

> ⚠️ **Incomplete.** This project was a learning exercise and is not planned for further development. The scaffold, config, and dependency setup are solid, but most of the application logic (routes, controllers, models) is either stubbed or missing.

---

## Local Setup (if you want to poke around)

```bash
git clone https://github.com/ViShEsHK2412/node-backend-project.git
cd node-backend-project
npm install
```

Create a `.env` file in the root:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev     # development (nodemon)
npm start       # production
```

---

## Notes

- Uses **ES Modules** (`"type": "module"` in package.json), so `import`/`export` throughout — no `require()`
- Cloudinary upload is intended to work as a two-step pipeline: Multer saves to `public/temp/`, then the file gets pushed to Cloudinary and the temp file is deleted
- Prettier is configured but only as a dev tool — no CI or lint-on-commit setup

---

*First backend project. Built to understand the plumbing before moving on to more serious things.*
