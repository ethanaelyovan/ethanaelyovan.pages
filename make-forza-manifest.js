// make-forza-manifest.js
// Lists the photos inside every car folder of assets/forza and writes assets/forza/manifest.js,
// which the website reads. Run it from this folder whenever you add, remove or rename photos:
//
//     node make-forza-manifest.js
//
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, 'assets', 'forza');
const isImage = /\.(webp|jpe?g|png|avif)$/i;
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true });   // imagef2 before imagef10

const map = {};
for (const dir of fs.readdirSync(root, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).sort(natural)) {
  map[dir] = fs.readdirSync(path.join(root, dir)).filter(f => isImage.test(f)).sort(natural);
}
fs.writeFileSync(path.join(root, 'manifest.js'), 'window.FORZA_MANIFEST = ' + JSON.stringify(map, null, 1) + ';\n');

console.log('Wrote assets/forza/manifest.js');
for (const k in map) console.log(`  ${k}: ${map[k].length} photos`);