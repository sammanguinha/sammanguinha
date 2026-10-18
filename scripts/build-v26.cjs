#!/usr/bin/env node
'use strict';
// Deterministic Cloudflare Pages build: edit individual source files,
// but load the original runtime as one classic script and one CSS stylesheet.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const integrity=JSON.parse(fs.readFileSync(path.join(root,'architecture-v26.json'),'utf8'));
const game=JSON.parse(fs.readFileSync(path.join(root,'architecture-v25.json'),'utf8'));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function gitBlob(s){return crypto.createHash('sha1').update('blob '+Buffer.byteLength(s,'utf8')+'\0'+s,'utf8').digest('hex')}
function expect(value,msg){if(!value)throw new Error(msg)}
const css=integrity.styleSections.map(read).join('');
const js=integrity.controllerSections.map(read).join('');
expect(gitBlob(css)===integrity.originalStylesGitBlob,'Stylesheet fingerprint mismatch: CSS modified without preserving V25 reference');
expect(gitBlob(js)===integrity.originalControllerGitBlob,'Controller fingerprint mismatch: game code modified without preserving V25 reference');
const allowed=new Set(['.html','.css','.js','.png','.jpg','.jpeg','.webp','.gif','.svg','.ico','.mp3','.ogg','.wav','.woff','.woff2']);
const directories=['css','js','sprites','audio','halloween_art'];
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
for(const item of fs.readdirSync(root,{withFileTypes:true})){
 if(!item.isFile())continue;
 if(allowed.has(path.extname(item.name).toLowerCase())||['_redirects','_headers'].includes(item.name)){
  fs.copyFileSync(path.join(root,item.name),path.join(dist,item.name));
 }
}
for(const dirname of directories){
 const from=path.join(root,dirname);
 expect(fs.existsSync(from),'Missing asset directory '+dirname);
 fs.cpSync(from,path.join(dist,dirname),{recursive:true});
}
let html=read('index.html');
const originalCss=integrity.styleSections.map(file=>'<link rel="stylesheet" href="'+file+'?v=26">').join('\n');
const originalJs=integrity.controllerSections.map(file=>'<script src="'+file+'?v=26"></script>').join('\n');
expect(html.includes(originalCss),'HTML CSS module order differs from verified manifest');
expect(html.includes(originalJs),'HTML JavaScript module order differs from verified manifest');
html=html.replace(originalCss,'<link rel="stylesheet" href="css/game-v26.bundle.css?v=26">');
html=html.replace(originalJs,'<script src="js/game-v26.bundle.js?v=26"></script>');
expect(!html.includes('src="js/core/app.js'),'Runtime must not request development modules');
fs.writeFileSync(path.join(dist,'index.html'),html);
fs.writeFileSync(path.join(dist,'css/game-v26.bundle.css'),css);
fs.writeFileSync(path.join(dist,'js/game-v26.bundle.js'),js);
for(const entry of [...game.styles,...game.scripts]){
 expect(fs.existsSync(path.join(dist,entry.file)),'Package missing module '+entry.file);
}
expect(!fs.existsSync(path.join(dist,'wrangler.jsonc')),'Do not ship Worker configuration in Pages ZIP');
console.log('V26 Cloudflare Pages build: '+Buffer.byteLength(html)+' HTML bytes, '+Buffer.byteLength(css)+' CSS bundle, '+Buffer.byteLength(js)+' JS bundle, '+directories.length+' asset folders.');
