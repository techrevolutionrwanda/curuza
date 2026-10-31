# Curuza

Curuza is a full-stack project for Tech Revolution Rwanda. It includes:

- a Next.js frontend in `frontend/`
- an Express + TypeScript backend in `backend/`
- HTML-based template files in `templates/`

This repository is structured as a monorepo so the frontend and backend can be developed and run independently.

---

## Project structure

```text
curuza/
├─ README.md
├─ backend/
│  ├─ src/
│  │  └─ server.ts
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ package-lock.json
├─ frontend/
│  ├─ src/
│  │  └─ app/
│  ├─ public/
│  ├─ package.json
│  ├─ next.config.ts
│  ├─ tsconfig.json
│  ├─ eslint.config.mjs
│  ├─ README.md
│  └─ package-lock.json
├─ templates/
│  ├─ smart-ledger-template.html
│  ├─ smart-ledger-web.html
│  └─ Smart_Ledger_Investor_Project_Brief (1).pdf
└─ .gitignore
```

---

## Prerequisites

Before running the project, make sure you have the following installed:

- Git
- Node.js 18 or later
- npm
- VS Code (recommended, optional but helpful)

---

## Clone the repository

### Option 1: Terminal

```bash

cd curuzagit clone https://github.com/techrevolutionrwanda/curuza.git
```

### Option 2: SSH

```bash
git clone git@github.com:techrevolutionrwanda/curuza.git
cd curuza
```

### Option 3: VS Code

1. Open VS Code.
2. Press `Ctrl+Shift+P` or `Cmd+Shift+P`.
3. Run `Git: Clone`.
4. Paste the repository URL:
   - HTTPS: `https://github.com/techrevolutionrwanda/curuza.git`
   - SSH: `git@github.com:techrevolutionrwanda/curuza.git`
5. Select the folder where you want to save the project and open it.

---

## Install dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## Run the project

### Configure the backend

Create `backend/.env` with the MongoDB connection string and a private session secret:

```env
MONGO_URI=mongodb://127.0.0.1:27017/curuza
SESSION_SECRET=replace-with-a-long-random-secret
PORT=4000
FRONTEND_URL=http://localhost:3000

# SMS Connect Rwanda
SMS_CONNECT_BASE_URL=https://smsconnect.tech/api/v1
SMS_CONNECT_API_KEY=
SMS_CONNECT_API_SECRET=
SMS_CONNECT_SENDER_ID=CURUZA
SMS_DRY_MODE=true
SMS_UNIT_COST_RWF=10
```

For multiple allowed frontend origins, separate them with commas. Set
`NEXT_PUBLIC_API_URL=http://localhost:4000` in `frontend/.env.local` if the API
is not running at its default URL.

### SMS reminders

Suppliers can send a reminder to one debtor or to every debtor from the
**Debtors** page, and the backend queues automatic reminders from each sale's
due date:

- 2 days before the due date
- on the due date
- 3, 7 and 14 days overdue

Messages are held between 21:00 and 07:00 (Central Africa Time), capped at four
per debt and one every 24 hours per customer. The worker runs inside the API
process by default. To run it separately, set `SMS_WORKER_INLINE=false` and
start `npm run worker` in another terminal.

Without `SMS_CONNECT_API_KEY` and `SMS_CONNECT_API_SECRET` the app stays in
dry-run mode: messages are rendered, queued and logged, but no SMS is sent.
When the keys are added, remove `SMS_DRY_MODE=true` (or set it to `false`) to go
live. Each SMS costs 10 RWF and the gateway appends its own branding, so the app
keeps the content within 112 characters to stay inside one 160-character SMS.


### Start the backend

From the project root:

```bash
cd backend
npm run dev
```

This starts the Express API on:

- `http://localhost:4000`

The authentication endpoints are `POST /api/auth/register` and
`POST /api/auth/login`. `GET /api/auth/me` returns the current account, and
`PATCH /api/auth/me` updates its profile. `POST /api/auth/logout` ends the
session. Successful login and registration set the HTTP-only `curuza_session`
cookie used by the frontend route gate.

### Start the frontend

From the project root:

```bash
cd frontend
npm run dev
```

This starts the Next.js application on:

- `http://localhost:3000`

Open the browser to that URL to view the frontend.

---

## Useful scripts

### Backend (`backend/package.json`)

```bash
npm run dev   # runs TypeScript app in watch mode
npm run build # compiles TypeScript to dist
npm run start # starts the built app
npm run worker # runs SMS reminders in a dedicated process
npm run backfill:sms -- --apply # links old sales and adds default due dates
```

### Frontend (`frontend/package.json`)

```bash
npm run dev   # starts the Next.js development server
npm run build # production build
npm run start # starts the built production app
npm run lint  # runs ESLint
```

---

## Working in VS Code

For this project, it is recommended to open the entire repository in VS Code, then open terminals in each folder separately:

- one terminal for `frontend/`
- one terminal for `backend/`

This makes it easier to run both services at the same time.

You can also use a VS Code multi-root workspace if you want to manage both apps more comfortably.

---

## Templates folder

The repository includes static HTML templates in `templates/` for design and prototype work. These files are not part of the running app unless you explicitly use them for a demo or mockup.

Examples:

- `templates/smart-ledger-template.html`
- `templates/smart-ledger-web.html`

Use these as reference or starting points for UI mockups and project presentations.

---

## Notes

- The backend is a minimal Express server written in TypeScript.
- The frontend is a Next.js app using React and Tailwind CSS configuration.
- The project is still in an early stage, so some files may evolve as the app grows.

---

## Contributing

If you want to contribute:

1. Clone the repo.
2. Create a new branch.
3. Make your changes.
4. Run the relevant app locally.
5. Commit and push your branch.
6. Open a pull request.

---

## Troubleshooting

- If `npm install` fails, check your Node.js version.
- If the backend does not start, make sure port `4000` is free.
- If the frontend does not start, make sure port `3000` is free.
- If Git asks for credentials, verify that your GitHub account has access to the repository.

---

## Quick start summary

```bash
# clone
git clone https://github.com/techrevolutionrwanda/curuza.git
cd curuza

# backend
cd backend
npm install
npm run dev

# frontend (new terminal)
cd frontend
npm install
npm run dev
```

Then open:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
