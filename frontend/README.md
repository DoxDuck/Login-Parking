# Parking System Frontend

Frontend application built with React, TypeScript, and Vite.

## Project structure

```text
src/
├── app/                         # Application composition and global setup
├── presentation/                # Pages, components, layouts, hooks, and styles
├── application/                 # Use cases and application-level orchestration
├── domain/                      # Business entities, rules, and repository contracts
├── infrastructure/              # API, persistence, and repository implementations
├── shared/                      # Reusable types, constants, and utilities
├── assets/                      # Static assets used by the application
└── main.tsx                     # Browser entry point
```

## Layer responsibilities

- **Presentation** renders the UI and forwards user actions to application use cases.
- **Application** coordinates workflows and depends on domain contracts.
- **Domain** owns business rules and repository interfaces; it stays independent of React and external services.
- **Infrastructure** implements domain contracts and integrates with APIs or browser storage.

Keep dependencies pointed inward: `presentation` → `application` → `domain`. `infrastructure` implements contracts defined by `domain`; domain code must not import infrastructure or UI code.

## Development

```sh
npm install
npm run dev
npm run build
npm run lint
```
