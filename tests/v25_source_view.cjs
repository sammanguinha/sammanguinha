'use strict';
const path=require('node:path');
// A view for legacy source-level regression tests: keep assertions against real
// executed code even though the browser now loads it through external assets.
function sourceView(html,read){
  let styles=0,scripts=0;
  html=html.replace(/<link\b([^>]*?)\bhref="(css\/[^"?]+)\?v=(?:25|26)"([^>]*)>/gi,(_,before,file,after)=>{
    styles++;
    const id=(before+' '+after).match(/\bid="([^"]+)"/);
    return '<style'+(id?' id="'+id[1]+'"':'')+'>'+read(file)+'</style>';
  });
  html=html.replace(/<script\s+src="(js\/[^"?]+)\?v=(?:25|26)"\s*><\/script>/gi,(_,file)=>{
    scripts++;return '<script>'+read(file)+'</script>';
  });
  if(styles!==12||scripts!==14)throw new Error('V25 source view: expected 12 CSS and 14 JS files, got '+styles+'/'+scripts);
  return html;
}
module.exports={sourceView};
