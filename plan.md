# E-Commerce Project Plan: Spring Boot & TanStack Start

This document outlines the architectural plan and implementation roadmap for the e-commerce application.

## 1. Project Structure
```text
/ecomm-spring
├── backend/                # Spring Boot Application
├── frontend/               # TanStack Start Application
├── docker-compose.yaml     # Production/Staging Compose
├── docker-compose.dev.yaml # Development Compose (with Watch)
├── plan.md                 # Project Plan
└── .github/workflows/      # CI/CD Pipelines
```

## 2. Tech Stack

### Backend (Spring Boot)
- **Framework:** Spring Boot 3.x (Java 21)
- **Database:** PostgreSQL
- **Security:** Spring Security with Keycloak (OIDC/OAuth2)
- **API Documentation:** Springdoc OpenAPI (Swagger UI)
- **Type Safety:** OpenAPI Generator for TypeScript types
- **Persistence:** Spring Data JPA

### Frontend (TanStack Start)
- **Framework:** TanStack Start (Full-stack React framework)
- **Styling:** Tailwind CSS + shadcn/ui
- **Data Fetching:** TanStack Query (React Query)
- **State Management:** TanStack Router (Built-in to Start)
- **Auth:** Keycloak JS SDK integration

### DevOps & CI/CD
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Development Experience:** `docker compose watch` for hot-reloading across the stack.
- **CI/CD:** GitHub Actions (Build, Test, Lint, and Docker Image Push)

---

## 3. Implementation Phases

### Phase 1: Infrastructure & Backend Foundation
1. **Docker Setup:**
   - Create `docker-compose.dev.yaml` with PostgreSQL and Keycloak services.
   - Configure Keycloak Realm for `ecomm-app` with a client for the frontend.
2. **Spring Boot Scaffolding:**
   - Initialize Spring Boot with Web, JPA, Postgres, Security, and Validation.
   - Configure `application-dev.yml` to connect to Dockerized Postgres.
3. **OpenAPI Configuration:**
   - Setup `springdoc-openapi`.
   - Implement a sample `ProductController` with basic CRUD to serve as the type-generation source.

### Phase 2: Authentication (Keycloak)
1. **Keycloak Configuration:**
   - Set up "Email/Password" login flow.
   - Create test users.
2. **Spring Security Integration:**
   - Configure `SecurityFilterChain` to validate JWTs from Keycloak.
   - Implement `@PreAuthorize` on protected routes.

### Phase 3: Frontend Foundation (TanStack Start)
1. **Scaffold Frontend:**
   - Initialize TanStack Start project.
   - Install Tailwind CSS and shadcn/ui.
2. **Type Generation Setup:**
   - Add a script to fetch `swagger.json` from the backend and generate TypeScript types using `openapi-typescript`.
3. **React Query & API Client:**
   - Setup `QueryClient`.
   - Create an Axios/Fetch instance using the generated types.

### Phase 4: Routing & Auth UI
1. **Navigation:**
   - Implement layout with non-protected (Home, Products) and protected (Profile, Orders) routes.
2. **Keycloak Integration:**
   - Implement a `useAuth` hook or context using `keycloak-js`.
   - Create a `ProtectedRoute` component for redirecting unauthenticated users.

### Phase 5: CI/CD & Dev Experience
1. **Docker Compose Watch:**
   - Configure `docker-compose.dev.yaml` to sync local changes to containers.
2. **GitHub Actions:**
   - Create `ci.yaml` to run tests on every PR.
   - Create `cd.yaml` to build and push Docker images.

---

## 4. Specific Workflows

### API Type Generation Workflow
1. Developer updates Backend controller/DTO.
2. Run `npm run generate-api` in `frontend/`.
3. `openapi-typescript` reads `http://localhost:8080/v3/api-docs` and updates `frontend/src/types/api.d.ts`.
4. Frontend code immediately reflects schema changes with full IntelliSense.

### Development Workflow
1. Run `docker compose -f docker-compose.dev.yaml up`.
2. Backend runs with hot-reload (via Spring DevTools).
3. Frontend runs with TanStack Start dev server.
4. Keycloak handles auth locally at `localhost:8080/auth`.
