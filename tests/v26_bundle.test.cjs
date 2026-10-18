'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const read=p=>fs.readFileSync(path.join(dist,p),'utf8');
const integrity=JSON.parse(fs.readFileSync(path.join(root,'architecture-v26.json'),'utf8'));
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s,'utf8')+'\0'+s,'utf8').digest('hex');
test('Production package has independent CSS and JS bundles with EXACT V25 source code',()=>{
 const css=read('css/game-v26.bundle.css'),js=read('js/game-v26.bundle.js');
 assert.equal(blob(css),integrity.originalStylesGitBlob);
 assert.equal(blob(js),integrity.originalControllerGitBlob);
 const html=read('index.html');
 assert.ok(html.includes('css/game-v26.bundle.css?v=26'));
 assert.ok(html.includes('js/game-v26.bundle.js?v=26'));
 for(const x of integrity.styleSections)assert.ok(!html.includes('href="'+x+'?v=26"'),x);
 for(const x of integrity.controllerSections)assert.ok(!html.includes('src="'+x+'?v=26"'),x);
});
test('Cloudflare build retains all game asset directories and excludes configuration and test data',()=>{
 for(const folder of ['css','js','sprites','audio','halloween_art'])assert.ok(fs.statSync(path.join(dist,folder)).isDirectory());
 for(const file of ['index.html','mundo_pomar.js','mundo_v24.css','tela_cheia_v24.js','sprites/torre_solar_v24.svg','js/game-v26.bundle.js','css/game-v26.bundle.css'])assert.ok(fs.existsSync(path.join(dist,file)),file);
 for(const file of ['wrangler.jsonc','architecture-v26.json','package.json'])assert.ok(!fs.existsSync(path.join(dist,file)),file);
});
