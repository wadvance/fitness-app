import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

console.log('Building web export...');
execSync('npx expo export --platform web', { cwd: root, stdio: 'inherit' });

const indexPath = join(dist, 'index.html');
let html = readFileSync(indexPath, 'utf-8');
html = html.replace(/href="\//g, 'href="/fitness-app/');
html = html.replace(/src="\//g, 'src="/fitness-app/');
writeFileSync(indexPath, html);
console.log('Fixed paths in index.html');

const jsDir = join(dist, '_expo', 'static', 'js', 'web');
if (existsSync(jsDir)) {
  const files = readdirSync(jsDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const filePath = join(jsDir, file);
    let js = readFileSync(filePath, 'utf-8');
    js = js.replace(/"\/assets\//g, '"/fitness-app/assets/');
    writeFileSync(filePath, js);
    console.log(`Fixed paths in ${file}`);
  }
}

writeFileSync(join(dist, '.nojekyll'), '');
console.log('Created .nojekyll');

const notFoundPath = join(dist, '404.html');
if (existsSync(notFoundPath)) {
  let html404 = readFileSync(notFoundPath, 'utf-8');
  html404 = html404.replace(/URL='\//g, "URL='/fitness-app/");
  writeFileSync(notFoundPath, html404);
  console.log('Fixed paths in 404.html');
}

console.log('Web build complete!');
