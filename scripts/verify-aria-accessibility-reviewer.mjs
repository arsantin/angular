import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AGENT_NAME = 'aria-accessibility-reviewer';
const REQUIRED_BODY_FRAGMENTS = [
  'MDN ARIA reference',
  'Native semantic HTML before ARIA.',
  'Accessible names and descriptions',
  'Keyboard-operable interactive controls',
  'State synchronization for dynamic UI',
  '[attr.aria-*]',
  'Repeated controls and dynamic lists',
  'Manual verification',
  'If no issues are found',
  '| Severity',
  '| High/Medium/Low',
];

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const agentPath = path.join(repositoryRoot, '.github/agents/aria-accessibility-reviewer.agent.md');

function commandOutput(command, args) {
  return execFileSync(command, args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

export function validateAgentDefinition(content) {
  const errors = [];
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  if (!frontmatter) {
    return ['Agent definition must contain YAML frontmatter followed by instructions.'];
  }

  const [, metadata, instructions] = frontmatter;
  if (!/^name:\s*aria-accessibility-reviewer\s*$/m.test(metadata)) {
    errors.push(`Agent name must be "${AGENT_NAME}".`);
  }

  if (!/^description:\s*Reviews Angular templates and components for correct ARIA usage and accessibility regressions without modifying files\s*$/m.test(metadata)) {
    errors.push('Agent description must describe the read-only Angular ARIA review.');
  }

  const toolsMatch = metadata.match(/^tools:\s*\[([^\]]*)\]\s*$/m);
  const tools = toolsMatch
    ? toolsMatch[1]
        .split(',')
        .map((tool) => tool.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
        .sort()
    : [];
  if (tools.join(',') !== 'read,search') {
    errors.push('Agent tools must be restricted to read and search.');
  }

  for (const fragment of REQUIRED_BODY_FRAGMENTS) {
    if (!instructions.includes(fragment)) {
      errors.push(`Agent instructions must include "${fragment}".`);
    }
  }

  return errors;
}

export function stagedAngularFiles(gitOutput) {
  return gitOutput
    .split('\0')
    .filter(Boolean)
    .filter((file) => file.endsWith('.html') || file.endsWith('.ts'));
}

function tableCells(line) {
  return line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
}

export function parseReviewReport(report, files) {
  const lines = report.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => {
    const cells = tableCells(line);
    return cells.length === 4 && cells[0] === 'Severity' && cells[1] === 'File and line';
  });

  if (headerIndex === -1 || !/^\|\s*-{3,}/.test(lines[headerIndex + 1]?.trim() ?? '')) {
    throw new Error('Copilot returned no valid accessibility findings table.');
  }

  const findings = [];
  for (let index = headerIndex + 2; index < lines.length && lines[index].trim().startsWith('|'); index += 1) {
    const cells = tableCells(lines[index]);
    if (cells.length !== 4 || !['High', 'Medium', 'Low'].includes(cells[0])) {
      throw new Error('Copilot returned a malformed accessibility finding.');
    }
    findings.push({ severity: cells[0], file: cells[1], finding: cells[2], recommendation: cells[3] });
  }

  const severityRows = lines.filter((line) => {
    const cells = tableCells(line);
    return cells.length === 4 && ['High', 'Medium', 'Low'].includes(cells[0]);
  });
  if (severityRows.length !== findings.length) {
    throw new Error('Copilot returned accessibility findings outside the required table.');
  }

  if (findings.length === 0) {
    if (!/\bno (accessibility )?issues found\b/i.test(report)) {
      throw new Error('Copilot did not clearly state that no accessibility issues were found.');
    }

    for (const file of files) {
      if (!report.includes(file)) {
        throw new Error(`Copilot did not name reviewed file "${file}".`);
      }
    }
  }

  return findings;
}

export function createReviewPrompt(files) {
  const fileList = files.map((file) => `- \`${file}\``).join('\n');
  return `Review only these staged Angular files for ARIA accessibility defects:\n${fileList}\n\nUse the ${AGENT_NAME} instructions exactly. Do not edit files or inspect unrelated files. Always return the required four-column findings table. If there are no findings, return the empty table followed by "No accessibility issues found." and "Files reviewed:" listing every path above.`;
}

export function invokeCopilot(files, execute = commandOutput) {
  return execute('copilot', [
    '--prompt',
    createReviewPrompt(files),
    '--agent',
    AGENT_NAME,
    '--allow-all-tools',
    '--output-format',
    'text',
    '--silent',
  ]);
}

export function verify(agentDefinition, gitOutput, execute = commandOutput) {
  const definitionErrors = validateAgentDefinition(agentDefinition);
  if (definitionErrors.length > 0) {
    throw new Error(`ARIA reviewer definition is invalid:\n- ${definitionErrors.join('\n- ')}`);
  }

  const files = stagedAngularFiles(gitOutput);
  if (files.length === 0) {
    return { files, findings: [], report: null };
  }

  const report = invokeCopilot(files, execute);
  const findings = parseReviewReport(report, files);
  if (findings.length > 0) {
    throw new Error(`Copilot found ${findings.length} accessibility issue(s).`);
  }

  return { files, findings, report };
}

function main() {
  try {
    const agentDefinition = readFileSync(agentPath, 'utf8');
    const gitOutput = commandOutput('git', [
      'diff',
      '--cached',
      '--name-only',
      '--diff-filter=ACMR',
      '-z',
    ]);
    const result = verify(agentDefinition, gitOutput);

    if (result.report) {
      process.stdout.write(`${result.report.trim()}\n`);
    } else {
      process.stdout.write('ARIA reviewer definition is valid; no staged Angular templates or components to review.\n');
    }
  } catch (error) {
    process.stderr.write(`ARIA accessibility verification failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
