/*! Monio: io.mjs
    v0.34.0-pre (c) 2022 Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
import{EMPTY_FUNC,identity,isFunction,isPromise,isMonad,getMonadFlatMap,continuation,runSignal,isRunSignal,trampoline}from"../lib/util.mjs";import Nothing from"../nothing.mjs";import Either from"../either.mjs";const BRAND={};export default Object.assign(IO,{of:of,pure:of,unit:of,is:is,do:$do,doEither:doEither,fromIOx:fromIOx});export{IO as RIO};export{of};export{of as pure};export{of as unit};export{is};export{$do as do};export{doEither};export{fromIOx};function IO(t){var r={map:function map(r){return IO((n=>continuation([()=>t(n),t=>isPromise(t)?t.then(r):r(t)])))},chain:chain,flatMap:chain,bind:chain,concat:function concat(r){return IO((n=>continuation([()=>t(n),t=>continuation([()=>r.run(runSignal(n)),r=>isPromise(t)||isPromise(r)?Promise.all([t,r]).then((([t,r])=>t.concat(r))):t.concat(r)])])))},run:function run(r){return isRunSignal(r)?t(r.env):trampoline(t(r))},_inspect:function _inspect(){return`${r[Symbol.toStringTag]}(${isFunction(t)?t.name||"anonymous function":String(t)})`},_is:function _is(t){return t===BRAND},[Symbol.toStringTag]:"IO"};return r;function chain(r){return IO((n=>continuation([()=>t(n),t=>{var e=isPromise(t)?t.then(r):r(t);return isPromise(e)?e.then((t=>t.run(n))):e.run(runSignal(n))}])))}}function of(t){return IO((()=>t))}function is(t){return!!(t&&isFunction(t._is)&&t._is(BRAND))}function processNext(t,r,n,e){return isPromise(r)?safeUnwrap(r,e).then((([t,r])=>trampoline(handleNextRespVal(t,r)))).catch((t=>trampoline(handleNextRespVal(t,"error")))):handleNextRespVal(r,e&&Either.Left.is(r)?"error":"value");function handleNextRespVal(r,i){var ioWrap=r=>IO((()=>t(r,i))),o=isMonad(r)&&isFunction(r.fold),a=!isMonad(r)||e&&"error"==i&&Either.Left.is(r)||!is(r)&&!o;return(Nothing.is(r)?IO.of():r&&isFunction(r)&&isFunction(r._chain_with_IO)&&isFunction(r._inspect)&&/^IOx\b/.test(r._inspect())?r._chain_with_IO(ioWrap):a?ioWrap(r):o?r.fold(ioWrap,ioWrap):monadFlatMap(r,ioWrap)).run(runSignal(n))}}function $do(t,...r){return IO((n=>{var e=getIterator(t,n,this,r);return new Promise((t=>t(trampoline(next())))).catch((t=>trampoline(next(t,"error")))).catch(liftDoError);function next(t,r){try{var i="error"===r?e.throw(t):e.next(t);return isPromise(i)?i.then((t=>trampoline(handleResp(t)))):handleResp(i);function handleResp(t){if(!t.done)return processNext(next,t.value,n,!1);try{return IO.is(t.value)?t.value.run(runSignal(n)):t.value}catch(t){return liftDoError(t)}}}catch(t){return liftDoError(t)}}}))}function liftDoError(t){var r=Promise.reject(t);return r.catch(EMPTY_FUNC),r}function doEither(t,...r){return IO((n=>{var e=getIterator(t,n,this,r);return new Promise((t=>t(trampoline(next())))).catch((t=>trampoline(next(t,"error")))).catch(liftDoEitherError);function next(t,r){t="error"!=r||Either.Left.is(t)?"value"!=r||Either.Right.is(t)?Either.is(t)?t:Either(t):Either.Right(t):Either.Left(t);try{let r=t.fold((t=>e.throw(t)),(t=>e.next(t)));return isPromise(r)?r.then((t=>trampoline(handleResp(t)))):handleResp(r);function handleResp(t){return t.done?continuation([()=>{try{return IO.is(t.value)?t.value.run(runSignal(n)):t.value}catch(t){return liftDoEitherError(t)}},t=>isPromise(t)?t.then(handleRespVal):handleRespVal(t)]):processNext(next,t.value,n,!0)}function handleRespVal(t){return Either.Right.is(t)?t:Either.Left.is(t)?liftDoEitherError(t):Either.Right(t)}}catch(t){return liftDoEitherError(t)}}}))}function liftDoEitherError(t){t=isPromise(t)||Either.Left.is(t)?t:Either.Left(t);var r=Promise.reject(t);return r.catch(EMPTY_FUNC),r}function fromIOx(t){return IO((r=>t.run(runSignal(r))))}function getIterator(t,r,n,e){return isFunction(t)?t.call(n,r,...e):t&&isFunction(t.next)?t:void 0}function monadFlatMap(t,r){return getMonadFlatMap(t).call(t,r)}async function safeUnwrap(t,r){try{if(t=await t,r&&Either.Left.is(t))throw t;return[t,"value"]}catch(t){return[t,"error"]}}