#!/usr/bin/env node
// Assistant Statusline - GSD Edition
// Shows: model | current task | directory | context usage

const fs = require('fs');
const path = require('path');

// Read JSON from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
function findPlanningRoot(startDir) {
  let dir = startDir;
  while (dir) {
    const statePath = path.join(dir, '.planning', 'STATE.md');
    if (fs.existsSync(statePath)) {
      return { root: dir, statePath };
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  if (maxLength <= 3) return text.slice(0, maxLength);
  return `${text.slice(0, maxLength - 3)}...`;
}

function readTaskFromState(statePath) {
  try {
    const content = fs.readFileSync(statePath, 'utf8');
    const lines = content.split('\n');
    const phaseLine = lines.find(line => line.startsWith('Phase:')) || '';
    const planLine = lines.find(line => line.startsWith('Plan:')) || '';

    let phaseNum = '';
    let phaseName = '';
    const phaseMatch = phaseLine.match(/Phase:\s*([0-9]+(?:\.[0-9]+)?)(?:\s+of\s+[0-9]+)?(?:\s+\(([^)]+)\))?/);
    if (phaseMatch) {
      phaseNum = phaseMatch[1];
      phaseName = phaseMatch[2] || '';
    } else {
      const fallbackPhase = phaseLine.replace('Phase:', '').trim();
      phaseName = fallbackPhase;
    }

    let planCurrent = '';
    let planTotal = '';
    const planMatch = planLine.match(/Plan:\s*([0-9]+)\s+of\s+([0-9]+)/);
    if (planMatch) {
      planCurrent = planMatch[1];
      planTotal = planMatch[2];
    }

    const parts = [];
    if (phaseNum) {
      let label = `P${phaseNum}`;
      if (phaseName) label += ` ${truncate(phaseName, 20)}`;
      parts.push(label);
    } else if (phaseName) {
      parts.push(truncate(phaseName, 20));
    }

    if (planCurrent && planTotal) {
      parts.push(`${planCurrent}/${planTotal}`);
    }

    return parts.join(' ');
  } catch (e) {
    return '';
  }
}

function readPendingTodoCount(rootDir) {
  try {
    const pendingDir = path.join(rootDir, '.planning', 'todos', 'pending');
    if (!fs.existsSync(pendingDir)) return 0;
    const files = fs.readdirSync(pendingDir).filter(name => name.endsWith('.md'));
    return files.length;
  } catch (e) {
    return 0;
  }
}

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Assistant';
    const dir = data.workspace?.current_dir || process.cwd();
    const remaining = data.context_window?.remaining_percentage;

    // Context window display (shows USED percentage)
    let ctx = '';
    if (remaining != null) {
      const rem = Math.round(remaining);
      const used = Math.max(0, Math.min(100, 100 - rem));

      // Build progress bar (10 segments)
      const filled = Math.floor(used / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

      // Color based on usage
      if (used < 50) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 65) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 80) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m💀 ${bar} ${used}%\x1b[0m`;
      }
    }

    // Current task from planning state
    let task = '';
    const planning = findPlanningRoot(dir);
    if (planning) {
      task = readTaskFromState(planning.statePath);
      if (!task) {
        const todoCount = readPendingTodoCount(planning.root);
        if (todoCount > 0) task = `todos:${todoCount}`;
      }
    }

    // Output
    const dirname = path.basename(dir);
    if (task) {
      process.stdout.write(`\x1b[2m${model}\x1b[0m │ \x1b[1m${task}\x1b[0m │ \x1b[2m${dirname}\x1b[0m${ctx}`);
    } else {
      process.stdout.write(`\x1b[2m${model}\x1b[0m │ \x1b[2m${dirname}\x1b[0m${ctx}`);
    }
  } catch (e) {
    // Silent fail - don't break statusline on parse errors
  }
});
