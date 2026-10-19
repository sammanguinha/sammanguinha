'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),js=read('js/ui/v30-news.js'),css=read('css/v30-news.css');
test('V30.1 home displays release news and accessible persistent controls',()=>{
 for(const id of ['sm30News','sm30NewsHeading','sm30NewsVersion','sm30NewsRead','sm30NewsPlay'])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(html.includes('V29 · Crônicas Vivas'));
 assert.ok(html.includes('A V30 está em desenvolvimento'));
 assert.ok(html.indexOf('css/v30-news.css?v=30.1')>html.indexOf('css/update-notice.css?v=25'));
 assert.ok(html.indexOf('js/ui/v30-news.js?v=30.1')>html.indexOf('js/ui/update-notice.js?v=25'));
});
test('V29 notes always replace stale V23 modal and can be reopened',()=>{
 assert.doesNotThrow(()=>new vm.Script(js));
 for(const part of ["current='29.0.0'","sm_last_seen_release_v29","history.replaceChildren()",
  "read.addEventListener('click',openNotes)","close.addEventListener('click',markSeen)",
  "later.addEventListener('click',markSeen)",'reopen.classList.add',"'sm-show'"])
  assert.ok(js.includes(part),part);
 for(const term of ['Crônicas Vivas','Carrilhão','Mariposa','Sentinela','Analisar','V28.1'])
  assert.ok(js.includes(term),'release note '+term);
 assert.ok(!js.includes('V30 foi lançada'),'V30 must not be reported released');
});
test('Home release card has mobile support and accessible focus/reduced motion',()=>{
 for(const token of ['#home .sm30-news','#home #sm30NewsRead','#home #sm30NewsPlay',
  ':focus-visible','@media(max-width:600px)','prefers-reduced-motion'])
  assert.ok(css.includes(token),token);
});
