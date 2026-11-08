import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import katex from 'katex';

const ROOT_DIR = path.resolve('.');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const WORKFLOW_PATH = path.join(ROOT_DIR, '.github', 'workflows', 'deploy.yml');
const GITIGNORE_PATH = path.join(ROOT_DIR, '.gitignore');
const PACKAGE_PATH = path.join(ROOT_DIR, 'package.json');
const VITE_CONFIG_PATH = path.join(ROOT_DIR, 'vite.config.ts');

describe('Milestone 4 Invariant & Stress Challenge Suite', () => {

  describe('1. Production Build & Relative Paths Invariant', () => {
    test('dist/index.html exists and is properly populated', () => {
      assert.ok(fs.existsSync(DIST_DIR), 'dist directory must exist');
      const indexPath = path.join(DIST_DIR, 'index.html');
      assert.ok(fs.existsSync(indexPath), 'dist/index.html must exist');
      const html = fs.readFileSync(indexPath, 'utf-8');
      assert.ok(html.length > 2000, 'dist/index.html should have substantial content');
    });

    test('dist/index.html contains zero absolute path asset references', () => {
      const html = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');

      // Match script tags
      const scriptMatches = [...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/gi)];
      for (const match of scriptMatches) {
        const src = match[1];
        if (!src.startsWith('http://') && !src.startsWith('https://')) {
          assert.ok(
            src.startsWith('./') || !src.startsWith('/'),
            `Script src "${src}" must be relative, not absolute / for GitHub Pages compatibility`
          );
          // Verify target exists
          const resolvedPath = path.resolve(DIST_DIR, src);
          assert.ok(fs.existsSync(resolvedPath), `Asset file referenced in script "${src}" must exist on disk`);
        }
      }

      // Match stylesheet links
      const linkMatches = [...html.matchAll(/<link\s+[^>]*href=["']([^"']+)["']/gi)];
      for (const match of linkMatches) {
        const href = match[1];
        if (!href.startsWith('http://') && !href.startsWith('https://')) {
          assert.ok(
            href.startsWith('./') || !href.startsWith('/'),
            `Link href "${href}" must be relative, not absolute / for GitHub Pages compatibility`
          );
          const resolvedPath = path.resolve(DIST_DIR, href);
          assert.ok(fs.existsSync(resolvedPath), `Asset file referenced in link "${href}" must exist on disk`);
        }
      }
    });

    test('vite.config.ts configures base: "./" for static relative hosting', () => {
      assert.ok(fs.existsSync(VITE_CONFIG_PATH), 'vite.config.ts must exist');
      const configText = fs.readFileSync(VITE_CONFIG_PATH, 'utf-8');
      assert.match(configText, /base:\s*['"]\.\/['"]/, 'vite.config.ts must explicitly configure base: "./"');
    });
  });

  describe('2. KaTeX Font Assets & CSS Offline Invariant', () => {
    test('CSS bundle exists and all font URLs resolve to existing local files with relative paths', () => {
      assert.ok(fs.existsSync(ASSETS_DIR), 'dist/assets directory must exist');
      const cssFiles = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.css'));
      assert.ok(cssFiles.length >= 1, 'At least one CSS bundle must exist in dist/assets');

      const cssPath = path.join(ASSETS_DIR, cssFiles[0]);
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      const urlMatches = [...cssContent.matchAll(/url\(([^)]+)\)/g)].map(m => {
        let u = m[1].trim();
        if ((u.startsWith('"') && u.endsWith('"')) || (u.startsWith("'") && u.endsWith("'"))) {
          u = u.slice(1, -1);
        }
        return u;
      });

      assert.ok(urlMatches.length > 0, 'CSS should contain url() references for fonts');

      const fontUrls = urlMatches.filter(u => !u.startsWith('data:') && /\.(woff2?|ttf|eot|otf)(\?.*)?$/i.test(u));
      assert.ok(fontUrls.length >= 20, `Expected at least 20 font URL references in KaTeX CSS, found ${fontUrls.length}`);

      for (const fontUrl of fontUrls) {
        // Strip query string or hash if present
        const cleanUrl = fontUrl.split('?')[0].split('#')[0];
        
        // Invariant: cannot start with absolute slash
        assert.ok(!cleanUrl.startsWith('/'), `Font URL "${cleanUrl}" must not be an absolute path starting with /`);

        // Resolve relative to ASSETS_DIR (since the CSS is in dist/assets)
        const fontPath = path.resolve(ASSETS_DIR, cleanUrl);
        assert.ok(
          fs.existsSync(fontPath),
          `Font file referenced in CSS "${cleanUrl}" must physically exist at ${fontPath}`
        );
      }
    });

    test('KaTeX font families are comprehensively bundled (AMS, Main, Math, Caligraphic, Fraktur, SansSerif, Size)', () => {
      const assetFiles = fs.readdirSync(ASSETS_DIR);
      const fontFiles = assetFiles.filter(f => f.startsWith('KaTeX_'));

      assert.ok(fontFiles.length >= 30, `Expected at least 30 KaTeX font files in dist/assets, found ${fontFiles.length}`);

      const families = ['AMS', 'Caligraphic', 'Fraktur', 'Main', 'Math', 'SansSerif', 'Script', 'Size1', 'Size2', 'Size3', 'Size4', 'Typewriter'];
      for (const family of families) {
        const found = fontFiles.some(f => f.includes(`KaTeX_${family}`));
        assert.ok(found, `KaTeX font family "${family}" must be present in dist/assets`);
      }

      // Check font formats
      const woff2Count = fontFiles.filter(f => f.endsWith('.woff2')).length;
      const woffCount = fontFiles.filter(f => f.endsWith('.woff')).length;
      const ttfCount = fontFiles.filter(f => f.endsWith('.ttf')).length;

      assert.ok(woff2Count >= 10, 'Expected woff2 font files');
      assert.ok(woffCount >= 10, 'Expected woff font files');
      assert.ok(ttfCount >= 10, 'Expected ttf font files');
    });

    test('KaTeX renders complex wave equations cleanly without throwing or needing CDN', () => {
      const equations = [
        '\\psi(x,t) = A \\cos(kx - \\omega t + \\phi)',
        '\\frac{\\partial^2 \\psi}{\\partial t^2} = v^2 \\frac{\\partial^2 \\psi}{\\partial x^2}',
        '\\omega^2 = \\frac{4T}{ma} \\sin^2\\left(\\frac{ka}{2}\\right)',
        'v_{\\text{grup}} = \\frac{d\\omega}{dk} = \\frac{v_0}{\\sqrt{1 + \\frac{\\omega_p^2}{c^2 k^2}}}',
        '\\int_{-\\infty}^{+\\infty} e^{i(k-k\')x} dx = 2\\pi \\delta(k - k\')',
        'Z_0 = \\sqrt{\\frac{L_0}{C_0}} = \\sqrt{\\frac{\\mu_0}{\\varepsilon_0}} \\approx 377\\;\\Omega'
      ];

      for (const eq of equations) {
        assert.doesNotThrow(() => {
          const rendered = katex.renderToString(eq, {
            displayMode: true,
            throwOnError: true
          });
          assert.ok(rendered.includes('katex-display'), 'KaTeX output should contain display container');
          assert.ok(rendered.includes('katex-html'), 'KaTeX output should contain rendered HTML math');
        }, `KaTeX failed to render: ${eq}`);
      }
    });
  });

  describe('3. CI/CD GitHub Actions Workflow Invariants', () => {
    test('.github/workflows/deploy.yml exists and defines correct triggers, permissions, and steps', () => {
      assert.ok(fs.existsSync(WORKFLOW_PATH), '.github/workflows/deploy.yml must exist');
      const yaml = fs.readFileSync(WORKFLOW_PATH, 'utf-8');

      // Verify trigger
      assert.match(yaml, /branches:\s*\n\s*-\s*main/, 'Workflow must trigger on push to main branch');
      assert.match(yaml, /workflow_dispatch:/, 'Workflow must support workflow_dispatch trigger');

      // Verify permissions for Pages
      assert.match(yaml, /contents:\s*read/, 'Workflow requires contents: read');
      assert.match(yaml, /pages:\s*write/, 'Workflow requires pages: write');
      assert.match(yaml, /id-token:\s*write/, 'Workflow requires id-token: write');

      // Verify concurrency
      assert.match(yaml, /group:\s*['"]pages['"]/, 'Concurrency group must be pages');
      assert.match(yaml, /cancel-in-progress:\s*true/, 'Concurrency should cancel-in-progress: true');

      // Verify build job steps
      assert.match(yaml, /npm run typecheck/, 'Workflow must run npm run typecheck');
      assert.match(yaml, /npm test/, 'Workflow must run npm test');
      assert.match(yaml, /npm run build/, 'Workflow must run npm run build');
      assert.match(yaml, /actions\/upload-pages-artifact@v3/, 'Workflow must upload artifact using actions/upload-pages-artifact@v3');
      assert.match(yaml, /path:\s*['"]\.\/dist['"]/, 'Artifact upload path must be ./dist');

      // Verify deploy job
      assert.match(yaml, /actions\/deploy-pages@v4/, 'Workflow must deploy using actions/deploy-pages@v4');
      assert.match(yaml, /environment:\s*\n\s*name:\s*['"]github-pages['"]/, 'Deploy job must target github-pages environment');
      assert.match(yaml, /needs:\s*build/, 'Deploy job must depend on build job');
    });
  });

  describe('4. Git Repository & .gitignore Invariants', () => {
    test('.git directory exists and current branch is main', () => {
      const gitDir = path.join(ROOT_DIR, '.git');
      assert.ok(fs.existsSync(gitDir), '.git directory must exist');

      const branch = execSync('git branch --show-current', { cwd: ROOT_DIR, encoding: 'utf-8' }).trim();
      assert.equal(branch, 'main', 'Active branch must be main');
    });

    test('.gitignore correctly ignores dist/, node_modules/, .agents/, and logs', () => {
      assert.ok(fs.existsSync(GITIGNORE_PATH), '.gitignore must exist');
      const gi = fs.readFileSync(GITIGNORE_PATH, 'utf-8');

      assert.match(gi, /node_modules\//, '.gitignore must ignore node_modules/');
      assert.match(gi, /dist\//, '.gitignore must ignore dist/');
      assert.match(gi, /\.agents\//, '.gitignore must ignore .agents/');
      assert.match(gi, /\*\.log/, '.gitignore must ignore *.log');

      // Test git check-ignore programmatically
      const ignoredPaths = ['node_modules/test.js', 'dist/index.html', '.agents/teamwork/plan.md', 'error.log'];
      for (const p of ignoredPaths) {
        let isIgnored = false;
        try {
          const out = execSync(`git check-ignore "${p}"`, { cwd: ROOT_DIR, encoding: 'utf-8' });
          if (out.trim().length > 0) isIgnored = true;
        } catch {
          isIgnored = false;
        }
        assert.ok(isIgnored, `Path "${p}" must be ignored according to git check-ignore`);
      }
    });

    test('git remote origin is configured to ati/berkeley-dalgalar-lab', () => {
      const remotes = execSync('git remote -v', { cwd: ROOT_DIR, encoding: 'utf-8' });
      assert.match(remotes, /origin\s+https:\/\/github\.com\/ati\/berkeley-dalgalar-lab\.git\s+\(fetch\)/);
      assert.match(remotes, /origin\s+https:\/\/github\.com\/ati\/berkeley-dalgalar-lab\.git\s+\(push\)/);
    });

    test('git log contains expected semantic commits and working tree is clean', () => {
      const status = execSync('git status --porcelain', { cwd: ROOT_DIR, encoding: 'utf-8' });
      // Exclude tests/m4_stress_challenge.test.mjs and m4_adversarial_challenge.test.mjs if untracked during review
      const untracked = status.split('\n').filter(line => line.trim().length > 0 && !line.includes('m4_stress_challenge.test.mjs') && !line.includes('m4_adversarial_challenge.test.mjs'));
      assert.equal(untracked.length, 0, `Git working tree must be clean (excluding current test file), found: ${untracked.join('; ')}`);

      const log = execSync('git log --oneline', { cwd: ROOT_DIR, encoding: 'utf-8' });
      const commits = log.trim().split('\n');
      assert.ok(commits.length >= 5, `Expected at least 5 semantic commits in history, found ${commits.length}`);

      assert.match(log, /feat\(core\):/);
      assert.match(log, /feat\(i18n\):/);
      assert.match(log, /feat\(theory\):/);
      assert.match(log, /feat\(problems\):/);
      assert.match(log, /ci\(deploy\):/);
    });
  });

  describe('5. Scripts & Package Invariants', () => {
    test('package.json contains typecheck and build scripts', () => {
      const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf-8'));
      assert.equal(pkg.scripts.typecheck, 'tsc --noEmit', 'typecheck script must be "tsc --noEmit"');
      assert.ok(pkg.scripts.build.includes('vite build'), 'build script must run vite build');
      assert.equal(pkg.scripts.test, 'node --test tests/physics_and_derivations.test.mjs', 'test script must run physics_and_derivations');
    });
  });

});
