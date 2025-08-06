# Project Description

## 1. Enviroment variables

Each microservice contains `.env.example` where listed all env variables that we must have to launch our project

To launch each microservice locally in dev flow we need to create `.env.development.local` file with the same variables as in the `.env.example`

In production automatically used variables from incubator/my_team page

To run tests locally we need to create file `.env.testing.local` with variables of testing environment

## 2. Package.json commands' explanation

- **`build`** - Compiles all apps in the monorepo using Nest CLI (nest build)
- **`build:main`** - Compiles only the main service (apps/main/)
- **`start:main`** - Runs the compiled main service in production mode using Node.js directly
  - these expect that you've run build:* first so dist/ exists.
- **`start:dev:main`** - Starts main service in watch mode — hot-reloads on code changes
  - Uses cross-env NODE_ENV=development to simulate dev environment.
    - cross-env ensure that NODE_ENV=development works for any OS(Linux/macOS/Windows)
    - NODE_ENV=development we dont declare NODE_ENV inside our code manually. instead we pass it at runtime by script "cross-env NODE_ENV=development nest start main --watch"
- **`format`** - Runs Prettier and formats all *.ts files in apps/ and libs/
- **`lint`** - Runs ESLint on all code and auto-fixes violations
- **`test`** - Runs all Jest UNIT tests (*.spec.ts) across the whole project
  - user.service.spec.ts → unit test
  - app.e2e-spec.ts → E2E test
- **`test:e2e`** - Runs E2E tests for payments service (default)
- **`test:e2e:main`** - Runs E2E tests for main service (apps/main/test/jest-e2e.json)
  - "cross-env NODE_ENV=testing jest --config ./apps/main/test/jest-e2e.json"
    - jest --config ./apps/main/test/jest-e2e.json it tells Jest to use a custom config file located at: ./apps/main/test/jest-e2e.json instead of using the default jest.config.js
    