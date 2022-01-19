/*! Monio: async-either.mjs
    v0.34.0-pre (c) 2022 Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
import{EMPTY_FUNC,isFunction,isPromise}from"./lib/util.mjs";import Either from"./either.mjs";const BRAND={};export default Object.assign(AsyncEither,{Left:AsyncLeft,Right:AsyncRight,of:AsyncRight,pure:AsyncRight,unit:AsyncRight,is:is,fromFoldable:fromFoldable,fromPromise:fromPromise});function AsyncLeft(t){return AsyncEither(Either.Left(t))}function AsyncRight(t){return AsyncEither(Either.Right(t))}function AsyncEither(t){return fromPromise(isPromise(t)?t:Either.Left.is(t)?Promise.reject(t):Promise.resolve(t))}function fromPromise(t){t=splitPromise(t);var r={map:function map(r){var handle=t=>{var _doMap=r=>t.fold(Either.Left,(t=>{try{return r(t)}catch(t){return Either.Left(t)}}));return isPromise(r)?r.then(_doMap):_doMap(r)};return AsyncEither(t.then(handle,handle))},chain:chain,flatMap:chain,bind:chain,ap:function ap(r){return r.map(t)},concat:function concat(r){return r.map((r=>t.then((t=>t.concat(r)))))},fold:function fold(r,i){var handle=t=>r=>r.fold((r=>Promise.reject(t(r))),t),e=t.then(handle(i),handle(r));return e.catch(EMPTY_FUNC),e},_inspect:function _inspect(){return`${r[Symbol.toStringTag]}(Promise)`},_is:function _is(t){return t===BRAND},[Symbol.toStringTag]:"AsyncEither"};return r;function chain(r){var handle=t=>{var _doChain=r=>t.fold(Either.Left,(t=>{try{let i=r(t);return is(i)||Either.is(i)?i.fold(Either.Left,identity):i}catch(t){return Either.Left(t)}}));return isPromise(r)?r.then(_doChain):_doChain(r)};return AsyncEither(t.then(handle,handle))}}function is(t){return!!(t&&isFunction(t._is)&&t._is(BRAND))}function fromFoldable(t){return t.fold(AsyncEither.Left,AsyncEither.Right)}function splitPromise(t){var r=t.then((t=>Either.is(t)?t:Either.Right(t)),(t=>Promise.reject(Either.is(t)?t:Either.Left(t))));return r.catch(EMPTY_FUNC),r}