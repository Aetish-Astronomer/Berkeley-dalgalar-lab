/**
 * ============================================================================
 * EMPIRICAL ADVERSARIAL STRESS TEST SUITE: MILESTONE 4
 * Berkeley Waves Interactive Laboratory — Git, GitHub & Automated Deployment
 *
 * Challenger: challenger_m4_1_gen2
 * Verification Focus:
 *  1. Git repository integrity (branch, clean porcelain status, commit count & semantic messages, remote origin, author config).
 *  2. .gitignore coverage & file exclusion verification via `git check-ignore`.
 *  3. GitHub Actions workflow (.github/workflows/deploy.yml) structure, syntax, permissions, actions, and pipeline order.
 *  4. Production build artifact inspection (relative asset paths, dist integrity, KaTeX font assets).
 *  5. package.json scripts and TypeScript typecheck command validity.
 * ============================================================================
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = 'c:/Users/ati/berkeley-dalgalar-lab';

test('M4-Adv-1: Git Repository State & Working Tree Purity', () => {
  // 1.1 Verify git directory exists
  const gitDir = path.join(ROOT, '.git');
  assert.ok(fs.existsSync(gitDir), '.git directory must exist');

  // 1.2 Verify active branch is strictly 'main'
  const branch = execSync('git branch --show-current', { cwd: ROOT, encoding: 'utf8' }).trim();
  assert.equal(branch, 'main', 'Active branch must be "main"');

  // 1.3 Verify git status --porcelain is clean (no untracked source files or dirty modifications)
  const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' }).trim();
  // Filter out intentional challenge/review test harnesses
  const untrackedLines = status
    ? status.split('\n').filter(l => {
        const line = l.trim();
        if (line.includes('tests/m4_adversarial_challenge.test.mjs')) return false;
        if (line.includes('tests/m4_stress_challenge.test.mjs')) return false;
        return line.length > 0;
      })
    : [];
  assert.equal(untrackedLines.length, 0, `Working tree must be clean of untracked code files. Found:\n${untrackedLines.join('\n')}`);

  // 1.4 Verify commit count is at least 5
  const commitCountStr = execSync('git rev-list --count HEAD', { cwd: ROOT, encoding: 'utf8' }).trim();
  const commitCount = parseInt(commitCountStr, 10);
  assert.ok(commitCount >= 5, `Repository must contain at least 5 commits; found ${commitCount}`);

  // 1.5 Verify all commit messages follow semantic commit conventions
  const commitLogs = execSync('git log --format="%h %s"', { cwd: ROOT, encoding: 'utf8' }).trim().split('\n');
  assert.ok(commitLogs.length >= 5, 'Commit log must return >= 5 commits');
  const semanticPrefixes = ['feat(', 'fix(', 'docs(', 'style(', 'refactor(', 'perf(', 'test(', 'chore(', 'ci('];
  for (const log of commitLogs) {
    const message = log.substring(log.indexOf(' ') + 1).trim();
    const hasSemanticPrefix = semanticPrefixes.some(prefix => message.startsWith(prefix));
    assert.ok(hasSemanticPrefix, `Commit message "${message}" must follow semantic conventional commits`);
  }

  // 1.6 Verify remote origin
  const remotes = execSync('git remote -v', { cwd: ROOT, encoding: 'utf8' }).trim();
  assert.ok(remotes.includes('origin'), 'Remote origin must be configured');
  assert.ok(
    remotes.includes('https://github.com/ati/berkeley-dalgalar-lab.git'),
    `Remote origin URL must match https://github.com/ati/berkeley-dalgalar-lab.git; found:\n${remotes}`
  );

  // 1.7 Verify local author identity
  const userName = execSync('git config user.name', { cwd: ROOT, encoding: 'utf8' }).trim();
  const userEmail = execSync('git config user.email', { cwd: ROOT, encoding: 'utf8' }).trim();
  assert.ok(userName.length > 0, 'git config user.name must be configured');
  assert.ok(userEmail.length > 0, 'git config user.email must be configured');
});

test('M4-Adv-2: .gitignore Rules & Inadvertent File Exclusion Testing', () => {
  const gitignorePath = path.join(ROOT, '.gitignore');
  assert.ok(fs.existsSync(gitignorePath), '.gitignore must exist');
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

  // 2.1 Verify critical ignore patterns are present
  const requiredPatterns = ['node_modules/', 'dist/', '.agents/', '*.log', '.DS_Store', 'Thumbs.db'];
  for (const pat of requiredPatterns) {
    assert.ok(gitignoreContent.includes(pat), `.gitignore must contain pattern: ${pat}`);
  }

  // 2.2 Verify git check-ignore returns positive match for sensitive/build paths
  const testPaths = [
    'node_modules/package/index.js',
    'dist/index.html',
    'dist/assets/index.js',
    '.agents/teamwork/plan.md',
    '.agents/worker/handoff.md',
    'debug.log',
    'npm-debug.log',
    '.DS_Store',
    'Thumbs.db',
    '.vscode/settings.json'
  ];

  for (const tp of testPaths) {
    try {
      const ignored = execSync(`git check-ignore "${tp}"`, { cwd: ROOT, encoding: 'utf8' }).trim();
      assert.ok(ignored.length > 0, `Expected path "${tp}" to be ignored by git`);
    } catch {
      assert.fail(`Path "${tp}" should have been matched by .gitignore`);
    }
  }

  // 2.3 Verify tracked files list contains NO ignored files
  const trackedFiles = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).trim().split('\n');
  for (const tf of trackedFiles) {
    assert.ok(!tf.startsWith('node_modules/'), `Tracked file in node_modules found: ${tf}`);
    assert.ok(!tf.startsWith('dist/'), `Tracked file in dist found: ${tf}`);
    assert.ok(!tf.startsWith('.agents/'), `Tracked file in .agents found: ${tf}`);
    assert.ok(!tf.endsWith('.log'), `Tracked log file found: ${tf}`);
    assert.notEqual(tf, '.DS_Store', '.DS_Store must not be tracked');
    assert.notEqual(tf, 'Thumbs.db', 'Thumbs.db must not be tracked');
  }
});

test('M4-Adv-3: GitHub Actions CI/CD Deployment Pipeline Rigorous Verification', () => {
  const workflowPath = path.join(ROOT, '.github/workflows/deploy.yml');
  assert.ok(fs.existsSync(workflowPath), '.github/workflows/deploy.yml must exist');
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');

  // 3.1 Verify triggers
  assert.ok(/on:\s*(\n\s+push:\s*\n\s+branches:\s*\n\s+-\s+main|\s*\[.*push.*\])/.test(workflowContent) ||
    (workflowContent.includes('push:') && workflowContent.includes('main')), 'Workflow must trigger on push to main');
  assert.ok(workflowContent.includes('workflow_dispatch:'), 'Workflow must support workflow_dispatch');

  // 3.2 Verify security permissions
  assert.ok(workflowContent.includes('permissions:'), 'Workflow must have permissions block');
  assert.ok(workflowContent.includes('contents: read'), 'contents: read must be configured');
  assert.ok(workflowContent.includes('pages: write'), 'pages: write must be configured');
  assert.ok(workflowContent.includes('id-token: write'), 'id-token: write must be configured');

  // 3.3 Verify concurrency control to prevent stale deployments
  assert.ok(workflowContent.includes("group: 'pages'") || workflowContent.includes('group: "pages"') || workflowContent.includes('group: pages'),
    'Concurrency group must be pages');
  assert.ok(workflowContent.includes('cancel-in-progress: true'), 'cancel-in-progress must be true');

  // 3.4 Verify build job configuration and action steps
  assert.ok(workflowContent.includes('build:'), 'Workflow must define build job');
  assert.ok(workflowContent.includes('runs-on: ubuntu-latest'), 'Workflow must run on ubuntu-latest');
  assert.ok(workflowContent.includes('actions/checkout@v4'), 'Workflow must use actions/checkout@v4');
  assert.ok(workflowContent.includes('actions/setup-node@v4'), 'Workflow must use actions/setup-node@v4');
  assert.ok(workflowContent.includes('node-version: 20'), 'Workflow must use Node 20');
  assert.ok(workflowContent.includes("cache: 'npm'") || workflowContent.includes('cache: "npm"'), 'Workflow must configure npm cache');

  // 3.5 Verify sequential pipeline execution: npm ci -> npm run typecheck -> npm test -> npm run build
  const ciIdx = workflowContent.indexOf('npm ci');
  const typecheckIdx = workflowContent.indexOf('npm run typecheck');
  const testIdx = workflowContent.indexOf('npm test');
  const buildIdx = workflowContent.indexOf('npm run build');

  assert.ok(ciIdx !== -1, 'Workflow must run npm ci');
  assert.ok(typecheckIdx !== -1, 'Workflow must run npm run typecheck');
  assert.ok(testIdx !== -1, 'Workflow must run npm test');
  assert.ok(buildIdx !== -1, 'Workflow must run npm run build');

  assert.ok(ciIdx < typecheckIdx, 'npm ci must run before npm run typecheck');
  assert.ok(typecheckIdx < testIdx, 'npm run typecheck must run before npm test');
  assert.ok(testIdx < buildIdx, 'npm test must run before npm run build');

  // 3.6 Verify artifact upload action and path
  assert.ok(workflowContent.includes('actions/upload-pages-artifact@v3'), 'Must use actions/upload-pages-artifact@v3');
  assert.ok(workflowContent.includes("path: './dist'") || workflowContent.includes('path: dist') || workflowContent.includes('path: "./dist"'),
    'Artifact upload path must target dist');

  // 3.7 Verify deploy job configuration and dependency
  assert.ok(workflowContent.includes('deploy:'), 'Workflow must define deploy job');
  assert.ok(workflowContent.includes('needs: build'), 'deploy job must depend on build job');
  assert.ok(workflowContent.includes('github-pages'), 'deploy environment must be github-pages');
  assert.ok(workflowContent.includes('actions/deploy-pages@v4'), 'Must use actions/deploy-pages@v4');
});

test('M4-Adv-4: Production Build Static Artifact Quality & Relative Paths', () => {
  const distDir = path.join(ROOT, 'dist');
  assert.ok(fs.existsSync(distDir), 'dist directory must exist');

  const indexHtmlPath = path.join(distDir, 'index.html');
  assert.ok(fs.existsSync(indexHtmlPath), 'dist/index.html must exist');
  const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // 4.1 Verify relative path references in index.html (vital for GitHub Pages subdirectory hosting)
  assert.ok(
    htmlContent.includes('./assets/') || !htmlContent.includes('href="/assets/'),
    'dist/index.html should not have root-relative /assets/ links that break on GitHub Pages'
  );

  // 4.2 Verify JS bundle and CSS bundles exist in dist/assets
  const assetsDir = path.join(distDir, 'assets');
  assert.ok(fs.existsSync(assetsDir), 'dist/assets directory must exist');
  const assetFiles = fs.readdirSync(assetsDir);

  const jsFiles = assetFiles.filter(f => f.endsWith('.js'));
  const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
  const fontFiles = assetFiles.filter(f => f.endsWith('.woff') || f.endsWith('.woff2') || f.endsWith('.ttf'));

  assert.ok(jsFiles.length >= 1, 'At least 1 bundled JS file must exist in dist/assets');
  assert.ok(cssFiles.length >= 1, 'At least 1 bundled CSS file must exist in dist/assets');
  assert.ok(fontFiles.length >= 20, `KaTeX fonts must be included in dist/assets; found ${fontFiles.length}`);

  // 4.3 Verify vite.config.ts base configuration
  const viteConfigPath = path.join(ROOT, 'vite.config.ts');
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  assert.ok(
    viteConfig.includes("base: './'") || viteConfig.includes('base: "./"'),
    'vite.config.ts must specify base: "./" for static relative hosting'
  );
});

test('M4-Adv-5: package.json Quality & Script Integrity', () => {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  assert.ok(pkg.scripts, 'package.json must contain scripts');
  assert.equal(pkg.scripts.typecheck, 'tsc --noEmit', 'typecheck script must be "tsc --noEmit"');
  assert.ok(pkg.scripts.build.includes('tsc --noEmit'), 'build script must include tsc --noEmit check');
  assert.ok(pkg.scripts.build.includes('vite build'), 'build script must execute vite build');
  assert.equal(pkg.scripts.test, 'node --test tests/physics_and_derivations.test.mjs', 'test script must run physics invariant test suite');
});
