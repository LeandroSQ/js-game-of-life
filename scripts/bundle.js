(()=>{var c=(o,e,t)=>new Promise((i,n)=>{var s=d=>{try{h(t.next(d))}catch(v){n(v)}},r=d=>{try{h(t.throw(d))}catch(v){n(v)}},h=d=>d.done?i(d.value):Promise.resolve(d.value).then(s,r);h((t=t.apply(o,e)).next())});window.addLoadEventListener=function(o){let e=!1,t=()=>{e||(e=!0,o())};window.addEventListener("DOMContentLoaded",t),window.addEventListener("load",t),document.addEventListener("load",t),window.addEventListener("ready",t),setTimeout(t,1e3)};window.addVisibilityChangeEventListener=function(o){let e=["webkit","moz","ms",""],t=!1,i=()=>{if(t)return;t=!0;let n=e.map(s=>s&&s.length>0?`${s}Hidden`:"hidden").map(s=>document[s]).reduce((s,r)=>s||r,!1);o(!n),setTimeout(()=>{t=!1},100)};for(let n of e)document.addEventListener(`${n}visibilitychange`,i);document.onvisibilitychange=i};CanvasRenderingContext2D.prototype.drawLine=function(o,e,t,i){this.beginPath(),this.moveTo(o,e),this.lineTo(t,i),this.stroke()};CanvasRenderingContext2D.prototype.drawCircle=function(o,e,t){this.beginPath(),this.arc(o,e,t,0,2*Math.PI)};HTMLCanvasElement.prototype.screenshot=function(o="download.png"){let e=document.createElement("a");e.download=o,e.href=this.toDataURL("image/png;base64"),e.style.visibility="hidden",e.style.display="none",document.body.appendChild(e),setTimeout(()=>{e.click(),document.body.removeChild(e)},100)};String.prototype.toCamelCase=function(){return this.replace("--","").replace(/-./g,o=>o[1].toUpperCase()).trim()};var a=class{static logColoredText(e,t,i,...n){console[e].call(console,`%c${e.toUpperCase()} %c[${t}]`,`font-weight: bold; color: ${i};`,"font-weight: bold; color: gray",...n)}static info(e,...t){this.logColoredText("info",e,"turquoise",...t)}static warn(e,...t){this.logColoredText("warn",e,"yellow",...t)}static error(e,...t){this.logColoredText("error",e,"red",...t)}static debug(e,...t){}};var p=class{static isColorLight(e){let t=`0x${e.trim().slice(1)}`;t.length<5&&(t=t.replace(/./g,"$&$&"));let i=parseInt(t,16),n=i>>16,s=i>>8&255,r=i&255;return Math.sqrt(.299*(n*n)+.587*(s*s)+.114*(r*r))>127.5}};var l=class{static setup(e){return c(this,null,function*(){l.main=e,l.loadVariables(),l.observeChanges()})}static loadVariables(){let e=["--background","--foreground","--container-background","--container-border","--container-shadow","--cell-alive","--cell-dead"];a.info("Theme",`Setting up theme, loading ${e.length} variables...`),console.groupCollapsed("Loading theme variables");let t=getComputedStyle(document.body);for(let i of e){let n=t.getPropertyValue(i),s=i.toString().toCamelCase();l[s]=n,console.log(`%c${s}`,`color: ${p.isColorLight(n)?"#212121":"#eee"}; background-color: ${n}`)}console.groupEnd()}static observeChanges(){let e=window.matchMedia("(prefers-color-scheme: dark)");e.addEventListener("change",()=>{a.info("Theme",`Changed theme to ${e.matches?"dark":"light"}`),l.loadVariables()})}};var m=class{constructor(e=void 0){this.element=document.createElement("canvas");this.virtualWidth=0;this.virtualHeight=0;this.drawRatio=1;this.overrideRatio=void 0;e&&(this.element.id=e);let t=this.element.getContext("2d");if(!t)throw new Error("Could not get context of canvas");this.context=t,this.context.imageSmoothingEnabled=!1,this.context.mozImageSmoothingEnabled=!1}get backingStoreRatio(){return this.overrideRatio||this.context.webkitBackingStorePixelRatio||this.context.mozBackingStorePixelRatio||this.context.msBackingStorePixelRatio||this.context.oBackingStorePixelRatio||this.context.backingStorePixelRatio||1}get devicePixelRation(){return this.overrideRatio||window.devicePixelRatio||1}getDrawRatio(e,t){return t/e}setSize(e,t){this.drawRatio=this.getDrawRatio(this.backingStoreRatio,this.devicePixelRation),this.backingStoreRatio!==this.devicePixelRation?(this.element.width=e*this.drawRatio,this.element.height=t*this.drawRatio,this.element.style.width=`${e}px`,this.element.style.minWidth=`${e}px`,this.element.style.height=`${t}px`,this.element.style.minHeight=`${t}px`):(this.element.width=e,this.element.height=t,this.element.style.width="",this.element.style.height=""),this.context.scale(this.drawRatio,this.drawRatio),this.virtualWidth=e,this.virtualHeight=t}clear(){this.context.clearRect(0,0,this.element.width,this.element.height)}drawTo(e,t,i){i.save(),i.scale(1/this.drawRatio,1/this.drawRatio),i.drawImage(this.element,e,t),i.restore()}attachToElement(e){e.appendChild(this.element)}get width(){return this.virtualWidth||this.element.width}get height(){return this.virtualHeight||this.element.height}};var f=class{constructor(){this.rows=32;this.cols=32;this.cellWidth=0;this.cellHeight=0;this.cells=[];this.canvasBuffer=new m("grid-buffer");this.isDirty=!1}setupCells(){this.cells=[];for(let e=0;e<this.rows;e++){this.cells[e]=[];for(let t=0;t<this.cols;t++)this.cells[e][t]=0}}load(e){let t={x:Math.floor(this.cols/2),y:Math.floor(this.rows/2)};this.setupCells();let i=e[0].length,n=e.length;for(let s=0;s<n;s++)for(let r=0;r<i;r++)this.setCell(Math.floor(t.y+s-n/2),Math.floor(t.x+r-i/2),e[s][r])}random(){this.cells=[];for(let e=0;e<this.rows;e++){this.cells[e]=[];for(let t=0;t<this.cols;t++)this.cells[e][t]=Math.random()<=.25?1:0}}onLayout(e,t){let i=Math.min(e,t);this.cellHeight=i/this.rows,this.cellWidth=i/this.cols,this.canvasBuffer.setSize(e,t),this.isDirty=!0}getCell(e,t){return e<0||e>=this.rows||t<0||t>=this.cols?0:this.cells[e][t]}setCell(e,t,i){e<0||e>=this.rows||t<0||t>=this.cols||(this.cells[e][t]=i)}getNeighborCount(e,t){let i=0;return this.getCell(e-1,t)===1&&i++,this.getCell(e-1,t-1)===1&&i++,this.getCell(e,t-1)===1&&i++,this.getCell(e-1,t+1)===1&&i++,this.getCell(e,t+1)===1&&i++,this.getCell(e+1,t)===1&&i++,this.getCell(e+1,t-1)===1&&i++,this.getCell(e+1,t+1)===1&&i++,i}invalidate(){this.isDirty=!0}render(e){if(this.isDirty){this.isDirty=!1;let t=this.canvasBuffer.context;this.canvasBuffer.clear(),t.strokeStyle=l.containerBorder,t.lineWidth=1;for(let i=0;i<this.rows;i++)t.drawLine(0,i*this.cellHeight,t.canvas.width,i*this.cellHeight);for(let i=0;i<this.cols;i++)t.drawLine(i*this.cellWidth,0,i*this.cellWidth,t.canvas.height)}this.renderCells(e),this.canvasBuffer.drawTo(0,0,e)}renderCells(e){e.fillStyle=l.cellAlive;for(let t=0;t<this.rows;t++)for(let i=0;i<this.cols;i++)this.cells[t][i]===1&&e.fillRect(i*this.cellWidth,t*this.cellHeight,this.cellWidth,this.cellHeight)}update(){let e=[];for(let t=0;t<this.rows;t++){e[t]=[];for(let i=0;i<this.cols;i++){let n=this.getCell(t,i),s=this.getNeighborCount(t,i);n==1?s<2?e[t][i]=0:s===2||s===3?e[t][i]=1:s>3&&(e[t][i]=0):s===3&&(e[t][i]=1)}}this.cells=e}};var b=class{static load(){return c(this,null,function*(){let t=[12,20,40].map(i=>c(this,null,function*(){let n=`${i}pt ${b.fontFamily}`;document.fonts.check(n)||(yield document.fonts.load(n))}));yield Promise.all(t)})}},u=b;u.fontFamily="'Rubik', cursive";var g=class{static parse(e){let t=e.split(`
`).map(r=>r.trim()),i=t.length,n=Math.max(...t.map(r=>r.length)),s=[];for(let r=0;r<i;r++){s[r]=[];for(let h=0;h<n;h++)t[r][h]==="X"?s[r][h]=1:s[r][h]=0}return console.groupCollapsed("Loading pattern"),console.table(s),a.debug("Pattern loader",`${i} rows and ${n} columns.`),console.groupEnd(),s}static load(e){return c(this,null,function*(){let i=yield(yield fetch(e)).text();return g.parse(i)})}};var w=class{constructor(){this.canvas=new m("canvas");this.ctx=this.canvas.context;this.targetFPS=15;this.targetFrameTime=1/this.targetFPS;this.frameTimer=0;this.lastFrameTime=performance.now();this.frameCounter=0;this.fpsTimer=0;this.fps=0;this.isPaused=!1;this.grid=new f;a.info("Game of life","Starting up..."),this.attachHooks(),l.setup(this)}attachHooks(){a.info("Checkers","Attaching hooks..."),window.addLoadEventListener(this.onLoad.bind(this)),window.addEventListener("resize",this.onResize.bind(this)),window.addVisibilityChangeEventListener(this.onVisibilityChange.bind(this))}onLoad(){return c(this,null,function*(){a.debug("Game of life","Window loaded");let e=document.getElementById("container");if(!e)throw new Error("Could not find container element");this.canvas.attachToElement(e),this.onLayout(),yield u.load(),yield this.loadPattern("glider"),this.requestNextFrame()})}onResize(){a.debug("Game of life","Window resized"),this.onLayout()}onVisibilityChange(e){a.debug("Game of life",`Window visibility changed to ${e}`?"visible":"hidden"),this.isPaused=!e,e&&this.requestNextFrame()}onLayout(){var n;a.debug("Game of life","Window layout changed");let e=(n=document.getElementById("container"))!=null?n:document.body,t=e.clientWidth,i=e.clientHeight;this.grid.onLayout(t,i),this.canvas.setSize(this.grid.cellWidth*this.grid.cols,this.grid.cellHeight*this.grid.rows)}requestNextFrame(){this.isPaused||(this.lastFrameTime=performance.now(),requestAnimationFrame(this.onFrame.bind(this)))}onFrame(e){if(this.isPaused)return;let t=(e-this.lastFrameTime)/1e3;for(this.frameTimer+=t,this.fpsTimer+=t;this.frameTimer>=this.targetFrameTime;)this.frameTimer-=this.targetFrameTime,t=this.targetFrameTime,this.frameCounter++,this.fpsTimer>=1&&(this.fpsTimer-=1,this.fps=this.frameCounter,this.frameCounter=0,a.debug("Game of life",`FPS: ${this.fps}`)),this.update();this.render(),this.requestNextFrame()}renderDebugOverlay(){}update(){this.grid.update()}render(){this.canvas.clear(),this.grid.render(this.ctx),this.renderDebugOverlay()}loadPattern(e){return c(this,null,function*(){let t=yield g.load(`./../assets/pattern-${e}.txt`);this.grid.load(t)})}randomPattern(){return c(this,null,function*(){this.grid.random()})}};window._instance=new w;})();