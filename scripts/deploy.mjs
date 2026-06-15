import { execSync } from 'child_process';
import { existsSync, cpSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const tmpDir = join(tmpdir(), 'opencode', 'gh-pages-deploy');

if (!existsSync(dist)) {
  console.error('dist/ not found. Run npm run build:web first.');
  process.exit(1);
}

if (existsSync(tmpDir)) {
  rmSync(tmpDir, { recursive: true, force: true });
}

try {
  execSync(`git worktree add -f "${tmpDir}" origin/gh-pages`, {
    cwd: root,
    stdio: 'pipe',
  });
} catch {
  execSync(`git worktree add -f "${tmpDir}" --orphan gh-pages`, {
    cwd: root,
    stdio: 'pipe',
  });
}

const items = readdirSync(dist);
for (const item of items) {
  const src = join(dist, item);
  const dest = join(tmpDir, item);
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true });
  }
  cpSync(src, dest, { recursive: true, force: true });
}

execSync('git add -A', { cwd: tmpDir, stdio: 'pipe' });
try {
  execSync('git commit -m "Deploy web build"', { cwd: tmpDir, stdio: 'pipe' });
} catch {
  // no changes to commit
}
execSync('git push origin HEAD:gh-pages', { cwd: tmpDir, stdio: 'inherit' });
execSync(`git worktree remove "${tmpDir}"`, { cwd: root, stdio: 'pipe' });

console.log('Deployed to gh-pages!');
