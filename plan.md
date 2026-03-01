# E-Commerce Platform Revamp Plan

## 1. Architectural & Structural Issues
*   **Monolithic Frontend**: Bundling Buyer, Seller, and Admin interfaces into a single application increases the bundle size, complicates routing, and exposes admin/seller routes to standard users.
*   **Lack of Monorepo Structure**: Sharing code (UI components, API clients, TypeScript types, validation schemas) across three separate frontends requires a proper monorepo tool (like Turborepo, Nx, or npm/yarn workspaces).
*   **Auth Flow UX**: Relying on Keycloak's default login/signup screens breaks the immersion and branding of the application. Custom UI pages are needed for a seamless experience.
*   **Token Management**: Storing tokens on the client-side (LocalStorage/Memory) poses security risks. A Backend-For-Frontend (BFF) pattern or HttpOnly cookies should be considered for a production-grade app.

## 2. Proposed Architecture
*   **Monorepo Setup**: Migrate to an `npm` or `pnpm` workspace with `apps/` and `packages/` directories.
    *   `apps/buyer`: The main storefront (migrated from the current `frontend`).
    *   `apps/seller`: Dashboard for inventory and order management.
    *   `apps/admin`: Platform administration, user management, and global analytics.
    *   `packages/ui`: Shared React components (Buttons, Inputs, Navbars).
    *   `packages/config`: Shared ESLint, TypeScript, and Tailwind configurations.
    *   `packages/api`: Shared Axios instances, DTO types, and API hooks.
*   **Backend**: Maintain the Spring Boot modular monolith but strictly separate controllers and security filters (`/api/buyer/*`, `/api/seller/*`, `/api/admin/*`, `/api/auth/*`).

## 3. Custom Authentication Strategy
To achieve custom Login/Signup pages without redirecting to Keycloak's standard UI, we have two primary paths:
*   **Path A: Direct Access Grants (ROPC)**: The frontend collects credentials via custom forms and sends them to the backend. The backend acts as a proxy, exchanging credentials for Keycloak tokens and returning them to the client (or setting HttpOnly cookies).
*   **Path B: Keycloak Custom Theme**: Create a highly customized, React-based Keycloak theme that matches the exact design system of the apps. *(Path A is generally preferred for absolute control over the React app's state and routing).*

## 4. UI/UX Enhancements
*   **Design System**: Implement a cohesive design system using Radix UI/shadcn principles combined with Tailwind CSS.
*   **Micro-interactions**: Add Framer Motion for fluid transitions, page routing animations, and interactive feedback.
*   **Skeleton Loaders**: Replace basic "Loading..." text with animated skeleton components for better perceived performance.
*   **Responsive Excellence**: Ensure all dashboards and storefronts are perfectly optimized for mobile, tablet, and desktop.

## 5. Step-by-Step Execution Plan

### Phase 1: Monorepo Transformation
1.  Initialize a workspace root.
2.  Move the current `frontend` to `apps/buyer`.
3.  Create `apps/seller` and `apps/admin` using Vite + React + TanStack Router.
4.  Extract shared configurations into a `packages/` directory.

### Phase 2: Backend Auth & Proxy Setup
1.  Implement an Auth Controller in Spring Boot to handle custom login and registration requests.
2.  Integrate Keycloak Admin REST Client in the backend to programmatically create users and assign roles based on the custom signup form.
3.  Configure HttpOnly cookies for token delivery to enhance security across the three apps.

### Phase 3: Frontend Scaffolding & Custom Auth UI
1.  Build the custom Login and Signup pages in `apps/buyer`, `apps/seller`, and `apps/admin`.
2.  Integrate Zod & React Hook Form for robust validation.
3.  Connect the forms to the new backend Auth Controller.

### Phase 4: Role-Specific App Development
1.  **Buyer App**: Refine the product catalog, add a robust shopping cart state, and polish the checkout flow.
2.  **Seller App**: Build data tables with sorting/filtering for inventory, and add interactive charts for sales metrics.
3.  **Admin App**: Develop global user management, platform health monitoring, and dispute resolution interfaces.

### Phase 5: Polish & Deployment
1.  Update Docker Compose to build and serve the three distinct frontends and the backend proxy.
2.  Configure Caddy/Nginx to route subdomains (e.g., `shop.localhost`, `seller.localhost`, `admin.localhost`) to the correct containers.
3.  Perform final end-to-end testing.
