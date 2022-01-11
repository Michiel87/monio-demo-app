/*! Monio: event-stream.mjs
    v0.33.0 (c) 2022 Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
import{isFunction,curry,getDeferred}from"../lib/util.mjs";import IO from"./io.mjs";const BRAND={};IOEventStream=Object.assign(curry(IOEventStream,2),{merge:merge,zip:zip,close:close,is:is});export default IOEventStream;export{merge};export{zip};export{close};export{is};function IOEventStream(e,t,n={}){var{debounce:r=0,maxDebounceDelay:i=0,bufferSize:l=100,throwBufferOverflow:u=!1,evtOpts:a={}}=n;return r=Number(r)||0,i=Math.max(r,Number(i)||0),IO((()=>{var n,o,s={evt:null,timestamp:null,def:null,intv:null},f=Symbol("force closed"),{pr:c,next:m}=getDeferred(),d=async function*eventStream(){p||start();try{for(;;){if(0==n.length){let{pr:e,next:t}=getDeferred();n.push(e),o.push(t)}let e=await Promise.race([c,n.shift()]);if(e==f)return;yield e}}finally{isFunction(e.removeEventListener)?e.removeEventListener(t,handler,a):isFunction(e.removeListener)?e.removeListener(t,handler):isFunction(e.off)&&e.off(t,handler),n.length=o.length=0}}(),v=d.return,p=!1;return d.return=function itReturn(...e){var t=v.apply(d,e);if(d.closed=!0,m(f),s.timestamp){clearTimeout(s.intv);let e=s.def.next;s.evt=s.timestamp=s.def=s.intv=null,e()}return d.return=v,t},d.closed=!1,d.start=start,d.nextIO=function nextIO(e){return IO((()=>d.next(e)))},d._is=function _is(e){return e===BRAND},d;function start(){p||(p=!0,n=[],o=[],isFunction(e.addEventListener)?e.addEventListener(t,handler,a):isFunction(e.addListener)?e.addListener(t,handler):isFunction(e.on)&&e.on(t,handler))}async function handler(e){if(r>0){let t=Date.now();if(s.evt=e,null!=s.timestamp)return clearTimeout(s.intv),void(t-s.timestamp<i?s.intv=setTimeout(s.def.next,Math.min(r,i-(t-s.timestamp))):s.def.next());if(s.timestamp=t,s.def=getDeferred(),s.intv=setTimeout(s.def.next,r),await s.def.pr,null==s.def)return;e=s.evt,s.evt=s.timestamp=s.def=s.intv=null}if(o.length>0){o.shift()(e)}else if(n.length<l){let{pr:t,next:r}=getDeferred();n.push(t),r(e)}else if(u){let t=new Error("Event stream buffer overflow");throw t.evt=e,t}}}))}function merge(...e){return IO((()=>async function*mergeStreams(){try{for(;;){let t=pullFromStreams(e);if(!(t.length>0))return;try{if(1==t.length){let[n,r,i]=await t[0];if(i.done)return void(e[n]=null);e[n]=r,yield i.value}else{let[n,r,i]=await Promise.race(t);e[n]=null,i.done||(e.push(r),yield i.value)}}catch(e){return Promise.reject(e)}}}finally{await close(e)}}()))}function zip(...e){return IO((()=>async function*zipStreams(){try{for(;;){let t=pullFromStreams(e);if(!(t.length>0))return;try{let n=(await Promise.all(t)).reduce((function getStreamVals(t,n){var[r,i,l]=n;return l.done?(e[r]=null,t):(e[r]=i,[...t,l.value])}),[]);if(!(n.length>0))return;yield n}catch(e){return Promise.reject(e)}}}finally{await close(...e).run()}}()))}function pullFromStreams(e){return e.map((function callIter(t,n){return t&&isFunction(t.next)?(e[n]=async function getNext(){var r=t.next();try{let i=await r;return e[n]=[n,t,i]}catch(t){return e[n]=null,r}}(),e[n]):t})).filter(Boolean)}function close(...e){return IO((()=>Promise.all(e.map((async function closeStream(e){if(e&&isFunction(e.return))try{return await e.return()}catch(e){}})))))}function is(e){return!!(e&&isFunction(e._is)&&e._is(BRAND))}