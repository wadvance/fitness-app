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

const notFoundContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>fitness-app</title>
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/fitness-app/'">
</head>
<body></body>
</html>`;
writeFileSync(join(dist, '404.html'), notFoundContent);
console.log('Created 404.html');

console.log('Web build complete!');
