'use strict';
const path = require('node:path');
require('esbuild').buildSync({ entryPoints: [path.join(__dirname, '../src/renderer/panel/premium/index.jsx')], outfile: path.join(__dirname, '../src/renderer/panel/budget-premium-app.js'), bundle: true, platform: 'browser', format: 'iife', target: 'chrome130', minify: true, sourcemap: true, legalComments: 'linked', define: { 'process.env.NODE_ENV': '"production"' } });
console.log('Premium Black React / Canvas bundle built.');
