# Copilot instructions

## Commands

Use npm (the repository pins npm 11.6.2).

| Task | Command |
| --- | --- |
| Development server | `npm start` |
| Production build | `npm run build` |
| Development build | `npm run build -- --configuration development` |
| All unit tests, once | `npm test -- --watch=false` |
| One unit spec, once | `npm test -- --watch=false --include='src/app/app.spec.ts'` |
| All E2E tests | `npm run e2e` |
| One E2E spec | Start `npm start`, then run `npx playwright test e2e/example.spec.ts --project=chromium` |

Unit tests use Angular's unit-test builder with Vitest globals. E2E tests use Playwright in Chromium, Firefox, and WebKit; `ng e2e` starts the configured Angular dev server. There is no `lint` npm script or Angular `lint` target.

## Application architecture

- `src/main.ts` bootstraps the standalone `App` with `appConfig`. `App` always renders `Header` and the router outlet.
- `src/app/app.routes.ts` is the routing source of truth. Page components are mapped directly to routes. Dashboard, users, products, and user-details routes use `dashboardGuard`; the guard reads `token_angular` from `localStorage`, validates it at `${environment.baseUrl}/auth/validate`, and redirects to `/login` with `returnUrl` when invalid. Keep this guard on new protected dashboard routes.
- `src/store/index.ts` contains the root-provided `ProductSearchStore`, the shared state owner for products, cart items, and in-memory orders. It loads products through `ProductService` on initialization and persists the cart under the `app_cart` local-storage key. Product and cart components, dashboard pages, and the review-order flow consume this store directly.
- API base URLs are defined in `src/environments/environment.ts` (production) and replaced with `environment.development.ts` by the development build configuration. New API consumers should import `environment` from `src/environments/environment`, not the development file directly, so file replacement works.
- Pages live in `src/app/pages`, reusable UI in `components` and `widgets`, and API integration in `services`. Each component is conventionally colocated with its `.ts`, `.html`, `.css`, and `.spec.ts` files. Global Tailwind CSS is imported from `src/styles.css`.

## Angular and state conventions

- This is a standalone Angular application: declare template dependencies in a component's `imports`; do not add NgModules or `standalone: true`.
- Use `inject()` for dependencies, signal-based `input()`/`output()` APIs, signals for local state, and `computed()` for derivations. Update signals with `set()` or `update()`, never `mutate()`.
- Use `ChangeDetectionStrategy.OnPush` for new components. Use Angular native control flow (`@if`, `@for`, and `@switch`) rather than structural control-flow directives, and use class/style bindings rather than `ngClass` or `ngStyle`.
- The app uses Angular signal forms (`form()` and `FormField`) for login, signup, and contact pages. Follow that pattern for comparable forms rather than introducing template-driven forms.
- Shared domain state belongs in an NgRx Signal Store. Keep local presentation state in the component; do not introduce the classic NgRx Store/reducers/actions/selectors stack. Model derived store values with `withComputed`, state changes with `patchState`, and asynchronous store work with `rxMethod` when an RxJS pipeline is needed.
- Keep HTTP/infrastructure calls in root-provided services when they are reusable. Preserve the established authentication key (`token_angular`) and cart key (`app_cart`) unless all consumers and persisted-data migration are updated together.

## TypeScript and tests

- TypeScript and Angular templates run in strict mode. Do not add `any`; use existing interfaces, explicit domain types, or `unknown` at truly untyped boundaries.
- Component specs use `TestBed.configureTestingModule({ imports: [Component] })` for standalone components. Add or update the colocated `.spec.ts` when changing component or service behavior.
- The Playwright configuration uses `http://localhost:4200` unless `PLAYWRIGHT_TEST_BASE_URL` is set. Keep E2E tests under `e2e/` and avoid `test.only`, which is rejected on CI.

## Scope of changes

- Check existing components, services, and the Signal Store before adding an abstraction. Keep task changes focused; do not reorganize unrelated files, add dependencies without need, or commit automatically.
