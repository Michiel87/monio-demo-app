/*! Monio: any.mjs
    v0.33.0 (c) 2022 Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
import{isFunction,isPromise}from"../lib/util.mjs";import IO from"./io.mjs";const BRAND={};export default Object.assign(AnyIO,{of:of,is:is,empty:empty});function AnyIO(n){var t=IO(n),i={map:function map(n){return AnyIO((i=>t.map(n).run(i)))},chain:chain,flatMap:chain,bind:chain,concat:function concat(n){return AnyIO((i=>IO(t.run).map((t=>t||n.run(i))).run(i)))},run:function run(n){return t.run(n)},_inspect:function _inspect(){var n=t._inspect().match(/^IO\((.*)\)$/)[1];return`${i[Symbol.toStringTag]}(${n})`},_is:function _is(n){return!(n!==BRAND&&!t._is(n))},[Symbol.toStringTag]:"AnyIO"};return i;function chain(n){return AnyIO((i=>t.chain(n).run(i)))}}function of(n){return AnyIO((()=>n))}function is(n){return!!(n&&isFunction(n._is)&&n._is(BRAND))}function empty(){return AnyIO((()=>!1))}