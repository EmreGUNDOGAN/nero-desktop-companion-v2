'use strict';
const path = require('node:path'), fs = require('node:fs');
const esbuild = require('esbuild'), postcss = require('postcss');
const panel = path.join(__dirname, '../src/renderer/panel');
async function build() {
  const options = { nodePaths:process.env.NERO_NODE_MODULES?[process.env.NERO_NODE_MODULES]:undefined,bundle: true, platform: 'browser', format: 'iife', target: 'chrome130', minify: true, sourcemap: true, legalComments: 'linked', define: { 'process.env.NODE_ENV': '"production"' } };
  esbuild.buildSync({ ...options, entryPoints: [path.join(panel, 'premium/index.jsx')], outfile: path.join(panel, 'budget-premium-app.js') });
  esbuild.buildSync({ ...options, entryPoints: [path.join(panel, 'financial/index.tsx')], tsconfig: path.join(__dirname, '../tsconfig.finance.json'), outfile: path.join(panel, 'budget-financial-app.js') });
  const input = path.join(panel, 'financial/tailwind.css');
  const result = await postcss([require('@tailwindcss/postcss')({ base: path.dirname(input) })]).process(fs.readFileSync(input, 'utf8'), { from: input });
  const scope = ':where(#view-budget[data-finance-theme="financial-dashboard"])';
  result.root.walkRules(rule => {
    if (rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
    // Utilities never reset another Nero theme or any non-finance page.
    rule.selectors = rule.selectors.map(selector => selector === ':root' || selector === ':host' ? scope : `${scope} ${selector}`);
  });
  fs.writeFileSync(path.join(panel, 'budget-financial-tailwind.css'), result.root.toString());
  console.log('Premium Black and Finans Merkezi: local React / Canvas / Tailwind bundles built.');
}
build().catch(error => { console.error(error); process.exitCode = 1; });
