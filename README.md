# Curuza

A TypeScript project maintained by the Tech Revolution Rwanda organization.

> Short: this README explains how to clone the repo (terminal or VS Code), install dependencies, run the project locally, and the high-level project structure.

---

## Prerequisites

- Node.js 18+ (or the version specified in `package.json` / `.nvmrc` if present)
- Git
- A GitHub account with access to this repository (this repo is private; use SSH or a PAT if cloning over HTTPS)
- One of: npm, yarn, or pnpm (use whichever the project uses; `package.json` scripts will be the source of truth)

---

## Clone the repository

Terminal (HTTPS):

```bash
# using HTTPS (may require GitHub username/password or PAT for private repos)
git clone https://github.com/techrevolutionrwanda/curuza.git
cd curuza
```

Terminal (SSH - recommended if you have SSH keys configured):

```bash
git clone git@github.com:techrevolutionrwanda/curuza.git
cd curuza
```

VS Code (GUI):

1. Open Visual Studio Code.
2. Open the Command Palette (View → Command Palette... or Ctrl/Cmd+Shift+P).
3. Run `Git: Clone` and paste the repository URL (either the HTTPS or SSH URL above).
4. When prompted, choose a local folder and open the cloned repository in VS Code.
5. (Optional) Run `code .` in the repo folder to open the project in VS Code from the terminal.

---

## Install dependencies

Check the project for a preferred package manager. If a `package-lock.json` exists, use npm; if `yarn.lock` exists, use yarn; if `pnpm-lock.yaml` exists, use pnpm.

Common commands:

```bash
# npm
npm install
# yarn
yarn install
# pnpm
pnpm install
```

---

## Run the project locally

Look at `package.json` `scripts` to confirm available commands. Typical commands are:

```bash
# start in development mode
npm run dev
# or
npm start

# build for production
npm run build

# run tests
npm test
```

If the project is a web app, the dev server usually runs on http://localhost:3000 or http://localhost:5173 — check the console output after running the dev script.

---

## Working with VS Code

- Open the project folder in VS Code.
- Install recommended extensions (TypeScript, ESLint, Prettier, etc.) if prompted.
- Use the built-in terminal (View → Terminal) to run the commands above.
- Use the debugger configuration in `.vscode/launch.json` if present, or create one to attach to the dev server.

---

## Project structure (example — may vary)

The exact structure may differ; this is a common layout for TypeScript apps:

```
curuza/
├─ package.json          # scripts and dependencies
├─ tsconfig.json         # TypeScript configuration
├─ .eslintrc.js          # (optional) ESLint config
├─ .prettierrc           # (optional) Prettier config
├─ public/               # static assets (if a web project)
├─ src/                  # application source code
│  ├─ index.tsx          # app entry (React) or main.ts
│  ├─ App.tsx            # root component (if applicable)
│  ├─ components/        # reusable UI components
│  ├─ pages/             # page-level components or routes
│  └─ styles/            # styles or CSS modules
├─ tests/                # tests (unit/integration)
└─ README.md             # this file
```

To find the true entry point and scripts, open `package.json` and look for the `main`, `scripts`, and `devDependencies` fields.

---

## Troubleshooting

- If cloning fails due to permission errors, make sure your GitHub user has access to the `techrevolutionrwanda/curuza` repository and that you are authenticating correctly (SSH keys set up or use a PAT for HTTPS).
- If `npm install` fails, check your Node.js version and the error message — installing the correct Node version with nvm often resolves version mismatches.

---

## Contributing

If you plan to contribute, please check for a `CONTRIBUTING.md` or existing issues/pull request guidelines in the repository.

---

If you'd like, I can:
- Open this README file in the repository so you can review/edit it.
- Add more project-specific setup steps if you tell me the package manager and dev script names.
- Add badges (build/test) or a short project description — provide the text you want shown.
