# Angular21

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Commit-time ARIA accessibility review

`npm install` configures this repository's local Git hooks. Before every commit, the
pre-commit hook validates `.github/agents/aria-accessibility-reviewer.agent.md` and
uses the installed, authenticated GitHub Copilot CLI to review staged `.html` and
`.ts` files. It blocks the commit when the agent definition is invalid, Copilot cannot
complete the review, the response is malformed, or any High, Medium, or Low finding is
reported.

Run the check manually with:

```bash
npm run verify:aria-accessibility-reviewer
```

The hook requires `node`, `npm`, and an authenticated `copilot` CLI in `PATH`. If hooks
were not configured during installation, run `npm run setup:git-hooks`. Git's
`git commit --no-verify` bypasses the local hook and should be reserved for exceptional
cases.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
