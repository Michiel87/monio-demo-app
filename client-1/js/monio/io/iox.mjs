/*! Monio: iox.mjs
    v0.33.0 (c) 2022 Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
import{isFunction,isPromise,isMonad,curry,getDeferred}from"../lib/util.mjs";import IO from"./io.mjs";onEvent=curry(onEvent,2),onceEvent=curry(onceEvent,2),of.empty=ofEmpty;const BRAND={},EMPTY={},UNSET=Symbol("unset"),CLOSED=Symbol("closed");var registerHooks=new WeakMap;export default Object.assign(IOx,{of:of,pure:of,unit:of,is:is,do:$do,doEither:doEither,onEvent:onEvent,onceEvent:onceEvent,onTimer:onTimer,merge:merge,zip:zip,fromIO:fromIO,fromIter:fromIter,toIter:toIter});export{of};export{of as pure};export{of as unit};export{is};export{$do as do};export{doEither};export{onEvent};export{onceEvent};export{onTimer};export{merge};export{zip};export{fromIO};export{fromIter};export{toIter};function IOx(e,n=[]){n=Array.isArray(n)?[...n]:[n];var t,r,o,s=UNSET,i=UNSET,u=new WeakMap,c=new WeakMap,a=new WeakSet,l=new WeakSet,f=!1,p=!1,d=!1,h=!1,g=!1,E=0,O=IO((function effect(o){if(g)return[UNSET,CLOSED,EMPTY].includes(i)?getDeferred().pr:i;if(!h&&isFunction(e)){if(f||d||function registerWithDeps(e){if(f=!0,Array.isArray(n)&&n.length>0)for(let t of n)if(is(t)&&registerHooks.has(t)&&!u.has(t)){u.set(t,[]);let[n]=registerHooks.get(t);isFunction(n)&&n(onDepUpdate,t,e)}f=!1,d=!0}(o),!p)return function execIOF(o){var i,u=!0;try{p=!0;e:for(;p;){let n;if(!h&&e&&(s=o,n=collectDepVals(o,u),u=!1),!n)return i||(t||({pr:t,next:r}=getDeferred()),t);if(n===CLOSED||!e)try{return i||t||getDeferred().pr}finally{close()}let c=e(s,...n);if(h||c===EMPTY)return i||void 0;{let e=updateCurrentVal(c,haveQueuedIOxDepVals());if(!isPromise(e)&&haveIOxDeps()){i=e,discardCurrentIOxDepVals();continue e}return discardCurrentDepVals(),e}}}finally{!function discardCurrentIODepVals(){if(haveDeps())for(let e of n)IO.is(e)&&!is(e)&&removeDepVal(e)}(),p=!1}}(o)}else if(![UNSET,CLOSED,EMPTY].includes(i))return i;return}));O.assign=assign;var b=Object.assign((function IOx$(e){assign(e)}),{map:function map(e){return IOx(((n,t)=>e(t)),[b])},chain:chain,flatMap:chain,bind:chain,concat:function concat(e){return IOx(((n,t)=>{var r=e.run(n);return isPromise(r)?r.then((e=>t.concat(e))):t.concat(r)}),[b])},run:function run(e){if(!h)return O.run(e)},stop:stop,close:close,isClosed:function isClosed(){return h},freeze:function freeze(){g=!0,stop()},isFrozen:function isFrozen(){return g},toString:function toString(){return`[function ${this[Symbol.toStringTag]||this.name}]`},_chain_with_IO:function _chain_with_IO(e){return i!==UNSET&&s!==UNSET?e(i!==CLOSED?i:void 0):O.chain(e)},_inspect:function _inspect(){return`${b[Symbol.toStringTag]}(${isMonad(i)&&isFunction(i._inspect)?i._inspect():[UNSET,CLOSED].includes(i)?isFunction(e)?e.name||"anonymous function":"..":String(i)})`},_is:function _is(e){return!(e!==BRAND&&!(O||IO.of())._is(e))},[Symbol.toStringTag]:"IOx"});return registerHooks.set(b,[registerListener,function unregisterListener(e){if(Array.isArray(o)&&o.length>0){let n=o.findIndex((n=>n==e));-1!=n&&o.splice(n,1)}}]),b;function stop(){unregisterWithDeps(),s=UNSET}function close(){h||(h=!0,stop(),updateCurrentVal(CLOSED,!1),registerHooks.delete(b),a=l=t=r=n=e=O=b=o=null)}function assign(t){if(!h&&!g)return unregisterWithDeps(),n=s=e=null,updateCurrentVal(t,!1)}function chain(e){return IOx((function IOxChain(n,t){var r=e(t);return isPromise(r)?r.then(handle):handle(r);function handle(e){return registerHooks.has(e)&&registerListener(((n,t)=>{t===CLOSED&&e&&!e.isClosed()&&e.close()}),b,s!==UNSET?s:n),e.run(n)}}),[b])}function haveDeps(){return Array.isArray(n)&&n.length>0}function haveIOxDeps(){if(haveDeps())return n.some(is)}function haveQueuedIOxDepVals(){if(haveDeps())for(let e of n)if(is(e)){let n=u.get(e);if(n&&n.length>1)return!0}return!1}function discardCurrentDepVals(){if(haveDeps())for(let e of n)removeDepVal(e),a.delete(e)}function discardCurrentIOxDepVals(){if(haveDeps())for(let e of n)is(e)&&removeDepVal(e)}function onDepUpdate(e,n){if(n===CLOSED?(l.add(e),c.delete(e)):setDepVal(e,n),!f&&!p)if(s!==UNSET&&n!==CLOSED)safeIORun(b,s);else{collectDepVals(void 0,!1)===CLOSED&&close()}}function setDepVal(e,n){u.has(e)||u.set(e,[]),u.get(e).push(n),is(e)&&c.set(e,n)}function getDepVal(e){return hasDepVal(e)?u.get(e)[0]:void 0}function hasDepVal(e){return u.has(e)&&u.get(e).length>0}function removeDepVal(e){if(hasDepVal(e))return u.get(e).shift()}function collectDepVals(e,t){if(!haveDeps())return[];if(++E>1)return!1;for(var r;E>0;){r=[];for(let e of n)if(is(e)&&(l.has(e)||e.isClosed())&&(!p||!hasDepVal(e)))return E=0,CLOSED;for(let o of n)if(is(o)){let e=hasDepVal(o)?getDepVal(o):t&&c.has(o)?c.get(o):UNSET;r.push(e)}else if(IO.is(o))if(a&&a.has(o))r.push(UNSET);else if(hasDepVal(o))r.push(getDepVal(o));else{let n=o.run(e||(s!==UNSET?s:void 0));isPromise(n)?(a.add(o),r.push(UNSET),n.then((e=>{a&&a.has(o)&&(a.delete(o),onDepUpdate(o,e))})).catch(logUnhandledError)):(a.delete(o),setDepVal(o,n),r.push(n))}else o===EMPTY?r.push(UNSET):r.push(o);r.includes(UNSET)&&(r=!1),E=Math.max(0,E-1)}return Array.isArray(r)&&r.length>0?r:void 0}function updateCurrentVal(e,n){return isPromise(e)?e.then(handle).catch(logUnhandledError):(n=!1,handle(e));function handle(e){if(i=e,Array.isArray(o)){let e=b,n=[...o];for(let t of n)t(e,i)}return n&&!p&&s!==UNSET&&safeIORun(b,s),i===CLOSED&&O&&close(),[UNSET,CLOSED,EMPTY].includes(i)?r?(r(void 0),void(t=r=null)):void 0:(r&&(r(i),t=r=null),i)}}function registerListener(e,n,t){i===CLOSED?e(n,CLOSED):(Array.isArray(o)?o.push(e):o=[e],s===UNSET?safeIORun(b,t):i!==UNSET&&e(n,i))}function unregisterWithDeps(){if(d=!1,haveDeps()){for(let e of n)if(e&&isFunction(e)&&registerHooks.has(e)){u.delete(e),a&&a.delete(e);let[,n]=registerHooks.get(e);isFunction(n)&&n(onDepUpdate)}u=new WeakMap,c=new WeakMap}}}function is(e){return!!(e&&isFunction(e._is)&&e._is(BRAND))}function of(e){return IOx((()=>e),[])}function ofEmpty(){return IOx((()=>{}),[EMPTY])}function $do(e,n,...t){return IOx(((n,...r)=>IO.do(e,...r,...t).run(n)),n)}function doEither(e,n,...t){return IOx(((n,...r)=>IO.doEither(e,...r,...t).run(n)),n)}function onEvent(e,n,t=!1){var r=!1,o=IOx((function effect(){return subscribe(),EMPTY}),[]),{run:s,stop:i,close:u}=o;return Object.assign(o,{run:run,stop:stop,close:function close(){o&&(Object.assign(o,{run:s,stop:i,close:u}),stop(),o.close(),run=s=i=stop=u=o=e=t=null)}}),o;function subscribe(){!r&&o&&(r=!0,isFunction(e.addEventListener)?e.addEventListener(n,o,t):isFunction(e.addListener)?e.addListener(n,o):isFunction(e.on)&&e.on(n,o))}function run(e){subscribe(),s&&s(e)}function stop(){!function unsubscribe(){r&&o&&(r=!1,isFunction(e.removeEventListener)?e.removeEventListener(n,o,t):isFunction(e.removeListener)?e.removeListener(n,o):isFunction(e.off)&&e.off(n,o))}(),i()}}function onceEvent(e,n,t=!1){var r,o=!1,s=!1,i=onEvent(e,n,t),{run:u,stop:c,close:a}=i;return Object.assign(i,{run:run,stop:stop,close:close}),i;function run(e){i&&(u&&(i.run=u),function subscribe(){o||r||!i||(o=!0,r=IOx(onFire,[i]))}(),r&&r.run(e))}function stop(){i&&(i.run=run,function unsubscribe(){o&&r&&(o=!1,r.close(),r=null)}(),c())}function close(){i&&(Object.assign(i,{run:u,stop:c,close:a}),stop(),i.close(),run=u=c=stop=a=close=i=r=null)}function onFire(){s||(s=!0,close())}}function onTimer(e,n){var t,r=!1,o=IOx((function effect(){return subscribe(),EMPTY}),[]);n="number"==typeof n?Math.max(1,n||1):void 0;var{run:s,stop:i,close:u}=o;return Object.assign(o,{run:run,stop:stop,close:close}),o;function subscribe(){r||t||(r=!0,t=setInterval(onTick,e))}function run(e){subscribe(),s&&s(e)}function onTick(){o&&o("tick"),"number"==typeof n&&(n--,close&&n<=0&&close())}function stop(){!function unsubscribe(){r&&t&&(r=!1,clearInterval(t),t=null)}(),i()}function close(){o&&(Object.assign(o,{run:s,stop:i,close:u}),stop(),o.close(),run=s=i=stop=u=close=o=null)}}function zip(e=[]){Array.isArray(e)&&(e=[...e]);var n=!1,t=new Map,r=IOx((function effect(e){return subscribe(e),EMPTY}),[]),{run:o,stop:s,close:i}=r;return Object.assign(r,{run:run,stop:stop,close:close}),r;function subscribe(o){if(!n&&r&&(n=!0,Array.isArray(e))){for(let n of e)if(t.has(n)||t.set(n,[]),registerHooks.has(n)){let[e]=registerHooks.get(n);e(onUpdate,n,o)}checkListeners()}}function onUpdate(e,n){r&&!r.isClosed()&&(n!==CLOSED&&t.has(e)&&t.get(e).push(n),checkListeners())}function checkListeners(){if(r&&!r.isClosed()&&Array.isArray(e))for(;;){let n,o,s=!0;for(let r of e){r&&!r.isClosed()&&(s=!1);let e=t.get(r);if(e.length>0)o=o||[],n=n||[],o.push(e[0]),n.push(e);else if(r&&!r.isClosed())return}if(!(Array.isArray(o)&&Array.isArray(n)&&o.length>0&&n.length>0)){s&&close();break}for(let e of n)e.shift();r(o)}}function run(e){subscribe(e),o&&o(e)}function stop(){!function unsubscribe(){if(n&&r&&(n=!1,Array.isArray(e)))for(let n of e)if(registerHooks.has(n)){let[,e]=registerHooks.get(n);e(onUpdate)}}(),s()}function close(){r&&(Object.assign(r,{run:o,stop:s,close:i}),stop(),r.close(),run=o=s=stop=i=close=t=r=e=null)}}function merge(e=[]){Array.isArray(e)&&(e=[...e]);var n=!1,t=IOx((function effect(e){return subscribe(e),EMPTY}),[]),{run:r,stop:o,close:s}=t;return Object.assign(t,{run:run,stop:stop,close:close}),t;function subscribe(r){if(!n&&t&&(n=!0,Array.isArray(e))){for(let n of e)if(registerHooks.has(n)){let[e]=registerHooks.get(n);e(onUpdate,n,r)}checkListeners()}}function onUpdate(e,n){t&&!t.isClosed()&&(n!==CLOSED&&t(n),checkListeners())}function checkListeners(){t&&!t.isClosed()&&Array.isArray(e)&&e.every((e=>!e||e.isClosed()))&&close()}function run(e){subscribe(e),r&&r(e)}function stop(){!function unsubscribe(){if(n&&t&&(n=!1,Array.isArray(e)))for(let n of e)if(registerHooks.has(n)){let[,e]=registerHooks.get(n);e(onUpdate)}}(),o()}function close(){t&&(Object.assign(t,{run:r,stop:o,close:s}),stop(),t.close(),run=r=o=stop=s=close=t=e=null)}}function fromIO(e){return IOx(((e,n)=>n),[e])}function fromIter(e,n=!0){Symbol("paused");var t,r,o,s=!1,i=this,u=IOx((function effect(){return function subscribe(){!s&&u&&(s=!0,o=function getIter(e){return isFunction(e)?e.call(i):e&&isFunction(e.next)?e:e&&e[Symbol.iterator]?e[Symbol.iterator]():e&&e[Symbol.asyncIterator]?e[Symbol.asyncIterator]():void 0}(e),({pr:r,next:t}=getDeferred()),async function drainIterator(){var e=!0;try{for(;s;){let n=o.next();if(isPromise(n)&&(n=await Promise.race([r,n])),!n)break;if(n===CLOSED||!s||n.done)break;if(isPromise(n.value)){if(n=await Promise.race([r,n.value]),n===CLOSED||!e)break;u(n)}else u(n.value)}}finally{e=!1,n&&close?close():await unsubscribe()}}().catch(logUnhandledError))}(),EMPTY}),[]),{run:c,stop:a,close:l}=u;return Object.assign(u,{run:run,stop:stop,close:close}),u;function unsubscribe(){s&&u&&(t&&(t(CLOSED),r=t=null),s=!1)}function run(e){c&&c(e)}function stop(){unsubscribe(),a()}function close(){u&&(Object.assign(u,{run:c,stop:a,close:l}),stop(),u.close(),run=c=a=stop=l=close=u=null)}}function toIter(e,n){var t,r=[],o=[],s=!1,i=!1,u={[Symbol.asyncIterator](){return this},next:doNext,return:doReturn};return u;function emptyResult(e){return{value:e,done:!0}}function primeQueues(){var{pr:e,next:n}=getDeferred();r.push(e),o.push(n)}function onIOxUpdate(e,n){if(n===CLOSED)0==r.length&&doReturn();else if(!s){0==o.length&&primeQueues(),o.shift()({value:n,done:!1})}}function doNext(){if(s)return Promise.resolve(emptyResult());if(e.isClosed()&&0==r.length)return doReturn();0==r.length&&primeQueues();var t=r.shift();return i||function subscribe(){if(!i&&registerHooks.has(e)){i=!0;let[t]=registerHooks.get(e);t(onIOxUpdate,e,n)}}(),t}function doReturn(i){var c=emptyResult(i);if(!s){if(s=!0,function unsubscribe(){if(registerHooks.has(e)){let[,n]=registerHooks.get(e);n(onIOxUpdate)}}(),t=r.length>0?r[r.length-1]:void 0,o.length>0)for(let e of o)e(emptyResult());o=r=n=e=onIOxUpdate=primeQueues=doNext=doReturn=u=null}return t?t.then((()=>{try{return c}finally{t=c=null}})):Promise.resolve(c)}}function safeIORun(e,n){try{var t=e.run(n);isPromise(t)&&t.catch(logUnhandledError)}catch(e){Promise.reject(e).catch(logUnhandledError)}}function logUnhandledError(e){console.log(e&&(e.stack?e.stack:e.toString()))}