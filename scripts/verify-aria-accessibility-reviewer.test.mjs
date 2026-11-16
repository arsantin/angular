import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  createReviewPrompt,
  invokeCopilot,
  parseReviewReport,
  stagedAngularFiles,
  validateAgentDefinition,
  verify,
} from './verify-aria-accessibility-reviewer.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validDefinition = readFileSync(
  path.join(repositoryRoot, '.github/agents/aria-accessibility-reviewer.agent.md'),
  'utf8',
);
const files = ['src/app/example.component.ts', 'src/app/example.component.html'];
const noFindingsReport = `| Severity | File and line | Finding | Recommendation |
| -------- | ------------- | ------- | -------------- |

No accessibility issues found.
Files reviewed: \`src/app/example.component.ts\`, \`src/app/example.component.html\`.`;

test('accepts the repository accessibility reviewer definition', () => {
  assert.deepEqual(validateAgentDefinition(validDefinition), []);
});

test('rejects agent definitions with write access or missing instructions', () => {
  const invalidDefinition = validDefinition
    .replace("tools: ['read', 'search']", "tools: ['read', 'write']")
    .replace('Manual verification', 'Browser checks');

  assert.deepEqual(validateAgentDefinition(invalidDefinition), [
    'Agent tools must be restricted to read and search.',
    'Agent instructions must include "Manual verification".',
  ]);
});

test('selects only staged Angular templates and component files', () => {
  assert.deepEqual(
    stagedAngularFiles('src/app/example.component.ts\0src/app/example.component.html\0README.md\0'),
    files,
  );
});

test('accepts a complete no-findings report that names every reviewed file', () => {
  assert.deepEqual(parseReviewReport(noFindingsReport, files), []);
});

test('returns findings for every severity so the caller can block the commit', () => {
  const report = `| Severity | File and line | Finding | Recommendation |
| -------- | ------------- | ------- | -------------- |
| High | \`src/app/example.component.ts:12\` | Missing control name | Add a label |
| Medium | \`src/app/example.component.html:8\` | Invalid role | Use a button |
| Low | \`src/app/example.component.html:16\` | Redundant ARIA | Remove it |`;

  assert.equal(parseReviewReport(report, files).length, 3);
});

test('rejects reports with no clear outcome or malformed findings', () => {
  assert.throws(
    () =>
      parseReviewReport(
        '| Severity | File and line | Finding | Recommendation |\n| --- | --- | --- | --- |',
        files,
      ),
    /did not clearly state/,
  );
  assert.throws(
    () =>
      parseReviewReport(
        '| Severity | File and line | Finding | Recommendation |\n| --- | --- | --- | --- |\n| Critical | file | issue | fix |',
        files,
      ),
    /malformed/,
  );
  assert.throws(
    () =>
      parseReviewReport(
        `${noFindingsReport}\n\n| Low | \`src/app/example.component.html:4\` | Redundant ARIA | Remove it |`,
        files,
      ),
    /outside the required table/,
  );
});

test('does not invoke Copilot when no Angular files are staged', () => {
  let invoked = false;
  const result = verify(validDefinition, 'README.md\0', () => {
    invoked = true;
    return '';
  });

  assert.deepEqual(result, { files: [], findings: [], report: null });
  assert.equal(invoked, false);
});

test('passes the constrained prompt and agent name to Copilot', () => {
  let invocation;
  const report = invokeCopilot(files, (command, args) => {
    invocation = { command, args };
    return noFindingsReport;
  });

  assert.equal(report, noFindingsReport);
  assert.equal(invocation.command, 'copilot');
  assert.equal(invocation.args[invocation.args.indexOf('--agent') + 1], 'aria-accessibility-reviewer');
  assert.match(createReviewPrompt(files), /Review only these staged Angular files/);
});

test('fails verification when Copilot reports any accessibility finding', () => {
  const report = `| Severity | File and line | Finding | Recommendation |
| -------- | ------------- | ------- | -------------- |
| Low | \`src/app/example.component.html:4\` | Redundant ARIA | Remove it |`;

  assert.throws(
    () => verify(validDefinition, `${files.join('\0')}\0`, () => report),
    /found 1 accessibility/,
  );
});
