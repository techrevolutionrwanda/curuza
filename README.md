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
git clone https://github.com/techrevolutionrwanda/curuza.git
cd curuza
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

### Start the backend

From the project root:

```bash
cd backend
npm run dev
```

This starts the Express API on:

- `http://localhost:5000`

The backend root endpoint returns a JSON message confirming the server is running.

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
- If the backend does not start, make sure port `5000` is free.
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
- Backend: http://localhost:5000
