'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),asar=require('@electron/asar');
const root=path.join(__dirname,'..'),resources=path.resolve(process.argv[2]||path.join(root,'dist/win-unpacked/resources')),hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
const archive=path.join(resources,'app.asar');assert.ok(fs.existsSync(archive));let sourceFiles=0,themeFiles=0;
// Electron Builder omits developer lockfiles; this remains in the complete source ZIP.
const developmentOnlyFiles=['src/renderer/restaurant-ui/pnpm-lock.yaml'];
for(const file of files(path.join(root,'src'))){const relative=path.relative(root,file);if(developmentOnlyFiles.includes(relative.split(path.sep).join('/')))continue;assert.equal(hash(asar.extractFile(archive,relative)),hash(fs.readFileSync(file)),relative);sourceFiles++;}
const manifests=[];for(const file of files(path.join(root,'themes'))){const relative=path.relative(path.join(root,'themes'),file);const packaged=path.join(resources,'themes',relative);assert.ok(fs.existsSync(packaged),relative);assert.equal(hash(fs.readFileSync(packaged)),hash(fs.readFileSync(file)),relative);themeFiles++;if(path.basename(file)==='theme.json')manifests.push(JSON.parse(fs.readFileSync(file,'utf8')).id);}
assert.equal(JSON.parse(asar.extractFile(archive,'package.json')).version,'7.0.0');for(const id of ['bikini-bottom','stars-hollow','scranton'])assert.ok(manifests.includes(id),id);
const report={passed:true,version:'7.0.0',sourceFiles,themeFiles,themeIds:manifests.sort(),allRuntimeSourceAndThemeHashesMatch:true,developmentOnlyFiles,approvedCostumes:['bikini-spongebob','bikini-squidward','bikini-patrick','bikini-mr-krabs','bikini-sandy']};fs.writeFileSync(path.join(root,'docs/reviews/7.0.0-PACKAGED-RESOURCES.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
