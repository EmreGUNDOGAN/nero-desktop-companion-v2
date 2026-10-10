import {fileURLToPath} from 'node:url';
import path from 'node:path';
const uiRoot=path.dirname(fileURLToPath(import.meta.url));
process.chdir(uiRoot);
import {build} from 'esbuild';
import * as sass from 'sass';
import {writeFileSync} from 'node:fs';
await build({absWorkingDir:uiRoot,entryPoints:['./hud.jsx'],bundle:true,minify:true,format:'esm',outfile:'../restaurant/game-hud.js',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'game-modules',setup(b){b.onResolve({filter:/\.\.\/restaurant\//},a=>({path:'./'+a.path.split('/').at(-1),external:true}));}}]});
writeFileSync('../restaurant/game-hud.css',sass.compile('game-hud.scss',{style:'compressed'}).css);
