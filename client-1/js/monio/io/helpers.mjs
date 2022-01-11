/*! Monio: helpers.mjs
    v0.33.0 (c) 2022 Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
import{isFunction,isPromise,isMonad,liftM,curry,foldMap}from"../lib/util.mjs";import IO from"./io.mjs";import AllIO from"./all.mjs";import AnyIO from"./any.mjs";import IOx from"./iox.mjs";import Maybe from"../maybe.mjs";import Either from"../either.mjs";listFilterInIO=curry(listFilterInIO,2),listFilterOutIO=curry(listFilterOutIO,2);var returnedValues=new WeakSet;export default{log:log,getReader:getReader,waitAll:waitAll,maybeFromIO:maybeFromIO,eitherFromIO:eitherFromIO,applyIO:applyIO,doIO:IO.do,doEIO:IO.doEither,doIOBind:doIOBind,doEIOBind:doEIOBind,listFilterInIO:listFilterInIO,listFilterOutIO:listFilterOutIO,listConcatIO:listConcatIO,match:match,iif:iif,elif:elif,els:els,iNot:iNot,iAnd:iAnd,iOr:iOr,iReturn:iReturn,wasReturned:wasReturned,ifReturned:ifReturned,matchReturned:matchReturned,getPropIO:getPropIO,assignPropIO:assignPropIO};export{log};export{getReader};export{waitAll};export{maybeFromIO};export{eitherFromIO};export{applyIO};export let{do:doIO}=IO;export let{doEither:doEIO}=IO;export{doIOBind};export{doEIOBind};export{listFilterInIO};export{listFilterOutIO};export{listConcatIO};export{match};export{iif};export{elif};export{els};export{iNot};export{iAnd};export{iOr};export{iReturn};export{wasReturned};export{ifReturned};export{matchReturned};export{getPropIO};export{assignPropIO};function log(...t){return IO((()=>console.log(...t)))}function getReader(){return IO((t=>t))}function waitAll(...t){return IO((r=>Promise.all(t.map((t=>liftIO(r,t).run(r))))))}function maybeFromIO(t,r={}){var e=liftIO(r,t).run(r);return isPromise(e)?e.then(Maybe.from):Maybe.from(e)}function eitherFromIO(t,r={}){var e=liftIO(r,t).run(r);return isPromise(e)?e.then((t=>Either.fromFoldable(Maybe.from(t)))):Either.fromFoldable(Maybe.from(e))}function applyIO(t,r){return IO((()=>t.run(r)))}function doIOBind(t,r){return(...e)=>IO((()=>IO.do(t,...e).run(r)))}function doEIOBind(t,r){return(...e)=>IO((()=>IO.doEither(t,...e).run(r)))}function listFilterInIO(t,r){return listConcatIO(r.map((r=>t(r).map((t=>t?[r]:[])))))}function listFilterOutIO(t,r){return listFilterInIO((r=>iNot(t(r))),r)}function listConcatIO(t){return t.reduce(((t,r)=>t.concat(r)),IO.of([]))}function match(...t){if(t.length<2)throw new Error("Invalid match arguments");for(var r=Symbol("default"),e=[];t.length>0;)if(t.length>1){let r=t.slice(0,2);t=t.slice(2),e.push(r)}else e.push([r,t[0]]),t.length=0;return IO((t=>e.reduce(((e,[i,n])=>e.chain((e=>e?IO.of(e):liftIO(t,i).chain(((t,e)=>i=>i?(e=isFunction(e)?e():e,(e=Array.isArray(e)?e:[e]).reduce(((r,e)=>r.chain((r=>liftIO(t,r).chain((r=>returnedValues.has(r)?IO.of(r):liftIO(t,e)))))),IO.of()).chain((e=>liftIO(t,e).chain((t=>IO.of(returnedValues.has(t)?t:i!==r?i:void 0)))))):IO.of(i))(t,n))))),IO.of()).run(t)))}function iif(t,r,...e){return match(t,r,...e.flatMap((t=>t)))}function elif(t,r){return[t,r]}function els(t){return[t]}function iReturn(t){return IO((r=>liftIO(r,t).map((t=>{var r={returned:t};return returnedValues.add(r),r})).run(r)))}function iNot(t){return IO((r=>liftIO(r,t).map((t=>!t)).run(r)))}function iAnd(...t){return IO((r=>foldMap((t=>AllIO((r=>liftIO(r,t).run(r)))),t).run(r)))}function iOr(...t){return IO((r=>foldMap((t=>AnyIO((r=>liftIO(r,t).run(r)))),t).run(r)))}function wasReturned(t){return returnedValues.has(t)}function ifReturned(t){return t.map((t=>wasReturned(t)?t.returned:void 0))}function matchReturned(t){return t.map((t=>wasReturned(t)?t.returned:void 0))}function getPropIO(t,r){return liftM(r).chain((r=>IO((()=>r[t]))))}function assignPropIO(t,r,e){return liftM(r).chain((r=>liftM(e).chain((e=>IO((()=>e[t]=r))))))}function liftIO(t,r){if(isMonad(r)){if(IO.is(r))return r;if(Either.Left.is(r)||Maybe.Nothing.is(r)){let t={returned:r};return returnedValues.add(t),IO.of(t)}{let t=r.chain(IO.of);return IO.is(t)?t:IO.of(r)}}return isFunction(r)?liftIO(t,r(t)):r&&"object"==typeof r&&isFunction(r.next)?IO.do(r):IO.of(r)}