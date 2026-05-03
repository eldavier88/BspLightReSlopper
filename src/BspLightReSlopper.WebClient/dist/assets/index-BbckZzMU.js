(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const h of c.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();function Vv(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var rh={exports:{}},No={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var A_;function Uy(){if(A_)return No;A_=1;var o=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(r,l,c){var h=null;if(c!==void 0&&(h=""+c),l.key!==void 0&&(h=""+l.key),"key"in l){c={};for(var d in l)d!=="key"&&(c[d]=l[d])}else c=l;return l=c.ref,{$$typeof:o,type:r,key:h,ref:l!==void 0?l:null,props:c}}return No.Fragment=t,No.jsx=i,No.jsxs=i,No}var C_;function Ly(){return C_||(C_=1,rh.exports=Uy()),rh.exports}var en=Ly(),sh={exports:{}},ie={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R_;function Ny(){if(R_)return ie;R_=1;var o=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),h=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),y=Symbol.iterator;function M(L){return L===null||typeof L!="object"?null:(L=y&&L[y]||L["@@iterator"],typeof L=="function"?L:null)}var T={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,x={};function S(L,et,yt){this.props=L,this.context=et,this.refs=x,this.updater=yt||T}S.prototype.isReactComponent={},S.prototype.setState=function(L,et){if(typeof L!="object"&&typeof L!="function"&&L!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,L,et,"setState")},S.prototype.forceUpdate=function(L){this.updater.enqueueForceUpdate(this,L,"forceUpdate")};function z(){}z.prototype=S.prototype;function N(L,et,yt){this.props=L,this.context=et,this.refs=x,this.updater=yt||T}var D=N.prototype=new z;D.constructor=N,C(D,S.prototype),D.isPureReactComponent=!0;var K=Array.isArray;function G(){}var I={H:null,A:null,T:null,S:null},Z=Object.prototype.hasOwnProperty;function w(L,et,yt){var q=yt.ref;return{$$typeof:o,type:L,key:et,ref:q!==void 0?q:null,props:yt}}function R(L,et){return w(L.type,et,L.props)}function H(L){return typeof L=="object"&&L!==null&&L.$$typeof===o}function lt(L){var et={"=":"=0",":":"=2"};return"$"+L.replace(/[=:]/g,function(yt){return et[yt]})}var st=/\/+/g;function gt(L,et){return typeof L=="object"&&L!==null&&L.key!=null?lt(""+L.key):et.toString(36)}function _t(L){switch(L.status){case"fulfilled":return L.value;case"rejected":throw L.reason;default:switch(typeof L.status=="string"?L.then(G,G):(L.status="pending",L.then(function(et){L.status==="pending"&&(L.status="fulfilled",L.value=et)},function(et){L.status==="pending"&&(L.status="rejected",L.reason=et)})),L.status){case"fulfilled":return L.value;case"rejected":throw L.reason}}throw L}function O(L,et,yt,q,ut){var Et=typeof L;(Et==="undefined"||Et==="boolean")&&(L=null);var St=!1;if(L===null)St=!0;else switch(Et){case"bigint":case"string":case"number":St=!0;break;case"object":switch(L.$$typeof){case o:case t:St=!0;break;case g:return St=L._init,O(St(L._payload),et,yt,q,ut)}}if(St)return ut=ut(L),St=q===""?"."+gt(L,0):q,K(ut)?(yt="",St!=null&&(yt=St.replace(st,"$&/")+"/"),O(ut,et,yt,"",function(Kt){return Kt})):ut!=null&&(H(ut)&&(ut=R(ut,yt+(ut.key==null||L&&L.key===ut.key?"":(""+ut.key).replace(st,"$&/")+"/")+St)),et.push(ut)),1;St=0;var Ft=q===""?".":q+":";if(K(L))for(var jt=0;jt<L.length;jt++)q=L[jt],Et=Ft+gt(q,jt),St+=O(q,et,yt,Et,ut);else if(jt=M(L),typeof jt=="function")for(L=jt.call(L),jt=0;!(q=L.next()).done;)q=q.value,Et=Ft+gt(q,jt++),St+=O(q,et,yt,Et,ut);else if(Et==="object"){if(typeof L.then=="function")return O(_t(L),et,yt,q,ut);throw et=String(L),Error("Objects are not valid as a React child (found: "+(et==="[object Object]"?"object with keys {"+Object.keys(L).join(", ")+"}":et)+"). If you meant to render a collection of children, use an array instead.")}return St}function j(L,et,yt){if(L==null)return L;var q=[],ut=0;return O(L,q,"","",function(Et){return et.call(yt,Et,ut++)}),q}function Y(L){if(L._status===-1){var et=L._result;et=et(),et.then(function(yt){(L._status===0||L._status===-1)&&(L._status=1,L._result=yt)},function(yt){(L._status===0||L._status===-1)&&(L._status=2,L._result=yt)}),L._status===-1&&(L._status=0,L._result=et)}if(L._status===1)return L._result.default;throw L._result}var xt=typeof reportError=="function"?reportError:function(L){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var et=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof L=="object"&&L!==null&&typeof L.message=="string"?String(L.message):String(L),error:L});if(!window.dispatchEvent(et))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",L);return}console.error(L)},Tt={map:j,forEach:function(L,et,yt){j(L,function(){et.apply(this,arguments)},yt)},count:function(L){var et=0;return j(L,function(){et++}),et},toArray:function(L){return j(L,function(et){return et})||[]},only:function(L){if(!H(L))throw Error("React.Children.only expected to receive a single React element child.");return L}};return ie.Activity=v,ie.Children=Tt,ie.Component=S,ie.Fragment=i,ie.Profiler=l,ie.PureComponent=N,ie.StrictMode=r,ie.Suspense=p,ie.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=I,ie.__COMPILER_RUNTIME={__proto__:null,c:function(L){return I.H.useMemoCache(L)}},ie.cache=function(L){return function(){return L.apply(null,arguments)}},ie.cacheSignal=function(){return null},ie.cloneElement=function(L,et,yt){if(L==null)throw Error("The argument must be a React element, but you passed "+L+".");var q=C({},L.props),ut=L.key;if(et!=null)for(Et in et.key!==void 0&&(ut=""+et.key),et)!Z.call(et,Et)||Et==="key"||Et==="__self"||Et==="__source"||Et==="ref"&&et.ref===void 0||(q[Et]=et[Et]);var Et=arguments.length-2;if(Et===1)q.children=yt;else if(1<Et){for(var St=Array(Et),Ft=0;Ft<Et;Ft++)St[Ft]=arguments[Ft+2];q.children=St}return w(L.type,ut,q)},ie.createContext=function(L){return L={$$typeof:h,_currentValue:L,_currentValue2:L,_threadCount:0,Provider:null,Consumer:null},L.Provider=L,L.Consumer={$$typeof:c,_context:L},L},ie.createElement=function(L,et,yt){var q,ut={},Et=null;if(et!=null)for(q in et.key!==void 0&&(Et=""+et.key),et)Z.call(et,q)&&q!=="key"&&q!=="__self"&&q!=="__source"&&(ut[q]=et[q]);var St=arguments.length-2;if(St===1)ut.children=yt;else if(1<St){for(var Ft=Array(St),jt=0;jt<St;jt++)Ft[jt]=arguments[jt+2];ut.children=Ft}if(L&&L.defaultProps)for(q in St=L.defaultProps,St)ut[q]===void 0&&(ut[q]=St[q]);return w(L,Et,ut)},ie.createRef=function(){return{current:null}},ie.forwardRef=function(L){return{$$typeof:d,render:L}},ie.isValidElement=H,ie.lazy=function(L){return{$$typeof:g,_payload:{_status:-1,_result:L},_init:Y}},ie.memo=function(L,et){return{$$typeof:m,type:L,compare:et===void 0?null:et}},ie.startTransition=function(L){var et=I.T,yt={};I.T=yt;try{var q=L(),ut=I.S;ut!==null&&ut(yt,q),typeof q=="object"&&q!==null&&typeof q.then=="function"&&q.then(G,xt)}catch(Et){xt(Et)}finally{et!==null&&yt.types!==null&&(et.types=yt.types),I.T=et}},ie.unstable_useCacheRefresh=function(){return I.H.useCacheRefresh()},ie.use=function(L){return I.H.use(L)},ie.useActionState=function(L,et,yt){return I.H.useActionState(L,et,yt)},ie.useCallback=function(L,et){return I.H.useCallback(L,et)},ie.useContext=function(L){return I.H.useContext(L)},ie.useDebugValue=function(){},ie.useDeferredValue=function(L,et){return I.H.useDeferredValue(L,et)},ie.useEffect=function(L,et){return I.H.useEffect(L,et)},ie.useEffectEvent=function(L){return I.H.useEffectEvent(L)},ie.useId=function(){return I.H.useId()},ie.useImperativeHandle=function(L,et,yt){return I.H.useImperativeHandle(L,et,yt)},ie.useInsertionEffect=function(L,et){return I.H.useInsertionEffect(L,et)},ie.useLayoutEffect=function(L,et){return I.H.useLayoutEffect(L,et)},ie.useMemo=function(L,et){return I.H.useMemo(L,et)},ie.useOptimistic=function(L,et){return I.H.useOptimistic(L,et)},ie.useReducer=function(L,et,yt){return I.H.useReducer(L,et,yt)},ie.useRef=function(L){return I.H.useRef(L)},ie.useState=function(L){return I.H.useState(L)},ie.useSyncExternalStore=function(L,et,yt){return I.H.useSyncExternalStore(L,et,yt)},ie.useTransition=function(){return I.H.useTransition()},ie.version="19.2.5",ie}var w_;function Ud(){return w_||(w_=1,sh.exports=Ny()),sh.exports}var Ai=Ud();const Oy=Vv(Ai);var oh={exports:{}},Oo={},lh={exports:{}},ch={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var D_;function Py(){return D_||(D_=1,(function(o){function t(O,j){var Y=O.length;O.push(j);t:for(;0<Y;){var xt=Y-1>>>1,Tt=O[xt];if(0<l(Tt,j))O[xt]=j,O[Y]=Tt,Y=xt;else break t}}function i(O){return O.length===0?null:O[0]}function r(O){if(O.length===0)return null;var j=O[0],Y=O.pop();if(Y!==j){O[0]=Y;t:for(var xt=0,Tt=O.length,L=Tt>>>1;xt<L;){var et=2*(xt+1)-1,yt=O[et],q=et+1,ut=O[q];if(0>l(yt,Y))q<Tt&&0>l(ut,yt)?(O[xt]=ut,O[q]=Y,xt=q):(O[xt]=yt,O[et]=Y,xt=et);else if(q<Tt&&0>l(ut,Y))O[xt]=ut,O[q]=Y,xt=q;else break t}}return j}function l(O,j){var Y=O.sortIndex-j.sortIndex;return Y!==0?Y:O.id-j.id}if(o.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;o.unstable_now=function(){return c.now()}}else{var h=Date,d=h.now();o.unstable_now=function(){return h.now()-d}}var p=[],m=[],g=1,v=null,y=3,M=!1,T=!1,C=!1,x=!1,S=typeof setTimeout=="function"?setTimeout:null,z=typeof clearTimeout=="function"?clearTimeout:null,N=typeof setImmediate<"u"?setImmediate:null;function D(O){for(var j=i(m);j!==null;){if(j.callback===null)r(m);else if(j.startTime<=O)r(m),j.sortIndex=j.expirationTime,t(p,j);else break;j=i(m)}}function K(O){if(C=!1,D(O),!T)if(i(p)!==null)T=!0,G||(G=!0,lt());else{var j=i(m);j!==null&&_t(K,j.startTime-O)}}var G=!1,I=-1,Z=5,w=-1;function R(){return x?!0:!(o.unstable_now()-w<Z)}function H(){if(x=!1,G){var O=o.unstable_now();w=O;var j=!0;try{t:{T=!1,C&&(C=!1,z(I),I=-1),M=!0;var Y=y;try{e:{for(D(O),v=i(p);v!==null&&!(v.expirationTime>O&&R());){var xt=v.callback;if(typeof xt=="function"){v.callback=null,y=v.priorityLevel;var Tt=xt(v.expirationTime<=O);if(O=o.unstable_now(),typeof Tt=="function"){v.callback=Tt,D(O),j=!0;break e}v===i(p)&&r(p),D(O)}else r(p);v=i(p)}if(v!==null)j=!0;else{var L=i(m);L!==null&&_t(K,L.startTime-O),j=!1}}break t}finally{v=null,y=Y,M=!1}j=void 0}}finally{j?lt():G=!1}}}var lt;if(typeof N=="function")lt=function(){N(H)};else if(typeof MessageChannel<"u"){var st=new MessageChannel,gt=st.port2;st.port1.onmessage=H,lt=function(){gt.postMessage(null)}}else lt=function(){S(H,0)};function _t(O,j){I=S(function(){O(o.unstable_now())},j)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(O){O.callback=null},o.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Z=0<O?Math.floor(1e3/O):5},o.unstable_getCurrentPriorityLevel=function(){return y},o.unstable_next=function(O){switch(y){case 1:case 2:case 3:var j=3;break;default:j=y}var Y=y;y=j;try{return O()}finally{y=Y}},o.unstable_requestPaint=function(){x=!0},o.unstable_runWithPriority=function(O,j){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var Y=y;y=O;try{return j()}finally{y=Y}},o.unstable_scheduleCallback=function(O,j,Y){var xt=o.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?xt+Y:xt):Y=xt,O){case 1:var Tt=-1;break;case 2:Tt=250;break;case 5:Tt=1073741823;break;case 4:Tt=1e4;break;default:Tt=5e3}return Tt=Y+Tt,O={id:g++,callback:j,priorityLevel:O,startTime:Y,expirationTime:Tt,sortIndex:-1},Y>xt?(O.sortIndex=Y,t(m,O),i(p)===null&&O===i(m)&&(C?(z(I),I=-1):C=!0,_t(K,Y-xt))):(O.sortIndex=Tt,t(p,O),T||M||(T=!0,G||(G=!0,lt()))),O},o.unstable_shouldYield=R,o.unstable_wrapCallback=function(O){var j=y;return function(){var Y=y;y=j;try{return O.apply(this,arguments)}finally{y=Y}}}})(ch)),ch}var U_;function Iy(){return U_||(U_=1,lh.exports=Py()),lh.exports}var uh={exports:{}},Un={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var L_;function zy(){if(L_)return Un;L_=1;var o=Ud();function t(p){var m="https://react.dev/errors/"+p;if(1<arguments.length){m+="?args[]="+encodeURIComponent(arguments[1]);for(var g=2;g<arguments.length;g++)m+="&args[]="+encodeURIComponent(arguments[g])}return"Minified React error #"+p+"; visit "+m+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var r={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(p,m,g){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:v==null?null:""+v,children:p,containerInfo:m,implementation:g}}var h=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(p,m){if(p==="font")return"";if(typeof m=="string")return m==="use-credentials"?m:""}return Un.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,Un.createPortal=function(p,m){var g=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!m||m.nodeType!==1&&m.nodeType!==9&&m.nodeType!==11)throw Error(t(299));return c(p,m,null,g)},Un.flushSync=function(p){var m=h.T,g=r.p;try{if(h.T=null,r.p=2,p)return p()}finally{h.T=m,r.p=g,r.d.f()}},Un.preconnect=function(p,m){typeof p=="string"&&(m?(m=m.crossOrigin,m=typeof m=="string"?m==="use-credentials"?m:"":void 0):m=null,r.d.C(p,m))},Un.prefetchDNS=function(p){typeof p=="string"&&r.d.D(p)},Un.preinit=function(p,m){if(typeof p=="string"&&m&&typeof m.as=="string"){var g=m.as,v=d(g,m.crossOrigin),y=typeof m.integrity=="string"?m.integrity:void 0,M=typeof m.fetchPriority=="string"?m.fetchPriority:void 0;g==="style"?r.d.S(p,typeof m.precedence=="string"?m.precedence:void 0,{crossOrigin:v,integrity:y,fetchPriority:M}):g==="script"&&r.d.X(p,{crossOrigin:v,integrity:y,fetchPriority:M,nonce:typeof m.nonce=="string"?m.nonce:void 0})}},Un.preinitModule=function(p,m){if(typeof p=="string")if(typeof m=="object"&&m!==null){if(m.as==null||m.as==="script"){var g=d(m.as,m.crossOrigin);r.d.M(p,{crossOrigin:g,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0})}}else m==null&&r.d.M(p)},Un.preload=function(p,m){if(typeof p=="string"&&typeof m=="object"&&m!==null&&typeof m.as=="string"){var g=m.as,v=d(g,m.crossOrigin);r.d.L(p,g,{crossOrigin:v,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,type:typeof m.type=="string"?m.type:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0,referrerPolicy:typeof m.referrerPolicy=="string"?m.referrerPolicy:void 0,imageSrcSet:typeof m.imageSrcSet=="string"?m.imageSrcSet:void 0,imageSizes:typeof m.imageSizes=="string"?m.imageSizes:void 0,media:typeof m.media=="string"?m.media:void 0})}},Un.preloadModule=function(p,m){if(typeof p=="string")if(m){var g=d(m.as,m.crossOrigin);r.d.m(p,{as:typeof m.as=="string"&&m.as!=="script"?m.as:void 0,crossOrigin:g,integrity:typeof m.integrity=="string"?m.integrity:void 0})}else r.d.m(p)},Un.requestFormReset=function(p){r.d.r(p)},Un.unstable_batchedUpdates=function(p,m){return p(m)},Un.useFormState=function(p,m,g){return h.H.useFormState(p,m,g)},Un.useFormStatus=function(){return h.H.useHostTransitionStatus()},Un.version="19.2.5",Un}var N_;function By(){if(N_)return uh.exports;N_=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(t){console.error(t)}}return o(),uh.exports=zy(),uh.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var O_;function Fy(){if(O_)return Oo;O_=1;var o=Iy(),t=Ud(),i=By();function r(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function c(e){var n=e,a=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,(n.flags&4098)!==0&&(a=n.return),e=n.return;while(e)}return n.tag===3?a:null}function h(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function d(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function p(e){if(c(e)!==e)throw Error(r(188))}function m(e){var n=e.alternate;if(!n){if(n=c(e),n===null)throw Error(r(188));return n!==e?null:e}for(var a=e,s=n;;){var u=a.return;if(u===null)break;var f=u.alternate;if(f===null){if(s=u.return,s!==null){a=s;continue}break}if(u.child===f.child){for(f=u.child;f;){if(f===a)return p(u),e;if(f===s)return p(u),n;f=f.sibling}throw Error(r(188))}if(a.return!==s.return)a=u,s=f;else{for(var _=!1,E=u.child;E;){if(E===a){_=!0,a=u,s=f;break}if(E===s){_=!0,s=u,a=f;break}E=E.sibling}if(!_){for(E=f.child;E;){if(E===a){_=!0,a=f,s=u;break}if(E===s){_=!0,s=f,a=u;break}E=E.sibling}if(!_)throw Error(r(189))}}if(a.alternate!==s)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?e:n}function g(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=g(e),n!==null)return n;e=e.sibling}return null}var v=Object.assign,y=Symbol.for("react.element"),M=Symbol.for("react.transitional.element"),T=Symbol.for("react.portal"),C=Symbol.for("react.fragment"),x=Symbol.for("react.strict_mode"),S=Symbol.for("react.profiler"),z=Symbol.for("react.consumer"),N=Symbol.for("react.context"),D=Symbol.for("react.forward_ref"),K=Symbol.for("react.suspense"),G=Symbol.for("react.suspense_list"),I=Symbol.for("react.memo"),Z=Symbol.for("react.lazy"),w=Symbol.for("react.activity"),R=Symbol.for("react.memo_cache_sentinel"),H=Symbol.iterator;function lt(e){return e===null||typeof e!="object"?null:(e=H&&e[H]||e["@@iterator"],typeof e=="function"?e:null)}var st=Symbol.for("react.client.reference");function gt(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===st?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case C:return"Fragment";case S:return"Profiler";case x:return"StrictMode";case K:return"Suspense";case G:return"SuspenseList";case w:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case T:return"Portal";case N:return e.displayName||"Context";case z:return(e._context.displayName||"Context")+".Consumer";case D:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case I:return n=e.displayName||null,n!==null?n:gt(e.type)||"Memo";case Z:n=e._payload,e=e._init;try{return gt(e(n))}catch{}}return null}var _t=Array.isArray,O=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,j=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Y={pending:!1,data:null,method:null,action:null},xt=[],Tt=-1;function L(e){return{current:e}}function et(e){0>Tt||(e.current=xt[Tt],xt[Tt]=null,Tt--)}function yt(e,n){Tt++,xt[Tt]=e.current,e.current=n}var q=L(null),ut=L(null),Et=L(null),St=L(null);function Ft(e,n){switch(yt(Et,n),yt(ut,e),yt(q,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?Zg(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=Zg(n),e=Kg(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}et(q),yt(q,e)}function jt(){et(q),et(ut),et(Et)}function Kt(e){e.memoizedState!==null&&yt(St,e);var n=q.current,a=Kg(n,e.type);n!==a&&(yt(ut,e),yt(q,a))}function Ve(e){ut.current===e&&(et(q),et(ut)),St.current===e&&(et(St),wo._currentValue=Y)}var He,ue;function B(e){if(He===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);He=n&&n[1]||"",ue=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+He+e+ue}var wn=!1;function fe(e,n){if(!e||wn)return"";wn=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var s={DetermineComponentFrameRoot:function(){try{if(n){var mt=function(){throw Error()};if(Object.defineProperty(mt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(mt,[])}catch(rt){var $=rt}Reflect.construct(e,[],mt)}else{try{mt.call()}catch(rt){$=rt}e.call(mt.prototype)}}else{try{throw Error()}catch(rt){$=rt}(mt=e())&&typeof mt.catch=="function"&&mt.catch(function(){})}}catch(rt){if(rt&&$&&typeof rt.stack=="string")return[rt.stack,$.stack]}return[null,null]}};s.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(s.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=s.DetermineComponentFrameRoot(),_=f[0],E=f[1];if(_&&E){var P=_.split(`
`),J=E.split(`
`);for(u=s=0;s<P.length&&!P[s].includes("DetermineComponentFrameRoot");)s++;for(;u<J.length&&!J[u].includes("DetermineComponentFrameRoot");)u++;if(s===P.length||u===J.length)for(s=P.length-1,u=J.length-1;1<=s&&0<=u&&P[s]!==J[u];)u--;for(;1<=s&&0<=u;s--,u--)if(P[s]!==J[u]){if(s!==1||u!==1)do if(s--,u--,0>u||P[s]!==J[u]){var ct=`
`+P[s].replace(" at new "," at ");return e.displayName&&ct.includes("<anonymous>")&&(ct=ct.replace("<anonymous>",e.displayName)),ct}while(1<=s&&0<=u);break}}}finally{wn=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?B(a):""}function pe(e,n){switch(e.tag){case 26:case 27:case 5:return B(e.type);case 16:return B("Lazy");case 13:return e.child!==n&&n!==null?B("Suspense Fallback"):B("Suspense");case 19:return B("SuspenseList");case 0:case 15:return fe(e.type,!1);case 11:return fe(e.type.render,!1);case 1:return fe(e.type,!0);case 31:return B("Activity");default:return""}}function Xt(e){try{var n="",a=null;do n+=pe(e,a),a=e,e=e.return;while(e);return n}catch(s){return`
Error generating stack: `+s.message+`
`+s.stack}}var Ue=Object.prototype.hasOwnProperty,kt=o.unstable_scheduleCallback,U=o.unstable_cancelCallback,b=o.unstable_shouldYield,tt=o.unstable_requestPaint,ft=o.unstable_now,Mt=o.unstable_getCurrentPriorityLevel,pt=o.unstable_ImmediatePriority,Gt=o.unstable_UserBlockingPriority,Rt=o.unstable_NormalPriority,It=o.unstable_LowPriority,me=o.unstable_IdlePriority,At=o.log,zt=o.unstable_setDisableYieldValue,Zt=null,Vt=null;function Ot(e){if(typeof At=="function"&&zt(e),Vt&&typeof Vt.setStrictMode=="function")try{Vt.setStrictMode(Zt,e)}catch{}}var $t=Math.clz32?Math.clz32:k,re=Math.log,Oe=Math.LN2;function k(e){return e>>>=0,e===0?32:31-(re(e)/Oe|0)|0}var wt=256,ot=262144,vt=4194304;function Ct(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Dt(e,n,a){var s=e.pendingLanes;if(s===0)return 0;var u=0,f=e.suspendedLanes,_=e.pingedLanes;e=e.warmLanes;var E=s&134217727;return E!==0?(s=E&~f,s!==0?u=Ct(s):(_&=E,_!==0?u=Ct(_):a||(a=E&~e,a!==0&&(u=Ct(a))))):(E=s&~f,E!==0?u=Ct(E):_!==0?u=Ct(_):a||(a=s&~e,a!==0&&(u=Ct(a)))),u===0?0:n!==0&&n!==u&&(n&f)===0&&(f=u&-u,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:u}function te(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function qe(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function hn(){var e=vt;return vt<<=1,(vt&62914560)===0&&(vt=4194304),e}function be(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function xn(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function _i(e,n,a,s,u,f){var _=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var E=e.entanglements,P=e.expirationTimes,J=e.hiddenUpdates;for(a=_&~a;0<a;){var ct=31-$t(a),mt=1<<ct;E[ct]=0,P[ct]=-1;var $=J[ct];if($!==null)for(J[ct]=null,ct=0;ct<$.length;ct++){var rt=$[ct];rt!==null&&(rt.lane&=-536870913)}a&=~mt}s!==0&&Hs(e,s,0),f!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=f&~(_&~n))}function Hs(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var s=31-$t(n);e.entangledLanes|=n,e.entanglements[s]=e.entanglements[s]|1073741824|a&261930}function Gs(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var s=31-$t(a),u=1<<s;u&n|e[s]&n&&(e[s]|=n),a&=~u}}function Li(e,n){var a=n&-n;return a=(a&42)!==0?1:Ja(a),(a&(e.suspendedLanes|n))!==0?0:a}function Ja(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Or(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Vs(){var e=j.p;return e!==0?e:(e=window.event,e===void 0?32:S_(e.type))}function $a(e,n){var a=j.p;try{return j.p=e,n()}finally{j.p=a}}var vi=Math.random().toString(36).slice(2),Qe="__reactFiber$"+vi,Mn="__reactProps$"+vi,Vi="__reactContainer$"+vi,ks="__reactEvents$"+vi,Jc="__reactListeners$"+vi,$c="__reactHandles$"+vi,Jo="__reactResources$"+vi,tr="__reactMarker$"+vi;function Xs(e){delete e[Qe],delete e[Mn],delete e[ks],delete e[Jc],delete e[$c]}function A(e){var n=e[Qe];if(n)return n;for(var a=e.parentNode;a;){if(n=a[Vi]||a[Qe]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=i_(e);e!==null;){if(a=e[Qe])return a;e=i_(e)}return n}e=a,a=e.parentNode}return null}function X(e){if(e=e[Qe]||e[Vi]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function nt(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(r(33))}function it(e){var n=e[Jo];return n||(n=e[Jo]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function V(e){e[tr]=!0}var bt=new Set,Ut={};function Nt(e,n){Pt(e,n),Pt(e+"Capture",n)}function Pt(e,n){for(Ut[e]=n,e=0;e<n.length;e++)bt.add(n[e])}var ee=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Jt={},Wt={};function ve(e){return Ue.call(Wt,e)?!0:Ue.call(Jt,e)?!1:ee.test(e)?Wt[e]=!0:(Jt[e]=!0,!1)}function Se(e,n,a){if(ve(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var s=n.toLowerCase().slice(0,5);if(s!=="data-"&&s!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,""+a)}}function ke(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,""+a)}}function Te(e,n,a,s){if(s===null)e.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,""+s)}}function ne(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Yt(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function dn(e,n,a){var s=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof s<"u"&&typeof s.get=="function"&&typeof s.set=="function"){var u=s.get,f=s.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return u.call(this)},set:function(_){a=""+_,f.call(this,_)}}),Object.defineProperty(e,n,{enumerable:s.enumerable}),{getValue:function(){return a},setValue:function(_){a=""+_},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function Ee(e){if(!e._valueTracker){var n=Yt(e)?"checked":"value";e._valueTracker=dn(e,n,""+e[n])}}function Fn(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),s="";return e&&(s=Yt(e)?e.checked?"true":"false":e.value),e=s,e!==a?(n.setValue(e),!0):!1}function Si(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Pn=/[\n"\\]/g;function vn(e){return e.replace(Pn,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Pe(e,n,a,s,u,f,_,E){e.name="",_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"?e.type=_:e.removeAttribute("type"),n!=null?_==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+ne(n)):e.value!==""+ne(n)&&(e.value=""+ne(n)):_!=="submit"&&_!=="reset"||e.removeAttribute("value"),n!=null?Dn(e,_,ne(n)):a!=null?Dn(e,_,ne(a)):s!=null&&e.removeAttribute("value"),u==null&&f!=null&&(e.defaultChecked=!!f),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),E!=null&&typeof E!="function"&&typeof E!="symbol"&&typeof E!="boolean"?e.name=""+ne(E):e.removeAttribute("name")}function In(e,n,a,s,u,f,_,E){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){Ee(e);return}a=a!=null?""+ne(a):"",n=n!=null?""+ne(n):a,E||n===e.value||(e.value=n),e.defaultValue=n}s=s??u,s=typeof s!="function"&&typeof s!="symbol"&&!!s,e.checked=E?e.checked:!!s,e.defaultChecked=!!s,_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"&&(e.name=_),Ee(e)}function Dn(e,n,a){n==="number"&&Si(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function Je(e,n,a,s){if(e=e.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<e.length;a++)u=n.hasOwnProperty("$"+e[a].value),e[a].selected!==u&&(e[a].selected=u),u&&s&&(e[a].defaultSelected=!0)}else{for(a=""+ne(a),n=null,u=0;u<e.length;u++){if(e[u].value===a){e[u].selected=!0,s&&(e[u].defaultSelected=!0);return}n!==null||e[u].disabled||(n=e[u])}n!==null&&(n.selected=!0)}}function En(e,n,a){if(n!=null&&(n=""+ne(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+ne(a):""}function Pr(e,n,a,s){if(n==null){if(s!=null){if(a!=null)throw Error(r(92));if(_t(s)){if(1<s.length)throw Error(r(93));s=s[0]}a=s}a==null&&(a=""),n=a}a=ne(n),e.defaultValue=a,s=e.textContent,s===a&&s!==""&&s!==null&&(e.value=s),Ee(e)}function Hn(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var A0=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function qd(e,n,a){var s=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?s?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":s?e.setProperty(n,a):typeof a!="number"||a===0||A0.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Yd(e,n,a){if(n!=null&&typeof n!="object")throw Error(r(62));if(e=e.style,a!=null){for(var s in a)!a.hasOwnProperty(s)||n!=null&&n.hasOwnProperty(s)||(s.indexOf("--")===0?e.setProperty(s,""):s==="float"?e.cssFloat="":e[s]="");for(var u in n)s=n[u],n.hasOwnProperty(u)&&a[u]!==s&&qd(e,u,s)}else for(var f in n)n.hasOwnProperty(f)&&qd(e,f,n[f])}function tu(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var C0=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),R0=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function $o(e){return R0.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function ki(){}var eu=null;function nu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ir=null,zr=null;function jd(e){var n=X(e);if(n&&(e=n.stateNode)){var a=e[Mn]||null;t:switch(e=n.stateNode,n.type){case"input":if(Pe(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+vn(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var s=a[n];if(s!==e&&s.form===e.form){var u=s[Mn]||null;if(!u)throw Error(r(90));Pe(s,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)s=a[n],s.form===e.form&&Fn(s)}break t;case"textarea":En(e,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&Je(e,!!a.multiple,n,!1)}}}var iu=!1;function Zd(e,n,a){if(iu)return e(n,a);iu=!0;try{var s=e(n);return s}finally{if(iu=!1,(Ir!==null||zr!==null)&&(Hl(),Ir&&(n=Ir,e=zr,zr=Ir=null,jd(n),e)))for(n=0;n<e.length;n++)jd(e[n])}}function Ws(e,n){var a=e.stateNode;if(a===null)return null;var s=a[Mn]||null;if(s===null)return null;a=s[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(e=e.type,s=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!s;break t;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(r(231,n,typeof a));return a}var Xi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),au=!1;if(Xi)try{var qs={};Object.defineProperty(qs,"passive",{get:function(){au=!0}}),window.addEventListener("test",qs,qs),window.removeEventListener("test",qs,qs)}catch{au=!1}var va=null,ru=null,tl=null;function Kd(){if(tl)return tl;var e,n=ru,a=n.length,s,u="value"in va?va.value:va.textContent,f=u.length;for(e=0;e<a&&n[e]===u[e];e++);var _=a-e;for(s=1;s<=_&&n[a-s]===u[f-s];s++);return tl=u.slice(e,1<s?1-s:void 0)}function el(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function nl(){return!0}function Qd(){return!1}function Gn(e){function n(a,s,u,f,_){this._reactName=a,this._targetInst=u,this.type=s,this.nativeEvent=f,this.target=_,this.currentTarget=null;for(var E in e)e.hasOwnProperty(E)&&(a=e[E],this[E]=a?a(f):f[E]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?nl:Qd,this.isPropagationStopped=Qd,this}return v(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=nl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=nl)},persist:function(){},isPersistent:nl}),n}var er={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},il=Gn(er),Ys=v({},er,{view:0,detail:0}),w0=Gn(Ys),su,ou,js,al=v({},Ys,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:cu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==js&&(js&&e.type==="mousemove"?(su=e.screenX-js.screenX,ou=e.screenY-js.screenY):ou=su=0,js=e),su)},movementY:function(e){return"movementY"in e?e.movementY:ou}}),Jd=Gn(al),D0=v({},al,{dataTransfer:0}),U0=Gn(D0),L0=v({},Ys,{relatedTarget:0}),lu=Gn(L0),N0=v({},er,{animationName:0,elapsedTime:0,pseudoElement:0}),O0=Gn(N0),P0=v({},er,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),I0=Gn(P0),z0=v({},er,{data:0}),$d=Gn(z0),B0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},F0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},H0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function G0(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=H0[e])?!!n[e]:!1}function cu(){return G0}var V0=v({},Ys,{key:function(e){if(e.key){var n=B0[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=el(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?F0[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:cu,charCode:function(e){return e.type==="keypress"?el(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?el(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),k0=Gn(V0),X0=v({},al,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),tp=Gn(X0),W0=v({},Ys,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:cu}),q0=Gn(W0),Y0=v({},er,{propertyName:0,elapsedTime:0,pseudoElement:0}),j0=Gn(Y0),Z0=v({},al,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),K0=Gn(Z0),Q0=v({},er,{newState:0,oldState:0}),J0=Gn(Q0),$0=[9,13,27,32],uu=Xi&&"CompositionEvent"in window,Zs=null;Xi&&"documentMode"in document&&(Zs=document.documentMode);var tS=Xi&&"TextEvent"in window&&!Zs,ep=Xi&&(!uu||Zs&&8<Zs&&11>=Zs),np=" ",ip=!1;function ap(e,n){switch(e){case"keyup":return $0.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function rp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Br=!1;function eS(e,n){switch(e){case"compositionend":return rp(n);case"keypress":return n.which!==32?null:(ip=!0,np);case"textInput":return e=n.data,e===np&&ip?null:e;default:return null}}function nS(e,n){if(Br)return e==="compositionend"||!uu&&ap(e,n)?(e=Kd(),tl=ru=va=null,Br=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return ep&&n.locale!=="ko"?null:n.data;default:return null}}var iS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function sp(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!iS[e.type]:n==="textarea"}function op(e,n,a,s){Ir?zr?zr.push(s):zr=[s]:Ir=s,n=Yl(n,"onChange"),0<n.length&&(a=new il("onChange","change",null,a,s),e.push({event:a,listeners:n}))}var Ks=null,Qs=null;function aS(e){kg(e,0)}function rl(e){var n=nt(e);if(Fn(n))return e}function lp(e,n){if(e==="change")return n}var cp=!1;if(Xi){var fu;if(Xi){var hu="oninput"in document;if(!hu){var up=document.createElement("div");up.setAttribute("oninput","return;"),hu=typeof up.oninput=="function"}fu=hu}else fu=!1;cp=fu&&(!document.documentMode||9<document.documentMode)}function fp(){Ks&&(Ks.detachEvent("onpropertychange",hp),Qs=Ks=null)}function hp(e){if(e.propertyName==="value"&&rl(Qs)){var n=[];op(n,Qs,e,nu(e)),Zd(aS,n)}}function rS(e,n,a){e==="focusin"?(fp(),Ks=n,Qs=a,Ks.attachEvent("onpropertychange",hp)):e==="focusout"&&fp()}function sS(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return rl(Qs)}function oS(e,n){if(e==="click")return rl(n)}function lS(e,n){if(e==="input"||e==="change")return rl(n)}function cS(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var Kn=typeof Object.is=="function"?Object.is:cS;function Js(e,n){if(Kn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),s=Object.keys(n);if(a.length!==s.length)return!1;for(s=0;s<a.length;s++){var u=a[s];if(!Ue.call(n,u)||!Kn(e[u],n[u]))return!1}return!0}function dp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function pp(e,n){var a=dp(e);e=0;for(var s;a;){if(a.nodeType===3){if(s=e+a.textContent.length,e<=n&&s>=n)return{node:a,offset:n-e};e=s}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=dp(a)}}function mp(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?mp(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function gp(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=Si(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=Si(e.document)}return n}function du(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var uS=Xi&&"documentMode"in document&&11>=document.documentMode,Fr=null,pu=null,$s=null,mu=!1;function _p(e,n,a){var s=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;mu||Fr==null||Fr!==Si(s)||(s=Fr,"selectionStart"in s&&du(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),$s&&Js($s,s)||($s=s,s=Yl(pu,"onSelect"),0<s.length&&(n=new il("onSelect","select",null,n,a),e.push({event:n,listeners:s}),n.target=Fr)))}function nr(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var Hr={animationend:nr("Animation","AnimationEnd"),animationiteration:nr("Animation","AnimationIteration"),animationstart:nr("Animation","AnimationStart"),transitionrun:nr("Transition","TransitionRun"),transitionstart:nr("Transition","TransitionStart"),transitioncancel:nr("Transition","TransitionCancel"),transitionend:nr("Transition","TransitionEnd")},gu={},vp={};Xi&&(vp=document.createElement("div").style,"AnimationEvent"in window||(delete Hr.animationend.animation,delete Hr.animationiteration.animation,delete Hr.animationstart.animation),"TransitionEvent"in window||delete Hr.transitionend.transition);function ir(e){if(gu[e])return gu[e];if(!Hr[e])return e;var n=Hr[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in vp)return gu[e]=n[a];return e}var Sp=ir("animationend"),yp=ir("animationiteration"),xp=ir("animationstart"),fS=ir("transitionrun"),hS=ir("transitionstart"),dS=ir("transitioncancel"),Mp=ir("transitionend"),Ep=new Map,_u="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");_u.push("scrollEnd");function yi(e,n){Ep.set(e,n),Nt(n,[e])}var sl=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},si=[],Gr=0,vu=0;function ol(){for(var e=Gr,n=vu=Gr=0;n<e;){var a=si[n];si[n++]=null;var s=si[n];si[n++]=null;var u=si[n];si[n++]=null;var f=si[n];if(si[n++]=null,s!==null&&u!==null){var _=s.pending;_===null?u.next=u:(u.next=_.next,_.next=u),s.pending=u}f!==0&&bp(a,u,f)}}function ll(e,n,a,s){si[Gr++]=e,si[Gr++]=n,si[Gr++]=a,si[Gr++]=s,vu|=s,e.lanes|=s,e=e.alternate,e!==null&&(e.lanes|=s)}function Su(e,n,a,s){return ll(e,n,a,s),cl(e)}function ar(e,n){return ll(e,null,null,n),cl(e)}function bp(e,n,a){e.lanes|=a;var s=e.alternate;s!==null&&(s.lanes|=a);for(var u=!1,f=e.return;f!==null;)f.childLanes|=a,s=f.alternate,s!==null&&(s.childLanes|=a),f.tag===22&&(e=f.stateNode,e===null||e._visibility&1||(u=!0)),e=f,f=f.return;return e.tag===3?(f=e.stateNode,u&&n!==null&&(u=31-$t(a),e=f.hiddenUpdates,s=e[u],s===null?e[u]=[n]:s.push(n),n.lane=a|536870912),f):null}function cl(e){if(50<Mo)throw Mo=0,wf=null,Error(r(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Vr={};function pS(e,n,a,s){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Qn(e,n,a,s){return new pS(e,n,a,s)}function yu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Wi(e,n){var a=e.alternate;return a===null?(a=Qn(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Tp(e,n){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function ul(e,n,a,s,u,f){var _=0;if(s=e,typeof e=="function")yu(e)&&(_=1);else if(typeof e=="string")_=Sy(e,a,q.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case w:return e=Qn(31,a,n,u),e.elementType=w,e.lanes=f,e;case C:return rr(a.children,u,f,n);case x:_=8,u|=24;break;case S:return e=Qn(12,a,n,u|2),e.elementType=S,e.lanes=f,e;case K:return e=Qn(13,a,n,u),e.elementType=K,e.lanes=f,e;case G:return e=Qn(19,a,n,u),e.elementType=G,e.lanes=f,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case N:_=10;break t;case z:_=9;break t;case D:_=11;break t;case I:_=14;break t;case Z:_=16,s=null;break t}_=29,a=Error(r(130,e===null?"null":typeof e,"")),s=null}return n=Qn(_,a,n,u),n.elementType=e,n.type=s,n.lanes=f,n}function rr(e,n,a,s){return e=Qn(7,e,s,n),e.lanes=a,e}function xu(e,n,a){return e=Qn(6,e,null,n),e.lanes=a,e}function Ap(e){var n=Qn(18,null,null,0);return n.stateNode=e,n}function Mu(e,n,a){return n=Qn(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var Cp=new WeakMap;function oi(e,n){if(typeof e=="object"&&e!==null){var a=Cp.get(e);return a!==void 0?a:(n={value:e,source:n,stack:Xt(n)},Cp.set(e,n),n)}return{value:e,source:n,stack:Xt(n)}}var kr=[],Xr=0,fl=null,to=0,li=[],ci=0,Sa=null,Ni=1,Oi="";function qi(e,n){kr[Xr++]=to,kr[Xr++]=fl,fl=e,to=n}function Rp(e,n,a){li[ci++]=Ni,li[ci++]=Oi,li[ci++]=Sa,Sa=e;var s=Ni;e=Oi;var u=32-$t(s)-1;s&=~(1<<u),a+=1;var f=32-$t(n)+u;if(30<f){var _=u-u%5;f=(s&(1<<_)-1).toString(32),s>>=_,u-=_,Ni=1<<32-$t(n)+u|a<<u|s,Oi=f+e}else Ni=1<<f|a<<u|s,Oi=e}function Eu(e){e.return!==null&&(qi(e,1),Rp(e,1,0))}function bu(e){for(;e===fl;)fl=kr[--Xr],kr[Xr]=null,to=kr[--Xr],kr[Xr]=null;for(;e===Sa;)Sa=li[--ci],li[ci]=null,Oi=li[--ci],li[ci]=null,Ni=li[--ci],li[ci]=null}function wp(e,n){li[ci++]=Ni,li[ci++]=Oi,li[ci++]=Sa,Ni=n.id,Oi=n.overflow,Sa=e}var bn=null,Xe=null,ye=!1,ya=null,ui=!1,Tu=Error(r(519));function xa(e){var n=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw eo(oi(n,e)),Tu}function Dp(e){var n=e.stateNode,a=e.type,s=e.memoizedProps;switch(n[Qe]=e,n[Mn]=s,a){case"dialog":de("cancel",n),de("close",n);break;case"iframe":case"object":case"embed":de("load",n);break;case"video":case"audio":for(a=0;a<bo.length;a++)de(bo[a],n);break;case"source":de("error",n);break;case"img":case"image":case"link":de("error",n),de("load",n);break;case"details":de("toggle",n);break;case"input":de("invalid",n),In(n,s.value,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name,!0);break;case"select":de("invalid",n);break;case"textarea":de("invalid",n),Pr(n,s.value,s.defaultValue,s.children)}a=s.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||s.suppressHydrationWarning===!0||Yg(n.textContent,a)?(s.popover!=null&&(de("beforetoggle",n),de("toggle",n)),s.onScroll!=null&&de("scroll",n),s.onScrollEnd!=null&&de("scrollend",n),s.onClick!=null&&(n.onclick=ki),n=!0):n=!1,n||xa(e,!0)}function Up(e){for(bn=e.return;bn;)switch(bn.tag){case 5:case 31:case 13:ui=!1;return;case 27:case 3:ui=!0;return;default:bn=bn.return}}function Wr(e){if(e!==bn)return!1;if(!ye)return Up(e),ye=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||Xf(e.type,e.memoizedProps)),a=!a),a&&Xe&&xa(e),Up(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Xe=n_(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Xe=n_(e)}else n===27?(n=Xe,Pa(e.type)?(e=Zf,Zf=null,Xe=e):Xe=n):Xe=bn?hi(e.stateNode.nextSibling):null;return!0}function sr(){Xe=bn=null,ye=!1}function Au(){var e=ya;return e!==null&&(Wn===null?Wn=e:Wn.push.apply(Wn,e),ya=null),e}function eo(e){ya===null?ya=[e]:ya.push(e)}var Cu=L(null),or=null,Yi=null;function Ma(e,n,a){yt(Cu,n._currentValue),n._currentValue=a}function ji(e){e._currentValue=Cu.current,et(Cu)}function Ru(e,n,a){for(;e!==null;){var s=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,s!==null&&(s.childLanes|=n)):s!==null&&(s.childLanes&n)!==n&&(s.childLanes|=n),e===a)break;e=e.return}}function wu(e,n,a,s){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var f=u.dependencies;if(f!==null){var _=u.child;f=f.firstContext;t:for(;f!==null;){var E=f;f=u;for(var P=0;P<n.length;P++)if(E.context===n[P]){f.lanes|=a,E=f.alternate,E!==null&&(E.lanes|=a),Ru(f.return,a,e),s||(_=null);break t}f=E.next}}else if(u.tag===18){if(_=u.return,_===null)throw Error(r(341));_.lanes|=a,f=_.alternate,f!==null&&(f.lanes|=a),Ru(_,a,e),_=null}else _=u.child;if(_!==null)_.return=u;else for(_=u;_!==null;){if(_===e){_=null;break}if(u=_.sibling,u!==null){u.return=_.return,_=u;break}_=_.return}u=_}}function qr(e,n,a,s){e=null;for(var u=n,f=!1;u!==null;){if(!f){if((u.flags&524288)!==0)f=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var _=u.alternate;if(_===null)throw Error(r(387));if(_=_.memoizedProps,_!==null){var E=u.type;Kn(u.pendingProps.value,_.value)||(e!==null?e.push(E):e=[E])}}else if(u===St.current){if(_=u.alternate,_===null)throw Error(r(387));_.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(wo):e=[wo])}u=u.return}e!==null&&wu(n,e,a,s),n.flags|=262144}function hl(e){for(e=e.firstContext;e!==null;){if(!Kn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function lr(e){or=e,Yi=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Tn(e){return Lp(or,e)}function dl(e,n){return or===null&&lr(e),Lp(e,n)}function Lp(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},Yi===null){if(e===null)throw Error(r(308));Yi=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else Yi=Yi.next=n;return a}var mS=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,s){e.push(s)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},gS=o.unstable_scheduleCallback,_S=o.unstable_NormalPriority,sn={$$typeof:N,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Du(){return{controller:new mS,data:new Map,refCount:0}}function no(e){e.refCount--,e.refCount===0&&gS(_S,function(){e.controller.abort()})}var io=null,Uu=0,Yr=0,jr=null;function vS(e,n){if(io===null){var a=io=[];Uu=0,Yr=Pf(),jr={status:"pending",value:void 0,then:function(s){a.push(s)}}}return Uu++,n.then(Np,Np),n}function Np(){if(--Uu===0&&io!==null){jr!==null&&(jr.status="fulfilled");var e=io;io=null,Yr=0,jr=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function SS(e,n){var a=[],s={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return e.then(function(){s.status="fulfilled",s.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(s.status="rejected",s.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),s}var Op=O.S;O.S=function(e,n){_g=ft(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&vS(e,n),Op!==null&&Op(e,n)};var cr=L(null);function Lu(){var e=cr.current;return e!==null?e:Ge.pooledCache}function pl(e,n){n===null?yt(cr,cr.current):yt(cr,n.pool)}function Pp(){var e=Lu();return e===null?null:{parent:sn._currentValue,pool:e}}var Zr=Error(r(460)),Nu=Error(r(474)),ml=Error(r(542)),gl={then:function(){}};function Ip(e){return e=e.status,e==="fulfilled"||e==="rejected"}function zp(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(ki,ki),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Fp(e),e;default:if(typeof n.status=="string")n.then(ki,ki);else{if(e=Ge,e!==null&&100<e.shellSuspendCounter)throw Error(r(482));e=n,e.status="pending",e.then(function(s){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=s}},function(s){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=s}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Fp(e),e}throw fr=n,Zr}}function ur(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(fr=a,Zr):a}}var fr=null;function Bp(){if(fr===null)throw Error(r(459));var e=fr;return fr=null,e}function Fp(e){if(e===Zr||e===ml)throw Error(r(483))}var Kr=null,ao=0;function _l(e){var n=ao;return ao+=1,Kr===null&&(Kr=[]),zp(Kr,e,n)}function ro(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function vl(e,n){throw n.$$typeof===y?Error(r(525)):(e=Object.prototype.toString.call(n),Error(r(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function Hp(e){function n(W,F){if(e){var Q=W.deletions;Q===null?(W.deletions=[F],W.flags|=16):Q.push(F)}}function a(W,F){if(!e)return null;for(;F!==null;)n(W,F),F=F.sibling;return null}function s(W){for(var F=new Map;W!==null;)W.key!==null?F.set(W.key,W):F.set(W.index,W),W=W.sibling;return F}function u(W,F){return W=Wi(W,F),W.index=0,W.sibling=null,W}function f(W,F,Q){return W.index=Q,e?(Q=W.alternate,Q!==null?(Q=Q.index,Q<F?(W.flags|=67108866,F):Q):(W.flags|=67108866,F)):(W.flags|=1048576,F)}function _(W){return e&&W.alternate===null&&(W.flags|=67108866),W}function E(W,F,Q,ht){return F===null||F.tag!==6?(F=xu(Q,W.mode,ht),F.return=W,F):(F=u(F,Q),F.return=W,F)}function P(W,F,Q,ht){var qt=Q.type;return qt===C?ct(W,F,Q.props.children,ht,Q.key):F!==null&&(F.elementType===qt||typeof qt=="object"&&qt!==null&&qt.$$typeof===Z&&ur(qt)===F.type)?(F=u(F,Q.props),ro(F,Q),F.return=W,F):(F=ul(Q.type,Q.key,Q.props,null,W.mode,ht),ro(F,Q),F.return=W,F)}function J(W,F,Q,ht){return F===null||F.tag!==4||F.stateNode.containerInfo!==Q.containerInfo||F.stateNode.implementation!==Q.implementation?(F=Mu(Q,W.mode,ht),F.return=W,F):(F=u(F,Q.children||[]),F.return=W,F)}function ct(W,F,Q,ht,qt){return F===null||F.tag!==7?(F=rr(Q,W.mode,ht,qt),F.return=W,F):(F=u(F,Q),F.return=W,F)}function mt(W,F,Q){if(typeof F=="string"&&F!==""||typeof F=="number"||typeof F=="bigint")return F=xu(""+F,W.mode,Q),F.return=W,F;if(typeof F=="object"&&F!==null){switch(F.$$typeof){case M:return Q=ul(F.type,F.key,F.props,null,W.mode,Q),ro(Q,F),Q.return=W,Q;case T:return F=Mu(F,W.mode,Q),F.return=W,F;case Z:return F=ur(F),mt(W,F,Q)}if(_t(F)||lt(F))return F=rr(F,W.mode,Q,null),F.return=W,F;if(typeof F.then=="function")return mt(W,_l(F),Q);if(F.$$typeof===N)return mt(W,dl(W,F),Q);vl(W,F)}return null}function $(W,F,Q,ht){var qt=F!==null?F.key:null;if(typeof Q=="string"&&Q!==""||typeof Q=="number"||typeof Q=="bigint")return qt!==null?null:E(W,F,""+Q,ht);if(typeof Q=="object"&&Q!==null){switch(Q.$$typeof){case M:return Q.key===qt?P(W,F,Q,ht):null;case T:return Q.key===qt?J(W,F,Q,ht):null;case Z:return Q=ur(Q),$(W,F,Q,ht)}if(_t(Q)||lt(Q))return qt!==null?null:ct(W,F,Q,ht,null);if(typeof Q.then=="function")return $(W,F,_l(Q),ht);if(Q.$$typeof===N)return $(W,F,dl(W,Q),ht);vl(W,Q)}return null}function rt(W,F,Q,ht,qt){if(typeof ht=="string"&&ht!==""||typeof ht=="number"||typeof ht=="bigint")return W=W.get(Q)||null,E(F,W,""+ht,qt);if(typeof ht=="object"&&ht!==null){switch(ht.$$typeof){case M:return W=W.get(ht.key===null?Q:ht.key)||null,P(F,W,ht,qt);case T:return W=W.get(ht.key===null?Q:ht.key)||null,J(F,W,ht,qt);case Z:return ht=ur(ht),rt(W,F,Q,ht,qt)}if(_t(ht)||lt(ht))return W=W.get(Q)||null,ct(F,W,ht,qt,null);if(typeof ht.then=="function")return rt(W,F,Q,_l(ht),qt);if(ht.$$typeof===N)return rt(W,F,Q,dl(F,ht),qt);vl(F,ht)}return null}function Bt(W,F,Q,ht){for(var qt=null,Ae=null,Ht=F,oe=F=0,_e=null;Ht!==null&&oe<Q.length;oe++){Ht.index>oe?(_e=Ht,Ht=null):_e=Ht.sibling;var Ce=$(W,Ht,Q[oe],ht);if(Ce===null){Ht===null&&(Ht=_e);break}e&&Ht&&Ce.alternate===null&&n(W,Ht),F=f(Ce,F,oe),Ae===null?qt=Ce:Ae.sibling=Ce,Ae=Ce,Ht=_e}if(oe===Q.length)return a(W,Ht),ye&&qi(W,oe),qt;if(Ht===null){for(;oe<Q.length;oe++)Ht=mt(W,Q[oe],ht),Ht!==null&&(F=f(Ht,F,oe),Ae===null?qt=Ht:Ae.sibling=Ht,Ae=Ht);return ye&&qi(W,oe),qt}for(Ht=s(Ht);oe<Q.length;oe++)_e=rt(Ht,W,oe,Q[oe],ht),_e!==null&&(e&&_e.alternate!==null&&Ht.delete(_e.key===null?oe:_e.key),F=f(_e,F,oe),Ae===null?qt=_e:Ae.sibling=_e,Ae=_e);return e&&Ht.forEach(function(Ha){return n(W,Ha)}),ye&&qi(W,oe),qt}function Qt(W,F,Q,ht){if(Q==null)throw Error(r(151));for(var qt=null,Ae=null,Ht=F,oe=F=0,_e=null,Ce=Q.next();Ht!==null&&!Ce.done;oe++,Ce=Q.next()){Ht.index>oe?(_e=Ht,Ht=null):_e=Ht.sibling;var Ha=$(W,Ht,Ce.value,ht);if(Ha===null){Ht===null&&(Ht=_e);break}e&&Ht&&Ha.alternate===null&&n(W,Ht),F=f(Ha,F,oe),Ae===null?qt=Ha:Ae.sibling=Ha,Ae=Ha,Ht=_e}if(Ce.done)return a(W,Ht),ye&&qi(W,oe),qt;if(Ht===null){for(;!Ce.done;oe++,Ce=Q.next())Ce=mt(W,Ce.value,ht),Ce!==null&&(F=f(Ce,F,oe),Ae===null?qt=Ce:Ae.sibling=Ce,Ae=Ce);return ye&&qi(W,oe),qt}for(Ht=s(Ht);!Ce.done;oe++,Ce=Q.next())Ce=rt(Ht,W,oe,Ce.value,ht),Ce!==null&&(e&&Ce.alternate!==null&&Ht.delete(Ce.key===null?oe:Ce.key),F=f(Ce,F,oe),Ae===null?qt=Ce:Ae.sibling=Ce,Ae=Ce);return e&&Ht.forEach(function(Dy){return n(W,Dy)}),ye&&qi(W,oe),qt}function Be(W,F,Q,ht){if(typeof Q=="object"&&Q!==null&&Q.type===C&&Q.key===null&&(Q=Q.props.children),typeof Q=="object"&&Q!==null){switch(Q.$$typeof){case M:t:{for(var qt=Q.key;F!==null;){if(F.key===qt){if(qt=Q.type,qt===C){if(F.tag===7){a(W,F.sibling),ht=u(F,Q.props.children),ht.return=W,W=ht;break t}}else if(F.elementType===qt||typeof qt=="object"&&qt!==null&&qt.$$typeof===Z&&ur(qt)===F.type){a(W,F.sibling),ht=u(F,Q.props),ro(ht,Q),ht.return=W,W=ht;break t}a(W,F);break}else n(W,F);F=F.sibling}Q.type===C?(ht=rr(Q.props.children,W.mode,ht,Q.key),ht.return=W,W=ht):(ht=ul(Q.type,Q.key,Q.props,null,W.mode,ht),ro(ht,Q),ht.return=W,W=ht)}return _(W);case T:t:{for(qt=Q.key;F!==null;){if(F.key===qt)if(F.tag===4&&F.stateNode.containerInfo===Q.containerInfo&&F.stateNode.implementation===Q.implementation){a(W,F.sibling),ht=u(F,Q.children||[]),ht.return=W,W=ht;break t}else{a(W,F);break}else n(W,F);F=F.sibling}ht=Mu(Q,W.mode,ht),ht.return=W,W=ht}return _(W);case Z:return Q=ur(Q),Be(W,F,Q,ht)}if(_t(Q))return Bt(W,F,Q,ht);if(lt(Q)){if(qt=lt(Q),typeof qt!="function")throw Error(r(150));return Q=qt.call(Q),Qt(W,F,Q,ht)}if(typeof Q.then=="function")return Be(W,F,_l(Q),ht);if(Q.$$typeof===N)return Be(W,F,dl(W,Q),ht);vl(W,Q)}return typeof Q=="string"&&Q!==""||typeof Q=="number"||typeof Q=="bigint"?(Q=""+Q,F!==null&&F.tag===6?(a(W,F.sibling),ht=u(F,Q),ht.return=W,W=ht):(a(W,F),ht=xu(Q,W.mode,ht),ht.return=W,W=ht),_(W)):a(W,F)}return function(W,F,Q,ht){try{ao=0;var qt=Be(W,F,Q,ht);return Kr=null,qt}catch(Ht){if(Ht===Zr||Ht===ml)throw Ht;var Ae=Qn(29,Ht,null,W.mode);return Ae.lanes=ht,Ae.return=W,Ae}finally{}}}var hr=Hp(!0),Gp=Hp(!1),Ea=!1;function Ou(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Pu(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ba(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ta(e,n,a){var s=e.updateQueue;if(s===null)return null;if(s=s.shared,(we&2)!==0){var u=s.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),s.pending=n,n=cl(e),bp(e,null,a),n}return ll(e,s,n,a),cl(e)}function so(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var s=n.lanes;s&=e.pendingLanes,a|=s,n.lanes=a,Gs(e,a)}}function Iu(e,n){var a=e.updateQueue,s=e.alternate;if(s!==null&&(s=s.updateQueue,a===s)){var u=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var _={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?u=f=_:f=f.next=_,a=a.next}while(a!==null);f===null?u=f=n:f=f.next=n}else u=f=n;a={baseState:s.baseState,firstBaseUpdate:u,lastBaseUpdate:f,shared:s.shared,callbacks:s.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var zu=!1;function oo(){if(zu){var e=jr;if(e!==null)throw e}}function lo(e,n,a,s){zu=!1;var u=e.updateQueue;Ea=!1;var f=u.firstBaseUpdate,_=u.lastBaseUpdate,E=u.shared.pending;if(E!==null){u.shared.pending=null;var P=E,J=P.next;P.next=null,_===null?f=J:_.next=J,_=P;var ct=e.alternate;ct!==null&&(ct=ct.updateQueue,E=ct.lastBaseUpdate,E!==_&&(E===null?ct.firstBaseUpdate=J:E.next=J,ct.lastBaseUpdate=P))}if(f!==null){var mt=u.baseState;_=0,ct=J=P=null,E=f;do{var $=E.lane&-536870913,rt=$!==E.lane;if(rt?(ge&$)===$:(s&$)===$){$!==0&&$===Yr&&(zu=!0),ct!==null&&(ct=ct.next={lane:0,tag:E.tag,payload:E.payload,callback:null,next:null});t:{var Bt=e,Qt=E;$=n;var Be=a;switch(Qt.tag){case 1:if(Bt=Qt.payload,typeof Bt=="function"){mt=Bt.call(Be,mt,$);break t}mt=Bt;break t;case 3:Bt.flags=Bt.flags&-65537|128;case 0:if(Bt=Qt.payload,$=typeof Bt=="function"?Bt.call(Be,mt,$):Bt,$==null)break t;mt=v({},mt,$);break t;case 2:Ea=!0}}$=E.callback,$!==null&&(e.flags|=64,rt&&(e.flags|=8192),rt=u.callbacks,rt===null?u.callbacks=[$]:rt.push($))}else rt={lane:$,tag:E.tag,payload:E.payload,callback:E.callback,next:null},ct===null?(J=ct=rt,P=mt):ct=ct.next=rt,_|=$;if(E=E.next,E===null){if(E=u.shared.pending,E===null)break;rt=E,E=rt.next,rt.next=null,u.lastBaseUpdate=rt,u.shared.pending=null}}while(!0);ct===null&&(P=mt),u.baseState=P,u.firstBaseUpdate=J,u.lastBaseUpdate=ct,f===null&&(u.shared.lanes=0),Da|=_,e.lanes=_,e.memoizedState=mt}}function Vp(e,n){if(typeof e!="function")throw Error(r(191,e));e.call(n)}function kp(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)Vp(a[e],n)}var Qr=L(null),Sl=L(0);function Xp(e,n){e=ia,yt(Sl,e),yt(Qr,n),ia=e|n.baseLanes}function Bu(){yt(Sl,ia),yt(Qr,Qr.current)}function Fu(){ia=Sl.current,et(Qr),et(Sl)}var Jn=L(null),fi=null;function Aa(e){var n=e.alternate;yt(an,an.current&1),yt(Jn,e),fi===null&&(n===null||Qr.current!==null||n.memoizedState!==null)&&(fi=e)}function Hu(e){yt(an,an.current),yt(Jn,e),fi===null&&(fi=e)}function Wp(e){e.tag===22?(yt(an,an.current),yt(Jn,e),fi===null&&(fi=e)):Ca()}function Ca(){yt(an,an.current),yt(Jn,Jn.current)}function $n(e){et(Jn),fi===e&&(fi=null),et(an)}var an=L(0);function yl(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Yf(a)||jf(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var Zi=0,se=null,Ie=null,on=null,xl=!1,Jr=!1,dr=!1,Ml=0,co=0,$r=null,yS=0;function $e(){throw Error(r(321))}function Gu(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!Kn(e[a],n[a]))return!1;return!0}function Vu(e,n,a,s,u,f){return Zi=f,se=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,O.H=e===null||e.memoizedState===null?Rm:af,dr=!1,f=a(s,u),dr=!1,Jr&&(f=Yp(n,a,s,u)),qp(e),f}function qp(e){O.H=ho;var n=Ie!==null&&Ie.next!==null;if(Zi=0,on=Ie=se=null,xl=!1,co=0,$r=null,n)throw Error(r(300));e===null||ln||(e=e.dependencies,e!==null&&hl(e)&&(ln=!0))}function Yp(e,n,a,s){se=e;var u=0;do{if(Jr&&($r=null),co=0,Jr=!1,25<=u)throw Error(r(301));if(u+=1,on=Ie=null,e.updateQueue!=null){var f=e.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}O.H=wm,f=n(a,s)}while(Jr);return f}function xS(){var e=O.H,n=e.useState()[0];return n=typeof n.then=="function"?uo(n):n,e=e.useState()[0],(Ie!==null?Ie.memoizedState:null)!==e&&(se.flags|=1024),n}function ku(){var e=Ml!==0;return Ml=0,e}function Xu(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function Wu(e){if(xl){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}xl=!1}Zi=0,on=Ie=se=null,Jr=!1,co=Ml=0,$r=null}function zn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return on===null?se.memoizedState=on=e:on=on.next=e,on}function rn(){if(Ie===null){var e=se.alternate;e=e!==null?e.memoizedState:null}else e=Ie.next;var n=on===null?se.memoizedState:on.next;if(n!==null)on=n,Ie=e;else{if(e===null)throw se.alternate===null?Error(r(467)):Error(r(310));Ie=e,e={memoizedState:Ie.memoizedState,baseState:Ie.baseState,baseQueue:Ie.baseQueue,queue:Ie.queue,next:null},on===null?se.memoizedState=on=e:on=on.next=e}return on}function El(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function uo(e){var n=co;return co+=1,$r===null&&($r=[]),e=zp($r,e,n),n=se,(on===null?n.memoizedState:on.next)===null&&(n=n.alternate,O.H=n===null||n.memoizedState===null?Rm:af),e}function bl(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return uo(e);if(e.$$typeof===N)return Tn(e)}throw Error(r(438,String(e)))}function qu(e){var n=null,a=se.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var s=se.alternate;s!==null&&(s=s.updateQueue,s!==null&&(s=s.memoCache,s!=null&&(n={data:s.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=El(),se.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),s=0;s<e;s++)a[s]=R;return n.index++,a}function Ki(e,n){return typeof n=="function"?n(e):n}function Tl(e){var n=rn();return Yu(n,Ie,e)}function Yu(e,n,a){var s=e.queue;if(s===null)throw Error(r(311));s.lastRenderedReducer=a;var u=e.baseQueue,f=s.pending;if(f!==null){if(u!==null){var _=u.next;u.next=f.next,f.next=_}n.baseQueue=u=f,s.pending=null}if(f=e.baseState,u===null)e.memoizedState=f;else{n=u.next;var E=_=null,P=null,J=n,ct=!1;do{var mt=J.lane&-536870913;if(mt!==J.lane?(ge&mt)===mt:(Zi&mt)===mt){var $=J.revertLane;if($===0)P!==null&&(P=P.next={lane:0,revertLane:0,gesture:null,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null}),mt===Yr&&(ct=!0);else if((Zi&$)===$){J=J.next,$===Yr&&(ct=!0);continue}else mt={lane:0,revertLane:J.revertLane,gesture:null,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null},P===null?(E=P=mt,_=f):P=P.next=mt,se.lanes|=$,Da|=$;mt=J.action,dr&&a(f,mt),f=J.hasEagerState?J.eagerState:a(f,mt)}else $={lane:mt,revertLane:J.revertLane,gesture:J.gesture,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null},P===null?(E=P=$,_=f):P=P.next=$,se.lanes|=mt,Da|=mt;J=J.next}while(J!==null&&J!==n);if(P===null?_=f:P.next=E,!Kn(f,e.memoizedState)&&(ln=!0,ct&&(a=jr,a!==null)))throw a;e.memoizedState=f,e.baseState=_,e.baseQueue=P,s.lastRenderedState=f}return u===null&&(s.lanes=0),[e.memoizedState,s.dispatch]}function ju(e){var n=rn(),a=n.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=e;var s=a.dispatch,u=a.pending,f=n.memoizedState;if(u!==null){a.pending=null;var _=u=u.next;do f=e(f,_.action),_=_.next;while(_!==u);Kn(f,n.memoizedState)||(ln=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,s]}function jp(e,n,a){var s=se,u=rn(),f=ye;if(f){if(a===void 0)throw Error(r(407));a=a()}else a=n();var _=!Kn((Ie||u).memoizedState,a);if(_&&(u.memoizedState=a,ln=!0),u=u.queue,Qu(Qp.bind(null,s,u,e),[e]),u.getSnapshot!==n||_||on!==null&&on.memoizedState.tag&1){if(s.flags|=2048,ts(9,{destroy:void 0},Kp.bind(null,s,u,a,n),null),Ge===null)throw Error(r(349));f||(Zi&127)!==0||Zp(s,n,a)}return a}function Zp(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=se.updateQueue,n===null?(n=El(),se.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function Kp(e,n,a,s){n.value=a,n.getSnapshot=s,Jp(n)&&$p(e)}function Qp(e,n,a){return a(function(){Jp(n)&&$p(e)})}function Jp(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!Kn(e,a)}catch{return!0}}function $p(e){var n=ar(e,2);n!==null&&qn(n,e,2)}function Zu(e){var n=zn();if(typeof e=="function"){var a=e;if(e=a(),dr){Ot(!0);try{a()}finally{Ot(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ki,lastRenderedState:e},n}function tm(e,n,a,s){return e.baseState=a,Yu(e,Ie,typeof s=="function"?s:Ki)}function MS(e,n,a,s,u){if(Rl(e))throw Error(r(485));if(e=n.action,e!==null){var f={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(_){f.listeners.push(_)}};O.T!==null?a(!0):f.isTransition=!1,s(f),a=n.pending,a===null?(f.next=n.pending=f,em(n,f)):(f.next=a.next,n.pending=a.next=f)}}function em(e,n){var a=n.action,s=n.payload,u=e.state;if(n.isTransition){var f=O.T,_={};O.T=_;try{var E=a(u,s),P=O.S;P!==null&&P(_,E),nm(e,n,E)}catch(J){Ku(e,n,J)}finally{f!==null&&_.types!==null&&(f.types=_.types),O.T=f}}else try{f=a(u,s),nm(e,n,f)}catch(J){Ku(e,n,J)}}function nm(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(s){im(e,n,s)},function(s){return Ku(e,n,s)}):im(e,n,a)}function im(e,n,a){n.status="fulfilled",n.value=a,am(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,em(e,a)))}function Ku(e,n,a){var s=e.pending;if(e.pending=null,s!==null){s=s.next;do n.status="rejected",n.reason=a,am(n),n=n.next;while(n!==s)}e.action=null}function am(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function rm(e,n){return n}function sm(e,n){if(ye){var a=Ge.formState;if(a!==null){t:{var s=se;if(ye){if(Xe){e:{for(var u=Xe,f=ui;u.nodeType!==8;){if(!f){u=null;break e}if(u=hi(u.nextSibling),u===null){u=null;break e}}f=u.data,u=f==="F!"||f==="F"?u:null}if(u){Xe=hi(u.nextSibling),s=u.data==="F!";break t}}xa(s)}s=!1}s&&(n=a[0])}}return a=zn(),a.memoizedState=a.baseState=n,s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:rm,lastRenderedState:n},a.queue=s,a=Tm.bind(null,se,s),s.dispatch=a,s=Zu(!1),f=nf.bind(null,se,!1,s.queue),s=zn(),u={state:n,dispatch:null,action:e,pending:null},s.queue=u,a=MS.bind(null,se,u,f,a),u.dispatch=a,s.memoizedState=e,[n,a,!1]}function om(e){var n=rn();return lm(n,Ie,e)}function lm(e,n,a){if(n=Yu(e,n,rm)[0],e=Tl(Ki)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var s=uo(n)}catch(_){throw _===Zr?ml:_}else s=n;n=rn();var u=n.queue,f=u.dispatch;return a!==n.memoizedState&&(se.flags|=2048,ts(9,{destroy:void 0},ES.bind(null,u,a),null)),[s,f,e]}function ES(e,n){e.action=n}function cm(e){var n=rn(),a=Ie;if(a!==null)return lm(n,a,e);rn(),n=n.memoizedState,a=rn();var s=a.queue.dispatch;return a.memoizedState=e,[n,s,!1]}function ts(e,n,a,s){return e={tag:e,create:a,deps:s,inst:n,next:null},n=se.updateQueue,n===null&&(n=El(),se.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(s=a.next,a.next=e,e.next=s,n.lastEffect=e),e}function um(){return rn().memoizedState}function Al(e,n,a,s){var u=zn();se.flags|=e,u.memoizedState=ts(1|n,{destroy:void 0},a,s===void 0?null:s)}function Cl(e,n,a,s){var u=rn();s=s===void 0?null:s;var f=u.memoizedState.inst;Ie!==null&&s!==null&&Gu(s,Ie.memoizedState.deps)?u.memoizedState=ts(n,f,a,s):(se.flags|=e,u.memoizedState=ts(1|n,f,a,s))}function fm(e,n){Al(8390656,8,e,n)}function Qu(e,n){Cl(2048,8,e,n)}function bS(e){se.flags|=4;var n=se.updateQueue;if(n===null)n=El(),se.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function hm(e){var n=rn().memoizedState;return bS({ref:n,nextImpl:e}),function(){if((we&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}function dm(e,n){return Cl(4,2,e,n)}function pm(e,n){return Cl(4,4,e,n)}function mm(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function gm(e,n,a){a=a!=null?a.concat([e]):null,Cl(4,4,mm.bind(null,n,e),a)}function Ju(){}function _m(e,n){var a=rn();n=n===void 0?null:n;var s=a.memoizedState;return n!==null&&Gu(n,s[1])?s[0]:(a.memoizedState=[e,n],e)}function vm(e,n){var a=rn();n=n===void 0?null:n;var s=a.memoizedState;if(n!==null&&Gu(n,s[1]))return s[0];if(s=e(),dr){Ot(!0);try{e()}finally{Ot(!1)}}return a.memoizedState=[s,n],s}function $u(e,n,a){return a===void 0||(Zi&1073741824)!==0&&(ge&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=Sg(),se.lanes|=e,Da|=e,a)}function Sm(e,n,a,s){return Kn(a,n)?a:Qr.current!==null?(e=$u(e,a,s),Kn(e,n)||(ln=!0),e):(Zi&42)===0||(Zi&1073741824)!==0&&(ge&261930)===0?(ln=!0,e.memoizedState=a):(e=Sg(),se.lanes|=e,Da|=e,n)}function ym(e,n,a,s,u){var f=j.p;j.p=f!==0&&8>f?f:8;var _=O.T,E={};O.T=E,nf(e,!1,n,a);try{var P=u(),J=O.S;if(J!==null&&J(E,P),P!==null&&typeof P=="object"&&typeof P.then=="function"){var ct=SS(P,s);fo(e,n,ct,ni(e))}else fo(e,n,s,ni(e))}catch(mt){fo(e,n,{then:function(){},status:"rejected",reason:mt},ni())}finally{j.p=f,_!==null&&E.types!==null&&(_.types=E.types),O.T=_}}function TS(){}function tf(e,n,a,s){if(e.tag!==5)throw Error(r(476));var u=xm(e).queue;ym(e,u,n,Y,a===null?TS:function(){return Mm(e),a(s)})}function xm(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:Y,baseState:Y,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ki,lastRenderedState:Y},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ki,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function Mm(e){var n=xm(e);n.next===null&&(n=e.alternate.memoizedState),fo(e,n.next.queue,{},ni())}function ef(){return Tn(wo)}function Em(){return rn().memoizedState}function bm(){return rn().memoizedState}function AS(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=ni();e=ba(a);var s=Ta(n,e,a);s!==null&&(qn(s,n,a),so(s,n,a)),n={cache:Du()},e.payload=n;return}n=n.return}}function CS(e,n,a){var s=ni();a={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Rl(e)?Am(n,a):(a=Su(e,n,a,s),a!==null&&(qn(a,e,s),Cm(a,n,s)))}function Tm(e,n,a){var s=ni();fo(e,n,a,s)}function fo(e,n,a,s){var u={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Rl(e))Am(n,u);else{var f=e.alternate;if(e.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var _=n.lastRenderedState,E=f(_,a);if(u.hasEagerState=!0,u.eagerState=E,Kn(E,_))return ll(e,n,u,0),Ge===null&&ol(),!1}catch{}finally{}if(a=Su(e,n,u,s),a!==null)return qn(a,e,s),Cm(a,n,s),!0}return!1}function nf(e,n,a,s){if(s={lane:2,revertLane:Pf(),gesture:null,action:s,hasEagerState:!1,eagerState:null,next:null},Rl(e)){if(n)throw Error(r(479))}else n=Su(e,a,s,2),n!==null&&qn(n,e,2)}function Rl(e){var n=e.alternate;return e===se||n!==null&&n===se}function Am(e,n){Jr=xl=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function Cm(e,n,a){if((a&4194048)!==0){var s=n.lanes;s&=e.pendingLanes,a|=s,n.lanes=a,Gs(e,a)}}var ho={readContext:Tn,use:bl,useCallback:$e,useContext:$e,useEffect:$e,useImperativeHandle:$e,useLayoutEffect:$e,useInsertionEffect:$e,useMemo:$e,useReducer:$e,useRef:$e,useState:$e,useDebugValue:$e,useDeferredValue:$e,useTransition:$e,useSyncExternalStore:$e,useId:$e,useHostTransitionStatus:$e,useFormState:$e,useActionState:$e,useOptimistic:$e,useMemoCache:$e,useCacheRefresh:$e};ho.useEffectEvent=$e;var Rm={readContext:Tn,use:bl,useCallback:function(e,n){return zn().memoizedState=[e,n===void 0?null:n],e},useContext:Tn,useEffect:fm,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,Al(4194308,4,mm.bind(null,n,e),a)},useLayoutEffect:function(e,n){return Al(4194308,4,e,n)},useInsertionEffect:function(e,n){Al(4,2,e,n)},useMemo:function(e,n){var a=zn();n=n===void 0?null:n;var s=e();if(dr){Ot(!0);try{e()}finally{Ot(!1)}}return a.memoizedState=[s,n],s},useReducer:function(e,n,a){var s=zn();if(a!==void 0){var u=a(n);if(dr){Ot(!0);try{a(n)}finally{Ot(!1)}}}else u=n;return s.memoizedState=s.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},s.queue=e,e=e.dispatch=CS.bind(null,se,e),[s.memoizedState,e]},useRef:function(e){var n=zn();return e={current:e},n.memoizedState=e},useState:function(e){e=Zu(e);var n=e.queue,a=Tm.bind(null,se,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:Ju,useDeferredValue:function(e,n){var a=zn();return $u(a,e,n)},useTransition:function(){var e=Zu(!1);return e=ym.bind(null,se,e.queue,!0,!1),zn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var s=se,u=zn();if(ye){if(a===void 0)throw Error(r(407));a=a()}else{if(a=n(),Ge===null)throw Error(r(349));(ge&127)!==0||Zp(s,n,a)}u.memoizedState=a;var f={value:a,getSnapshot:n};return u.queue=f,fm(Qp.bind(null,s,f,e),[e]),s.flags|=2048,ts(9,{destroy:void 0},Kp.bind(null,s,f,a,n),null),a},useId:function(){var e=zn(),n=Ge.identifierPrefix;if(ye){var a=Oi,s=Ni;a=(s&~(1<<32-$t(s)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Ml++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=yS++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:ef,useFormState:sm,useActionState:sm,useOptimistic:function(e){var n=zn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=nf.bind(null,se,!0,a),a.dispatch=n,[e,n]},useMemoCache:qu,useCacheRefresh:function(){return zn().memoizedState=AS.bind(null,se)},useEffectEvent:function(e){var n=zn(),a={impl:e};return n.memoizedState=a,function(){if((we&2)!==0)throw Error(r(440));return a.impl.apply(void 0,arguments)}}},af={readContext:Tn,use:bl,useCallback:_m,useContext:Tn,useEffect:Qu,useImperativeHandle:gm,useInsertionEffect:dm,useLayoutEffect:pm,useMemo:vm,useReducer:Tl,useRef:um,useState:function(){return Tl(Ki)},useDebugValue:Ju,useDeferredValue:function(e,n){var a=rn();return Sm(a,Ie.memoizedState,e,n)},useTransition:function(){var e=Tl(Ki)[0],n=rn().memoizedState;return[typeof e=="boolean"?e:uo(e),n]},useSyncExternalStore:jp,useId:Em,useHostTransitionStatus:ef,useFormState:om,useActionState:om,useOptimistic:function(e,n){var a=rn();return tm(a,Ie,e,n)},useMemoCache:qu,useCacheRefresh:bm};af.useEffectEvent=hm;var wm={readContext:Tn,use:bl,useCallback:_m,useContext:Tn,useEffect:Qu,useImperativeHandle:gm,useInsertionEffect:dm,useLayoutEffect:pm,useMemo:vm,useReducer:ju,useRef:um,useState:function(){return ju(Ki)},useDebugValue:Ju,useDeferredValue:function(e,n){var a=rn();return Ie===null?$u(a,e,n):Sm(a,Ie.memoizedState,e,n)},useTransition:function(){var e=ju(Ki)[0],n=rn().memoizedState;return[typeof e=="boolean"?e:uo(e),n]},useSyncExternalStore:jp,useId:Em,useHostTransitionStatus:ef,useFormState:cm,useActionState:cm,useOptimistic:function(e,n){var a=rn();return Ie!==null?tm(a,Ie,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:qu,useCacheRefresh:bm};wm.useEffectEvent=hm;function rf(e,n,a,s){n=e.memoizedState,a=a(s,n),a=a==null?n:v({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var sf={enqueueSetState:function(e,n,a){e=e._reactInternals;var s=ni(),u=ba(s);u.payload=n,a!=null&&(u.callback=a),n=Ta(e,u,s),n!==null&&(qn(n,e,s),so(n,e,s))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var s=ni(),u=ba(s);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Ta(e,u,s),n!==null&&(qn(n,e,s),so(n,e,s))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=ni(),s=ba(a);s.tag=2,n!=null&&(s.callback=n),n=Ta(e,s,a),n!==null&&(qn(n,e,a),so(n,e,a))}};function Dm(e,n,a,s,u,f,_){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(s,f,_):n.prototype&&n.prototype.isPureReactComponent?!Js(a,s)||!Js(u,f):!0}function Um(e,n,a,s){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,s),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,s),n.state!==e&&sf.enqueueReplaceState(n,n.state,null)}function pr(e,n){var a=n;if("ref"in n){a={};for(var s in n)s!=="ref"&&(a[s]=n[s])}if(e=e.defaultProps){a===n&&(a=v({},a));for(var u in e)a[u]===void 0&&(a[u]=e[u])}return a}function Lm(e){sl(e)}function Nm(e){console.error(e)}function Om(e){sl(e)}function wl(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(s){setTimeout(function(){throw s})}}function Pm(e,n,a){try{var s=e.onCaughtError;s(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function of(e,n,a){return a=ba(a),a.tag=3,a.payload={element:null},a.callback=function(){wl(e,n)},a}function Im(e){return e=ba(e),e.tag=3,e}function zm(e,n,a,s){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var f=s.value;e.payload=function(){return u(f)},e.callback=function(){Pm(n,a,s)}}var _=a.stateNode;_!==null&&typeof _.componentDidCatch=="function"&&(e.callback=function(){Pm(n,a,s),typeof u!="function"&&(Ua===null?Ua=new Set([this]):Ua.add(this));var E=s.stack;this.componentDidCatch(s.value,{componentStack:E!==null?E:""})})}function RS(e,n,a,s,u){if(a.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){if(n=a.alternate,n!==null&&qr(n,a,u,!0),a=Jn.current,a!==null){switch(a.tag){case 31:case 13:return fi===null?Gl():a.alternate===null&&tn===0&&(tn=3),a.flags&=-257,a.flags|=65536,a.lanes=u,s===gl?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([s]):n.add(s),Lf(e,s,u)),!1;case 22:return a.flags|=65536,s===gl?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([s])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([s]):a.add(s)),Lf(e,s,u)),!1}throw Error(r(435,a.tag))}return Lf(e,s,u),Gl(),!1}if(ye)return n=Jn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,s!==Tu&&(e=Error(r(422),{cause:s}),eo(oi(e,a)))):(s!==Tu&&(n=Error(r(423),{cause:s}),eo(oi(n,a))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,s=oi(s,a),u=of(e.stateNode,s,u),Iu(e,u),tn!==4&&(tn=2)),!1;var f=Error(r(520),{cause:s});if(f=oi(f,a),xo===null?xo=[f]:xo.push(f),tn!==4&&(tn=2),n===null)return!0;s=oi(s,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=u&-u,a.lanes|=e,e=of(a.stateNode,s,e),Iu(a,e),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(Ua===null||!Ua.has(f))))return a.flags|=65536,u&=-u,a.lanes|=u,u=Im(u),zm(u,e,a,s),Iu(a,u),!1}a=a.return}while(a!==null);return!1}var lf=Error(r(461)),ln=!1;function An(e,n,a,s){n.child=e===null?Gp(n,null,a,s):hr(n,e.child,a,s)}function Bm(e,n,a,s,u){a=a.render;var f=n.ref;if("ref"in s){var _={};for(var E in s)E!=="ref"&&(_[E]=s[E])}else _=s;return lr(n),s=Vu(e,n,a,_,f,u),E=ku(),e!==null&&!ln?(Xu(e,n,u),Qi(e,n,u)):(ye&&E&&Eu(n),n.flags|=1,An(e,n,s,u),n.child)}function Fm(e,n,a,s,u){if(e===null){var f=a.type;return typeof f=="function"&&!yu(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,Hm(e,n,f,s,u)):(e=ul(a.type,null,s,n,n.mode,u),e.ref=n.ref,e.return=n,n.child=e)}if(f=e.child,!gf(e,u)){var _=f.memoizedProps;if(a=a.compare,a=a!==null?a:Js,a(_,s)&&e.ref===n.ref)return Qi(e,n,u)}return n.flags|=1,e=Wi(f,s),e.ref=n.ref,e.return=n,n.child=e}function Hm(e,n,a,s,u){if(e!==null){var f=e.memoizedProps;if(Js(f,s)&&e.ref===n.ref)if(ln=!1,n.pendingProps=s=f,gf(e,u))(e.flags&131072)!==0&&(ln=!0);else return n.lanes=e.lanes,Qi(e,n,u)}return cf(e,n,a,s,u)}function Gm(e,n,a,s){var u=s.children,f=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),s.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,e!==null){for(s=n.child=e.child,u=0;s!==null;)u=u|s.lanes|s.childLanes,s=s.sibling;s=u&~f}else s=0,n.child=null;return Vm(e,n,f,a,s)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&pl(n,f!==null?f.cachePool:null),f!==null?Xp(n,f):Bu(),Wp(n);else return s=n.lanes=536870912,Vm(e,n,f!==null?f.baseLanes|a:a,a,s)}else f!==null?(pl(n,f.cachePool),Xp(n,f),Ca(),n.memoizedState=null):(e!==null&&pl(n,null),Bu(),Ca());return An(e,n,u,a),n.child}function po(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function Vm(e,n,a,s,u){var f=Lu();return f=f===null?null:{parent:sn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},e!==null&&pl(n,null),Bu(),Wp(n),e!==null&&qr(e,n,s,!0),n.childLanes=u,null}function Dl(e,n){return n=Ll({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function km(e,n,a){return hr(n,e.child,null,a),e=Dl(n,n.pendingProps),e.flags|=2,$n(n),n.memoizedState=null,e}function wS(e,n,a){var s=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(ye){if(s.mode==="hidden")return e=Dl(n,s),n.lanes=536870912,po(null,e);if(Hu(n),(e=Xe)?(e=e_(e,ui),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Sa!==null?{id:Ni,overflow:Oi}:null,retryLane:536870912,hydrationErrors:null},a=Ap(e),a.return=n,n.child=a,bn=n,Xe=null)):e=null,e===null)throw xa(n);return n.lanes=536870912,null}return Dl(n,s)}var f=e.memoizedState;if(f!==null){var _=f.dehydrated;if(Hu(n),u)if(n.flags&256)n.flags&=-257,n=km(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(r(558));else if(ln||qr(e,n,a,!1),u=(a&e.childLanes)!==0,ln||u){if(s=Ge,s!==null&&(_=Li(s,a),_!==0&&_!==f.retryLane))throw f.retryLane=_,ar(e,_),qn(s,e,_),lf;Gl(),n=km(e,n,a)}else e=f.treeContext,Xe=hi(_.nextSibling),bn=n,ye=!0,ya=null,ui=!1,e!==null&&wp(n,e),n=Dl(n,s),n.flags|=4096;return n}return e=Wi(e.child,{mode:s.mode,children:s.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Ul(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function cf(e,n,a,s,u){return lr(n),a=Vu(e,n,a,s,void 0,u),s=ku(),e!==null&&!ln?(Xu(e,n,u),Qi(e,n,u)):(ye&&s&&Eu(n),n.flags|=1,An(e,n,a,u),n.child)}function Xm(e,n,a,s,u,f){return lr(n),n.updateQueue=null,a=Yp(n,s,a,u),qp(e),s=ku(),e!==null&&!ln?(Xu(e,n,f),Qi(e,n,f)):(ye&&s&&Eu(n),n.flags|=1,An(e,n,a,f),n.child)}function Wm(e,n,a,s,u){if(lr(n),n.stateNode===null){var f=Vr,_=a.contextType;typeof _=="object"&&_!==null&&(f=Tn(_)),f=new a(s,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=sf,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=s,f.state=n.memoizedState,f.refs={},Ou(n),_=a.contextType,f.context=typeof _=="object"&&_!==null?Tn(_):Vr,f.state=n.memoizedState,_=a.getDerivedStateFromProps,typeof _=="function"&&(rf(n,a,_,s),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(_=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),_!==f.state&&sf.enqueueReplaceState(f,f.state,null),lo(n,s,f,u),oo(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!0}else if(e===null){f=n.stateNode;var E=n.memoizedProps,P=pr(a,E);f.props=P;var J=f.context,ct=a.contextType;_=Vr,typeof ct=="object"&&ct!==null&&(_=Tn(ct));var mt=a.getDerivedStateFromProps;ct=typeof mt=="function"||typeof f.getSnapshotBeforeUpdate=="function",E=n.pendingProps!==E,ct||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(E||J!==_)&&Um(n,f,s,_),Ea=!1;var $=n.memoizedState;f.state=$,lo(n,s,f,u),oo(),J=n.memoizedState,E||$!==J||Ea?(typeof mt=="function"&&(rf(n,a,mt,s),J=n.memoizedState),(P=Ea||Dm(n,a,P,s,$,J,_))?(ct||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=s,n.memoizedState=J),f.props=s,f.state=J,f.context=_,s=P):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!1)}else{f=n.stateNode,Pu(e,n),_=n.memoizedProps,ct=pr(a,_),f.props=ct,mt=n.pendingProps,$=f.context,J=a.contextType,P=Vr,typeof J=="object"&&J!==null&&(P=Tn(J)),E=a.getDerivedStateFromProps,(J=typeof E=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(_!==mt||$!==P)&&Um(n,f,s,P),Ea=!1,$=n.memoizedState,f.state=$,lo(n,s,f,u),oo();var rt=n.memoizedState;_!==mt||$!==rt||Ea||e!==null&&e.dependencies!==null&&hl(e.dependencies)?(typeof E=="function"&&(rf(n,a,E,s),rt=n.memoizedState),(ct=Ea||Dm(n,a,ct,s,$,rt,P)||e!==null&&e.dependencies!==null&&hl(e.dependencies))?(J||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(s,rt,P),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(s,rt,P)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||_===e.memoizedProps&&$===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===e.memoizedProps&&$===e.memoizedState||(n.flags|=1024),n.memoizedProps=s,n.memoizedState=rt),f.props=s,f.state=rt,f.context=P,s=ct):(typeof f.componentDidUpdate!="function"||_===e.memoizedProps&&$===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||_===e.memoizedProps&&$===e.memoizedState||(n.flags|=1024),s=!1)}return f=s,Ul(e,n),s=(n.flags&128)!==0,f||s?(f=n.stateNode,a=s&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,e!==null&&s?(n.child=hr(n,e.child,null,u),n.child=hr(n,null,a,u)):An(e,n,a,u),n.memoizedState=f.state,e=n.child):e=Qi(e,n,u),e}function qm(e,n,a,s){return sr(),n.flags|=256,An(e,n,a,s),n.child}var uf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function ff(e){return{baseLanes:e,cachePool:Pp()}}function hf(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=ei),e}function Ym(e,n,a){var s=n.pendingProps,u=!1,f=(n.flags&128)!==0,_;if((_=f)||(_=e!==null&&e.memoizedState===null?!1:(an.current&2)!==0),_&&(u=!0,n.flags&=-129),_=(n.flags&32)!==0,n.flags&=-33,e===null){if(ye){if(u?Aa(n):Ca(),(e=Xe)?(e=e_(e,ui),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:Sa!==null?{id:Ni,overflow:Oi}:null,retryLane:536870912,hydrationErrors:null},a=Ap(e),a.return=n,n.child=a,bn=n,Xe=null)):e=null,e===null)throw xa(n);return jf(e)?n.lanes=32:n.lanes=536870912,null}var E=s.children;return s=s.fallback,u?(Ca(),u=n.mode,E=Ll({mode:"hidden",children:E},u),s=rr(s,u,a,null),E.return=n,s.return=n,E.sibling=s,n.child=E,s=n.child,s.memoizedState=ff(a),s.childLanes=hf(e,_,a),n.memoizedState=uf,po(null,s)):(Aa(n),df(n,E))}var P=e.memoizedState;if(P!==null&&(E=P.dehydrated,E!==null)){if(f)n.flags&256?(Aa(n),n.flags&=-257,n=pf(e,n,a)):n.memoizedState!==null?(Ca(),n.child=e.child,n.flags|=128,n=null):(Ca(),E=s.fallback,u=n.mode,s=Ll({mode:"visible",children:s.children},u),E=rr(E,u,a,null),E.flags|=2,s.return=n,E.return=n,s.sibling=E,n.child=s,hr(n,e.child,null,a),s=n.child,s.memoizedState=ff(a),s.childLanes=hf(e,_,a),n.memoizedState=uf,n=po(null,s));else if(Aa(n),jf(E)){if(_=E.nextSibling&&E.nextSibling.dataset,_)var J=_.dgst;_=J,s=Error(r(419)),s.stack="",s.digest=_,eo({value:s,source:null,stack:null}),n=pf(e,n,a)}else if(ln||qr(e,n,a,!1),_=(a&e.childLanes)!==0,ln||_){if(_=Ge,_!==null&&(s=Li(_,a),s!==0&&s!==P.retryLane))throw P.retryLane=s,ar(e,s),qn(_,e,s),lf;Yf(E)||Gl(),n=pf(e,n,a)}else Yf(E)?(n.flags|=192,n.child=e.child,n=null):(e=P.treeContext,Xe=hi(E.nextSibling),bn=n,ye=!0,ya=null,ui=!1,e!==null&&wp(n,e),n=df(n,s.children),n.flags|=4096);return n}return u?(Ca(),E=s.fallback,u=n.mode,P=e.child,J=P.sibling,s=Wi(P,{mode:"hidden",children:s.children}),s.subtreeFlags=P.subtreeFlags&65011712,J!==null?E=Wi(J,E):(E=rr(E,u,a,null),E.flags|=2),E.return=n,s.return=n,s.sibling=E,n.child=s,po(null,s),s=n.child,E=e.child.memoizedState,E===null?E=ff(a):(u=E.cachePool,u!==null?(P=sn._currentValue,u=u.parent!==P?{parent:P,pool:P}:u):u=Pp(),E={baseLanes:E.baseLanes|a,cachePool:u}),s.memoizedState=E,s.childLanes=hf(e,_,a),n.memoizedState=uf,po(e.child,s)):(Aa(n),a=e.child,e=a.sibling,a=Wi(a,{mode:"visible",children:s.children}),a.return=n,a.sibling=null,e!==null&&(_=n.deletions,_===null?(n.deletions=[e],n.flags|=16):_.push(e)),n.child=a,n.memoizedState=null,a)}function df(e,n){return n=Ll({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Ll(e,n){return e=Qn(22,e,null,n),e.lanes=0,e}function pf(e,n,a){return hr(n,e.child,null,a),e=df(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function jm(e,n,a){e.lanes|=n;var s=e.alternate;s!==null&&(s.lanes|=n),Ru(e.return,n,a)}function mf(e,n,a,s,u,f){var _=e.memoizedState;_===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:s,tail:a,tailMode:u,treeForkCount:f}:(_.isBackwards=n,_.rendering=null,_.renderingStartTime=0,_.last=s,_.tail=a,_.tailMode=u,_.treeForkCount=f)}function Zm(e,n,a){var s=n.pendingProps,u=s.revealOrder,f=s.tail;s=s.children;var _=an.current,E=(_&2)!==0;if(E?(_=_&1|2,n.flags|=128):_&=1,yt(an,_),An(e,n,s,a),s=ye?to:0,!E&&e!==null&&(e.flags&128)!==0)t:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&jm(e,a,n);else if(e.tag===19)jm(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break t;for(;e.sibling===null;){if(e.return===null||e.return===n)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)e=a.alternate,e!==null&&yl(e)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),mf(n,!1,u,a,f,s);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(e=u.alternate,e!==null&&yl(e)===null){n.child=u;break}e=u.sibling,u.sibling=a,a=u,u=e}mf(n,!0,a,null,f,s);break;case"together":mf(n,!1,null,null,void 0,s);break;default:n.memoizedState=null}return n.child}function Qi(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),Da|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(qr(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(r(153));if(n.child!==null){for(e=n.child,a=Wi(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=Wi(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function gf(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&hl(e)))}function DS(e,n,a){switch(n.tag){case 3:Ft(n,n.stateNode.containerInfo),Ma(n,sn,e.memoizedState.cache),sr();break;case 27:case 5:Kt(n);break;case 4:Ft(n,n.stateNode.containerInfo);break;case 10:Ma(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Hu(n),null;break;case 13:var s=n.memoizedState;if(s!==null)return s.dehydrated!==null?(Aa(n),n.flags|=128,null):(a&n.child.childLanes)!==0?Ym(e,n,a):(Aa(n),e=Qi(e,n,a),e!==null?e.sibling:null);Aa(n);break;case 19:var u=(e.flags&128)!==0;if(s=(a&n.childLanes)!==0,s||(qr(e,n,a,!1),s=(a&n.childLanes)!==0),u){if(s)return Zm(e,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),yt(an,an.current),s)break;return null;case 22:return n.lanes=0,Gm(e,n,a,n.pendingProps);case 24:Ma(n,sn,e.memoizedState.cache)}return Qi(e,n,a)}function Km(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)ln=!0;else{if(!gf(e,a)&&(n.flags&128)===0)return ln=!1,DS(e,n,a);ln=(e.flags&131072)!==0}else ln=!1,ye&&(n.flags&1048576)!==0&&Rp(n,to,n.index);switch(n.lanes=0,n.tag){case 16:t:{var s=n.pendingProps;if(e=ur(n.elementType),n.type=e,typeof e=="function")yu(e)?(s=pr(e,s),n.tag=1,n=Wm(null,n,e,s,a)):(n.tag=0,n=cf(null,n,e,s,a));else{if(e!=null){var u=e.$$typeof;if(u===D){n.tag=11,n=Bm(null,n,e,s,a);break t}else if(u===I){n.tag=14,n=Fm(null,n,e,s,a);break t}}throw n=gt(e)||e,Error(r(306,n,""))}}return n;case 0:return cf(e,n,n.type,n.pendingProps,a);case 1:return s=n.type,u=pr(s,n.pendingProps),Wm(e,n,s,u,a);case 3:t:{if(Ft(n,n.stateNode.containerInfo),e===null)throw Error(r(387));s=n.pendingProps;var f=n.memoizedState;u=f.element,Pu(e,n),lo(n,s,null,a);var _=n.memoizedState;if(s=_.cache,Ma(n,sn,s),s!==f.cache&&wu(n,[sn],a,!0),oo(),s=_.element,f.isDehydrated)if(f={element:s,isDehydrated:!1,cache:_.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=qm(e,n,s,a);break t}else if(s!==u){u=oi(Error(r(424)),n),eo(u),n=qm(e,n,s,a);break t}else{switch(e=n.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Xe=hi(e.firstChild),bn=n,ye=!0,ya=null,ui=!0,a=Gp(n,null,s,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(sr(),s===u){n=Qi(e,n,a);break t}An(e,n,s,a)}n=n.child}return n;case 26:return Ul(e,n),e===null?(a=o_(n.type,null,n.pendingProps,null))?n.memoizedState=a:ye||(a=n.type,e=n.pendingProps,s=jl(Et.current).createElement(a),s[Qe]=n,s[Mn]=e,Cn(s,a,e),V(s),n.stateNode=s):n.memoizedState=o_(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return Kt(n),e===null&&ye&&(s=n.stateNode=a_(n.type,n.pendingProps,Et.current),bn=n,ui=!0,u=Xe,Pa(n.type)?(Zf=u,Xe=hi(s.firstChild)):Xe=u),An(e,n,n.pendingProps.children,a),Ul(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&ye&&((u=s=Xe)&&(s=sy(s,n.type,n.pendingProps,ui),s!==null?(n.stateNode=s,bn=n,Xe=hi(s.firstChild),ui=!1,u=!0):u=!1),u||xa(n)),Kt(n),u=n.type,f=n.pendingProps,_=e!==null?e.memoizedProps:null,s=f.children,Xf(u,f)?s=null:_!==null&&Xf(u,_)&&(n.flags|=32),n.memoizedState!==null&&(u=Vu(e,n,xS,null,null,a),wo._currentValue=u),Ul(e,n),An(e,n,s,a),n.child;case 6:return e===null&&ye&&((e=a=Xe)&&(a=oy(a,n.pendingProps,ui),a!==null?(n.stateNode=a,bn=n,Xe=null,e=!0):e=!1),e||xa(n)),null;case 13:return Ym(e,n,a);case 4:return Ft(n,n.stateNode.containerInfo),s=n.pendingProps,e===null?n.child=hr(n,null,s,a):An(e,n,s,a),n.child;case 11:return Bm(e,n,n.type,n.pendingProps,a);case 7:return An(e,n,n.pendingProps,a),n.child;case 8:return An(e,n,n.pendingProps.children,a),n.child;case 12:return An(e,n,n.pendingProps.children,a),n.child;case 10:return s=n.pendingProps,Ma(n,n.type,s.value),An(e,n,s.children,a),n.child;case 9:return u=n.type._context,s=n.pendingProps.children,lr(n),u=Tn(u),s=s(u),n.flags|=1,An(e,n,s,a),n.child;case 14:return Fm(e,n,n.type,n.pendingProps,a);case 15:return Hm(e,n,n.type,n.pendingProps,a);case 19:return Zm(e,n,a);case 31:return wS(e,n,a);case 22:return Gm(e,n,a,n.pendingProps);case 24:return lr(n),s=Tn(sn),e===null?(u=Lu(),u===null&&(u=Ge,f=Du(),u.pooledCache=f,f.refCount++,f!==null&&(u.pooledCacheLanes|=a),u=f),n.memoizedState={parent:s,cache:u},Ou(n),Ma(n,sn,u)):((e.lanes&a)!==0&&(Pu(e,n),lo(n,null,null,a),oo()),u=e.memoizedState,f=n.memoizedState,u.parent!==s?(u={parent:s,cache:s},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),Ma(n,sn,s)):(s=f.cache,Ma(n,sn,s),s!==u.cache&&wu(n,[sn],a,!0))),An(e,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(r(156,n.tag))}function Ji(e){e.flags|=4}function _f(e,n,a,s,u){if((n=(e.mode&32)!==0)&&(n=!1),n){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(Eg())e.flags|=8192;else throw fr=gl,Nu}else e.flags&=-16777217}function Qm(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!h_(n))if(Eg())e.flags|=8192;else throw fr=gl,Nu}function Nl(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?hn():536870912,e.lanes|=n,as|=n)}function mo(e,n){if(!ye)switch(e.tailMode){case"hidden":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var s=null;a!==null;)a.alternate!==null&&(s=a),a=a.sibling;s===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:s.sibling=null}}function We(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,s=0;if(n)for(var u=e.child;u!==null;)a|=u.lanes|u.childLanes,s|=u.subtreeFlags&65011712,s|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)a|=u.lanes|u.childLanes,s|=u.subtreeFlags,s|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=s,e.childLanes=a,n}function US(e,n,a){var s=n.pendingProps;switch(bu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return We(n),null;case 1:return We(n),null;case 3:return a=n.stateNode,s=null,e!==null&&(s=e.memoizedState.cache),n.memoizedState.cache!==s&&(n.flags|=2048),ji(sn),jt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Wr(n)?Ji(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Au())),We(n),null;case 26:var u=n.type,f=n.memoizedState;return e===null?(Ji(n),f!==null?(We(n),Qm(n,f)):(We(n),_f(n,u,null,s,a))):f?f!==e.memoizedState?(Ji(n),We(n),Qm(n,f)):(We(n),n.flags&=-16777217):(e=e.memoizedProps,e!==s&&Ji(n),We(n),_f(n,u,e,s,a)),null;case 27:if(Ve(n),a=Et.current,u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==s&&Ji(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return We(n),null}e=q.current,Wr(n)?Dp(n):(e=a_(u,s,a),n.stateNode=e,Ji(n))}return We(n),null;case 5:if(Ve(n),u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==s&&Ji(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return We(n),null}if(f=q.current,Wr(n))Dp(n);else{var _=jl(Et.current);switch(f){case 1:f=_.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:f=_.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":f=_.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":f=_.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":f=_.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof s.is=="string"?_.createElement("select",{is:s.is}):_.createElement("select"),s.multiple?f.multiple=!0:s.size&&(f.size=s.size);break;default:f=typeof s.is=="string"?_.createElement(u,{is:s.is}):_.createElement(u)}}f[Qe]=n,f[Mn]=s;t:for(_=n.child;_!==null;){if(_.tag===5||_.tag===6)f.appendChild(_.stateNode);else if(_.tag!==4&&_.tag!==27&&_.child!==null){_.child.return=_,_=_.child;continue}if(_===n)break t;for(;_.sibling===null;){if(_.return===null||_.return===n)break t;_=_.return}_.sibling.return=_.return,_=_.sibling}n.stateNode=f;t:switch(Cn(f,u,s),u){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break t;case"img":s=!0;break t;default:s=!1}s&&Ji(n)}}return We(n),_f(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==s&&Ji(n);else{if(typeof s!="string"&&n.stateNode===null)throw Error(r(166));if(e=Et.current,Wr(n)){if(e=n.stateNode,a=n.memoizedProps,s=null,u=bn,u!==null)switch(u.tag){case 27:case 5:s=u.memoizedProps}e[Qe]=n,e=!!(e.nodeValue===a||s!==null&&s.suppressHydrationWarning===!0||Yg(e.nodeValue,a)),e||xa(n,!0)}else e=jl(e).createTextNode(s),e[Qe]=n,n.stateNode=e}return We(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(s=Wr(n),a!==null){if(e===null){if(!s)throw Error(r(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(557));e[Qe]=n}else sr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;We(n),e=!1}else a=Au(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?($n(n),n):($n(n),null);if((n.flags&128)!==0)throw Error(r(558))}return We(n),null;case 13:if(s=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=Wr(n),s!==null&&s.dehydrated!==null){if(e===null){if(!u)throw Error(r(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(r(317));u[Qe]=n}else sr(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;We(n),u=!1}else u=Au(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?($n(n),n):($n(n),null)}return $n(n),(n.flags&128)!==0?(n.lanes=a,n):(a=s!==null,e=e!==null&&e.memoizedState!==null,a&&(s=n.child,u=null,s.alternate!==null&&s.alternate.memoizedState!==null&&s.alternate.memoizedState.cachePool!==null&&(u=s.alternate.memoizedState.cachePool.pool),f=null,s.memoizedState!==null&&s.memoizedState.cachePool!==null&&(f=s.memoizedState.cachePool.pool),f!==u&&(s.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),Nl(n,n.updateQueue),We(n),null);case 4:return jt(),e===null&&Ff(n.stateNode.containerInfo),We(n),null;case 10:return ji(n.type),We(n),null;case 19:if(et(an),s=n.memoizedState,s===null)return We(n),null;if(u=(n.flags&128)!==0,f=s.rendering,f===null)if(u)mo(s,!1);else{if(tn!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(f=yl(e),f!==null){for(n.flags|=128,mo(s,!1),e=f.updateQueue,n.updateQueue=e,Nl(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)Tp(a,e),a=a.sibling;return yt(an,an.current&1|2),ye&&qi(n,s.treeForkCount),n.child}e=e.sibling}s.tail!==null&&ft()>Bl&&(n.flags|=128,u=!0,mo(s,!1),n.lanes=4194304)}else{if(!u)if(e=yl(f),e!==null){if(n.flags|=128,u=!0,e=e.updateQueue,n.updateQueue=e,Nl(n,e),mo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!f.alternate&&!ye)return We(n),null}else 2*ft()-s.renderingStartTime>Bl&&a!==536870912&&(n.flags|=128,u=!0,mo(s,!1),n.lanes=4194304);s.isBackwards?(f.sibling=n.child,n.child=f):(e=s.last,e!==null?e.sibling=f:n.child=f,s.last=f)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=ft(),e.sibling=null,a=an.current,yt(an,u?a&1|2:a&1),ye&&qi(n,s.treeForkCount),e):(We(n),null);case 22:case 23:return $n(n),Fu(),s=n.memoizedState!==null,e!==null?e.memoizedState!==null!==s&&(n.flags|=8192):s&&(n.flags|=8192),s?(a&536870912)!==0&&(n.flags&128)===0&&(We(n),n.subtreeFlags&6&&(n.flags|=8192)):We(n),a=n.updateQueue,a!==null&&Nl(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==a&&(n.flags|=2048),e!==null&&et(cr),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),ji(sn),We(n),null;case 25:return null;case 30:return null}throw Error(r(156,n.tag))}function LS(e,n){switch(bu(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return ji(sn),jt(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return Ve(n),null;case 31:if(n.memoizedState!==null){if($n(n),n.alternate===null)throw Error(r(340));sr()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if($n(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(r(340));sr()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return et(an),null;case 4:return jt(),null;case 10:return ji(n.type),null;case 22:case 23:return $n(n),Fu(),e!==null&&et(cr),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return ji(sn),null;case 25:return null;default:return null}}function Jm(e,n){switch(bu(n),n.tag){case 3:ji(sn),jt();break;case 26:case 27:case 5:Ve(n);break;case 4:jt();break;case 31:n.memoizedState!==null&&$n(n);break;case 13:$n(n);break;case 19:et(an);break;case 10:ji(n.type);break;case 22:case 23:$n(n),Fu(),e!==null&&et(cr);break;case 24:ji(sn)}}function go(e,n){try{var a=n.updateQueue,s=a!==null?a.lastEffect:null;if(s!==null){var u=s.next;a=u;do{if((a.tag&e)===e){s=void 0;var f=a.create,_=a.inst;s=f(),_.destroy=s}a=a.next}while(a!==u)}}catch(E){Ne(n,n.return,E)}}function Ra(e,n,a){try{var s=n.updateQueue,u=s!==null?s.lastEffect:null;if(u!==null){var f=u.next;s=f;do{if((s.tag&e)===e){var _=s.inst,E=_.destroy;if(E!==void 0){_.destroy=void 0,u=n;var P=a,J=E;try{J()}catch(ct){Ne(u,P,ct)}}}s=s.next}while(s!==f)}}catch(ct){Ne(n,n.return,ct)}}function $m(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{kp(n,a)}catch(s){Ne(e,e.return,s)}}}function tg(e,n,a){a.props=pr(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(s){Ne(e,n,s)}}function _o(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var s=e.stateNode;break;case 30:s=e.stateNode;break;default:s=e.stateNode}typeof a=="function"?e.refCleanup=a(s):a.current=s}}catch(u){Ne(e,n,u)}}function Pi(e,n){var a=e.ref,s=e.refCleanup;if(a!==null)if(typeof s=="function")try{s()}catch(u){Ne(e,n,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){Ne(e,n,u)}else a.current=null}function eg(e){var n=e.type,a=e.memoizedProps,s=e.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&s.focus();break t;case"img":a.src?s.src=a.src:a.srcSet&&(s.srcset=a.srcSet)}}catch(u){Ne(e,e.return,u)}}function vf(e,n,a){try{var s=e.stateNode;ty(s,e.type,a,n),s[Mn]=n}catch(u){Ne(e,e.return,u)}}function ng(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Pa(e.type)||e.tag===4}function Sf(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||ng(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Pa(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function yf(e,n,a){var s=e.tag;if(s===5||s===6)e=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(e),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=ki));else if(s!==4&&(s===27&&Pa(e.type)&&(a=e.stateNode,n=null),e=e.child,e!==null))for(yf(e,n,a),e=e.sibling;e!==null;)yf(e,n,a),e=e.sibling}function Ol(e,n,a){var s=e.tag;if(s===5||s===6)e=e.stateNode,n?a.insertBefore(e,n):a.appendChild(e);else if(s!==4&&(s===27&&Pa(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Ol(e,n,a),e=e.sibling;e!==null;)Ol(e,n,a),e=e.sibling}function ig(e){var n=e.stateNode,a=e.memoizedProps;try{for(var s=e.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);Cn(n,s,a),n[Qe]=e,n[Mn]=a}catch(f){Ne(e,e.return,f)}}var $i=!1,cn=!1,xf=!1,ag=typeof WeakSet=="function"?WeakSet:Set,Sn=null;function NS(e,n){if(e=e.containerInfo,Vf=ec,e=gp(e),du(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else t:{a=(a=e.ownerDocument)&&a.defaultView||window;var s=a.getSelection&&a.getSelection();if(s&&s.rangeCount!==0){a=s.anchorNode;var u=s.anchorOffset,f=s.focusNode;s=s.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break t}var _=0,E=-1,P=-1,J=0,ct=0,mt=e,$=null;e:for(;;){for(var rt;mt!==a||u!==0&&mt.nodeType!==3||(E=_+u),mt!==f||s!==0&&mt.nodeType!==3||(P=_+s),mt.nodeType===3&&(_+=mt.nodeValue.length),(rt=mt.firstChild)!==null;)$=mt,mt=rt;for(;;){if(mt===e)break e;if($===a&&++J===u&&(E=_),$===f&&++ct===s&&(P=_),(rt=mt.nextSibling)!==null)break;mt=$,$=mt.parentNode}mt=rt}a=E===-1||P===-1?null:{start:E,end:P}}else a=null}a=a||{start:0,end:0}}else a=null;for(kf={focusedElem:e,selectionRange:a},ec=!1,Sn=n;Sn!==null;)if(n=Sn,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,Sn=e;else for(;Sn!==null;){switch(n=Sn,f=n.alternate,e=n.flags,n.tag){case 0:if((e&4)!==0&&(e=n.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)u=e[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&f!==null){e=void 0,a=n,u=f.memoizedProps,f=f.memoizedState,s=a.stateNode;try{var Bt=pr(a.type,u);e=s.getSnapshotBeforeUpdate(Bt,f),s.__reactInternalSnapshotBeforeUpdate=e}catch(Qt){Ne(a,a.return,Qt)}}break;case 3:if((e&1024)!==0){if(e=n.stateNode.containerInfo,a=e.nodeType,a===9)qf(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":qf(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(r(163))}if(e=n.sibling,e!==null){e.return=n.return,Sn=e;break}Sn=n.return}}function rg(e,n,a){var s=a.flags;switch(a.tag){case 0:case 11:case 15:ea(e,a),s&4&&go(5,a);break;case 1:if(ea(e,a),s&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(_){Ne(a,a.return,_)}else{var u=pr(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(u,n,e.__reactInternalSnapshotBeforeUpdate)}catch(_){Ne(a,a.return,_)}}s&64&&$m(a),s&512&&_o(a,a.return);break;case 3:if(ea(e,a),s&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{kp(e,n)}catch(_){Ne(a,a.return,_)}}break;case 27:n===null&&s&4&&ig(a);case 26:case 5:ea(e,a),n===null&&s&4&&eg(a),s&512&&_o(a,a.return);break;case 12:ea(e,a);break;case 31:ea(e,a),s&4&&lg(e,a);break;case 13:ea(e,a),s&4&&cg(e,a),s&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=VS.bind(null,a),ly(e,a))));break;case 22:if(s=a.memoizedState!==null||$i,!s){n=n!==null&&n.memoizedState!==null||cn,u=$i;var f=cn;$i=s,(cn=n)&&!f?na(e,a,(a.subtreeFlags&8772)!==0):ea(e,a),$i=u,cn=f}break;case 30:break;default:ea(e,a)}}function sg(e){var n=e.alternate;n!==null&&(e.alternate=null,sg(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&Xs(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ye=null,Vn=!1;function ta(e,n,a){for(a=a.child;a!==null;)og(e,n,a),a=a.sibling}function og(e,n,a){if(Vt&&typeof Vt.onCommitFiberUnmount=="function")try{Vt.onCommitFiberUnmount(Zt,a)}catch{}switch(a.tag){case 26:cn||Pi(a,n),ta(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:cn||Pi(a,n);var s=Ye,u=Vn;Pa(a.type)&&(Ye=a.stateNode,Vn=!1),ta(e,n,a),Ao(a.stateNode),Ye=s,Vn=u;break;case 5:cn||Pi(a,n);case 6:if(s=Ye,u=Vn,Ye=null,ta(e,n,a),Ye=s,Vn=u,Ye!==null)if(Vn)try{(Ye.nodeType===9?Ye.body:Ye.nodeName==="HTML"?Ye.ownerDocument.body:Ye).removeChild(a.stateNode)}catch(f){Ne(a,n,f)}else try{Ye.removeChild(a.stateNode)}catch(f){Ne(a,n,f)}break;case 18:Ye!==null&&(Vn?(e=Ye,$g(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),hs(e)):$g(Ye,a.stateNode));break;case 4:s=Ye,u=Vn,Ye=a.stateNode.containerInfo,Vn=!0,ta(e,n,a),Ye=s,Vn=u;break;case 0:case 11:case 14:case 15:Ra(2,a,n),cn||Ra(4,a,n),ta(e,n,a);break;case 1:cn||(Pi(a,n),s=a.stateNode,typeof s.componentWillUnmount=="function"&&tg(a,n,s)),ta(e,n,a);break;case 21:ta(e,n,a);break;case 22:cn=(s=cn)||a.memoizedState!==null,ta(e,n,a),cn=s;break;default:ta(e,n,a)}}function lg(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{hs(e)}catch(a){Ne(n,n.return,a)}}}function cg(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{hs(e)}catch(a){Ne(n,n.return,a)}}function OS(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new ag),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new ag),n;default:throw Error(r(435,e.tag))}}function Pl(e,n){var a=OS(e);n.forEach(function(s){if(!a.has(s)){a.add(s);var u=kS.bind(null,e,s);s.then(u,u)}})}function kn(e,n){var a=n.deletions;if(a!==null)for(var s=0;s<a.length;s++){var u=a[s],f=e,_=n,E=_;t:for(;E!==null;){switch(E.tag){case 27:if(Pa(E.type)){Ye=E.stateNode,Vn=!1;break t}break;case 5:Ye=E.stateNode,Vn=!1;break t;case 3:case 4:Ye=E.stateNode.containerInfo,Vn=!0;break t}E=E.return}if(Ye===null)throw Error(r(160));og(f,_,u),Ye=null,Vn=!1,f=u.alternate,f!==null&&(f.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)ug(n,e),n=n.sibling}var xi=null;function ug(e,n){var a=e.alternate,s=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:kn(n,e),Xn(e),s&4&&(Ra(3,e,e.return),go(3,e),Ra(5,e,e.return));break;case 1:kn(n,e),Xn(e),s&512&&(cn||a===null||Pi(a,a.return)),s&64&&$i&&(e=e.updateQueue,e!==null&&(s=e.callbacks,s!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?s:a.concat(s))));break;case 26:var u=xi;if(kn(n,e),Xn(e),s&512&&(cn||a===null||Pi(a,a.return)),s&4){var f=a!==null?a.memoizedState:null;if(s=e.memoizedState,a===null)if(s===null)if(e.stateNode===null){t:{s=e.type,a=e.memoizedProps,u=u.ownerDocument||u;e:switch(s){case"title":f=u.getElementsByTagName("title")[0],(!f||f[tr]||f[Qe]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=u.createElement(s),u.head.insertBefore(f,u.querySelector("head > title"))),Cn(f,s,a),f[Qe]=e,V(f),s=f;break t;case"link":var _=u_("link","href",u).get(s+(a.href||""));if(_){for(var E=0;E<_.length;E++)if(f=_[E],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){_.splice(E,1);break e}}f=u.createElement(s),Cn(f,s,a),u.head.appendChild(f);break;case"meta":if(_=u_("meta","content",u).get(s+(a.content||""))){for(E=0;E<_.length;E++)if(f=_[E],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){_.splice(E,1);break e}}f=u.createElement(s),Cn(f,s,a),u.head.appendChild(f);break;default:throw Error(r(468,s))}f[Qe]=e,V(f),s=f}e.stateNode=s}else f_(u,e.type,e.stateNode);else e.stateNode=c_(u,s,e.memoizedProps);else f!==s?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,s===null?f_(u,e.type,e.stateNode):c_(u,s,e.memoizedProps)):s===null&&e.stateNode!==null&&vf(e,e.memoizedProps,a.memoizedProps)}break;case 27:kn(n,e),Xn(e),s&512&&(cn||a===null||Pi(a,a.return)),a!==null&&s&4&&vf(e,e.memoizedProps,a.memoizedProps);break;case 5:if(kn(n,e),Xn(e),s&512&&(cn||a===null||Pi(a,a.return)),e.flags&32){u=e.stateNode;try{Hn(u,"")}catch(Bt){Ne(e,e.return,Bt)}}s&4&&e.stateNode!=null&&(u=e.memoizedProps,vf(e,u,a!==null?a.memoizedProps:u)),s&1024&&(xf=!0);break;case 6:if(kn(n,e),Xn(e),s&4){if(e.stateNode===null)throw Error(r(162));s=e.memoizedProps,a=e.stateNode;try{a.nodeValue=s}catch(Bt){Ne(e,e.return,Bt)}}break;case 3:if(Ql=null,u=xi,xi=Zl(n.containerInfo),kn(n,e),xi=u,Xn(e),s&4&&a!==null&&a.memoizedState.isDehydrated)try{hs(n.containerInfo)}catch(Bt){Ne(e,e.return,Bt)}xf&&(xf=!1,fg(e));break;case 4:s=xi,xi=Zl(e.stateNode.containerInfo),kn(n,e),Xn(e),xi=s;break;case 12:kn(n,e),Xn(e);break;case 31:kn(n,e),Xn(e),s&4&&(s=e.updateQueue,s!==null&&(e.updateQueue=null,Pl(e,s)));break;case 13:kn(n,e),Xn(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(zl=ft()),s&4&&(s=e.updateQueue,s!==null&&(e.updateQueue=null,Pl(e,s)));break;case 22:u=e.memoizedState!==null;var P=a!==null&&a.memoizedState!==null,J=$i,ct=cn;if($i=J||u,cn=ct||P,kn(n,e),cn=ct,$i=J,Xn(e),s&8192)t:for(n=e.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||P||$i||cn||mr(e)),a=null,n=e;;){if(n.tag===5||n.tag===26){if(a===null){P=a=n;try{if(f=P.stateNode,u)_=f.style,typeof _.setProperty=="function"?_.setProperty("display","none","important"):_.display="none";else{E=P.stateNode;var mt=P.memoizedProps.style,$=mt!=null&&mt.hasOwnProperty("display")?mt.display:null;E.style.display=$==null||typeof $=="boolean"?"":(""+$).trim()}}catch(Bt){Ne(P,P.return,Bt)}}}else if(n.tag===6){if(a===null){P=n;try{P.stateNode.nodeValue=u?"":P.memoizedProps}catch(Bt){Ne(P,P.return,Bt)}}}else if(n.tag===18){if(a===null){P=n;try{var rt=P.stateNode;u?t_(rt,!0):t_(P.stateNode,!1)}catch(Bt){Ne(P,P.return,Bt)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===e)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break t;for(;n.sibling===null;){if(n.return===null||n.return===e)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}s&4&&(s=e.updateQueue,s!==null&&(a=s.retryQueue,a!==null&&(s.retryQueue=null,Pl(e,a))));break;case 19:kn(n,e),Xn(e),s&4&&(s=e.updateQueue,s!==null&&(e.updateQueue=null,Pl(e,s)));break;case 30:break;case 21:break;default:kn(n,e),Xn(e)}}function Xn(e){var n=e.flags;if(n&2){try{for(var a,s=e.return;s!==null;){if(ng(s)){a=s;break}s=s.return}if(a==null)throw Error(r(160));switch(a.tag){case 27:var u=a.stateNode,f=Sf(e);Ol(e,f,u);break;case 5:var _=a.stateNode;a.flags&32&&(Hn(_,""),a.flags&=-33);var E=Sf(e);Ol(e,E,_);break;case 3:case 4:var P=a.stateNode.containerInfo,J=Sf(e);yf(e,J,P);break;default:throw Error(r(161))}}catch(ct){Ne(e,e.return,ct)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function fg(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;fg(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),e=e.sibling}}function ea(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)rg(e,n.alternate,n),n=n.sibling}function mr(e){for(e=e.child;e!==null;){var n=e;switch(n.tag){case 0:case 11:case 14:case 15:Ra(4,n,n.return),mr(n);break;case 1:Pi(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&tg(n,n.return,a),mr(n);break;case 27:Ao(n.stateNode);case 26:case 5:Pi(n,n.return),mr(n);break;case 22:n.memoizedState===null&&mr(n);break;case 30:mr(n);break;default:mr(n)}e=e.sibling}}function na(e,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var s=n.alternate,u=e,f=n,_=f.flags;switch(f.tag){case 0:case 11:case 15:na(u,f,a),go(4,f);break;case 1:if(na(u,f,a),s=f,u=s.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(J){Ne(s,s.return,J)}if(s=f,u=s.updateQueue,u!==null){var E=s.stateNode;try{var P=u.shared.hiddenCallbacks;if(P!==null)for(u.shared.hiddenCallbacks=null,u=0;u<P.length;u++)Vp(P[u],E)}catch(J){Ne(s,s.return,J)}}a&&_&64&&$m(f),_o(f,f.return);break;case 27:ig(f);case 26:case 5:na(u,f,a),a&&s===null&&_&4&&eg(f),_o(f,f.return);break;case 12:na(u,f,a);break;case 31:na(u,f,a),a&&_&4&&lg(u,f);break;case 13:na(u,f,a),a&&_&4&&cg(u,f);break;case 22:f.memoizedState===null&&na(u,f,a),_o(f,f.return);break;case 30:break;default:na(u,f,a)}n=n.sibling}}function Mf(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&no(a))}function Ef(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&no(e))}function Mi(e,n,a,s){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)hg(e,n,a,s),n=n.sibling}function hg(e,n,a,s){var u=n.flags;switch(n.tag){case 0:case 11:case 15:Mi(e,n,a,s),u&2048&&go(9,n);break;case 1:Mi(e,n,a,s);break;case 3:Mi(e,n,a,s),u&2048&&(e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&no(e)));break;case 12:if(u&2048){Mi(e,n,a,s),e=n.stateNode;try{var f=n.memoizedProps,_=f.id,E=f.onPostCommit;typeof E=="function"&&E(_,n.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(P){Ne(n,n.return,P)}}else Mi(e,n,a,s);break;case 31:Mi(e,n,a,s);break;case 13:Mi(e,n,a,s);break;case 23:break;case 22:f=n.stateNode,_=n.alternate,n.memoizedState!==null?f._visibility&2?Mi(e,n,a,s):vo(e,n):f._visibility&2?Mi(e,n,a,s):(f._visibility|=2,es(e,n,a,s,(n.subtreeFlags&10256)!==0||!1)),u&2048&&Mf(_,n);break;case 24:Mi(e,n,a,s),u&2048&&Ef(n.alternate,n);break;default:Mi(e,n,a,s)}}function es(e,n,a,s,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=e,_=n,E=a,P=s,J=_.flags;switch(_.tag){case 0:case 11:case 15:es(f,_,E,P,u),go(8,_);break;case 23:break;case 22:var ct=_.stateNode;_.memoizedState!==null?ct._visibility&2?es(f,_,E,P,u):vo(f,_):(ct._visibility|=2,es(f,_,E,P,u)),u&&J&2048&&Mf(_.alternate,_);break;case 24:es(f,_,E,P,u),u&&J&2048&&Ef(_.alternate,_);break;default:es(f,_,E,P,u)}n=n.sibling}}function vo(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,s=n,u=s.flags;switch(s.tag){case 22:vo(a,s),u&2048&&Mf(s.alternate,s);break;case 24:vo(a,s),u&2048&&Ef(s.alternate,s);break;default:vo(a,s)}n=n.sibling}}var So=8192;function ns(e,n,a){if(e.subtreeFlags&So)for(e=e.child;e!==null;)dg(e,n,a),e=e.sibling}function dg(e,n,a){switch(e.tag){case 26:ns(e,n,a),e.flags&So&&e.memoizedState!==null&&yy(a,xi,e.memoizedState,e.memoizedProps);break;case 5:ns(e,n,a);break;case 3:case 4:var s=xi;xi=Zl(e.stateNode.containerInfo),ns(e,n,a),xi=s;break;case 22:e.memoizedState===null&&(s=e.alternate,s!==null&&s.memoizedState!==null?(s=So,So=16777216,ns(e,n,a),So=s):ns(e,n,a));break;default:ns(e,n,a)}}function pg(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function yo(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];Sn=s,gg(s,e)}pg(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)mg(e),e=e.sibling}function mg(e){switch(e.tag){case 0:case 11:case 15:yo(e),e.flags&2048&&Ra(9,e,e.return);break;case 3:yo(e);break;case 12:yo(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,Il(e)):yo(e);break;default:yo(e)}}function Il(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];Sn=s,gg(s,e)}pg(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:Ra(8,n,n.return),Il(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Il(n));break;default:Il(n)}e=e.sibling}}function gg(e,n){for(;Sn!==null;){var a=Sn;switch(a.tag){case 0:case 11:case 15:Ra(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var s=a.memoizedState.cachePool.pool;s!=null&&s.refCount++}break;case 24:no(a.memoizedState.cache)}if(s=a.child,s!==null)s.return=a,Sn=s;else t:for(a=e;Sn!==null;){s=Sn;var u=s.sibling,f=s.return;if(sg(s),s===a){Sn=null;break t}if(u!==null){u.return=f,Sn=u;break t}Sn=f}}}var PS={getCacheForType:function(e){var n=Tn(sn),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return Tn(sn).controller.signal}},IS=typeof WeakMap=="function"?WeakMap:Map,we=0,Ge=null,he=null,ge=0,Le=0,ti=null,wa=!1,is=!1,bf=!1,ia=0,tn=0,Da=0,gr=0,Tf=0,ei=0,as=0,xo=null,Wn=null,Af=!1,zl=0,_g=0,Bl=1/0,Fl=null,Ua=null,pn=0,La=null,rs=null,aa=0,Cf=0,Rf=null,vg=null,Mo=0,wf=null;function ni(){return(we&2)!==0&&ge!==0?ge&-ge:O.T!==null?Pf():Vs()}function Sg(){if(ei===0)if((ge&536870912)===0||ye){var e=ot;ot<<=1,(ot&3932160)===0&&(ot=262144),ei=e}else ei=536870912;return e=Jn.current,e!==null&&(e.flags|=32),ei}function qn(e,n,a){(e===Ge&&(Le===2||Le===9)||e.cancelPendingCommit!==null)&&(ss(e,0),Na(e,ge,ei,!1)),xn(e,a),((we&2)===0||e!==Ge)&&(e===Ge&&((we&2)===0&&(gr|=a),tn===4&&Na(e,ge,ei,!1)),Ii(e))}function yg(e,n,a){if((we&6)!==0)throw Error(r(327));var s=!a&&(n&127)===0&&(n&e.expiredLanes)===0||te(e,n),u=s?FS(e,n):Uf(e,n,!0),f=s;do{if(u===0){is&&!s&&Na(e,n,0,!1);break}else{if(a=e.current.alternate,f&&!zS(a)){u=Uf(e,n,!1),f=!1;continue}if(u===2){if(f=n,e.errorRecoveryDisabledLanes&f)var _=0;else _=e.pendingLanes&-536870913,_=_!==0?_:_&536870912?536870912:0;if(_!==0){n=_;t:{var E=e;u=xo;var P=E.current.memoizedState.isDehydrated;if(P&&(ss(E,_).flags|=256),_=Uf(E,_,!1),_!==2){if(bf&&!P){E.errorRecoveryDisabledLanes|=f,gr|=f,u=4;break t}f=Wn,Wn=u,f!==null&&(Wn===null?Wn=f:Wn.push.apply(Wn,f))}u=_}if(f=!1,u!==2)continue}}if(u===1){ss(e,0),Na(e,n,0,!0);break}t:{switch(s=e,f=u,f){case 0:case 1:throw Error(r(345));case 4:if((n&4194048)!==n)break;case 6:Na(s,n,ei,!wa);break t;case 2:Wn=null;break;case 3:case 5:break;default:throw Error(r(329))}if((n&62914560)===n&&(u=zl+300-ft(),10<u)){if(Na(s,n,ei,!wa),Dt(s,0,!0)!==0)break t;aa=n,s.timeoutHandle=Qg(xg.bind(null,s,a,Wn,Fl,Af,n,ei,gr,as,wa,f,"Throttled",-0,0),u);break t}xg(s,a,Wn,Fl,Af,n,ei,gr,as,wa,f,null,-0,0)}}break}while(!0);Ii(e)}function xg(e,n,a,s,u,f,_,E,P,J,ct,mt,$,rt){if(e.timeoutHandle=-1,mt=n.subtreeFlags,mt&8192||(mt&16785408)===16785408){mt={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ki},dg(n,f,mt);var Bt=(f&62914560)===f?zl-ft():(f&4194048)===f?_g-ft():0;if(Bt=xy(mt,Bt),Bt!==null){aa=f,e.cancelPendingCommit=Bt(wg.bind(null,e,n,f,a,s,u,_,E,P,ct,mt,null,$,rt)),Na(e,f,_,!J);return}}wg(e,n,f,a,s,u,_,E,P)}function zS(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var s=0;s<a.length;s++){var u=a[s],f=u.getSnapshot;u=u.value;try{if(!Kn(f(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Na(e,n,a,s){n&=~Tf,n&=~gr,e.suspendedLanes|=n,e.pingedLanes&=~n,s&&(e.warmLanes|=n),s=e.expirationTimes;for(var u=n;0<u;){var f=31-$t(u),_=1<<f;s[f]=-1,u&=~_}a!==0&&Hs(e,a,n)}function Hl(){return(we&6)===0?(Eo(0),!1):!0}function Df(){if(he!==null){if(Le===0)var e=he.return;else e=he,Yi=or=null,Wu(e),Kr=null,ao=0,e=he;for(;e!==null;)Jm(e.alternate,e),e=e.return;he=null}}function ss(e,n){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,iy(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),aa=0,Df(),Ge=e,he=a=Wi(e.current,null),ge=n,Le=0,ti=null,wa=!1,is=te(e,n),bf=!1,as=ei=Tf=gr=Da=tn=0,Wn=xo=null,Af=!1,(n&8)!==0&&(n|=n&32);var s=e.entangledLanes;if(s!==0)for(e=e.entanglements,s&=n;0<s;){var u=31-$t(s),f=1<<u;n|=e[u],s&=~f}return ia=n,ol(),a}function Mg(e,n){se=null,O.H=ho,n===Zr||n===ml?(n=Bp(),Le=3):n===Nu?(n=Bp(),Le=4):Le=n===lf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,ti=n,he===null&&(tn=1,wl(e,oi(n,e.current)))}function Eg(){var e=Jn.current;return e===null?!0:(ge&4194048)===ge?fi===null:(ge&62914560)===ge||(ge&536870912)!==0?e===fi:!1}function bg(){var e=O.H;return O.H=ho,e===null?ho:e}function Tg(){var e=O.A;return O.A=PS,e}function Gl(){tn=4,wa||(ge&4194048)!==ge&&Jn.current!==null||(is=!0),(Da&134217727)===0&&(gr&134217727)===0||Ge===null||Na(Ge,ge,ei,!1)}function Uf(e,n,a){var s=we;we|=2;var u=bg(),f=Tg();(Ge!==e||ge!==n)&&(Fl=null,ss(e,n)),n=!1;var _=tn;t:do try{if(Le!==0&&he!==null){var E=he,P=ti;switch(Le){case 8:Df(),_=6;break t;case 3:case 2:case 9:case 6:Jn.current===null&&(n=!0);var J=Le;if(Le=0,ti=null,os(e,E,P,J),a&&is){_=0;break t}break;default:J=Le,Le=0,ti=null,os(e,E,P,J)}}BS(),_=tn;break}catch(ct){Mg(e,ct)}while(!0);return n&&e.shellSuspendCounter++,Yi=or=null,we=s,O.H=u,O.A=f,he===null&&(Ge=null,ge=0,ol()),_}function BS(){for(;he!==null;)Ag(he)}function FS(e,n){var a=we;we|=2;var s=bg(),u=Tg();Ge!==e||ge!==n?(Fl=null,Bl=ft()+500,ss(e,n)):is=te(e,n);t:do try{if(Le!==0&&he!==null){n=he;var f=ti;e:switch(Le){case 1:Le=0,ti=null,os(e,n,f,1);break;case 2:case 9:if(Ip(f)){Le=0,ti=null,Cg(n);break}n=function(){Le!==2&&Le!==9||Ge!==e||(Le=7),Ii(e)},f.then(n,n);break t;case 3:Le=7;break t;case 4:Le=5;break t;case 7:Ip(f)?(Le=0,ti=null,Cg(n)):(Le=0,ti=null,os(e,n,f,7));break;case 5:var _=null;switch(he.tag){case 26:_=he.memoizedState;case 5:case 27:var E=he;if(_?h_(_):E.stateNode.complete){Le=0,ti=null;var P=E.sibling;if(P!==null)he=P;else{var J=E.return;J!==null?(he=J,Vl(J)):he=null}break e}}Le=0,ti=null,os(e,n,f,5);break;case 6:Le=0,ti=null,os(e,n,f,6);break;case 8:Df(),tn=6;break t;default:throw Error(r(462))}}HS();break}catch(ct){Mg(e,ct)}while(!0);return Yi=or=null,O.H=s,O.A=u,we=a,he!==null?0:(Ge=null,ge=0,ol(),tn)}function HS(){for(;he!==null&&!b();)Ag(he)}function Ag(e){var n=Km(e.alternate,e,ia);e.memoizedProps=e.pendingProps,n===null?Vl(e):he=n}function Cg(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=Xm(a,n,n.pendingProps,n.type,void 0,ge);break;case 11:n=Xm(a,n,n.pendingProps,n.type.render,n.ref,ge);break;case 5:Wu(n);default:Jm(a,n),n=he=Tp(n,ia),n=Km(a,n,ia)}e.memoizedProps=e.pendingProps,n===null?Vl(e):he=n}function os(e,n,a,s){Yi=or=null,Wu(n),Kr=null,ao=0;var u=n.return;try{if(RS(e,u,n,a,ge)){tn=1,wl(e,oi(a,e.current)),he=null;return}}catch(f){if(u!==null)throw he=u,f;tn=1,wl(e,oi(a,e.current)),he=null;return}n.flags&32768?(ye||s===1?e=!0:is||(ge&536870912)!==0?e=!1:(wa=e=!0,(s===2||s===9||s===3||s===6)&&(s=Jn.current,s!==null&&s.tag===13&&(s.flags|=16384))),Rg(n,e)):Vl(n)}function Vl(e){var n=e;do{if((n.flags&32768)!==0){Rg(n,wa);return}e=n.return;var a=US(n.alternate,n,ia);if(a!==null){he=a;return}if(n=n.sibling,n!==null){he=n;return}he=n=e}while(n!==null);tn===0&&(tn=5)}function Rg(e,n){do{var a=LS(e.alternate,e);if(a!==null){a.flags&=32767,he=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){he=e;return}he=e=a}while(e!==null);tn=6,he=null}function wg(e,n,a,s,u,f,_,E,P){e.cancelPendingCommit=null;do kl();while(pn!==0);if((we&6)!==0)throw Error(r(327));if(n!==null){if(n===e.current)throw Error(r(177));if(f=n.lanes|n.childLanes,f|=vu,_i(e,a,f,_,E,P),e===Ge&&(he=Ge=null,ge=0),rs=n,La=e,aa=a,Cf=f,Rf=u,vg=s,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,XS(Rt,function(){return Og(),null})):(e.callbackNode=null,e.callbackPriority=0),s=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||s){s=O.T,O.T=null,u=j.p,j.p=2,_=we,we|=4;try{NS(e,n,a)}finally{we=_,j.p=u,O.T=s}}pn=1,Dg(),Ug(),Lg()}}function Dg(){if(pn===1){pn=0;var e=La,n=rs,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=O.T,O.T=null;var s=j.p;j.p=2;var u=we;we|=4;try{ug(n,e);var f=kf,_=gp(e.containerInfo),E=f.focusedElem,P=f.selectionRange;if(_!==E&&E&&E.ownerDocument&&mp(E.ownerDocument.documentElement,E)){if(P!==null&&du(E)){var J=P.start,ct=P.end;if(ct===void 0&&(ct=J),"selectionStart"in E)E.selectionStart=J,E.selectionEnd=Math.min(ct,E.value.length);else{var mt=E.ownerDocument||document,$=mt&&mt.defaultView||window;if($.getSelection){var rt=$.getSelection(),Bt=E.textContent.length,Qt=Math.min(P.start,Bt),Be=P.end===void 0?Qt:Math.min(P.end,Bt);!rt.extend&&Qt>Be&&(_=Be,Be=Qt,Qt=_);var W=pp(E,Qt),F=pp(E,Be);if(W&&F&&(rt.rangeCount!==1||rt.anchorNode!==W.node||rt.anchorOffset!==W.offset||rt.focusNode!==F.node||rt.focusOffset!==F.offset)){var Q=mt.createRange();Q.setStart(W.node,W.offset),rt.removeAllRanges(),Qt>Be?(rt.addRange(Q),rt.extend(F.node,F.offset)):(Q.setEnd(F.node,F.offset),rt.addRange(Q))}}}}for(mt=[],rt=E;rt=rt.parentNode;)rt.nodeType===1&&mt.push({element:rt,left:rt.scrollLeft,top:rt.scrollTop});for(typeof E.focus=="function"&&E.focus(),E=0;E<mt.length;E++){var ht=mt[E];ht.element.scrollLeft=ht.left,ht.element.scrollTop=ht.top}}ec=!!Vf,kf=Vf=null}finally{we=u,j.p=s,O.T=a}}e.current=n,pn=2}}function Ug(){if(pn===2){pn=0;var e=La,n=rs,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=O.T,O.T=null;var s=j.p;j.p=2;var u=we;we|=4;try{rg(e,n.alternate,n)}finally{we=u,j.p=s,O.T=a}}pn=3}}function Lg(){if(pn===4||pn===3){pn=0,tt();var e=La,n=rs,a=aa,s=vg;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?pn=5:(pn=0,rs=La=null,Ng(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(Ua=null),Or(a),n=n.stateNode,Vt&&typeof Vt.onCommitFiberRoot=="function")try{Vt.onCommitFiberRoot(Zt,n,void 0,(n.current.flags&128)===128)}catch{}if(s!==null){n=O.T,u=j.p,j.p=2,O.T=null;try{for(var f=e.onRecoverableError,_=0;_<s.length;_++){var E=s[_];f(E.value,{componentStack:E.stack})}}finally{O.T=n,j.p=u}}(aa&3)!==0&&kl(),Ii(e),u=e.pendingLanes,(a&261930)!==0&&(u&42)!==0?e===wf?Mo++:(Mo=0,wf=e):Mo=0,Eo(0)}}function Ng(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,no(n)))}function kl(){return Dg(),Ug(),Lg(),Og()}function Og(){if(pn!==5)return!1;var e=La,n=Cf;Cf=0;var a=Or(aa),s=O.T,u=j.p;try{j.p=32>a?32:a,O.T=null,a=Rf,Rf=null;var f=La,_=aa;if(pn=0,rs=La=null,aa=0,(we&6)!==0)throw Error(r(331));var E=we;if(we|=4,mg(f.current),hg(f,f.current,_,a),we=E,Eo(0,!1),Vt&&typeof Vt.onPostCommitFiberRoot=="function")try{Vt.onPostCommitFiberRoot(Zt,f)}catch{}return!0}finally{j.p=u,O.T=s,Ng(e,n)}}function Pg(e,n,a){n=oi(a,n),n=of(e.stateNode,n,2),e=Ta(e,n,2),e!==null&&(xn(e,2),Ii(e))}function Ne(e,n,a){if(e.tag===3)Pg(e,e,a);else for(;n!==null;){if(n.tag===3){Pg(n,e,a);break}else if(n.tag===1){var s=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(Ua===null||!Ua.has(s))){e=oi(a,e),a=Im(2),s=Ta(n,a,2),s!==null&&(zm(a,s,n,e),xn(s,2),Ii(s));break}}n=n.return}}function Lf(e,n,a){var s=e.pingCache;if(s===null){s=e.pingCache=new IS;var u=new Set;s.set(n,u)}else u=s.get(n),u===void 0&&(u=new Set,s.set(n,u));u.has(a)||(bf=!0,u.add(a),e=GS.bind(null,e,n,a),n.then(e,e))}function GS(e,n,a){var s=e.pingCache;s!==null&&s.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,Ge===e&&(ge&a)===a&&(tn===4||tn===3&&(ge&62914560)===ge&&300>ft()-zl?(we&2)===0&&ss(e,0):Tf|=a,as===ge&&(as=0)),Ii(e)}function Ig(e,n){n===0&&(n=hn()),e=ar(e,n),e!==null&&(xn(e,n),Ii(e))}function VS(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),Ig(e,a)}function kS(e,n){var a=0;switch(e.tag){case 31:case 13:var s=e.stateNode,u=e.memoizedState;u!==null&&(a=u.retryLane);break;case 19:s=e.stateNode;break;case 22:s=e.stateNode._retryCache;break;default:throw Error(r(314))}s!==null&&s.delete(n),Ig(e,a)}function XS(e,n){return kt(e,n)}var Xl=null,ls=null,Nf=!1,Wl=!1,Of=!1,Oa=0;function Ii(e){e!==ls&&e.next===null&&(ls===null?Xl=ls=e:ls=ls.next=e),Wl=!0,Nf||(Nf=!0,qS())}function Eo(e,n){if(!Of&&Wl){Of=!0;do for(var a=!1,s=Xl;s!==null;){if(e!==0){var u=s.pendingLanes;if(u===0)var f=0;else{var _=s.suspendedLanes,E=s.pingedLanes;f=(1<<31-$t(42|e)+1)-1,f&=u&~(_&~E),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Hg(s,f))}else f=ge,f=Dt(s,s===Ge?f:0,s.cancelPendingCommit!==null||s.timeoutHandle!==-1),(f&3)===0||te(s,f)||(a=!0,Hg(s,f));s=s.next}while(a);Of=!1}}function WS(){zg()}function zg(){Wl=Nf=!1;var e=0;Oa!==0&&ny()&&(e=Oa);for(var n=ft(),a=null,s=Xl;s!==null;){var u=s.next,f=Bg(s,n);f===0?(s.next=null,a===null?Xl=u:a.next=u,u===null&&(ls=a)):(a=s,(e!==0||(f&3)!==0)&&(Wl=!0)),s=u}pn!==0&&pn!==5||Eo(e),Oa!==0&&(Oa=0)}function Bg(e,n){for(var a=e.suspendedLanes,s=e.pingedLanes,u=e.expirationTimes,f=e.pendingLanes&-62914561;0<f;){var _=31-$t(f),E=1<<_,P=u[_];P===-1?((E&a)===0||(E&s)!==0)&&(u[_]=qe(E,n)):P<=n&&(e.expiredLanes|=E),f&=~E}if(n=Ge,a=ge,a=Dt(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),s=e.callbackNode,a===0||e===n&&(Le===2||Le===9)||e.cancelPendingCommit!==null)return s!==null&&s!==null&&U(s),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||te(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(s!==null&&U(s),Or(a)){case 2:case 8:a=Gt;break;case 32:a=Rt;break;case 268435456:a=me;break;default:a=Rt}return s=Fg.bind(null,e),a=kt(a,s),e.callbackPriority=n,e.callbackNode=a,n}return s!==null&&s!==null&&U(s),e.callbackPriority=2,e.callbackNode=null,2}function Fg(e,n){if(pn!==0&&pn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(kl()&&e.callbackNode!==a)return null;var s=ge;return s=Dt(e,e===Ge?s:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),s===0?null:(yg(e,s,n),Bg(e,ft()),e.callbackNode!=null&&e.callbackNode===a?Fg.bind(null,e):null)}function Hg(e,n){if(kl())return null;yg(e,n,!0)}function qS(){ay(function(){(we&6)!==0?kt(pt,WS):zg()})}function Pf(){if(Oa===0){var e=Yr;e===0&&(e=wt,wt<<=1,(wt&261888)===0&&(wt=256)),Oa=e}return Oa}function Gg(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:$o(""+e)}function Vg(e,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,e.id&&a.setAttribute("form",e.id),n.parentNode.insertBefore(a,n),e=new FormData(e),a.parentNode.removeChild(a),e}function YS(e,n,a,s,u){if(n==="submit"&&a&&a.stateNode===u){var f=Gg((u[Mn]||null).action),_=s.submitter;_&&(n=(n=_[Mn]||null)?Gg(n.formAction):_.getAttribute("formAction"),n!==null&&(f=n,_=null));var E=new il("action","action",null,s,u);e.push({event:E,listeners:[{instance:null,listener:function(){if(s.defaultPrevented){if(Oa!==0){var P=_?Vg(u,_):new FormData(u);tf(a,{pending:!0,data:P,method:u.method,action:f},null,P)}}else typeof f=="function"&&(E.preventDefault(),P=_?Vg(u,_):new FormData(u),tf(a,{pending:!0,data:P,method:u.method,action:f},f,P))},currentTarget:u}]})}}for(var If=0;If<_u.length;If++){var zf=_u[If],jS=zf.toLowerCase(),ZS=zf[0].toUpperCase()+zf.slice(1);yi(jS,"on"+ZS)}yi(Sp,"onAnimationEnd"),yi(yp,"onAnimationIteration"),yi(xp,"onAnimationStart"),yi("dblclick","onDoubleClick"),yi("focusin","onFocus"),yi("focusout","onBlur"),yi(fS,"onTransitionRun"),yi(hS,"onTransitionStart"),yi(dS,"onTransitionCancel"),yi(Mp,"onTransitionEnd"),Pt("onMouseEnter",["mouseout","mouseover"]),Pt("onMouseLeave",["mouseout","mouseover"]),Pt("onPointerEnter",["pointerout","pointerover"]),Pt("onPointerLeave",["pointerout","pointerover"]),Nt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Nt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Nt("onBeforeInput",["compositionend","keypress","textInput","paste"]),Nt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Nt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Nt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var bo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),KS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(bo));function kg(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var s=e[a],u=s.event;s=s.listeners;t:{var f=void 0;if(n)for(var _=s.length-1;0<=_;_--){var E=s[_],P=E.instance,J=E.currentTarget;if(E=E.listener,P!==f&&u.isPropagationStopped())break t;f=E,u.currentTarget=J;try{f(u)}catch(ct){sl(ct)}u.currentTarget=null,f=P}else for(_=0;_<s.length;_++){if(E=s[_],P=E.instance,J=E.currentTarget,E=E.listener,P!==f&&u.isPropagationStopped())break t;f=E,u.currentTarget=J;try{f(u)}catch(ct){sl(ct)}u.currentTarget=null,f=P}}}}function de(e,n){var a=n[ks];a===void 0&&(a=n[ks]=new Set);var s=e+"__bubble";a.has(s)||(Xg(n,e,2,!1),a.add(s))}function Bf(e,n,a){var s=0;n&&(s|=4),Xg(a,e,s,n)}var ql="_reactListening"+Math.random().toString(36).slice(2);function Ff(e){if(!e[ql]){e[ql]=!0,bt.forEach(function(a){a!=="selectionchange"&&(KS.has(a)||Bf(a,!1,e),Bf(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[ql]||(n[ql]=!0,Bf("selectionchange",!1,n))}}function Xg(e,n,a,s){switch(S_(n)){case 2:var u=by;break;case 8:u=Ty;break;default:u=th}a=u.bind(null,n,a,e),u=void 0,!au||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),s?u!==void 0?e.addEventListener(n,a,{capture:!0,passive:u}):e.addEventListener(n,a,!0):u!==void 0?e.addEventListener(n,a,{passive:u}):e.addEventListener(n,a,!1)}function Hf(e,n,a,s,u){var f=s;if((n&1)===0&&(n&2)===0&&s!==null)t:for(;;){if(s===null)return;var _=s.tag;if(_===3||_===4){var E=s.stateNode.containerInfo;if(E===u)break;if(_===4)for(_=s.return;_!==null;){var P=_.tag;if((P===3||P===4)&&_.stateNode.containerInfo===u)return;_=_.return}for(;E!==null;){if(_=A(E),_===null)return;if(P=_.tag,P===5||P===6||P===26||P===27){s=f=_;continue t}E=E.parentNode}}s=s.return}Zd(function(){var J=f,ct=nu(a),mt=[];t:{var $=Ep.get(e);if($!==void 0){var rt=il,Bt=e;switch(e){case"keypress":if(el(a)===0)break t;case"keydown":case"keyup":rt=k0;break;case"focusin":Bt="focus",rt=lu;break;case"focusout":Bt="blur",rt=lu;break;case"beforeblur":case"afterblur":rt=lu;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":rt=Jd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":rt=U0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":rt=q0;break;case Sp:case yp:case xp:rt=O0;break;case Mp:rt=j0;break;case"scroll":case"scrollend":rt=w0;break;case"wheel":rt=K0;break;case"copy":case"cut":case"paste":rt=I0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":rt=tp;break;case"toggle":case"beforetoggle":rt=J0}var Qt=(n&4)!==0,Be=!Qt&&(e==="scroll"||e==="scrollend"),W=Qt?$!==null?$+"Capture":null:$;Qt=[];for(var F=J,Q;F!==null;){var ht=F;if(Q=ht.stateNode,ht=ht.tag,ht!==5&&ht!==26&&ht!==27||Q===null||W===null||(ht=Ws(F,W),ht!=null&&Qt.push(To(F,ht,Q))),Be)break;F=F.return}0<Qt.length&&($=new rt($,Bt,null,a,ct),mt.push({event:$,listeners:Qt}))}}if((n&7)===0){t:{if($=e==="mouseover"||e==="pointerover",rt=e==="mouseout"||e==="pointerout",$&&a!==eu&&(Bt=a.relatedTarget||a.fromElement)&&(A(Bt)||Bt[Vi]))break t;if((rt||$)&&($=ct.window===ct?ct:($=ct.ownerDocument)?$.defaultView||$.parentWindow:window,rt?(Bt=a.relatedTarget||a.toElement,rt=J,Bt=Bt?A(Bt):null,Bt!==null&&(Be=c(Bt),Qt=Bt.tag,Bt!==Be||Qt!==5&&Qt!==27&&Qt!==6)&&(Bt=null)):(rt=null,Bt=J),rt!==Bt)){if(Qt=Jd,ht="onMouseLeave",W="onMouseEnter",F="mouse",(e==="pointerout"||e==="pointerover")&&(Qt=tp,ht="onPointerLeave",W="onPointerEnter",F="pointer"),Be=rt==null?$:nt(rt),Q=Bt==null?$:nt(Bt),$=new Qt(ht,F+"leave",rt,a,ct),$.target=Be,$.relatedTarget=Q,ht=null,A(ct)===J&&(Qt=new Qt(W,F+"enter",Bt,a,ct),Qt.target=Q,Qt.relatedTarget=Be,ht=Qt),Be=ht,rt&&Bt)e:{for(Qt=QS,W=rt,F=Bt,Q=0,ht=W;ht;ht=Qt(ht))Q++;ht=0;for(var qt=F;qt;qt=Qt(qt))ht++;for(;0<Q-ht;)W=Qt(W),Q--;for(;0<ht-Q;)F=Qt(F),ht--;for(;Q--;){if(W===F||F!==null&&W===F.alternate){Qt=W;break e}W=Qt(W),F=Qt(F)}Qt=null}else Qt=null;rt!==null&&Wg(mt,$,rt,Qt,!1),Bt!==null&&Be!==null&&Wg(mt,Be,Bt,Qt,!0)}}t:{if($=J?nt(J):window,rt=$.nodeName&&$.nodeName.toLowerCase(),rt==="select"||rt==="input"&&$.type==="file")var Ae=lp;else if(sp($))if(cp)Ae=lS;else{Ae=sS;var Ht=rS}else rt=$.nodeName,!rt||rt.toLowerCase()!=="input"||$.type!=="checkbox"&&$.type!=="radio"?J&&tu(J.elementType)&&(Ae=lp):Ae=oS;if(Ae&&(Ae=Ae(e,J))){op(mt,Ae,a,ct);break t}Ht&&Ht(e,$,J),e==="focusout"&&J&&$.type==="number"&&J.memoizedProps.value!=null&&Dn($,"number",$.value)}switch(Ht=J?nt(J):window,e){case"focusin":(sp(Ht)||Ht.contentEditable==="true")&&(Fr=Ht,pu=J,$s=null);break;case"focusout":$s=pu=Fr=null;break;case"mousedown":mu=!0;break;case"contextmenu":case"mouseup":case"dragend":mu=!1,_p(mt,a,ct);break;case"selectionchange":if(uS)break;case"keydown":case"keyup":_p(mt,a,ct)}var oe;if(uu)t:{switch(e){case"compositionstart":var _e="onCompositionStart";break t;case"compositionend":_e="onCompositionEnd";break t;case"compositionupdate":_e="onCompositionUpdate";break t}_e=void 0}else Br?ap(e,a)&&(_e="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(_e="onCompositionStart");_e&&(ep&&a.locale!=="ko"&&(Br||_e!=="onCompositionStart"?_e==="onCompositionEnd"&&Br&&(oe=Kd()):(va=ct,ru="value"in va?va.value:va.textContent,Br=!0)),Ht=Yl(J,_e),0<Ht.length&&(_e=new $d(_e,e,null,a,ct),mt.push({event:_e,listeners:Ht}),oe?_e.data=oe:(oe=rp(a),oe!==null&&(_e.data=oe)))),(oe=tS?eS(e,a):nS(e,a))&&(_e=Yl(J,"onBeforeInput"),0<_e.length&&(Ht=new $d("onBeforeInput","beforeinput",null,a,ct),mt.push({event:Ht,listeners:_e}),Ht.data=oe)),YS(mt,e,J,a,ct)}kg(mt,n)})}function To(e,n,a){return{instance:e,listener:n,currentTarget:a}}function Yl(e,n){for(var a=n+"Capture",s=[];e!==null;){var u=e,f=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||f===null||(u=Ws(e,a),u!=null&&s.unshift(To(e,u,f)),u=Ws(e,n),u!=null&&s.push(To(e,u,f))),e.tag===3)return s;e=e.return}return[]}function QS(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Wg(e,n,a,s,u){for(var f=n._reactName,_=[];a!==null&&a!==s;){var E=a,P=E.alternate,J=E.stateNode;if(E=E.tag,P!==null&&P===s)break;E!==5&&E!==26&&E!==27||J===null||(P=J,u?(J=Ws(a,f),J!=null&&_.unshift(To(a,J,P))):u||(J=Ws(a,f),J!=null&&_.push(To(a,J,P)))),a=a.return}_.length!==0&&e.push({event:n,listeners:_})}var JS=/\r\n?/g,$S=/\u0000|\uFFFD/g;function qg(e){return(typeof e=="string"?e:""+e).replace(JS,`
`).replace($S,"")}function Yg(e,n){return n=qg(n),qg(e)===n}function ze(e,n,a,s,u,f){switch(a){case"children":typeof s=="string"?n==="body"||n==="textarea"&&s===""||Hn(e,s):(typeof s=="number"||typeof s=="bigint")&&n!=="body"&&Hn(e,""+s);break;case"className":ke(e,"class",s);break;case"tabIndex":ke(e,"tabindex",s);break;case"dir":case"role":case"viewBox":case"width":case"height":ke(e,a,s);break;case"style":Yd(e,s,f);break;case"data":if(n!=="object"){ke(e,"data",s);break}case"src":case"href":if(s===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(s==null||typeof s=="function"||typeof s=="symbol"||typeof s=="boolean"){e.removeAttribute(a);break}s=$o(""+s),e.setAttribute(a,s);break;case"action":case"formAction":if(typeof s=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&ze(e,n,"name",u.name,u,null),ze(e,n,"formEncType",u.formEncType,u,null),ze(e,n,"formMethod",u.formMethod,u,null),ze(e,n,"formTarget",u.formTarget,u,null)):(ze(e,n,"encType",u.encType,u,null),ze(e,n,"method",u.method,u,null),ze(e,n,"target",u.target,u,null)));if(s==null||typeof s=="symbol"||typeof s=="boolean"){e.removeAttribute(a);break}s=$o(""+s),e.setAttribute(a,s);break;case"onClick":s!=null&&(e.onclick=ki);break;case"onScroll":s!=null&&de("scroll",e);break;case"onScrollEnd":s!=null&&de("scrollend",e);break;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(u.children!=null)throw Error(r(60));e.innerHTML=a}}break;case"multiple":e.multiple=s&&typeof s!="function"&&typeof s!="symbol";break;case"muted":e.muted=s&&typeof s!="function"&&typeof s!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(s==null||typeof s=="function"||typeof s=="boolean"||typeof s=="symbol"){e.removeAttribute("xlink:href");break}a=$o(""+s),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":s!=null&&typeof s!="function"&&typeof s!="symbol"?e.setAttribute(a,""+s):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":s&&typeof s!="function"&&typeof s!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":s===!0?e.setAttribute(a,""):s!==!1&&s!=null&&typeof s!="function"&&typeof s!="symbol"?e.setAttribute(a,s):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":s!=null&&typeof s!="function"&&typeof s!="symbol"&&!isNaN(s)&&1<=s?e.setAttribute(a,s):e.removeAttribute(a);break;case"rowSpan":case"start":s==null||typeof s=="function"||typeof s=="symbol"||isNaN(s)?e.removeAttribute(a):e.setAttribute(a,s);break;case"popover":de("beforetoggle",e),de("toggle",e),Se(e,"popover",s);break;case"xlinkActuate":Te(e,"http://www.w3.org/1999/xlink","xlink:actuate",s);break;case"xlinkArcrole":Te(e,"http://www.w3.org/1999/xlink","xlink:arcrole",s);break;case"xlinkRole":Te(e,"http://www.w3.org/1999/xlink","xlink:role",s);break;case"xlinkShow":Te(e,"http://www.w3.org/1999/xlink","xlink:show",s);break;case"xlinkTitle":Te(e,"http://www.w3.org/1999/xlink","xlink:title",s);break;case"xlinkType":Te(e,"http://www.w3.org/1999/xlink","xlink:type",s);break;case"xmlBase":Te(e,"http://www.w3.org/XML/1998/namespace","xml:base",s);break;case"xmlLang":Te(e,"http://www.w3.org/XML/1998/namespace","xml:lang",s);break;case"xmlSpace":Te(e,"http://www.w3.org/XML/1998/namespace","xml:space",s);break;case"is":Se(e,"is",s);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=C0.get(a)||a,Se(e,a,s))}}function Gf(e,n,a,s,u,f){switch(a){case"style":Yd(e,s,f);break;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(u.children!=null)throw Error(r(60));e.innerHTML=a}}break;case"children":typeof s=="string"?Hn(e,s):(typeof s=="number"||typeof s=="bigint")&&Hn(e,""+s);break;case"onScroll":s!=null&&de("scroll",e);break;case"onScrollEnd":s!=null&&de("scrollend",e);break;case"onClick":s!=null&&(e.onclick=ki);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Ut.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),f=e[Mn]||null,f=f!=null?f[a]:null,typeof f=="function"&&e.removeEventListener(n,f,u),typeof s=="function")){typeof f!="function"&&f!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(n,s,u);break t}a in e?e[a]=s:s===!0?e.setAttribute(a,""):Se(e,a,s)}}}function Cn(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":de("error",e),de("load",e);var s=!1,u=!1,f;for(f in a)if(a.hasOwnProperty(f)){var _=a[f];if(_!=null)switch(f){case"src":s=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:ze(e,n,f,_,a,null)}}u&&ze(e,n,"srcSet",a.srcSet,a,null),s&&ze(e,n,"src",a.src,a,null);return;case"input":de("invalid",e);var E=f=_=u=null,P=null,J=null;for(s in a)if(a.hasOwnProperty(s)){var ct=a[s];if(ct!=null)switch(s){case"name":u=ct;break;case"type":_=ct;break;case"checked":P=ct;break;case"defaultChecked":J=ct;break;case"value":f=ct;break;case"defaultValue":E=ct;break;case"children":case"dangerouslySetInnerHTML":if(ct!=null)throw Error(r(137,n));break;default:ze(e,n,s,ct,a,null)}}In(e,f,E,P,J,_,u,!1);return;case"select":de("invalid",e),s=_=f=null;for(u in a)if(a.hasOwnProperty(u)&&(E=a[u],E!=null))switch(u){case"value":f=E;break;case"defaultValue":_=E;break;case"multiple":s=E;default:ze(e,n,u,E,a,null)}n=f,a=_,e.multiple=!!s,n!=null?Je(e,!!s,n,!1):a!=null&&Je(e,!!s,a,!0);return;case"textarea":de("invalid",e),f=u=s=null;for(_ in a)if(a.hasOwnProperty(_)&&(E=a[_],E!=null))switch(_){case"value":s=E;break;case"defaultValue":u=E;break;case"children":f=E;break;case"dangerouslySetInnerHTML":if(E!=null)throw Error(r(91));break;default:ze(e,n,_,E,a,null)}Pr(e,s,u,f);return;case"option":for(P in a)if(a.hasOwnProperty(P)&&(s=a[P],s!=null))switch(P){case"selected":e.selected=s&&typeof s!="function"&&typeof s!="symbol";break;default:ze(e,n,P,s,a,null)}return;case"dialog":de("beforetoggle",e),de("toggle",e),de("cancel",e),de("close",e);break;case"iframe":case"object":de("load",e);break;case"video":case"audio":for(s=0;s<bo.length;s++)de(bo[s],e);break;case"image":de("error",e),de("load",e);break;case"details":de("toggle",e);break;case"embed":case"source":case"link":de("error",e),de("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(J in a)if(a.hasOwnProperty(J)&&(s=a[J],s!=null))switch(J){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:ze(e,n,J,s,a,null)}return;default:if(tu(n)){for(ct in a)a.hasOwnProperty(ct)&&(s=a[ct],s!==void 0&&Gf(e,n,ct,s,a,void 0));return}}for(E in a)a.hasOwnProperty(E)&&(s=a[E],s!=null&&ze(e,n,E,s,a,null))}function ty(e,n,a,s){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,f=null,_=null,E=null,P=null,J=null,ct=null;for(rt in a){var mt=a[rt];if(a.hasOwnProperty(rt)&&mt!=null)switch(rt){case"checked":break;case"value":break;case"defaultValue":P=mt;default:s.hasOwnProperty(rt)||ze(e,n,rt,null,s,mt)}}for(var $ in s){var rt=s[$];if(mt=a[$],s.hasOwnProperty($)&&(rt!=null||mt!=null))switch($){case"type":f=rt;break;case"name":u=rt;break;case"checked":J=rt;break;case"defaultChecked":ct=rt;break;case"value":_=rt;break;case"defaultValue":E=rt;break;case"children":case"dangerouslySetInnerHTML":if(rt!=null)throw Error(r(137,n));break;default:rt!==mt&&ze(e,n,$,rt,s,mt)}}Pe(e,_,E,P,J,ct,f,u);return;case"select":rt=_=E=$=null;for(f in a)if(P=a[f],a.hasOwnProperty(f)&&P!=null)switch(f){case"value":break;case"multiple":rt=P;default:s.hasOwnProperty(f)||ze(e,n,f,null,s,P)}for(u in s)if(f=s[u],P=a[u],s.hasOwnProperty(u)&&(f!=null||P!=null))switch(u){case"value":$=f;break;case"defaultValue":E=f;break;case"multiple":_=f;default:f!==P&&ze(e,n,u,f,s,P)}n=E,a=_,s=rt,$!=null?Je(e,!!a,$,!1):!!s!=!!a&&(n!=null?Je(e,!!a,n,!0):Je(e,!!a,a?[]:"",!1));return;case"textarea":rt=$=null;for(E in a)if(u=a[E],a.hasOwnProperty(E)&&u!=null&&!s.hasOwnProperty(E))switch(E){case"value":break;case"children":break;default:ze(e,n,E,null,s,u)}for(_ in s)if(u=s[_],f=a[_],s.hasOwnProperty(_)&&(u!=null||f!=null))switch(_){case"value":$=u;break;case"defaultValue":rt=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(r(91));break;default:u!==f&&ze(e,n,_,u,s,f)}En(e,$,rt);return;case"option":for(var Bt in a)if($=a[Bt],a.hasOwnProperty(Bt)&&$!=null&&!s.hasOwnProperty(Bt))switch(Bt){case"selected":e.selected=!1;break;default:ze(e,n,Bt,null,s,$)}for(P in s)if($=s[P],rt=a[P],s.hasOwnProperty(P)&&$!==rt&&($!=null||rt!=null))switch(P){case"selected":e.selected=$&&typeof $!="function"&&typeof $!="symbol";break;default:ze(e,n,P,$,s,rt)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var Qt in a)$=a[Qt],a.hasOwnProperty(Qt)&&$!=null&&!s.hasOwnProperty(Qt)&&ze(e,n,Qt,null,s,$);for(J in s)if($=s[J],rt=a[J],s.hasOwnProperty(J)&&$!==rt&&($!=null||rt!=null))switch(J){case"children":case"dangerouslySetInnerHTML":if($!=null)throw Error(r(137,n));break;default:ze(e,n,J,$,s,rt)}return;default:if(tu(n)){for(var Be in a)$=a[Be],a.hasOwnProperty(Be)&&$!==void 0&&!s.hasOwnProperty(Be)&&Gf(e,n,Be,void 0,s,$);for(ct in s)$=s[ct],rt=a[ct],!s.hasOwnProperty(ct)||$===rt||$===void 0&&rt===void 0||Gf(e,n,ct,$,s,rt);return}}for(var W in a)$=a[W],a.hasOwnProperty(W)&&$!=null&&!s.hasOwnProperty(W)&&ze(e,n,W,null,s,$);for(mt in s)$=s[mt],rt=a[mt],!s.hasOwnProperty(mt)||$===rt||$==null&&rt==null||ze(e,n,mt,$,s,rt)}function jg(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function ey(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),s=0;s<a.length;s++){var u=a[s],f=u.transferSize,_=u.initiatorType,E=u.duration;if(f&&E&&jg(_)){for(_=0,E=u.responseEnd,s+=1;s<a.length;s++){var P=a[s],J=P.startTime;if(J>E)break;var ct=P.transferSize,mt=P.initiatorType;ct&&jg(mt)&&(P=P.responseEnd,_+=ct*(P<E?1:(E-J)/(P-J)))}if(--s,n+=8*(f+_)/(u.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Vf=null,kf=null;function jl(e){return e.nodeType===9?e:e.ownerDocument}function Zg(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Kg(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function Xf(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Wf=null;function ny(){var e=window.event;return e&&e.type==="popstate"?e===Wf?!1:(Wf=e,!0):(Wf=null,!1)}var Qg=typeof setTimeout=="function"?setTimeout:void 0,iy=typeof clearTimeout=="function"?clearTimeout:void 0,Jg=typeof Promise=="function"?Promise:void 0,ay=typeof queueMicrotask=="function"?queueMicrotask:typeof Jg<"u"?function(e){return Jg.resolve(null).then(e).catch(ry)}:Qg;function ry(e){setTimeout(function(){throw e})}function Pa(e){return e==="head"}function $g(e,n){var a=n,s=0;do{var u=a.nextSibling;if(e.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(s===0){e.removeChild(u),hs(n);return}s--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")s++;else if(a==="html")Ao(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Ao(a);for(var f=a.firstChild;f;){var _=f.nextSibling,E=f.nodeName;f[tr]||E==="SCRIPT"||E==="STYLE"||E==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=_}}else a==="body"&&Ao(e.ownerDocument.body);a=u}while(a);hs(n)}function t_(e,n){var a=e;e=0;do{var s=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),s&&s.nodeType===8)if(a=s.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=s}while(a)}function qf(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":qf(a),Xs(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function sy(e,n,a,s){for(;e.nodeType===1;){var u=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!s&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(s){if(!e[tr])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(f=e.getAttribute("rel"),f==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(f!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(f=e.getAttribute("src"),(f!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&f&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var f=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===f)return e}else return e;if(e=hi(e.nextSibling),e===null)break}return null}function oy(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=hi(e.nextSibling),e===null))return null;return e}function e_(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=hi(e.nextSibling),e===null))return null;return e}function Yf(e){return e.data==="$?"||e.data==="$~"}function jf(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function ly(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var s=function(){n(),a.removeEventListener("DOMContentLoaded",s)};a.addEventListener("DOMContentLoaded",s),e._reactRetry=s}}function hi(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var Zf=null;function n_(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return hi(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function i_(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function a_(e,n,a){switch(n=jl(a),e){case"html":if(e=n.documentElement,!e)throw Error(r(452));return e;case"head":if(e=n.head,!e)throw Error(r(453));return e;case"body":if(e=n.body,!e)throw Error(r(454));return e;default:throw Error(r(451))}}function Ao(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);Xs(e)}var di=new Map,r_=new Set;function Zl(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ra=j.d;j.d={f:cy,r:uy,D:fy,C:hy,L:dy,m:py,X:gy,S:my,M:_y};function cy(){var e=ra.f(),n=Hl();return e||n}function uy(e){var n=X(e);n!==null&&n.tag===5&&n.type==="form"?Mm(n):ra.r(e)}var cs=typeof document>"u"?null:document;function s_(e,n,a){var s=cs;if(s&&typeof n=="string"&&n){var u=vn(n);u='link[rel="'+e+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),r_.has(u)||(r_.add(u),e={rel:e,crossOrigin:a,href:n},s.querySelector(u)===null&&(n=s.createElement("link"),Cn(n,"link",e),V(n),s.head.appendChild(n)))}}function fy(e){ra.D(e),s_("dns-prefetch",e,null)}function hy(e,n){ra.C(e,n),s_("preconnect",e,n)}function dy(e,n,a){ra.L(e,n,a);var s=cs;if(s&&e&&n){var u='link[rel="preload"][as="'+vn(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+vn(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+vn(a.imageSizes)+'"]')):u+='[href="'+vn(e)+'"]';var f=u;switch(n){case"style":f=us(e);break;case"script":f=fs(e)}di.has(f)||(e=v({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),di.set(f,e),s.querySelector(u)!==null||n==="style"&&s.querySelector(Co(f))||n==="script"&&s.querySelector(Ro(f))||(n=s.createElement("link"),Cn(n,"link",e),V(n),s.head.appendChild(n)))}}function py(e,n){ra.m(e,n);var a=cs;if(a&&e){var s=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+vn(s)+'"][href="'+vn(e)+'"]',f=u;switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=fs(e)}if(!di.has(f)&&(e=v({rel:"modulepreload",href:e},n),di.set(f,e),a.querySelector(u)===null)){switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Ro(f)))return}s=a.createElement("link"),Cn(s,"link",e),V(s),a.head.appendChild(s)}}}function my(e,n,a){ra.S(e,n,a);var s=cs;if(s&&e){var u=it(s).hoistableStyles,f=us(e);n=n||"default";var _=u.get(f);if(!_){var E={loading:0,preload:null};if(_=s.querySelector(Co(f)))E.loading=5;else{e=v({rel:"stylesheet",href:e,"data-precedence":n},a),(a=di.get(f))&&Kf(e,a);var P=_=s.createElement("link");V(P),Cn(P,"link",e),P._p=new Promise(function(J,ct){P.onload=J,P.onerror=ct}),P.addEventListener("load",function(){E.loading|=1}),P.addEventListener("error",function(){E.loading|=2}),E.loading|=4,Kl(_,n,s)}_={type:"stylesheet",instance:_,count:1,state:E},u.set(f,_)}}}function gy(e,n){ra.X(e,n);var a=cs;if(a&&e){var s=it(a).hoistableScripts,u=fs(e),f=s.get(u);f||(f=a.querySelector(Ro(u)),f||(e=v({src:e,async:!0},n),(n=di.get(u))&&Qf(e,n),f=a.createElement("script"),V(f),Cn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(u,f))}}function _y(e,n){ra.M(e,n);var a=cs;if(a&&e){var s=it(a).hoistableScripts,u=fs(e),f=s.get(u);f||(f=a.querySelector(Ro(u)),f||(e=v({src:e,async:!0,type:"module"},n),(n=di.get(u))&&Qf(e,n),f=a.createElement("script"),V(f),Cn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(u,f))}}function o_(e,n,a,s){var u=(u=Et.current)?Zl(u):null;if(!u)throw Error(r(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=us(a.href),a=it(u).hoistableStyles,s=a.get(n),s||(s={type:"style",instance:null,count:0,state:null},a.set(n,s)),s):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=us(a.href);var f=it(u).hoistableStyles,_=f.get(e);if(_||(u=u.ownerDocument||u,_={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(e,_),(f=u.querySelector(Co(e)))&&!f._p&&(_.instance=f,_.state.loading=5),di.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},di.set(e,a),f||vy(u,e,a,_.state))),n&&s===null)throw Error(r(528,""));return _}if(n&&s!==null)throw Error(r(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=fs(a),a=it(u).hoistableScripts,s=a.get(n),s||(s={type:"script",instance:null,count:0,state:null},a.set(n,s)),s):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,e))}}function us(e){return'href="'+vn(e)+'"'}function Co(e){return'link[rel="stylesheet"]['+e+"]"}function l_(e){return v({},e,{"data-precedence":e.precedence,precedence:null})}function vy(e,n,a,s){e.querySelector('link[rel="preload"][as="style"]['+n+"]")?s.loading=1:(n=e.createElement("link"),s.preload=n,n.addEventListener("load",function(){return s.loading|=1}),n.addEventListener("error",function(){return s.loading|=2}),Cn(n,"link",a),V(n),e.head.appendChild(n))}function fs(e){return'[src="'+vn(e)+'"]'}function Ro(e){return"script[async]"+e}function c_(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var s=e.querySelector('style[data-href~="'+vn(a.href)+'"]');if(s)return n.instance=s,V(s),s;var u=v({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return s=(e.ownerDocument||e).createElement("style"),V(s),Cn(s,"style",u),Kl(s,a.precedence,e),n.instance=s;case"stylesheet":u=us(a.href);var f=e.querySelector(Co(u));if(f)return n.state.loading|=4,n.instance=f,V(f),f;s=l_(a),(u=di.get(u))&&Kf(s,u),f=(e.ownerDocument||e).createElement("link"),V(f);var _=f;return _._p=new Promise(function(E,P){_.onload=E,_.onerror=P}),Cn(f,"link",s),n.state.loading|=4,Kl(f,a.precedence,e),n.instance=f;case"script":return f=fs(a.src),(u=e.querySelector(Ro(f)))?(n.instance=u,V(u),u):(s=a,(u=di.get(f))&&(s=v({},a),Qf(s,u)),e=e.ownerDocument||e,u=e.createElement("script"),V(u),Cn(u,"link",s),e.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(r(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(s=n.instance,n.state.loading|=4,Kl(s,a.precedence,e));return n.instance}function Kl(e,n,a){for(var s=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=s.length?s[s.length-1]:null,f=u,_=0;_<s.length;_++){var E=s[_];if(E.dataset.precedence===n)f=E;else if(f!==u)break}f?f.parentNode.insertBefore(e,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function Kf(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function Qf(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var Ql=null;function u_(e,n,a){if(Ql===null){var s=new Map,u=Ql=new Map;u.set(a,s)}else u=Ql,s=u.get(a),s||(s=new Map,u.set(a,s));if(s.has(e))return s;for(s.set(e,null),a=a.getElementsByTagName(e),u=0;u<a.length;u++){var f=a[u];if(!(f[tr]||f[Qe]||e==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var _=f.getAttribute(n)||"";_=e+_;var E=s.get(_);E?E.push(f):s.set(_,[f])}}return s}function f_(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function Sy(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return e=n.disabled,typeof n.precedence=="string"&&e==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function h_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function yy(e,n,a,s){if(a.type==="stylesheet"&&(typeof s.media!="string"||matchMedia(s.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=us(s.href),f=n.querySelector(Co(u));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=Jl.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=f,V(f);return}f=n.ownerDocument||n,s=l_(s),(u=di.get(u))&&Kf(s,u),f=f.createElement("link"),V(f);var _=f;_._p=new Promise(function(E,P){_.onload=E,_.onerror=P}),Cn(f,"link",s),a.instance=f}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=Jl.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var Jf=0;function xy(e,n){return e.stylesheets&&e.count===0&&tc(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var s=setTimeout(function(){if(e.stylesheets&&tc(e,e.stylesheets),e.unsuspend){var f=e.unsuspend;e.unsuspend=null,f()}},6e4+n);0<e.imgBytes&&Jf===0&&(Jf=62500*ey());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&tc(e,e.stylesheets),e.unsuspend)){var f=e.unsuspend;e.unsuspend=null,f()}},(e.imgBytes>Jf?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(s),clearTimeout(u)}}:null}function Jl(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)tc(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var $l=null;function tc(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,$l=new Map,n.forEach(My,e),$l=null,Jl.call(e))}function My(e,n){if(!(n.state.loading&4)){var a=$l.get(e);if(a)var s=a.get(null);else{a=new Map,$l.set(e,a);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<u.length;f++){var _=u[f];(_.nodeName==="LINK"||_.getAttribute("media")!=="not all")&&(a.set(_.dataset.precedence,_),s=_)}s&&a.set(null,s)}u=n.instance,_=u.getAttribute("data-precedence"),f=a.get(_)||s,f===s&&a.set(null,u),a.set(_,u),this.count++,s=Jl.bind(this),u.addEventListener("load",s),u.addEventListener("error",s),f?f.parentNode.insertBefore(u,f.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),n.state.loading|=4}}var wo={$$typeof:N,Provider:null,Consumer:null,_currentValue:Y,_currentValue2:Y,_threadCount:0};function Ey(e,n,a,s,u,f,_,E,P){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=be(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=be(0),this.hiddenUpdates=be(null),this.identifierPrefix=s,this.onUncaughtError=u,this.onCaughtError=f,this.onRecoverableError=_,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=P,this.incompleteTransitions=new Map}function d_(e,n,a,s,u,f,_,E,P,J,ct,mt){return e=new Ey(e,n,a,_,P,J,ct,mt,E),n=1,f===!0&&(n|=24),f=Qn(3,null,null,n),e.current=f,f.stateNode=e,n=Du(),n.refCount++,e.pooledCache=n,n.refCount++,f.memoizedState={element:s,isDehydrated:a,cache:n},Ou(f),e}function p_(e){return e?(e=Vr,e):Vr}function m_(e,n,a,s,u,f){u=p_(u),s.context===null?s.context=u:s.pendingContext=u,s=ba(n),s.payload={element:a},f=f===void 0?null:f,f!==null&&(s.callback=f),a=Ta(e,s,n),a!==null&&(qn(a,e,n),so(a,e,n))}function g_(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function $f(e,n){g_(e,n),(e=e.alternate)&&g_(e,n)}function __(e){if(e.tag===13||e.tag===31){var n=ar(e,67108864);n!==null&&qn(n,e,67108864),$f(e,67108864)}}function v_(e){if(e.tag===13||e.tag===31){var n=ni();n=Ja(n);var a=ar(e,n);a!==null&&qn(a,e,n),$f(e,n)}}var ec=!0;function by(e,n,a,s){var u=O.T;O.T=null;var f=j.p;try{j.p=2,th(e,n,a,s)}finally{j.p=f,O.T=u}}function Ty(e,n,a,s){var u=O.T;O.T=null;var f=j.p;try{j.p=8,th(e,n,a,s)}finally{j.p=f,O.T=u}}function th(e,n,a,s){if(ec){var u=eh(s);if(u===null)Hf(e,n,s,nc,a),y_(e,s);else if(Cy(u,e,n,a,s))s.stopPropagation();else if(y_(e,s),n&4&&-1<Ay.indexOf(e)){for(;u!==null;){var f=X(u);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var _=Ct(f.pendingLanes);if(_!==0){var E=f;for(E.pendingLanes|=2,E.entangledLanes|=2;_;){var P=1<<31-$t(_);E.entanglements[1]|=P,_&=~P}Ii(f),(we&6)===0&&(Bl=ft()+500,Eo(0))}}break;case 31:case 13:E=ar(f,2),E!==null&&qn(E,f,2),Hl(),$f(f,2)}if(f=eh(s),f===null&&Hf(e,n,s,nc,a),f===u)break;u=f}u!==null&&s.stopPropagation()}else Hf(e,n,s,null,a)}}function eh(e){return e=nu(e),nh(e)}var nc=null;function nh(e){if(nc=null,e=A(e),e!==null){var n=c(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=h(n),e!==null)return e;e=null}else if(a===31){if(e=d(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return nc=e,null}function S_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Mt()){case pt:return 2;case Gt:return 8;case Rt:case It:return 32;case me:return 268435456;default:return 32}default:return 32}}var ih=!1,Ia=null,za=null,Ba=null,Do=new Map,Uo=new Map,Fa=[],Ay="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function y_(e,n){switch(e){case"focusin":case"focusout":Ia=null;break;case"dragenter":case"dragleave":za=null;break;case"mouseover":case"mouseout":Ba=null;break;case"pointerover":case"pointerout":Do.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Uo.delete(n.pointerId)}}function Lo(e,n,a,s,u,f){return e===null||e.nativeEvent!==f?(e={blockedOn:n,domEventName:a,eventSystemFlags:s,nativeEvent:f,targetContainers:[u]},n!==null&&(n=X(n),n!==null&&__(n)),e):(e.eventSystemFlags|=s,n=e.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),e)}function Cy(e,n,a,s,u){switch(n){case"focusin":return Ia=Lo(Ia,e,n,a,s,u),!0;case"dragenter":return za=Lo(za,e,n,a,s,u),!0;case"mouseover":return Ba=Lo(Ba,e,n,a,s,u),!0;case"pointerover":var f=u.pointerId;return Do.set(f,Lo(Do.get(f)||null,e,n,a,s,u)),!0;case"gotpointercapture":return f=u.pointerId,Uo.set(f,Lo(Uo.get(f)||null,e,n,a,s,u)),!0}return!1}function x_(e){var n=A(e.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){e.blockedOn=n,$a(e.priority,function(){v_(a)});return}}else if(n===31){if(n=d(a),n!==null){e.blockedOn=n,$a(e.priority,function(){v_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ic(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=eh(e.nativeEvent);if(a===null){a=e.nativeEvent;var s=new a.constructor(a.type,a);eu=s,a.target.dispatchEvent(s),eu=null}else return n=X(a),n!==null&&__(n),e.blockedOn=a,!1;n.shift()}return!0}function M_(e,n,a){ic(e)&&a.delete(n)}function Ry(){ih=!1,Ia!==null&&ic(Ia)&&(Ia=null),za!==null&&ic(za)&&(za=null),Ba!==null&&ic(Ba)&&(Ba=null),Do.forEach(M_),Uo.forEach(M_)}function ac(e,n){e.blockedOn===n&&(e.blockedOn=null,ih||(ih=!0,o.unstable_scheduleCallback(o.unstable_NormalPriority,Ry)))}var rc=null;function E_(e){rc!==e&&(rc=e,o.unstable_scheduleCallback(o.unstable_NormalPriority,function(){rc===e&&(rc=null);for(var n=0;n<e.length;n+=3){var a=e[n],s=e[n+1],u=e[n+2];if(typeof s!="function"){if(nh(s||a)===null)continue;break}var f=X(a);f!==null&&(e.splice(n,3),n-=3,tf(f,{pending:!0,data:u,method:a.method,action:s},s,u))}}))}function hs(e){function n(P){return ac(P,e)}Ia!==null&&ac(Ia,e),za!==null&&ac(za,e),Ba!==null&&ac(Ba,e),Do.forEach(n),Uo.forEach(n);for(var a=0;a<Fa.length;a++){var s=Fa[a];s.blockedOn===e&&(s.blockedOn=null)}for(;0<Fa.length&&(a=Fa[0],a.blockedOn===null);)x_(a),a.blockedOn===null&&Fa.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(s=0;s<a.length;s+=3){var u=a[s],f=a[s+1],_=u[Mn]||null;if(typeof f=="function")_||E_(a);else if(_){var E=null;if(f&&f.hasAttribute("formAction")){if(u=f,_=f[Mn]||null)E=_.formAction;else if(nh(u)!==null)continue}else E=_.action;typeof E=="function"?a[s+1]=E:(a.splice(s,3),s-=3),E_(a)}}}function b_(){function e(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(_){return u=_})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),s||setTimeout(a,20)}function a(){if(!s&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var s=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){s=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function ah(e){this._internalRoot=e}sc.prototype.render=ah.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(r(409));var a=n.current,s=ni();m_(a,s,e,n,null,null)},sc.prototype.unmount=ah.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;m_(e.current,2,null,e,null,null),Hl(),n[Vi]=null}};function sc(e){this._internalRoot=e}sc.prototype.unstable_scheduleHydration=function(e){if(e){var n=Vs();e={blockedOn:null,target:e,priority:n};for(var a=0;a<Fa.length&&n!==0&&n<Fa[a].priority;a++);Fa.splice(a,0,e),a===0&&x_(e)}};var T_=t.version;if(T_!=="19.2.5")throw Error(r(527,T_,"19.2.5"));j.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(r(188)):(e=Object.keys(e).join(","),Error(r(268,e)));return e=m(n),e=e!==null?g(e):null,e=e===null?null:e.stateNode,e};var wy={bundleType:0,version:"19.2.5",rendererPackageName:"react-dom",currentDispatcherRef:O,reconcilerVersion:"19.2.5"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var oc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!oc.isDisabled&&oc.supportsFiber)try{Zt=oc.inject(wy),Vt=oc}catch{}}return Oo.createRoot=function(e,n){if(!l(e))throw Error(r(299));var a=!1,s="",u=Lm,f=Nm,_=Om;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(_=n.onRecoverableError)),n=d_(e,1,!1,null,null,a,s,null,u,f,_,b_),e[Vi]=n.current,Ff(e),new ah(n)},Oo.hydrateRoot=function(e,n,a){if(!l(e))throw Error(r(299));var s=!1,u="",f=Lm,_=Nm,E=Om,P=null;return a!=null&&(a.unstable_strictMode===!0&&(s=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(_=a.onCaughtError),a.onRecoverableError!==void 0&&(E=a.onRecoverableError),a.formState!==void 0&&(P=a.formState)),n=d_(e,1,!0,n,a??null,s,u,P,f,_,E,b_),n.context=p_(null),a=n.current,s=ni(),s=Ja(s),u=ba(s),u.callback=null,Ta(a,u,s),a=s,n.current.lanes=a,xn(n,a),Ii(n),e[Vi]=n.current,Ff(e),new sc(n)},Oo.version="19.2.5",Oo}var P_;function Hy(){if(P_)return oh.exports;P_=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(t){console.error(t)}}return o(),oh.exports=Fy(),oh.exports}var Gy=Hy();const Vy=Vv(Gy),Ld="/api/v1";async function ky(){const o=await fetch(`${Ld}/jobs`);if(!o.ok)throw new Error(await o.text());return o.json()}async function Xy(o){const t=await fetch(`${Ld}/jobs/estimate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!t.ok)throw new Error(await t.text());return t.json()}async function Wy(o){const t=await fetch(`${Ld}/jobs/${o}/cancel`,{method:"POST"});if(!t.ok)throw new Error(await t.text());return t.json()}class wr extends Error{constructor(t,i){const r=new.target.prototype;super(`${t}: Status code '${i}'`),this.statusCode=i,this.__proto__=r}}class Nd extends Error{constructor(t="A timeout occurred."){const i=new.target.prototype;super(t),this.__proto__=i}}class Ri extends Error{constructor(t="An abort occurred."){const i=new.target.prototype;super(t),this.__proto__=i}}class qy extends Error{constructor(t,i){const r=new.target.prototype;super(t),this.transport=i,this.errorType="UnsupportedTransportError",this.__proto__=r}}class Yy extends Error{constructor(t,i){const r=new.target.prototype;super(t),this.transport=i,this.errorType="DisabledTransportError",this.__proto__=r}}class jy extends Error{constructor(t,i){const r=new.target.prototype;super(t),this.transport=i,this.errorType="FailedToStartTransportError",this.__proto__=r}}class I_ extends Error{constructor(t){const i=new.target.prototype;super(t),this.errorType="FailedToNegotiateWithServerError",this.__proto__=i}}class Zy extends Error{constructor(t,i){const r=new.target.prototype;super(t),this.innerErrors=i,this.__proto__=r}}class kv{constructor(t,i,r){this.statusCode=t,this.statusText=i,this.content=r}}class Yc{get(t,i){return this.send({...i,method:"GET",url:t})}post(t,i){return this.send({...i,method:"POST",url:t})}delete(t,i){return this.send({...i,method:"DELETE",url:t})}getCookieString(t){return""}}var dt;(function(o){o[o.Trace=0]="Trace",o[o.Debug=1]="Debug",o[o.Information=2]="Information",o[o.Warning=3]="Warning",o[o.Error=4]="Error",o[o.Critical=5]="Critical",o[o.None=6]="None"})(dt||(dt={}));class Vo{constructor(){}log(t,i){}}Vo.instance=new Vo;const Ky="8.0.17";class fn{static isRequired(t,i){if(t==null)throw new Error(`The '${i}' argument is required.`)}static isNotEmpty(t,i){if(!t||t.match(/^\s*$/))throw new Error(`The '${i}' argument should not be empty.`)}static isIn(t,i,r){if(!(t in i))throw new Error(`Unknown ${r} value: ${t}.`)}}class Ze{static get isBrowser(){return!Ze.isNode&&typeof window=="object"&&typeof window.document=="object"}static get isWebWorker(){return!Ze.isNode&&typeof self=="object"&&"importScripts"in self}static get isReactNative(){return!Ze.isNode&&typeof window=="object"&&typeof window.document>"u"}static get isNode(){return typeof process<"u"&&process.release&&process.release.name==="node"}}function ko(o,t){let i="";return Ur(o)?(i=`Binary data of length ${o.byteLength}`,t&&(i+=`. Content: '${Qy(o)}'`)):typeof o=="string"&&(i=`String data of length ${o.length}`,t&&(i+=`. Content: '${o}'`)),i}function Qy(o){const t=new Uint8Array(o);let i="";return t.forEach(r=>{const l=r<16?"0":"";i+=`0x${l}${r.toString(16)} `}),i.substr(0,i.length-1)}function Ur(o){return o&&typeof ArrayBuffer<"u"&&(o instanceof ArrayBuffer||o.constructor&&o.constructor.name==="ArrayBuffer")}async function Xv(o,t,i,r,l,c){const h={},[d,p]=Ds();h[d]=p,o.log(dt.Trace,`(${t} transport) sending data. ${ko(l,c.logMessageContent)}.`);const m=Ur(l)?"arraybuffer":"text",g=await i.post(r,{content:l,headers:{...h,...c.headers},responseType:m,timeout:c.timeout,withCredentials:c.withCredentials});o.log(dt.Trace,`(${t} transport) request complete. Response status: ${g.statusCode}.`)}function Jy(o){return o===void 0?new Gc(dt.Information):o===null?Vo.instance:o.log!==void 0?o:new Gc(o)}class $y{constructor(t,i){this._subject=t,this._observer=i}dispose(){const t=this._subject.observers.indexOf(this._observer);t>-1&&this._subject.observers.splice(t,1),this._subject.observers.length===0&&this._subject.cancelCallback&&this._subject.cancelCallback().catch(i=>{})}}class Gc{constructor(t){this._minLevel=t,this.out=console}log(t,i){if(t>=this._minLevel){const r=`[${new Date().toISOString()}] ${dt[t]}: ${i}`;switch(t){case dt.Critical:case dt.Error:this.out.error(r);break;case dt.Warning:this.out.warn(r);break;case dt.Information:this.out.info(r);break;default:this.out.log(r);break}}}}function Ds(){let o="X-SignalR-User-Agent";return Ze.isNode&&(o="User-Agent"),[o,tx(Ky,ex(),ix(),nx())]}function tx(o,t,i,r){let l="Microsoft SignalR/";const c=o.split(".");return l+=`${c[0]}.${c[1]}`,l+=` (${o}; `,t&&t!==""?l+=`${t}; `:l+="Unknown OS; ",l+=`${i}`,r?l+=`; ${r}`:l+="; Unknown Runtime Version",l+=")",l}function ex(){if(Ze.isNode)switch(process.platform){case"win32":return"Windows NT";case"darwin":return"macOS";case"linux":return"Linux";default:return process.platform}else return""}function nx(){if(Ze.isNode)return process.versions.node}function ix(){return Ze.isNode?"NodeJS":"Browser"}function fh(o){return o.stack?o.stack:o.message?o.message:`${o}`}function ax(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("could not find global")}class rx extends Yc{constructor(t){if(super(),this._logger=t,typeof fetch>"u"||Ze.isNode){const i=typeof __webpack_require__=="function"?__non_webpack_require__:require;this._jar=new(i("tough-cookie")).CookieJar,typeof fetch>"u"?this._fetchType=i("node-fetch"):this._fetchType=fetch,this._fetchType=i("fetch-cookie")(this._fetchType,this._jar)}else this._fetchType=fetch.bind(ax());if(typeof AbortController>"u"){const i=typeof __webpack_require__=="function"?__non_webpack_require__:require;this._abortControllerType=i("abort-controller")}else this._abortControllerType=AbortController}async send(t){if(t.abortSignal&&t.abortSignal.aborted)throw new Ri;if(!t.method)throw new Error("No method defined.");if(!t.url)throw new Error("No url defined.");const i=new this._abortControllerType;let r;t.abortSignal&&(t.abortSignal.onabort=()=>{i.abort(),r=new Ri});let l=null;if(t.timeout){const p=t.timeout;l=setTimeout(()=>{i.abort(),this._logger.log(dt.Warning,"Timeout from HTTP request."),r=new Nd},p)}t.content===""&&(t.content=void 0),t.content&&(t.headers=t.headers||{},Ur(t.content)?t.headers["Content-Type"]="application/octet-stream":t.headers["Content-Type"]="text/plain;charset=UTF-8");let c;try{c=await this._fetchType(t.url,{body:t.content,cache:"no-cache",credentials:t.withCredentials===!0?"include":"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",...t.headers},method:t.method,mode:"cors",redirect:"follow",signal:i.signal})}catch(p){throw r||(this._logger.log(dt.Warning,`Error from HTTP request. ${p}.`),p)}finally{l&&clearTimeout(l),t.abortSignal&&(t.abortSignal.onabort=null)}if(!c.ok){const p=await z_(c,"text");throw new wr(p||c.statusText,c.status)}const d=await z_(c,t.responseType);return new kv(c.status,c.statusText,d)}getCookieString(t){let i="";return Ze.isNode&&this._jar&&this._jar.getCookies(t,(r,l)=>i=l.join("; ")),i}}function z_(o,t){let i;switch(t){case"arraybuffer":i=o.arrayBuffer();break;case"text":i=o.text();break;case"blob":case"document":case"json":throw new Error(`${t} is not supported.`);default:i=o.text();break}return i}class sx extends Yc{constructor(t){super(),this._logger=t}send(t){return t.abortSignal&&t.abortSignal.aborted?Promise.reject(new Ri):t.method?t.url?new Promise((i,r)=>{const l=new XMLHttpRequest;l.open(t.method,t.url,!0),l.withCredentials=t.withCredentials===void 0?!0:t.withCredentials,l.setRequestHeader("X-Requested-With","XMLHttpRequest"),t.content===""&&(t.content=void 0),t.content&&(Ur(t.content)?l.setRequestHeader("Content-Type","application/octet-stream"):l.setRequestHeader("Content-Type","text/plain;charset=UTF-8"));const c=t.headers;c&&Object.keys(c).forEach(h=>{l.setRequestHeader(h,c[h])}),t.responseType&&(l.responseType=t.responseType),t.abortSignal&&(t.abortSignal.onabort=()=>{l.abort(),r(new Ri)}),t.timeout&&(l.timeout=t.timeout),l.onload=()=>{t.abortSignal&&(t.abortSignal.onabort=null),l.status>=200&&l.status<300?i(new kv(l.status,l.statusText,l.response||l.responseText)):r(new wr(l.response||l.responseText||l.statusText,l.status))},l.onerror=()=>{this._logger.log(dt.Warning,`Error from HTTP request. ${l.status}: ${l.statusText}.`),r(new wr(l.statusText,l.status))},l.ontimeout=()=>{this._logger.log(dt.Warning,"Timeout from HTTP request."),r(new Nd)},l.send(t.content)}):Promise.reject(new Error("No url defined.")):Promise.reject(new Error("No method defined."))}}class ox extends Yc{constructor(t){if(super(),typeof fetch<"u"||Ze.isNode)this._httpClient=new rx(t);else if(typeof XMLHttpRequest<"u")this._httpClient=new sx(t);else throw new Error("No usable HttpClient found.")}send(t){return t.abortSignal&&t.abortSignal.aborted?Promise.reject(new Ri):t.method?t.url?this._httpClient.send(t):Promise.reject(new Error("No url defined.")):Promise.reject(new Error("No method defined."))}getCookieString(t){return this._httpClient.getCookieString(t)}}class ri{static write(t){return`${t}${ri.RecordSeparator}`}static parse(t){if(t[t.length-1]!==ri.RecordSeparator)throw new Error("Message is incomplete.");const i=t.split(ri.RecordSeparator);return i.pop(),i}}ri.RecordSeparatorCode=30;ri.RecordSeparator=String.fromCharCode(ri.RecordSeparatorCode);class lx{writeHandshakeRequest(t){return ri.write(JSON.stringify(t))}parseHandshakeResponse(t){let i,r;if(Ur(t)){const d=new Uint8Array(t),p=d.indexOf(ri.RecordSeparatorCode);if(p===-1)throw new Error("Message is incomplete.");const m=p+1;i=String.fromCharCode.apply(null,Array.prototype.slice.call(d.slice(0,m))),r=d.byteLength>m?d.slice(m).buffer:null}else{const d=t,p=d.indexOf(ri.RecordSeparator);if(p===-1)throw new Error("Message is incomplete.");const m=p+1;i=d.substring(0,m),r=d.length>m?d.substring(m):null}const l=ri.parse(i),c=JSON.parse(l[0]);if(c.type)throw new Error("Expected a handshake response from the server.");return[r,c]}}var ae;(function(o){o[o.Invocation=1]="Invocation",o[o.StreamItem=2]="StreamItem",o[o.Completion=3]="Completion",o[o.StreamInvocation=4]="StreamInvocation",o[o.CancelInvocation=5]="CancelInvocation",o[o.Ping=6]="Ping",o[o.Close=7]="Close",o[o.Ack=8]="Ack",o[o.Sequence=9]="Sequence"})(ae||(ae={}));class cx{constructor(){this.observers=[]}next(t){for(const i of this.observers)i.next(t)}error(t){for(const i of this.observers)i.error&&i.error(t)}complete(){for(const t of this.observers)t.complete&&t.complete()}subscribe(t){return this.observers.push(t),new $y(this,t)}}class ux{constructor(t,i,r){this._bufferSize=1e5,this._messages=[],this._totalMessageCount=0,this._waitForSequenceMessage=!1,this._nextReceivingSequenceId=1,this._latestReceivedSequenceId=0,this._bufferedByteCount=0,this._reconnectInProgress=!1,this._protocol=t,this._connection=i,this._bufferSize=r}async _send(t){const i=this._protocol.writeMessage(t);let r=Promise.resolve();if(this._isInvocationMessage(t)){this._totalMessageCount++;let l=()=>{},c=()=>{};Ur(i)?this._bufferedByteCount+=i.byteLength:this._bufferedByteCount+=i.length,this._bufferedByteCount>=this._bufferSize&&(r=new Promise((h,d)=>{l=h,c=d})),this._messages.push(new fx(i,this._totalMessageCount,l,c))}try{this._reconnectInProgress||await this._connection.send(i)}catch{this._disconnected()}await r}_ack(t){let i=-1;for(let r=0;r<this._messages.length;r++){const l=this._messages[r];if(l._id<=t.sequenceId)i=r,Ur(l._message)?this._bufferedByteCount-=l._message.byteLength:this._bufferedByteCount-=l._message.length,l._resolver();else if(this._bufferedByteCount<this._bufferSize)l._resolver();else break}i!==-1&&(this._messages=this._messages.slice(i+1))}_shouldProcessMessage(t){if(this._waitForSequenceMessage)return t.type!==ae.Sequence?!1:(this._waitForSequenceMessage=!1,!0);if(!this._isInvocationMessage(t))return!0;const i=this._nextReceivingSequenceId;return this._nextReceivingSequenceId++,i<=this._latestReceivedSequenceId?(i===this._latestReceivedSequenceId&&this._ackTimer(),!1):(this._latestReceivedSequenceId=i,this._ackTimer(),!0)}_resetSequence(t){if(t.sequenceId>this._nextReceivingSequenceId){this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));return}this._nextReceivingSequenceId=t.sequenceId}_disconnected(){this._reconnectInProgress=!0,this._waitForSequenceMessage=!0}async _resend(){const t=this._messages.length!==0?this._messages[0]._id:this._totalMessageCount+1;await this._connection.send(this._protocol.writeMessage({type:ae.Sequence,sequenceId:t}));const i=this._messages;for(const r of i)await this._connection.send(r._message);this._reconnectInProgress=!1}_dispose(t){t??(t=new Error("Unable to reconnect to server."));for(const i of this._messages)i._rejector(t)}_isInvocationMessage(t){switch(t.type){case ae.Invocation:case ae.StreamItem:case ae.Completion:case ae.StreamInvocation:case ae.CancelInvocation:return!0;case ae.Close:case ae.Sequence:case ae.Ping:case ae.Ack:return!1}}_ackTimer(){this._ackTimerHandle===void 0&&(this._ackTimerHandle=setTimeout(async()=>{try{this._reconnectInProgress||await this._connection.send(this._protocol.writeMessage({type:ae.Ack,sequenceId:this._latestReceivedSequenceId}))}catch{}clearTimeout(this._ackTimerHandle),this._ackTimerHandle=void 0},1e3))}}class fx{constructor(t,i,r,l){this._message=t,this._id=i,this._resolver=r,this._rejector=l}}const hx=30*1e3,dx=15*1e3,px=1e5;var je;(function(o){o.Disconnected="Disconnected",o.Connecting="Connecting",o.Connected="Connected",o.Disconnecting="Disconnecting",o.Reconnecting="Reconnecting"})(je||(je={}));class Od{static create(t,i,r,l,c,h,d){return new Od(t,i,r,l,c,h,d)}constructor(t,i,r,l,c,h,d){this._nextKeepAlive=0,this._freezeEventListener=()=>{this._logger.log(dt.Warning,"The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep")},fn.isRequired(t,"connection"),fn.isRequired(i,"logger"),fn.isRequired(r,"protocol"),this.serverTimeoutInMilliseconds=c??hx,this.keepAliveIntervalInMilliseconds=h??dx,this._statefulReconnectBufferSize=d??px,this._logger=i,this._protocol=r,this.connection=t,this._reconnectPolicy=l,this._handshakeProtocol=new lx,this.connection.onreceive=p=>this._processIncomingData(p),this.connection.onclose=p=>this._connectionClosed(p),this._callbacks={},this._methods={},this._closedCallbacks=[],this._reconnectingCallbacks=[],this._reconnectedCallbacks=[],this._invocationId=0,this._receivedHandshakeResponse=!1,this._connectionState=je.Disconnected,this._connectionStarted=!1,this._cachedPingMessage=this._protocol.writeMessage({type:ae.Ping})}get state(){return this._connectionState}get connectionId(){return this.connection&&this.connection.connectionId||null}get baseUrl(){return this.connection.baseUrl||""}set baseUrl(t){if(this._connectionState!==je.Disconnected&&this._connectionState!==je.Reconnecting)throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");if(!t)throw new Error("The HubConnection url must be a valid url.");this.connection.baseUrl=t}start(){return this._startPromise=this._startWithStateTransitions(),this._startPromise}async _startWithStateTransitions(){if(this._connectionState!==je.Disconnected)return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));this._connectionState=je.Connecting,this._logger.log(dt.Debug,"Starting HubConnection.");try{await this._startInternal(),Ze.isBrowser&&window.document.addEventListener("freeze",this._freezeEventListener),this._connectionState=je.Connected,this._connectionStarted=!0,this._logger.log(dt.Debug,"HubConnection connected successfully.")}catch(t){return this._connectionState=je.Disconnected,this._logger.log(dt.Debug,`HubConnection failed to start successfully because of error '${t}'.`),Promise.reject(t)}}async _startInternal(){this._stopDuringStartError=void 0,this._receivedHandshakeResponse=!1;const t=new Promise((i,r)=>{this._handshakeResolver=i,this._handshakeRejecter=r});await this.connection.start(this._protocol.transferFormat);try{let i=this._protocol.version;this.connection.features.reconnect||(i=1);const r={protocol:this._protocol.name,version:i};if(this._logger.log(dt.Debug,"Sending handshake request."),await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(r)),this._logger.log(dt.Information,`Using HubProtocol '${this._protocol.name}'.`),this._cleanupTimeout(),this._resetTimeoutPeriod(),this._resetKeepAliveInterval(),await t,this._stopDuringStartError)throw this._stopDuringStartError;(this.connection.features.reconnect||!1)&&(this._messageBuffer=new ux(this._protocol,this.connection,this._statefulReconnectBufferSize),this.connection.features.disconnected=this._messageBuffer._disconnected.bind(this._messageBuffer),this.connection.features.resend=()=>{if(this._messageBuffer)return this._messageBuffer._resend()}),this.connection.features.inherentKeepAlive||await this._sendMessage(this._cachedPingMessage)}catch(i){throw this._logger.log(dt.Debug,`Hub handshake failed with error '${i}' during start(). Stopping HubConnection.`),this._cleanupTimeout(),this._cleanupPingTimer(),await this.connection.stop(i),i}}async stop(){const t=this._startPromise;this.connection.features.reconnect=!1,this._stopPromise=this._stopInternal(),await this._stopPromise;try{await t}catch{}}_stopInternal(t){if(this._connectionState===je.Disconnected)return this._logger.log(dt.Debug,`Call to HubConnection.stop(${t}) ignored because it is already in the disconnected state.`),Promise.resolve();if(this._connectionState===je.Disconnecting)return this._logger.log(dt.Debug,`Call to HttpConnection.stop(${t}) ignored because the connection is already in the disconnecting state.`),this._stopPromise;const i=this._connectionState;return this._connectionState=je.Disconnecting,this._logger.log(dt.Debug,"Stopping HubConnection."),this._reconnectDelayHandle?(this._logger.log(dt.Debug,"Connection stopped during reconnect delay. Done reconnecting."),clearTimeout(this._reconnectDelayHandle),this._reconnectDelayHandle=void 0,this._completeClose(),Promise.resolve()):(i===je.Connected&&this._sendCloseMessage(),this._cleanupTimeout(),this._cleanupPingTimer(),this._stopDuringStartError=t||new Ri("The connection was stopped before the hub handshake could complete."),this.connection.stop(t))}async _sendCloseMessage(){try{await this._sendWithProtocol(this._createCloseMessage())}catch{}}stream(t,...i){const[r,l]=this._replaceStreamingParams(i),c=this._createStreamInvocation(t,i,l);let h;const d=new cx;return d.cancelCallback=()=>{const p=this._createCancelInvocation(c.invocationId);return delete this._callbacks[c.invocationId],h.then(()=>this._sendWithProtocol(p))},this._callbacks[c.invocationId]=(p,m)=>{if(m){d.error(m);return}else p&&(p.type===ae.Completion?p.error?d.error(new Error(p.error)):d.complete():d.next(p.item))},h=this._sendWithProtocol(c).catch(p=>{d.error(p),delete this._callbacks[c.invocationId]}),this._launchStreams(r,h),d}_sendMessage(t){return this._resetKeepAliveInterval(),this.connection.send(t)}_sendWithProtocol(t){return this._messageBuffer?this._messageBuffer._send(t):this._sendMessage(this._protocol.writeMessage(t))}send(t,...i){const[r,l]=this._replaceStreamingParams(i),c=this._sendWithProtocol(this._createInvocation(t,i,!0,l));return this._launchStreams(r,c),c}invoke(t,...i){const[r,l]=this._replaceStreamingParams(i),c=this._createInvocation(t,i,!1,l);return new Promise((d,p)=>{this._callbacks[c.invocationId]=(g,v)=>{if(v){p(v);return}else g&&(g.type===ae.Completion?g.error?p(new Error(g.error)):d(g.result):p(new Error(`Unexpected message type: ${g.type}`)))};const m=this._sendWithProtocol(c).catch(g=>{p(g),delete this._callbacks[c.invocationId]});this._launchStreams(r,m)})}on(t,i){!t||!i||(t=t.toLowerCase(),this._methods[t]||(this._methods[t]=[]),this._methods[t].indexOf(i)===-1&&this._methods[t].push(i))}off(t,i){if(!t)return;t=t.toLowerCase();const r=this._methods[t];if(r)if(i){const l=r.indexOf(i);l!==-1&&(r.splice(l,1),r.length===0&&delete this._methods[t])}else delete this._methods[t]}onclose(t){t&&this._closedCallbacks.push(t)}onreconnecting(t){t&&this._reconnectingCallbacks.push(t)}onreconnected(t){t&&this._reconnectedCallbacks.push(t)}_processIncomingData(t){if(this._cleanupTimeout(),this._receivedHandshakeResponse||(t=this._processHandshakeResponse(t),this._receivedHandshakeResponse=!0),t){const i=this._protocol.parseMessages(t,this._logger);for(const r of i)if(!(this._messageBuffer&&!this._messageBuffer._shouldProcessMessage(r)))switch(r.type){case ae.Invocation:this._invokeClientMethod(r).catch(l=>{this._logger.log(dt.Error,`Invoke client method threw error: ${fh(l)}`)});break;case ae.StreamItem:case ae.Completion:{const l=this._callbacks[r.invocationId];if(l){r.type===ae.Completion&&delete this._callbacks[r.invocationId];try{l(r)}catch(c){this._logger.log(dt.Error,`Stream callback threw error: ${fh(c)}`)}}break}case ae.Ping:break;case ae.Close:{this._logger.log(dt.Information,"Close message received from server.");const l=r.error?new Error("Server returned an error on close: "+r.error):void 0;r.allowReconnect===!0?this.connection.stop(l):this._stopPromise=this._stopInternal(l);break}case ae.Ack:this._messageBuffer&&this._messageBuffer._ack(r);break;case ae.Sequence:this._messageBuffer&&this._messageBuffer._resetSequence(r);break;default:this._logger.log(dt.Warning,`Invalid message type: ${r.type}.`);break}}this._resetTimeoutPeriod()}_processHandshakeResponse(t){let i,r;try{[r,i]=this._handshakeProtocol.parseHandshakeResponse(t)}catch(l){const c="Error parsing handshake response: "+l;this._logger.log(dt.Error,c);const h=new Error(c);throw this._handshakeRejecter(h),h}if(i.error){const l="Server returned handshake error: "+i.error;this._logger.log(dt.Error,l);const c=new Error(l);throw this._handshakeRejecter(c),c}else this._logger.log(dt.Debug,"Server handshake complete.");return this._handshakeResolver(),r}_resetKeepAliveInterval(){this.connection.features.inherentKeepAlive||(this._nextKeepAlive=new Date().getTime()+this.keepAliveIntervalInMilliseconds,this._cleanupPingTimer())}_resetTimeoutPeriod(){if((!this.connection.features||!this.connection.features.inherentKeepAlive)&&(this._timeoutHandle=setTimeout(()=>this.serverTimeout(),this.serverTimeoutInMilliseconds),this._pingServerHandle===void 0)){let t=this._nextKeepAlive-new Date().getTime();t<0&&(t=0),this._pingServerHandle=setTimeout(async()=>{if(this._connectionState===je.Connected)try{await this._sendMessage(this._cachedPingMessage)}catch{this._cleanupPingTimer()}},t)}}serverTimeout(){this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."))}async _invokeClientMethod(t){const i=t.target.toLowerCase(),r=this._methods[i];if(!r){this._logger.log(dt.Warning,`No client method with the name '${i}' found.`),t.invocationId&&(this._logger.log(dt.Warning,`No result given for '${i}' method and invocation ID '${t.invocationId}'.`),await this._sendWithProtocol(this._createCompletionMessage(t.invocationId,"Client didn't provide a result.",null)));return}const l=r.slice(),c=!!t.invocationId;let h,d,p;for(const m of l)try{const g=h;h=await m.apply(this,t.arguments),c&&h&&g&&(this._logger.log(dt.Error,`Multiple results provided for '${i}'. Sending error to server.`),p=this._createCompletionMessage(t.invocationId,"Client provided multiple results.",null)),d=void 0}catch(g){d=g,this._logger.log(dt.Error,`A callback for the method '${i}' threw error '${g}'.`)}p?await this._sendWithProtocol(p):c?(d?p=this._createCompletionMessage(t.invocationId,`${d}`,null):h!==void 0?p=this._createCompletionMessage(t.invocationId,null,h):(this._logger.log(dt.Warning,`No result given for '${i}' method and invocation ID '${t.invocationId}'.`),p=this._createCompletionMessage(t.invocationId,"Client didn't provide a result.",null)),await this._sendWithProtocol(p)):h&&this._logger.log(dt.Error,`Result given for '${i}' method but server is not expecting a result.`)}_connectionClosed(t){this._logger.log(dt.Debug,`HubConnection.connectionClosed(${t}) called while in state ${this._connectionState}.`),this._stopDuringStartError=this._stopDuringStartError||t||new Ri("The underlying connection was closed before the hub handshake could complete."),this._handshakeResolver&&this._handshakeResolver(),this._cancelCallbacksWithError(t||new Error("Invocation canceled due to the underlying connection being closed.")),this._cleanupTimeout(),this._cleanupPingTimer(),this._connectionState===je.Disconnecting?this._completeClose(t):this._connectionState===je.Connected&&this._reconnectPolicy?this._reconnect(t):this._connectionState===je.Connected&&this._completeClose(t)}_completeClose(t){if(this._connectionStarted){this._connectionState=je.Disconnected,this._connectionStarted=!1,this._messageBuffer&&(this._messageBuffer._dispose(t??new Error("Connection closed.")),this._messageBuffer=void 0),Ze.isBrowser&&window.document.removeEventListener("freeze",this._freezeEventListener);try{this._closedCallbacks.forEach(i=>i.apply(this,[t]))}catch(i){this._logger.log(dt.Error,`An onclose callback called with error '${t}' threw error '${i}'.`)}}}async _reconnect(t){const i=Date.now();let r=0,l=t!==void 0?t:new Error("Attempting to reconnect due to a unknown error."),c=this._getNextRetryDelay(r++,0,l);if(c===null){this._logger.log(dt.Debug,"Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."),this._completeClose(t);return}if(this._connectionState=je.Reconnecting,t?this._logger.log(dt.Information,`Connection reconnecting because of error '${t}'.`):this._logger.log(dt.Information,"Connection reconnecting."),this._reconnectingCallbacks.length!==0){try{this._reconnectingCallbacks.forEach(h=>h.apply(this,[t]))}catch(h){this._logger.log(dt.Error,`An onreconnecting callback called with error '${t}' threw error '${h}'.`)}if(this._connectionState!==je.Reconnecting){this._logger.log(dt.Debug,"Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");return}}for(;c!==null;){if(this._logger.log(dt.Information,`Reconnect attempt number ${r} will start in ${c} ms.`),await new Promise(h=>{this._reconnectDelayHandle=setTimeout(h,c)}),this._reconnectDelayHandle=void 0,this._connectionState!==je.Reconnecting){this._logger.log(dt.Debug,"Connection left the reconnecting state during reconnect delay. Done reconnecting.");return}try{if(await this._startInternal(),this._connectionState=je.Connected,this._logger.log(dt.Information,"HubConnection reconnected successfully."),this._reconnectedCallbacks.length!==0)try{this._reconnectedCallbacks.forEach(h=>h.apply(this,[this.connection.connectionId]))}catch(h){this._logger.log(dt.Error,`An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${h}'.`)}return}catch(h){if(this._logger.log(dt.Information,`Reconnect attempt failed because of error '${h}'.`),this._connectionState!==je.Reconnecting){this._logger.log(dt.Debug,`Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`),this._connectionState===je.Disconnecting&&this._completeClose();return}l=h instanceof Error?h:new Error(h.toString()),c=this._getNextRetryDelay(r++,Date.now()-i,l)}}this._logger.log(dt.Information,`Reconnect retries have been exhausted after ${Date.now()-i} ms and ${r} failed attempts. Connection disconnecting.`),this._completeClose()}_getNextRetryDelay(t,i,r){try{return this._reconnectPolicy.nextRetryDelayInMilliseconds({elapsedMilliseconds:i,previousRetryCount:t,retryReason:r})}catch(l){return this._logger.log(dt.Error,`IRetryPolicy.nextRetryDelayInMilliseconds(${t}, ${i}) threw error '${l}'.`),null}}_cancelCallbacksWithError(t){const i=this._callbacks;this._callbacks={},Object.keys(i).forEach(r=>{const l=i[r];try{l(null,t)}catch(c){this._logger.log(dt.Error,`Stream 'error' callback called with '${t}' threw error: ${fh(c)}`)}})}_cleanupPingTimer(){this._pingServerHandle&&(clearTimeout(this._pingServerHandle),this._pingServerHandle=void 0)}_cleanupTimeout(){this._timeoutHandle&&clearTimeout(this._timeoutHandle)}_createInvocation(t,i,r,l){if(r)return l.length!==0?{arguments:i,streamIds:l,target:t,type:ae.Invocation}:{arguments:i,target:t,type:ae.Invocation};{const c=this._invocationId;return this._invocationId++,l.length!==0?{arguments:i,invocationId:c.toString(),streamIds:l,target:t,type:ae.Invocation}:{arguments:i,invocationId:c.toString(),target:t,type:ae.Invocation}}}_launchStreams(t,i){if(t.length!==0){i||(i=Promise.resolve());for(const r in t)t[r].subscribe({complete:()=>{i=i.then(()=>this._sendWithProtocol(this._createCompletionMessage(r)))},error:l=>{let c;l instanceof Error?c=l.message:l&&l.toString?c=l.toString():c="Unknown error",i=i.then(()=>this._sendWithProtocol(this._createCompletionMessage(r,c)))},next:l=>{i=i.then(()=>this._sendWithProtocol(this._createStreamItemMessage(r,l)))}})}}_replaceStreamingParams(t){const i=[],r=[];for(let l=0;l<t.length;l++){const c=t[l];if(this._isObservable(c)){const h=this._invocationId;this._invocationId++,i[h]=c,r.push(h.toString()),t.splice(l,1)}}return[i,r]}_isObservable(t){return t&&t.subscribe&&typeof t.subscribe=="function"}_createStreamInvocation(t,i,r){const l=this._invocationId;return this._invocationId++,r.length!==0?{arguments:i,invocationId:l.toString(),streamIds:r,target:t,type:ae.StreamInvocation}:{arguments:i,invocationId:l.toString(),target:t,type:ae.StreamInvocation}}_createCancelInvocation(t){return{invocationId:t,type:ae.CancelInvocation}}_createStreamItemMessage(t,i){return{invocationId:t,item:i,type:ae.StreamItem}}_createCompletionMessage(t,i,r){return i?{error:i,invocationId:t,type:ae.Completion}:{invocationId:t,result:r,type:ae.Completion}}_createCloseMessage(){return{type:ae.Close}}}const mx=[0,2e3,1e4,3e4,null];class B_{constructor(t){this._retryDelays=t!==void 0?[...t,null]:mx}nextRetryDelayInMilliseconds(t){return this._retryDelays[t.previousRetryCount]}}class Dr{}Dr.Authorization="Authorization";Dr.Cookie="Cookie";class gx extends Yc{constructor(t,i){super(),this._innerClient=t,this._accessTokenFactory=i}async send(t){let i=!0;this._accessTokenFactory&&(!this._accessToken||t.url&&t.url.indexOf("/negotiate?")>0)&&(i=!1,this._accessToken=await this._accessTokenFactory()),this._setAuthorizationHeader(t);const r=await this._innerClient.send(t);return i&&r.statusCode===401&&this._accessTokenFactory?(this._accessToken=await this._accessTokenFactory(),this._setAuthorizationHeader(t),await this._innerClient.send(t)):r}_setAuthorizationHeader(t){t.headers||(t.headers={}),this._accessToken?t.headers[Dr.Authorization]=`Bearer ${this._accessToken}`:this._accessTokenFactory&&t.headers[Dr.Authorization]&&delete t.headers[Dr.Authorization]}getCookieString(t){return this._innerClient.getCookieString(t)}}var mn;(function(o){o[o.None=0]="None",o[o.WebSockets=1]="WebSockets",o[o.ServerSentEvents=2]="ServerSentEvents",o[o.LongPolling=4]="LongPolling"})(mn||(mn={}));var On;(function(o){o[o.Text=1]="Text",o[o.Binary=2]="Binary"})(On||(On={}));let _x=class{constructor(){this._isAborted=!1,this.onabort=null}abort(){this._isAborted||(this._isAborted=!0,this.onabort&&this.onabort())}get signal(){return this}get aborted(){return this._isAborted}};class F_{get pollAborted(){return this._pollAbort.aborted}constructor(t,i,r){this._httpClient=t,this._logger=i,this._pollAbort=new _x,this._options=r,this._running=!1,this.onreceive=null,this.onclose=null}async connect(t,i){if(fn.isRequired(t,"url"),fn.isRequired(i,"transferFormat"),fn.isIn(i,On,"transferFormat"),this._url=t,this._logger.log(dt.Trace,"(LongPolling transport) Connecting."),i===On.Binary&&typeof XMLHttpRequest<"u"&&typeof new XMLHttpRequest().responseType!="string")throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");const[r,l]=Ds(),c={[r]:l,...this._options.headers},h={abortSignal:this._pollAbort.signal,headers:c,timeout:1e5,withCredentials:this._options.withCredentials};i===On.Binary&&(h.responseType="arraybuffer");const d=`${t}&_=${Date.now()}`;this._logger.log(dt.Trace,`(LongPolling transport) polling: ${d}.`);const p=await this._httpClient.get(d,h);p.statusCode!==200?(this._logger.log(dt.Error,`(LongPolling transport) Unexpected response code: ${p.statusCode}.`),this._closeError=new wr(p.statusText||"",p.statusCode),this._running=!1):this._running=!0,this._receiving=this._poll(this._url,h)}async _poll(t,i){try{for(;this._running;)try{const r=`${t}&_=${Date.now()}`;this._logger.log(dt.Trace,`(LongPolling transport) polling: ${r}.`);const l=await this._httpClient.get(r,i);l.statusCode===204?(this._logger.log(dt.Information,"(LongPolling transport) Poll terminated by server."),this._running=!1):l.statusCode!==200?(this._logger.log(dt.Error,`(LongPolling transport) Unexpected response code: ${l.statusCode}.`),this._closeError=new wr(l.statusText||"",l.statusCode),this._running=!1):l.content?(this._logger.log(dt.Trace,`(LongPolling transport) data received. ${ko(l.content,this._options.logMessageContent)}.`),this.onreceive&&this.onreceive(l.content)):this._logger.log(dt.Trace,"(LongPolling transport) Poll timed out, reissuing.")}catch(r){this._running?r instanceof Nd?this._logger.log(dt.Trace,"(LongPolling transport) Poll timed out, reissuing."):(this._closeError=r,this._running=!1):this._logger.log(dt.Trace,`(LongPolling transport) Poll errored after shutdown: ${r.message}`)}}finally{this._logger.log(dt.Trace,"(LongPolling transport) Polling complete."),this.pollAborted||this._raiseOnClose()}}async send(t){return this._running?Xv(this._logger,"LongPolling",this._httpClient,this._url,t,this._options):Promise.reject(new Error("Cannot send until the transport is connected"))}async stop(){this._logger.log(dt.Trace,"(LongPolling transport) Stopping polling."),this._running=!1,this._pollAbort.abort();try{await this._receiving,this._logger.log(dt.Trace,`(LongPolling transport) sending DELETE request to ${this._url}.`);const t={},[i,r]=Ds();t[i]=r;const l={headers:{...t,...this._options.headers},timeout:this._options.timeout,withCredentials:this._options.withCredentials};let c;try{await this._httpClient.delete(this._url,l)}catch(h){c=h}c?c instanceof wr&&(c.statusCode===404?this._logger.log(dt.Trace,"(LongPolling transport) A 404 response was returned from sending a DELETE request."):this._logger.log(dt.Trace,`(LongPolling transport) Error sending a DELETE request: ${c}`)):this._logger.log(dt.Trace,"(LongPolling transport) DELETE request accepted.")}finally{this._logger.log(dt.Trace,"(LongPolling transport) Stop finished."),this._raiseOnClose()}}_raiseOnClose(){if(this.onclose){let t="(LongPolling transport) Firing onclose event.";this._closeError&&(t+=" Error: "+this._closeError),this._logger.log(dt.Trace,t),this.onclose(this._closeError)}}}class vx{constructor(t,i,r,l){this._httpClient=t,this._accessToken=i,this._logger=r,this._options=l,this.onreceive=null,this.onclose=null}async connect(t,i){return fn.isRequired(t,"url"),fn.isRequired(i,"transferFormat"),fn.isIn(i,On,"transferFormat"),this._logger.log(dt.Trace,"(SSE transport) Connecting."),this._url=t,this._accessToken&&(t+=(t.indexOf("?")<0?"?":"&")+`access_token=${encodeURIComponent(this._accessToken)}`),new Promise((r,l)=>{let c=!1;if(i!==On.Text){l(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));return}let h;if(Ze.isBrowser||Ze.isWebWorker)h=new this._options.EventSource(t,{withCredentials:this._options.withCredentials});else{const d=this._httpClient.getCookieString(t),p={};p.Cookie=d;const[m,g]=Ds();p[m]=g,h=new this._options.EventSource(t,{withCredentials:this._options.withCredentials,headers:{...p,...this._options.headers}})}try{h.onmessage=d=>{if(this.onreceive)try{this._logger.log(dt.Trace,`(SSE transport) data received. ${ko(d.data,this._options.logMessageContent)}.`),this.onreceive(d.data)}catch(p){this._close(p);return}},h.onerror=d=>{c?this._close():l(new Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."))},h.onopen=()=>{this._logger.log(dt.Information,`SSE connected to ${this._url}`),this._eventSource=h,c=!0,r()}}catch(d){l(d);return}})}async send(t){return this._eventSource?Xv(this._logger,"SSE",this._httpClient,this._url,t,this._options):Promise.reject(new Error("Cannot send until the transport is connected"))}stop(){return this._close(),Promise.resolve()}_close(t){this._eventSource&&(this._eventSource.close(),this._eventSource=void 0,this.onclose&&this.onclose(t))}}class Sx{constructor(t,i,r,l,c,h){this._logger=r,this._accessTokenFactory=i,this._logMessageContent=l,this._webSocketConstructor=c,this._httpClient=t,this.onreceive=null,this.onclose=null,this._headers=h}async connect(t,i){fn.isRequired(t,"url"),fn.isRequired(i,"transferFormat"),fn.isIn(i,On,"transferFormat"),this._logger.log(dt.Trace,"(WebSockets transport) Connecting.");let r;return this._accessTokenFactory&&(r=await this._accessTokenFactory()),new Promise((l,c)=>{t=t.replace(/^http/,"ws");let h;const d=this._httpClient.getCookieString(t);let p=!1;if(Ze.isNode||Ze.isReactNative){const m={},[g,v]=Ds();m[g]=v,r&&(m[Dr.Authorization]=`Bearer ${r}`),d&&(m[Dr.Cookie]=d),h=new this._webSocketConstructor(t,void 0,{headers:{...m,...this._headers}})}else r&&(t+=(t.indexOf("?")<0?"?":"&")+`access_token=${encodeURIComponent(r)}`);h||(h=new this._webSocketConstructor(t)),i===On.Binary&&(h.binaryType="arraybuffer"),h.onopen=m=>{this._logger.log(dt.Information,`WebSocket connected to ${t}.`),this._webSocket=h,p=!0,l()},h.onerror=m=>{let g=null;typeof ErrorEvent<"u"&&m instanceof ErrorEvent?g=m.error:g="There was an error with the transport",this._logger.log(dt.Information,`(WebSockets transport) ${g}.`)},h.onmessage=m=>{if(this._logger.log(dt.Trace,`(WebSockets transport) data received. ${ko(m.data,this._logMessageContent)}.`),this.onreceive)try{this.onreceive(m.data)}catch(g){this._close(g);return}},h.onclose=m=>{if(p)this._close(m);else{let g=null;typeof ErrorEvent<"u"&&m instanceof ErrorEvent?g=m.error:g="WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled.",c(new Error(g))}}})}send(t){return this._webSocket&&this._webSocket.readyState===this._webSocketConstructor.OPEN?(this._logger.log(dt.Trace,`(WebSockets transport) sending data. ${ko(t,this._logMessageContent)}.`),this._webSocket.send(t),Promise.resolve()):Promise.reject("WebSocket is not in the OPEN state")}stop(){return this._webSocket&&this._close(void 0),Promise.resolve()}_close(t){this._webSocket&&(this._webSocket.onclose=()=>{},this._webSocket.onmessage=()=>{},this._webSocket.onerror=()=>{},this._webSocket.close(),this._webSocket=void 0),this._logger.log(dt.Trace,"(WebSockets transport) socket closed."),this.onclose&&(this._isCloseEvent(t)&&(t.wasClean===!1||t.code!==1e3)?this.onclose(new Error(`WebSocket closed with status code: ${t.code} (${t.reason||"no reason given"}).`)):t instanceof Error?this.onclose(t):this.onclose())}_isCloseEvent(t){return t&&typeof t.wasClean=="boolean"&&typeof t.code=="number"}}const H_=100;class yx{constructor(t,i={}){if(this._stopPromiseResolver=()=>{},this.features={},this._negotiateVersion=1,fn.isRequired(t,"url"),this._logger=Jy(i.logger),this.baseUrl=this._resolveUrl(t),i=i||{},i.logMessageContent=i.logMessageContent===void 0?!1:i.logMessageContent,typeof i.withCredentials=="boolean"||i.withCredentials===void 0)i.withCredentials=i.withCredentials===void 0?!0:i.withCredentials;else throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");i.timeout=i.timeout===void 0?100*1e3:i.timeout;let r=null,l=null;if(Ze.isNode&&typeof require<"u"){const c=typeof __webpack_require__=="function"?__non_webpack_require__:require;r=c("ws"),l=c("eventsource")}!Ze.isNode&&typeof WebSocket<"u"&&!i.WebSocket?i.WebSocket=WebSocket:Ze.isNode&&!i.WebSocket&&r&&(i.WebSocket=r),!Ze.isNode&&typeof EventSource<"u"&&!i.EventSource?i.EventSource=EventSource:Ze.isNode&&!i.EventSource&&typeof l<"u"&&(i.EventSource=l),this._httpClient=new gx(i.httpClient||new ox(this._logger),i.accessTokenFactory),this._connectionState="Disconnected",this._connectionStarted=!1,this._options=i,this.onreceive=null,this.onclose=null}async start(t){if(t=t||On.Binary,fn.isIn(t,On,"transferFormat"),this._logger.log(dt.Debug,`Starting connection with transfer format '${On[t]}'.`),this._connectionState!=="Disconnected")return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));if(this._connectionState="Connecting",this._startInternalPromise=this._startInternal(t),await this._startInternalPromise,this._connectionState==="Disconnecting"){const i="Failed to start the HttpConnection before stop() was called.";return this._logger.log(dt.Error,i),await this._stopPromise,Promise.reject(new Ri(i))}else if(this._connectionState!=="Connected"){const i="HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";return this._logger.log(dt.Error,i),Promise.reject(new Ri(i))}this._connectionStarted=!0}send(t){return this._connectionState!=="Connected"?Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State.")):(this._sendQueue||(this._sendQueue=new Pd(this.transport)),this._sendQueue.send(t))}async stop(t){if(this._connectionState==="Disconnected")return this._logger.log(dt.Debug,`Call to HttpConnection.stop(${t}) ignored because the connection is already in the disconnected state.`),Promise.resolve();if(this._connectionState==="Disconnecting")return this._logger.log(dt.Debug,`Call to HttpConnection.stop(${t}) ignored because the connection is already in the disconnecting state.`),this._stopPromise;this._connectionState="Disconnecting",this._stopPromise=new Promise(i=>{this._stopPromiseResolver=i}),await this._stopInternal(t),await this._stopPromise}async _stopInternal(t){this._stopError=t;try{await this._startInternalPromise}catch{}if(this.transport){try{await this.transport.stop()}catch(i){this._logger.log(dt.Error,`HttpConnection.transport.stop() threw error '${i}'.`),this._stopConnection()}this.transport=void 0}else this._logger.log(dt.Debug,"HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.")}async _startInternal(t){let i=this.baseUrl;this._accessTokenFactory=this._options.accessTokenFactory,this._httpClient._accessTokenFactory=this._accessTokenFactory;try{if(this._options.skipNegotiation)if(this._options.transport===mn.WebSockets)this.transport=this._constructTransport(mn.WebSockets),await this._startTransport(i,t);else throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");else{let r=null,l=0;do{if(r=await this._getNegotiationResponse(i),this._connectionState==="Disconnecting"||this._connectionState==="Disconnected")throw new Ri("The connection was stopped during negotiation.");if(r.error)throw new Error(r.error);if(r.ProtocolVersion)throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");if(r.url&&(i=r.url),r.accessToken){const c=r.accessToken;this._accessTokenFactory=()=>c,this._httpClient._accessToken=c,this._httpClient._accessTokenFactory=void 0}l++}while(r.url&&l<H_);if(l===H_&&r.url)throw new Error("Negotiate redirection limit exceeded.");await this._createTransport(i,this._options.transport,r,t)}this.transport instanceof F_&&(this.features.inherentKeepAlive=!0),this._connectionState==="Connecting"&&(this._logger.log(dt.Debug,"The HttpConnection connected successfully."),this._connectionState="Connected")}catch(r){return this._logger.log(dt.Error,"Failed to start the connection: "+r),this._connectionState="Disconnected",this.transport=void 0,this._stopPromiseResolver(),Promise.reject(r)}}async _getNegotiationResponse(t){const i={},[r,l]=Ds();i[r]=l;const c=this._resolveNegotiateUrl(t);this._logger.log(dt.Debug,`Sending negotiation request: ${c}.`);try{const h=await this._httpClient.post(c,{content:"",headers:{...i,...this._options.headers},timeout:this._options.timeout,withCredentials:this._options.withCredentials});if(h.statusCode!==200)return Promise.reject(new Error(`Unexpected status code returned from negotiate '${h.statusCode}'`));const d=JSON.parse(h.content);return(!d.negotiateVersion||d.negotiateVersion<1)&&(d.connectionToken=d.connectionId),d.useStatefulReconnect&&this._options._useStatefulReconnect!==!0?Promise.reject(new I_("Client didn't negotiate Stateful Reconnect but the server did.")):d}catch(h){let d="Failed to complete negotiation with the server: "+h;return h instanceof wr&&h.statusCode===404&&(d=d+" Either this is not a SignalR endpoint or there is a proxy blocking the connection."),this._logger.log(dt.Error,d),Promise.reject(new I_(d))}}_createConnectUrl(t,i){return i?t+(t.indexOf("?")===-1?"?":"&")+`id=${i}`:t}async _createTransport(t,i,r,l){let c=this._createConnectUrl(t,r.connectionToken);if(this._isITransport(i)){this._logger.log(dt.Debug,"Connection was provided an instance of ITransport, using that directly."),this.transport=i,await this._startTransport(c,l),this.connectionId=r.connectionId;return}const h=[],d=r.availableTransports||[];let p=r;for(const m of d){const g=this._resolveTransportOrError(m,i,l,(p==null?void 0:p.useStatefulReconnect)===!0);if(g instanceof Error)h.push(`${m.transport} failed:`),h.push(g);else if(this._isITransport(g)){if(this.transport=g,!p){try{p=await this._getNegotiationResponse(t)}catch(v){return Promise.reject(v)}c=this._createConnectUrl(t,p.connectionToken)}try{await this._startTransport(c,l),this.connectionId=p.connectionId;return}catch(v){if(this._logger.log(dt.Error,`Failed to start the transport '${m.transport}': ${v}`),p=void 0,h.push(new jy(`${m.transport} failed: ${v}`,mn[m.transport])),this._connectionState!=="Connecting"){const y="Failed to select transport before stop() was called.";return this._logger.log(dt.Debug,y),Promise.reject(new Ri(y))}}}}return h.length>0?Promise.reject(new Zy(`Unable to connect to the server with any of the available transports. ${h.join(" ")}`,h)):Promise.reject(new Error("None of the transports supported by the client are supported by the server."))}_constructTransport(t){switch(t){case mn.WebSockets:if(!this._options.WebSocket)throw new Error("'WebSocket' is not supported in your environment.");return new Sx(this._httpClient,this._accessTokenFactory,this._logger,this._options.logMessageContent,this._options.WebSocket,this._options.headers||{});case mn.ServerSentEvents:if(!this._options.EventSource)throw new Error("'EventSource' is not supported in your environment.");return new vx(this._httpClient,this._httpClient._accessToken,this._logger,this._options);case mn.LongPolling:return new F_(this._httpClient,this._logger,this._options);default:throw new Error(`Unknown transport: ${t}.`)}}_startTransport(t,i){return this.transport.onreceive=this.onreceive,this.features.reconnect?this.transport.onclose=async r=>{let l=!1;if(this.features.reconnect)try{this.features.disconnected(),await this.transport.connect(t,i),await this.features.resend()}catch{l=!0}else{this._stopConnection(r);return}l&&this._stopConnection(r)}:this.transport.onclose=r=>this._stopConnection(r),this.transport.connect(t,i)}_resolveTransportOrError(t,i,r,l){const c=mn[t.transport];if(c==null)return this._logger.log(dt.Debug,`Skipping transport '${t.transport}' because it is not supported by this client.`),new Error(`Skipping transport '${t.transport}' because it is not supported by this client.`);if(xx(i,c))if(t.transferFormats.map(d=>On[d]).indexOf(r)>=0){if(c===mn.WebSockets&&!this._options.WebSocket||c===mn.ServerSentEvents&&!this._options.EventSource)return this._logger.log(dt.Debug,`Skipping transport '${mn[c]}' because it is not supported in your environment.'`),new qy(`'${mn[c]}' is not supported in your environment.`,c);this._logger.log(dt.Debug,`Selecting transport '${mn[c]}'.`);try{return this.features.reconnect=c===mn.WebSockets?l:void 0,this._constructTransport(c)}catch(d){return d}}else return this._logger.log(dt.Debug,`Skipping transport '${mn[c]}' because it does not support the requested transfer format '${On[r]}'.`),new Error(`'${mn[c]}' does not support ${On[r]}.`);else return this._logger.log(dt.Debug,`Skipping transport '${mn[c]}' because it was disabled by the client.`),new Yy(`'${mn[c]}' is disabled by the client.`,c)}_isITransport(t){return t&&typeof t=="object"&&"connect"in t}_stopConnection(t){if(this._logger.log(dt.Debug,`HttpConnection.stopConnection(${t}) called while in state ${this._connectionState}.`),this.transport=void 0,t=this._stopError||t,this._stopError=void 0,this._connectionState==="Disconnected"){this._logger.log(dt.Debug,`Call to HttpConnection.stopConnection(${t}) was ignored because the connection is already in the disconnected state.`);return}if(this._connectionState==="Connecting")throw this._logger.log(dt.Warning,`Call to HttpConnection.stopConnection(${t}) was ignored because the connection is still in the connecting state.`),new Error(`HttpConnection.stopConnection(${t}) was called while the connection is still in the connecting state.`);if(this._connectionState==="Disconnecting"&&this._stopPromiseResolver(),t?this._logger.log(dt.Error,`Connection disconnected with error '${t}'.`):this._logger.log(dt.Information,"Connection disconnected."),this._sendQueue&&(this._sendQueue.stop().catch(i=>{this._logger.log(dt.Error,`TransportSendQueue.stop() threw error '${i}'.`)}),this._sendQueue=void 0),this.connectionId=void 0,this._connectionState="Disconnected",this._connectionStarted){this._connectionStarted=!1;try{this.onclose&&this.onclose(t)}catch(i){this._logger.log(dt.Error,`HttpConnection.onclose(${t}) threw error '${i}'.`)}}}_resolveUrl(t){if(t.lastIndexOf("https://",0)===0||t.lastIndexOf("http://",0)===0)return t;if(!Ze.isBrowser)throw new Error(`Cannot resolve '${t}'.`);const i=window.document.createElement("a");return i.href=t,this._logger.log(dt.Information,`Normalizing '${t}' to '${i.href}'.`),i.href}_resolveNegotiateUrl(t){const i=new URL(t);i.pathname.endsWith("/")?i.pathname+="negotiate":i.pathname+="/negotiate";const r=new URLSearchParams(i.searchParams);return r.has("negotiateVersion")||r.append("negotiateVersion",this._negotiateVersion.toString()),r.has("useStatefulReconnect")?r.get("useStatefulReconnect")==="true"&&(this._options._useStatefulReconnect=!0):this._options._useStatefulReconnect===!0&&r.append("useStatefulReconnect","true"),i.search=r.toString(),i.toString()}}function xx(o,t){return!o||(t&o)!==0}class Pd{constructor(t){this._transport=t,this._buffer=[],this._executing=!0,this._sendBufferedData=new lc,this._transportResult=new lc,this._sendLoopPromise=this._sendLoop()}send(t){return this._bufferData(t),this._transportResult||(this._transportResult=new lc),this._transportResult.promise}stop(){return this._executing=!1,this._sendBufferedData.resolve(),this._sendLoopPromise}_bufferData(t){if(this._buffer.length&&typeof this._buffer[0]!=typeof t)throw new Error(`Expected data to be of type ${typeof this._buffer} but was of type ${typeof t}`);this._buffer.push(t),this._sendBufferedData.resolve()}async _sendLoop(){for(;;){if(await this._sendBufferedData.promise,!this._executing){this._transportResult&&this._transportResult.reject("Connection stopped.");break}this._sendBufferedData=new lc;const t=this._transportResult;this._transportResult=void 0;const i=typeof this._buffer[0]=="string"?this._buffer.join(""):Pd._concatBuffers(this._buffer);this._buffer.length=0;try{await this._transport.send(i),t.resolve()}catch(r){t.reject(r)}}}static _concatBuffers(t){const i=t.map(c=>c.byteLength).reduce((c,h)=>c+h),r=new Uint8Array(i);let l=0;for(const c of t)r.set(new Uint8Array(c),l),l+=c.byteLength;return r.buffer}}class lc{constructor(){this.promise=new Promise((t,i)=>[this._resolver,this._rejecter]=[t,i])}resolve(){this._resolver()}reject(t){this._rejecter(t)}}const Mx="json";class Ex{constructor(){this.name=Mx,this.version=2,this.transferFormat=On.Text}parseMessages(t,i){if(typeof t!="string")throw new Error("Invalid input for JSON hub protocol. Expected a string.");if(!t)return[];i===null&&(i=Vo.instance);const r=ri.parse(t),l=[];for(const c of r){const h=JSON.parse(c);if(typeof h.type!="number")throw new Error("Invalid payload.");switch(h.type){case ae.Invocation:this._isInvocationMessage(h);break;case ae.StreamItem:this._isStreamItemMessage(h);break;case ae.Completion:this._isCompletionMessage(h);break;case ae.Ping:break;case ae.Close:break;case ae.Ack:this._isAckMessage(h);break;case ae.Sequence:this._isSequenceMessage(h);break;default:i.log(dt.Information,"Unknown message type '"+h.type+"' ignored.");continue}l.push(h)}return l}writeMessage(t){return ri.write(JSON.stringify(t))}_isInvocationMessage(t){this._assertNotEmptyString(t.target,"Invalid payload for Invocation message."),t.invocationId!==void 0&&this._assertNotEmptyString(t.invocationId,"Invalid payload for Invocation message.")}_isStreamItemMessage(t){if(this._assertNotEmptyString(t.invocationId,"Invalid payload for StreamItem message."),t.item===void 0)throw new Error("Invalid payload for StreamItem message.")}_isCompletionMessage(t){if(t.result&&t.error)throw new Error("Invalid payload for Completion message.");!t.result&&t.error&&this._assertNotEmptyString(t.error,"Invalid payload for Completion message."),this._assertNotEmptyString(t.invocationId,"Invalid payload for Completion message.")}_isAckMessage(t){if(typeof t.sequenceId!="number")throw new Error("Invalid SequenceId for Ack message.")}_isSequenceMessage(t){if(typeof t.sequenceId!="number")throw new Error("Invalid SequenceId for Sequence message.")}_assertNotEmptyString(t,i){if(typeof t!="string"||t==="")throw new Error(i)}}const bx={trace:dt.Trace,debug:dt.Debug,info:dt.Information,information:dt.Information,warn:dt.Warning,warning:dt.Warning,error:dt.Error,critical:dt.Critical,none:dt.None};function Tx(o){const t=bx[o.toLowerCase()];if(typeof t<"u")return t;throw new Error(`Unknown log level: ${o}`)}class Ax{configureLogging(t){if(fn.isRequired(t,"logging"),Cx(t))this.logger=t;else if(typeof t=="string"){const i=Tx(t);this.logger=new Gc(i)}else this.logger=new Gc(t);return this}withUrl(t,i){return fn.isRequired(t,"url"),fn.isNotEmpty(t,"url"),this.url=t,typeof i=="object"?this.httpConnectionOptions={...this.httpConnectionOptions,...i}:this.httpConnectionOptions={...this.httpConnectionOptions,transport:i},this}withHubProtocol(t){return fn.isRequired(t,"protocol"),this.protocol=t,this}withAutomaticReconnect(t){if(this.reconnectPolicy)throw new Error("A reconnectPolicy has already been set.");return t?Array.isArray(t)?this.reconnectPolicy=new B_(t):this.reconnectPolicy=t:this.reconnectPolicy=new B_,this}withServerTimeout(t){return fn.isRequired(t,"milliseconds"),this._serverTimeoutInMilliseconds=t,this}withKeepAliveInterval(t){return fn.isRequired(t,"milliseconds"),this._keepAliveIntervalInMilliseconds=t,this}withStatefulReconnect(t){return this.httpConnectionOptions===void 0&&(this.httpConnectionOptions={}),this.httpConnectionOptions._useStatefulReconnect=!0,this._statefulReconnectBufferSize=t==null?void 0:t.bufferSize,this}build(){const t=this.httpConnectionOptions||{};if(t.logger===void 0&&(t.logger=this.logger),!this.url)throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");const i=new yx(this.url,t);return Od.create(i,this.logger||Vo.instance,this.protocol||new Ex,this.reconnectPolicy,this._serverTimeoutInMilliseconds,this._keepAliveIntervalInMilliseconds,this._statefulReconnectBufferSize)}}function Cx(o){return o.log!==void 0}let cc=null;function Rx(){return cc||(cc=new Ax().withUrl("/hubs/jobs").withAutomaticReconnect().build(),cc.start().catch(console.error)),cc}function wx(o,t){const i=Rx(),r=(l,c,h)=>{l===o&&t({jobId:l,progressPercent:c,status:h})};return i.on("JobProgress",r),i.invoke("Subscribe",o).catch(console.error),()=>{i.off("JobProgress",r),i.invoke("Unsubscribe",o).catch(console.error)}}function Dx({onSelect:o,selected:t}){const[i,r]=Ai.useState([]),[l,c]=Ai.useState(""),[h,d]=Ai.useState(!1),p=Ai.useCallback(async()=>{r(await ky())},[]);Ai.useEffect(()=>{p();const g=setInterval(p,5e3);return()=>clearInterval(g)},[p]),Ai.useEffect(()=>t?wx(t.id,v=>{r(y=>y.map(M=>M.id===v.jobId?{...M,status:v.status,progressPercent:v.progressPercent}:M)),(v.status==="completed"||v.status==="failed")&&p()}):void 0,[t,p]);async function m(g){g.preventDefault(),l.trim()&&(d(!0),await Xy({mapName:l.trim(),halfLambert:!1}),c(""),d(!1),p())}return en.jsxs("div",{style:{padding:8},children:[en.jsxs("form",{onSubmit:m,style:{marginBottom:12},children:[en.jsx("input",{placeholder:"map name",value:l,onChange:g=>c(g.target.value),style:{width:"100%",padding:6,background:"#1a1a1f",border:"1px solid #333",color:"#eee"}}),en.jsx("button",{type:"submit",disabled:h,style:{width:"100%",marginTop:6,padding:6,background:"#2a5",border:"none",color:"#fff",cursor:"pointer"},children:h?"Queueing…":"Estimate"})]}),en.jsx("div",{style:{display:"flex",flexDirection:"column",gap:6},children:i.map(g=>en.jsxs("div",{onClick:()=>o(g.id===(t==null?void 0:t.id)?null:g),style:{padding:8,borderRadius:4,background:(t==null?void 0:t.id)===g.id?"#1a3a5c":"#1a1a1f",border:"1px solid #333",cursor:"pointer",fontSize:12},children:[en.jsx("div",{style:{fontWeight:600},children:g.name}),en.jsxs("div",{style:{color:g.status==="completed"?"#4a5":g.status==="failed"?"#a45":"#888"},children:[g.status," ",g.progressPercent>0&&g.progressPercent<100?`${g.progressPercent}%`:""]}),g.status==="running"&&en.jsx("button",{onClick:v=>{v.stopPropagation(),Wy(g.id),p()},style:{marginTop:4,padding:"2px 8px",background:"#a33",border:"none",color:"#fff",cursor:"pointer",fontSize:11},children:"Cancel"})]},g.id))})]})}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Id="175",Ux=0,G_=1,Lx=2,Wv=1,Nx=2,fa=3,Ka=0,jn=1,ha=2,ja=0,Rs=1,V_=2,k_=3,X_=4,Ox=5,Tr=100,Px=101,Ix=102,zx=103,Bx=104,Fx=200,Hx=201,Gx=202,Vx=203,Xh=204,Wh=205,kx=206,Xx=207,Wx=208,qx=209,Yx=210,jx=211,Zx=212,Kx=213,Qx=214,qh=0,Yh=1,jh=2,Us=3,Zh=4,Kh=5,Qh=6,Jh=7,qv=0,Jx=1,$x=2,Za=0,tM=1,eM=2,nM=3,iM=4,aM=5,rM=6,sM=7,Yv=300,Ls=301,Ns=302,$h=303,td=304,jc=306,ed=1e3,Cr=1001,nd=1002,Di=1003,oM=1004,uc=1005,Bi=1006,hh=1007,Rr=1008,ga=1009,jv=1010,Zv=1011,Xo=1012,zd=1013,Lr=1014,da=1015,jo=1016,Bd=1017,Fd=1018,Wo=1020,Kv=35902,Qv=1021,Jv=1022,wi=1023,$v=1024,t0=1025,qo=1026,Yo=1027,e0=1028,Hd=1029,n0=1030,Gd=1031,Vd=1033,Oc=33776,Pc=33777,Ic=33778,zc=33779,id=35840,ad=35841,rd=35842,sd=35843,od=36196,ld=37492,cd=37496,ud=37808,fd=37809,hd=37810,dd=37811,pd=37812,md=37813,gd=37814,_d=37815,vd=37816,Sd=37817,yd=37818,xd=37819,Md=37820,Ed=37821,Bc=36492,bd=36494,Td=36495,i0=36283,Ad=36284,Cd=36285,Rd=36286,lM=3200,cM=3201,a0=0,uM=1,Ya="",mi="srgb",Os="srgb-linear",Vc="linear",Fe="srgb",ds=7680,W_=519,fM=512,hM=513,dM=514,r0=515,pM=516,mM=517,gM=518,_M=519,q_=35044,Y_="300 es",pa=2e3,kc=2001;class Is{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[t]===void 0&&(r[t]=[]),r[t].indexOf(i)===-1&&r[t].push(i)}hasEventListener(t,i){const r=this._listeners;return r===void 0?!1:r[t]!==void 0&&r[t].indexOf(i)!==-1}removeEventListener(t,i){const r=this._listeners;if(r===void 0)return;const l=r[t];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(t){const i=this._listeners;if(i===void 0)return;const r=i[t.type];if(r!==void 0){t.target=this;const l=r.slice(0);for(let c=0,h=l.length;c<h;c++)l[c].call(this,t);t.target=null}}}const Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dh=Math.PI/180,wd=180/Math.PI;function Zo(){const o=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Ln[o&255]+Ln[o>>8&255]+Ln[o>>16&255]+Ln[o>>24&255]+"-"+Ln[t&255]+Ln[t>>8&255]+"-"+Ln[t>>16&15|64]+Ln[t>>24&255]+"-"+Ln[i&63|128]+Ln[i>>8&255]+"-"+Ln[i>>16&255]+Ln[i>>24&255]+Ln[r&255]+Ln[r>>8&255]+Ln[r>>16&255]+Ln[r>>24&255]).toLowerCase()}function xe(o,t,i){return Math.max(t,Math.min(i,o))}function vM(o,t){return(o%t+t)%t}function ph(o,t,i){return(1-i)*o+i*t}function Po(o,t){switch(t.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function Yn(o,t){switch(t.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}class De{constructor(t=0,i=0){De.prototype.isVector2=!0,this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,r=this.y,l=t.elements;return this.x=l[0]*i+l[3]*r+l[6],this.y=l[1]*i+l[4]*r+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=xe(this.x,t.x,i.x),this.y=xe(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=xe(this.x,t,i),this.y=xe(this.y,t,i),this}clampLength(t,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(xe(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(t)/i;return Math.acos(xe(r,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,r=this.y-t.y;return i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const r=Math.cos(i),l=Math.sin(i),c=this.x-t.x,h=this.y-t.y;return this.x=c*r-h*l+t.x,this.y=c*l+h*r+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class le{constructor(t,i,r,l,c,h,d,p,m){le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,r,l,c,h,d,p,m)}set(t,i,r,l,c,h,d,p,m){const g=this.elements;return g[0]=t,g[1]=l,g[2]=d,g[3]=i,g[4]=c,g[5]=p,g[6]=r,g[7]=h,g[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,r=t.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(t,i,r){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const r=t.elements,l=i.elements,c=this.elements,h=r[0],d=r[3],p=r[6],m=r[1],g=r[4],v=r[7],y=r[2],M=r[5],T=r[8],C=l[0],x=l[3],S=l[6],z=l[1],N=l[4],D=l[7],K=l[2],G=l[5],I=l[8];return c[0]=h*C+d*z+p*K,c[3]=h*x+d*N+p*G,c[6]=h*S+d*D+p*I,c[1]=m*C+g*z+v*K,c[4]=m*x+g*N+v*G,c[7]=m*S+g*D+v*I,c[2]=y*C+M*z+T*K,c[5]=y*x+M*N+T*G,c[8]=y*S+M*D+T*I,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],r=t[1],l=t[2],c=t[3],h=t[4],d=t[5],p=t[6],m=t[7],g=t[8];return i*h*g-i*d*m-r*c*g+r*d*p+l*c*m-l*h*p}invert(){const t=this.elements,i=t[0],r=t[1],l=t[2],c=t[3],h=t[4],d=t[5],p=t[6],m=t[7],g=t[8],v=g*h-d*m,y=d*p-g*c,M=m*c-h*p,T=i*v+r*y+l*M;if(T===0)return this.set(0,0,0,0,0,0,0,0,0);const C=1/T;return t[0]=v*C,t[1]=(l*m-g*r)*C,t[2]=(d*r-l*h)*C,t[3]=y*C,t[4]=(g*i-l*p)*C,t[5]=(l*c-d*i)*C,t[6]=M*C,t[7]=(r*p-m*i)*C,t[8]=(h*i-r*c)*C,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,r,l,c,h,d){const p=Math.cos(c),m=Math.sin(c);return this.set(r*p,r*m,-r*(p*h+m*d)+h+t,-l*m,l*p,-l*(-m*h+p*d)+d+i,0,0,1),this}scale(t,i){return this.premultiply(mh.makeScale(t,i)),this}rotate(t){return this.premultiply(mh.makeRotation(-t)),this}translate(t,i){return this.premultiply(mh.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),r=Math.sin(t);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,r=t.elements;for(let l=0;l<9;l++)if(i[l]!==r[l])return!1;return!0}fromArray(t,i=0){for(let r=0;r<9;r++)this.elements[r]=t[r+i];return this}toArray(t=[],i=0){const r=this.elements;return t[i]=r[0],t[i+1]=r[1],t[i+2]=r[2],t[i+3]=r[3],t[i+4]=r[4],t[i+5]=r[5],t[i+6]=r[6],t[i+7]=r[7],t[i+8]=r[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const mh=new le;function s0(o){for(let t=o.length-1;t>=0;--t)if(o[t]>=65535)return!0;return!1}function Xc(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function SM(){const o=Xc("canvas");return o.style.display="block",o}const j_={};function Fc(o){o in j_||(j_[o]=!0,console.warn(o))}function yM(o,t,i){return new Promise(function(r,l){function c(){switch(o.clientWaitSync(t,o.SYNC_FLUSH_COMMANDS_BIT,0)){case o.WAIT_FAILED:l();break;case o.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:r()}}setTimeout(c,i)})}function xM(o){const t=o.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function MM(o){const t=o.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Z_=new le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),K_=new le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function EM(){const o={enabled:!0,workingColorSpace:Os,spaces:{},convert:function(l,c,h){return this.enabled===!1||c===h||!c||!h||(this.spaces[c].transfer===Fe&&(l.r=ma(l.r),l.g=ma(l.g),l.b=ma(l.b)),this.spaces[c].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===Fe&&(l.r=ws(l.r),l.g=ws(l.g),l.b=ws(l.b))),l},fromWorkingColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},toWorkingColorSpace:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===Ya?Vc:this.spaces[l].transfer},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,h){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return o.define({[Os]:{primaries:t,whitePoint:r,transfer:Vc,toXYZ:Z_,fromXYZ:K_,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:mi},outputColorSpaceConfig:{drawingBufferColorSpace:mi}},[mi]:{primaries:t,whitePoint:r,transfer:Fe,toXYZ:Z_,fromXYZ:K_,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:mi}}}),o}const Re=EM();function ma(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function ws(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let ps;class bM{static getDataURL(t,i="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let r;if(t instanceof HTMLCanvasElement)r=t;else{ps===void 0&&(ps=Xc("canvas")),ps.width=t.width,ps.height=t.height;const l=ps.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),r=ps}return r.toDataURL(i)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=Xc("canvas");i.width=t.width,i.height=t.height;const r=i.getContext("2d");r.drawImage(t,0,0,t.width,t.height);const l=r.getImageData(0,0,t.width,t.height),c=l.data;for(let h=0;h<c.length;h++)c[h]=ma(c[h]/255)*255;return r.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let r=0;r<i.length;r++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[r]=Math.floor(ma(i[r]/255)*255):i[r]=ma(i[r]);return{data:i,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let TM=0;class kd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:TM++}),this.uuid=Zo(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const r={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let h=0,d=l.length;h<d;h++)l[h].isDataTexture?c.push(gh(l[h].image)):c.push(gh(l[h]))}else c=gh(l);r.url=c}return i||(t.images[this.uuid]=r),r}}function gh(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?bM.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let AM=0;class Zn extends Is{constructor(t=Zn.DEFAULT_IMAGE,i=Zn.DEFAULT_MAPPING,r=Cr,l=Cr,c=Bi,h=Rr,d=wi,p=ga,m=Zn.DEFAULT_ANISOTROPY,g=Ya){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:AM++}),this.uuid=Zo(),this.name="",this.source=new kd(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=l,this.magFilter=c,this.minFilter=h,this.anisotropy=m,this.format=d,this.internalFormat=null,this.type=p,this.offset=new De(0,0),this.repeat=new De(1,1),this.center=new De(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(t.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Yv)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ed:t.x=t.x-Math.floor(t.x);break;case Cr:t.x=t.x<0?0:1;break;case nd:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ed:t.y=t.y-Math.floor(t.y);break;case Cr:t.y=t.y<0?0:1;break;case nd:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Zn.DEFAULT_IMAGE=null;Zn.DEFAULT_MAPPING=Yv;Zn.DEFAULT_ANISOTROPY=1;class nn{constructor(t=0,i=0,r=0,l=1){nn.prototype.isVector4=!0,this.x=t,this.y=i,this.z=r,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,r,l){return this.x=t,this.y=i,this.z=r,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,r=this.y,l=this.z,c=this.w,h=t.elements;return this.x=h[0]*i+h[4]*r+h[8]*l+h[12]*c,this.y=h[1]*i+h[5]*r+h[9]*l+h[13]*c,this.z=h[2]*i+h[6]*r+h[10]*l+h[14]*c,this.w=h[3]*i+h[7]*r+h[11]*l+h[15]*c,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,r,l,c;const p=t.elements,m=p[0],g=p[4],v=p[8],y=p[1],M=p[5],T=p[9],C=p[2],x=p[6],S=p[10];if(Math.abs(g-y)<.01&&Math.abs(v-C)<.01&&Math.abs(T-x)<.01){if(Math.abs(g+y)<.1&&Math.abs(v+C)<.1&&Math.abs(T+x)<.1&&Math.abs(m+M+S-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const N=(m+1)/2,D=(M+1)/2,K=(S+1)/2,G=(g+y)/4,I=(v+C)/4,Z=(T+x)/4;return N>D&&N>K?N<.01?(r=0,l=.707106781,c=.707106781):(r=Math.sqrt(N),l=G/r,c=I/r):D>K?D<.01?(r=.707106781,l=0,c=.707106781):(l=Math.sqrt(D),r=G/l,c=Z/l):K<.01?(r=.707106781,l=.707106781,c=0):(c=Math.sqrt(K),r=I/c,l=Z/c),this.set(r,l,c,i),this}let z=Math.sqrt((x-T)*(x-T)+(v-C)*(v-C)+(y-g)*(y-g));return Math.abs(z)<.001&&(z=1),this.x=(x-T)/z,this.y=(v-C)/z,this.z=(y-g)/z,this.w=Math.acos((m+M+S-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=xe(this.x,t.x,i.x),this.y=xe(this.y,t.y,i.y),this.z=xe(this.z,t.z,i.z),this.w=xe(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=xe(this.x,t,i),this.y=xe(this.y,t,i),this.z=xe(this.z,t,i),this.w=xe(this.w,t,i),this}clampLength(t,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(xe(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this.z=t.z+(i.z-t.z)*r,this.w=t.w+(i.w-t.w)*r,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class CM extends Is{constructor(t=1,i=1,r={}){super(),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=1,this.scissor=new nn(0,0,t,i),this.scissorTest=!1,this.viewport=new nn(0,0,t,i);const l={width:t,height:i,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const c=new Zn(l,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);c.flipY=!1,c.generateMipmaps=r.generateMipmaps,c.internalFormat=r.internalFormat,this.textures=[];const h=r.count;for(let d=0;d<h;d++)this.textures[d]=c.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,r=1){if(this.width!==t||this.height!==i||this.depth!==r){this.width=t,this.height=i,this.depth=r;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=r;this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,r=t.textures.length;i<r;i++){this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},t.textures[i].image);this.textures[i].source=new kd(l)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Nr extends CM{constructor(t=1,i=1,r={}){super(t,i,r),this.isWebGLRenderTarget=!0}}class o0 extends Zn{constructor(t=null,i=1,r=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:r,depth:l},this.magFilter=Di,this.minFilter=Di,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class RM extends Zn{constructor(t=null,i=1,r=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:r,depth:l},this.magFilter=Di,this.minFilter=Di,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ko{constructor(t=0,i=0,r=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=r,this._w=l}static slerpFlat(t,i,r,l,c,h,d){let p=r[l+0],m=r[l+1],g=r[l+2],v=r[l+3];const y=c[h+0],M=c[h+1],T=c[h+2],C=c[h+3];if(d===0){t[i+0]=p,t[i+1]=m,t[i+2]=g,t[i+3]=v;return}if(d===1){t[i+0]=y,t[i+1]=M,t[i+2]=T,t[i+3]=C;return}if(v!==C||p!==y||m!==M||g!==T){let x=1-d;const S=p*y+m*M+g*T+v*C,z=S>=0?1:-1,N=1-S*S;if(N>Number.EPSILON){const K=Math.sqrt(N),G=Math.atan2(K,S*z);x=Math.sin(x*G)/K,d=Math.sin(d*G)/K}const D=d*z;if(p=p*x+y*D,m=m*x+M*D,g=g*x+T*D,v=v*x+C*D,x===1-d){const K=1/Math.sqrt(p*p+m*m+g*g+v*v);p*=K,m*=K,g*=K,v*=K}}t[i]=p,t[i+1]=m,t[i+2]=g,t[i+3]=v}static multiplyQuaternionsFlat(t,i,r,l,c,h){const d=r[l],p=r[l+1],m=r[l+2],g=r[l+3],v=c[h],y=c[h+1],M=c[h+2],T=c[h+3];return t[i]=d*T+g*v+p*M-m*y,t[i+1]=p*T+g*y+m*v-d*M,t[i+2]=m*T+g*M+d*y-p*v,t[i+3]=g*T-d*v-p*y-m*M,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,r,l){return this._x=t,this._y=i,this._z=r,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const r=t._x,l=t._y,c=t._z,h=t._order,d=Math.cos,p=Math.sin,m=d(r/2),g=d(l/2),v=d(c/2),y=p(r/2),M=p(l/2),T=p(c/2);switch(h){case"XYZ":this._x=y*g*v+m*M*T,this._y=m*M*v-y*g*T,this._z=m*g*T+y*M*v,this._w=m*g*v-y*M*T;break;case"YXZ":this._x=y*g*v+m*M*T,this._y=m*M*v-y*g*T,this._z=m*g*T-y*M*v,this._w=m*g*v+y*M*T;break;case"ZXY":this._x=y*g*v-m*M*T,this._y=m*M*v+y*g*T,this._z=m*g*T+y*M*v,this._w=m*g*v-y*M*T;break;case"ZYX":this._x=y*g*v-m*M*T,this._y=m*M*v+y*g*T,this._z=m*g*T-y*M*v,this._w=m*g*v+y*M*T;break;case"YZX":this._x=y*g*v+m*M*T,this._y=m*M*v+y*g*T,this._z=m*g*T-y*M*v,this._w=m*g*v-y*M*T;break;case"XZY":this._x=y*g*v-m*M*T,this._y=m*M*v-y*g*T,this._z=m*g*T+y*M*v,this._w=m*g*v+y*M*T;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const r=i/2,l=Math.sin(r);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,r=i[0],l=i[4],c=i[8],h=i[1],d=i[5],p=i[9],m=i[2],g=i[6],v=i[10],y=r+d+v;if(y>0){const M=.5/Math.sqrt(y+1);this._w=.25/M,this._x=(g-p)*M,this._y=(c-m)*M,this._z=(h-l)*M}else if(r>d&&r>v){const M=2*Math.sqrt(1+r-d-v);this._w=(g-p)/M,this._x=.25*M,this._y=(l+h)/M,this._z=(c+m)/M}else if(d>v){const M=2*Math.sqrt(1+d-r-v);this._w=(c-m)/M,this._x=(l+h)/M,this._y=.25*M,this._z=(p+g)/M}else{const M=2*Math.sqrt(1+v-r-d);this._w=(h-l)/M,this._x=(c+m)/M,this._y=(p+g)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let r=t.dot(i)+1;return r<Number.EPSILON?(r=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=r):(this._x=0,this._y=-t.z,this._z=t.y,this._w=r)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=r),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(xe(this.dot(t),-1,1)))}rotateTowards(t,i){const r=this.angleTo(t);if(r===0)return this;const l=Math.min(1,i/r);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const r=t._x,l=t._y,c=t._z,h=t._w,d=i._x,p=i._y,m=i._z,g=i._w;return this._x=r*g+h*d+l*m-c*p,this._y=l*g+h*p+c*d-r*m,this._z=c*g+h*m+r*p-l*d,this._w=h*g-r*d-l*p-c*m,this._onChangeCallback(),this}slerp(t,i){if(i===0)return this;if(i===1)return this.copy(t);const r=this._x,l=this._y,c=this._z,h=this._w;let d=h*t._w+r*t._x+l*t._y+c*t._z;if(d<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,d=-d):this.copy(t),d>=1)return this._w=h,this._x=r,this._y=l,this._z=c,this;const p=1-d*d;if(p<=Number.EPSILON){const M=1-i;return this._w=M*h+i*this._w,this._x=M*r+i*this._x,this._y=M*l+i*this._y,this._z=M*c+i*this._z,this.normalize(),this}const m=Math.sqrt(p),g=Math.atan2(m,d),v=Math.sin((1-i)*g)/m,y=Math.sin(i*g)/m;return this._w=h*v+this._w*y,this._x=r*v+this._x*y,this._y=l*v+this._y*y,this._z=c*v+this._z*y,this._onChangeCallback(),this}slerpQuaternions(t,i,r){return this.copy(t).slerp(i,r)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),r=Math.random(),l=Math.sqrt(1-r),c=Math.sqrt(r);return this.set(l*Math.sin(t),l*Math.cos(t),c*Math.sin(i),c*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class at{constructor(t=0,i=0,r=0){at.prototype.isVector3=!0,this.x=t,this.y=i,this.z=r}set(t,i,r){return r===void 0&&(r=this.z),this.x=t,this.y=i,this.z=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(Q_.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(Q_.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,r=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[3]*r+c[6]*l,this.y=c[1]*i+c[4]*r+c[7]*l,this.z=c[2]*i+c[5]*r+c[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,r=this.y,l=this.z,c=t.elements,h=1/(c[3]*i+c[7]*r+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*r+c[8]*l+c[12])*h,this.y=(c[1]*i+c[5]*r+c[9]*l+c[13])*h,this.z=(c[2]*i+c[6]*r+c[10]*l+c[14])*h,this}applyQuaternion(t){const i=this.x,r=this.y,l=this.z,c=t.x,h=t.y,d=t.z,p=t.w,m=2*(h*l-d*r),g=2*(d*i-c*l),v=2*(c*r-h*i);return this.x=i+p*m+h*v-d*g,this.y=r+p*g+d*m-c*v,this.z=l+p*v+c*g-h*m,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,r=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[4]*r+c[8]*l,this.y=c[1]*i+c[5]*r+c[9]*l,this.z=c[2]*i+c[6]*r+c[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=xe(this.x,t.x,i.x),this.y=xe(this.y,t.y,i.y),this.z=xe(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=xe(this.x,t,i),this.y=xe(this.y,t,i),this.z=xe(this.z,t,i),this}clampLength(t,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(xe(r,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,r){return this.x=t.x+(i.x-t.x)*r,this.y=t.y+(i.y-t.y)*r,this.z=t.z+(i.z-t.z)*r,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const r=t.x,l=t.y,c=t.z,h=i.x,d=i.y,p=i.z;return this.x=l*p-c*d,this.y=c*h-r*p,this.z=r*d-l*h,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const r=t.dot(this)/i;return this.copy(t).multiplyScalar(r)}projectOnPlane(t){return _h.copy(this).projectOnVector(t),this.sub(_h)}reflect(t){return this.sub(_h.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(t)/i;return Math.acos(xe(r,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,r=this.y-t.y,l=this.z-t.z;return i*i+r*r+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,r){const l=Math.sin(i)*t;return this.x=l*Math.sin(r),this.y=Math.cos(i)*t,this.z=l*Math.cos(r),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,r){return this.x=t*Math.sin(i),this.y=r,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),r=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=r,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(t),this.y=i,this.z=r*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _h=new at,Q_=new Ko;class Qo{constructor(t=new at(1/0,1/0,1/0),i=new at(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,r=t.length;i<r;i+=3)this.expandByPoint(Ei.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,r=t.count;i<r;i++)this.expandByPoint(Ei.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,r=t.length;i<r;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const r=Ei.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(r),this.max.copy(t).add(r),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const r=t.geometry;if(r!==void 0){const c=r.getAttribute("position");if(i===!0&&c!==void 0&&t.isInstancedMesh!==!0)for(let h=0,d=c.count;h<d;h++)t.isMesh===!0?t.getVertexPosition(h,Ei):Ei.fromBufferAttribute(c,h),Ei.applyMatrix4(t.matrixWorld),this.expandByPoint(Ei);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),fc.copy(t.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),fc.copy(r.boundingBox)),fc.applyMatrix4(t.matrixWorld),this.union(fc)}const l=t.children;for(let c=0,h=l.length;c<h;c++)this.expandByObject(l[c],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ei),Ei.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,r;return t.normal.x>0?(i=t.normal.x*this.min.x,r=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,r=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,r+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,r+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,r+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,r+=t.normal.z*this.min.z),i<=-t.constant&&r>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Io),hc.subVectors(this.max,Io),ms.subVectors(t.a,Io),gs.subVectors(t.b,Io),_s.subVectors(t.c,Io),Ga.subVectors(gs,ms),Va.subVectors(_s,gs),_r.subVectors(ms,_s);let i=[0,-Ga.z,Ga.y,0,-Va.z,Va.y,0,-_r.z,_r.y,Ga.z,0,-Ga.x,Va.z,0,-Va.x,_r.z,0,-_r.x,-Ga.y,Ga.x,0,-Va.y,Va.x,0,-_r.y,_r.x,0];return!vh(i,ms,gs,_s,hc)||(i=[1,0,0,0,1,0,0,0,1],!vh(i,ms,gs,_s,hc))?!1:(dc.crossVectors(Ga,Va),i=[dc.x,dc.y,dc.z],vh(i,ms,gs,_s,hc))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ei).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ei).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(sa[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),sa[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),sa[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),sa[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),sa[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),sa[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),sa[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),sa[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(sa),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const sa=[new at,new at,new at,new at,new at,new at,new at,new at],Ei=new at,fc=new Qo,ms=new at,gs=new at,_s=new at,Ga=new at,Va=new at,_r=new at,Io=new at,hc=new at,dc=new at,vr=new at;function vh(o,t,i,r,l){for(let c=0,h=o.length-3;c<=h;c+=3){vr.fromArray(o,c);const d=l.x*Math.abs(vr.x)+l.y*Math.abs(vr.y)+l.z*Math.abs(vr.z),p=t.dot(vr),m=i.dot(vr),g=r.dot(vr);if(Math.max(-Math.max(p,m,g),Math.min(p,m,g))>d)return!1}return!0}const wM=new Qo,zo=new at,Sh=new at;class Zc{constructor(t=new at,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const r=this.center;i!==void 0?r.copy(i):wM.setFromPoints(t).getCenter(r);let l=0;for(let c=0,h=t.length;c<h;c++)l=Math.max(l,r.distanceToSquared(t[c]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const r=this.center.distanceToSquared(t);return i.copy(t),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;zo.subVectors(t,this.center);const i=zo.lengthSq();if(i>this.radius*this.radius){const r=Math.sqrt(i),l=(r-this.radius)*.5;this.center.addScaledVector(zo,l/r),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Sh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(zo.copy(t.center).add(Sh)),this.expandByPoint(zo.copy(t.center).sub(Sh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const oa=new at,yh=new at,pc=new at,ka=new at,xh=new at,mc=new at,Mh=new at;class l0{constructor(t=new at,i=new at(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,oa)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=oa.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(oa.copy(this.origin).addScaledVector(this.direction,i),oa.distanceToSquared(t))}distanceSqToSegment(t,i,r,l){yh.copy(t).add(i).multiplyScalar(.5),pc.copy(i).sub(t).normalize(),ka.copy(this.origin).sub(yh);const c=t.distanceTo(i)*.5,h=-this.direction.dot(pc),d=ka.dot(this.direction),p=-ka.dot(pc),m=ka.lengthSq(),g=Math.abs(1-h*h);let v,y,M,T;if(g>0)if(v=h*p-d,y=h*d-p,T=c*g,v>=0)if(y>=-T)if(y<=T){const C=1/g;v*=C,y*=C,M=v*(v+h*y+2*d)+y*(h*v+y+2*p)+m}else y=c,v=Math.max(0,-(h*y+d)),M=-v*v+y*(y+2*p)+m;else y=-c,v=Math.max(0,-(h*y+d)),M=-v*v+y*(y+2*p)+m;else y<=-T?(v=Math.max(0,-(-h*c+d)),y=v>0?-c:Math.min(Math.max(-c,-p),c),M=-v*v+y*(y+2*p)+m):y<=T?(v=0,y=Math.min(Math.max(-c,-p),c),M=y*(y+2*p)+m):(v=Math.max(0,-(h*c+d)),y=v>0?c:Math.min(Math.max(-c,-p),c),M=-v*v+y*(y+2*p)+m);else y=h>0?-c:c,v=Math.max(0,-(h*y+d)),M=-v*v+y*(y+2*p)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(yh).addScaledVector(pc,y),M}intersectSphere(t,i){oa.subVectors(t.center,this.origin);const r=oa.dot(this.direction),l=oa.dot(oa)-r*r,c=t.radius*t.radius;if(l>c)return null;const h=Math.sqrt(c-l),d=r-h,p=r+h;return p<0?null:d<0?this.at(p,i):this.at(d,i)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(t.normal)+t.constant)/i;return r>=0?r:null}intersectPlane(t,i){const r=this.distanceToPlane(t);return r===null?null:this.at(r,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let r,l,c,h,d,p;const m=1/this.direction.x,g=1/this.direction.y,v=1/this.direction.z,y=this.origin;return m>=0?(r=(t.min.x-y.x)*m,l=(t.max.x-y.x)*m):(r=(t.max.x-y.x)*m,l=(t.min.x-y.x)*m),g>=0?(c=(t.min.y-y.y)*g,h=(t.max.y-y.y)*g):(c=(t.max.y-y.y)*g,h=(t.min.y-y.y)*g),r>h||c>l||((c>r||isNaN(r))&&(r=c),(h<l||isNaN(l))&&(l=h),v>=0?(d=(t.min.z-y.z)*v,p=(t.max.z-y.z)*v):(d=(t.max.z-y.z)*v,p=(t.min.z-y.z)*v),r>p||d>l)||((d>r||r!==r)&&(r=d),(p<l||l!==l)&&(l=p),l<0)?null:this.at(r>=0?r:l,i)}intersectsBox(t){return this.intersectBox(t,oa)!==null}intersectTriangle(t,i,r,l,c){xh.subVectors(i,t),mc.subVectors(r,t),Mh.crossVectors(xh,mc);let h=this.direction.dot(Mh),d;if(h>0){if(l)return null;d=1}else if(h<0)d=-1,h=-h;else return null;ka.subVectors(this.origin,t);const p=d*this.direction.dot(mc.crossVectors(ka,mc));if(p<0)return null;const m=d*this.direction.dot(xh.cross(ka));if(m<0||p+m>h)return null;const g=-d*ka.dot(Mh);return g<0?null:this.at(g/h,c)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ke{constructor(t,i,r,l,c,h,d,p,m,g,v,y,M,T,C,x){Ke.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,r,l,c,h,d,p,m,g,v,y,M,T,C,x)}set(t,i,r,l,c,h,d,p,m,g,v,y,M,T,C,x){const S=this.elements;return S[0]=t,S[4]=i,S[8]=r,S[12]=l,S[1]=c,S[5]=h,S[9]=d,S[13]=p,S[2]=m,S[6]=g,S[10]=v,S[14]=y,S[3]=M,S[7]=T,S[11]=C,S[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ke().fromArray(this.elements)}copy(t){const i=this.elements,r=t.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(t){const i=this.elements,r=t.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,r){return t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(t,i,r){return this.set(t.x,i.x,r.x,0,t.y,i.y,r.y,0,t.z,i.z,r.z,0,0,0,0,1),this}extractRotation(t){const i=this.elements,r=t.elements,l=1/vs.setFromMatrixColumn(t,0).length(),c=1/vs.setFromMatrixColumn(t,1).length(),h=1/vs.setFromMatrixColumn(t,2).length();return i[0]=r[0]*l,i[1]=r[1]*l,i[2]=r[2]*l,i[3]=0,i[4]=r[4]*c,i[5]=r[5]*c,i[6]=r[6]*c,i[7]=0,i[8]=r[8]*h,i[9]=r[9]*h,i[10]=r[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,r=t.x,l=t.y,c=t.z,h=Math.cos(r),d=Math.sin(r),p=Math.cos(l),m=Math.sin(l),g=Math.cos(c),v=Math.sin(c);if(t.order==="XYZ"){const y=h*g,M=h*v,T=d*g,C=d*v;i[0]=p*g,i[4]=-p*v,i[8]=m,i[1]=M+T*m,i[5]=y-C*m,i[9]=-d*p,i[2]=C-y*m,i[6]=T+M*m,i[10]=h*p}else if(t.order==="YXZ"){const y=p*g,M=p*v,T=m*g,C=m*v;i[0]=y+C*d,i[4]=T*d-M,i[8]=h*m,i[1]=h*v,i[5]=h*g,i[9]=-d,i[2]=M*d-T,i[6]=C+y*d,i[10]=h*p}else if(t.order==="ZXY"){const y=p*g,M=p*v,T=m*g,C=m*v;i[0]=y-C*d,i[4]=-h*v,i[8]=T+M*d,i[1]=M+T*d,i[5]=h*g,i[9]=C-y*d,i[2]=-h*m,i[6]=d,i[10]=h*p}else if(t.order==="ZYX"){const y=h*g,M=h*v,T=d*g,C=d*v;i[0]=p*g,i[4]=T*m-M,i[8]=y*m+C,i[1]=p*v,i[5]=C*m+y,i[9]=M*m-T,i[2]=-m,i[6]=d*p,i[10]=h*p}else if(t.order==="YZX"){const y=h*p,M=h*m,T=d*p,C=d*m;i[0]=p*g,i[4]=C-y*v,i[8]=T*v+M,i[1]=v,i[5]=h*g,i[9]=-d*g,i[2]=-m*g,i[6]=M*v+T,i[10]=y-C*v}else if(t.order==="XZY"){const y=h*p,M=h*m,T=d*p,C=d*m;i[0]=p*g,i[4]=-v,i[8]=m*g,i[1]=y*v+C,i[5]=h*g,i[9]=M*v-T,i[2]=T*v-M,i[6]=d*g,i[10]=C*v+y}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(DM,t,UM)}lookAt(t,i,r){const l=this.elements;return ii.subVectors(t,i),ii.lengthSq()===0&&(ii.z=1),ii.normalize(),Xa.crossVectors(r,ii),Xa.lengthSq()===0&&(Math.abs(r.z)===1?ii.x+=1e-4:ii.z+=1e-4,ii.normalize(),Xa.crossVectors(r,ii)),Xa.normalize(),gc.crossVectors(ii,Xa),l[0]=Xa.x,l[4]=gc.x,l[8]=ii.x,l[1]=Xa.y,l[5]=gc.y,l[9]=ii.y,l[2]=Xa.z,l[6]=gc.z,l[10]=ii.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const r=t.elements,l=i.elements,c=this.elements,h=r[0],d=r[4],p=r[8],m=r[12],g=r[1],v=r[5],y=r[9],M=r[13],T=r[2],C=r[6],x=r[10],S=r[14],z=r[3],N=r[7],D=r[11],K=r[15],G=l[0],I=l[4],Z=l[8],w=l[12],R=l[1],H=l[5],lt=l[9],st=l[13],gt=l[2],_t=l[6],O=l[10],j=l[14],Y=l[3],xt=l[7],Tt=l[11],L=l[15];return c[0]=h*G+d*R+p*gt+m*Y,c[4]=h*I+d*H+p*_t+m*xt,c[8]=h*Z+d*lt+p*O+m*Tt,c[12]=h*w+d*st+p*j+m*L,c[1]=g*G+v*R+y*gt+M*Y,c[5]=g*I+v*H+y*_t+M*xt,c[9]=g*Z+v*lt+y*O+M*Tt,c[13]=g*w+v*st+y*j+M*L,c[2]=T*G+C*R+x*gt+S*Y,c[6]=T*I+C*H+x*_t+S*xt,c[10]=T*Z+C*lt+x*O+S*Tt,c[14]=T*w+C*st+x*j+S*L,c[3]=z*G+N*R+D*gt+K*Y,c[7]=z*I+N*H+D*_t+K*xt,c[11]=z*Z+N*lt+D*O+K*Tt,c[15]=z*w+N*st+D*j+K*L,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],r=t[4],l=t[8],c=t[12],h=t[1],d=t[5],p=t[9],m=t[13],g=t[2],v=t[6],y=t[10],M=t[14],T=t[3],C=t[7],x=t[11],S=t[15];return T*(+c*p*v-l*m*v-c*d*y+r*m*y+l*d*M-r*p*M)+C*(+i*p*M-i*m*y+c*h*y-l*h*M+l*m*g-c*p*g)+x*(+i*m*v-i*d*M-c*h*v+r*h*M+c*d*g-r*m*g)+S*(-l*d*g-i*p*v+i*d*y+l*h*v-r*h*y+r*p*g)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,r){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=r),this}invert(){const t=this.elements,i=t[0],r=t[1],l=t[2],c=t[3],h=t[4],d=t[5],p=t[6],m=t[7],g=t[8],v=t[9],y=t[10],M=t[11],T=t[12],C=t[13],x=t[14],S=t[15],z=v*x*m-C*y*m+C*p*M-d*x*M-v*p*S+d*y*S,N=T*y*m-g*x*m-T*p*M+h*x*M+g*p*S-h*y*S,D=g*C*m-T*v*m+T*d*M-h*C*M-g*d*S+h*v*S,K=T*v*p-g*C*p-T*d*y+h*C*y+g*d*x-h*v*x,G=i*z+r*N+l*D+c*K;if(G===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/G;return t[0]=z*I,t[1]=(C*y*c-v*x*c-C*l*M+r*x*M+v*l*S-r*y*S)*I,t[2]=(d*x*c-C*p*c+C*l*m-r*x*m-d*l*S+r*p*S)*I,t[3]=(v*p*c-d*y*c-v*l*m+r*y*m+d*l*M-r*p*M)*I,t[4]=N*I,t[5]=(g*x*c-T*y*c+T*l*M-i*x*M-g*l*S+i*y*S)*I,t[6]=(T*p*c-h*x*c-T*l*m+i*x*m+h*l*S-i*p*S)*I,t[7]=(h*y*c-g*p*c+g*l*m-i*y*m-h*l*M+i*p*M)*I,t[8]=D*I,t[9]=(T*v*c-g*C*c-T*r*M+i*C*M+g*r*S-i*v*S)*I,t[10]=(h*C*c-T*d*c+T*r*m-i*C*m-h*r*S+i*d*S)*I,t[11]=(g*d*c-h*v*c-g*r*m+i*v*m+h*r*M-i*d*M)*I,t[12]=K*I,t[13]=(g*C*l-T*v*l+T*r*y-i*C*y-g*r*x+i*v*x)*I,t[14]=(T*d*l-h*C*l-T*r*p+i*C*p+h*r*x-i*d*x)*I,t[15]=(h*v*l-g*d*l+g*r*p-i*v*p-h*r*y+i*d*y)*I,this}scale(t){const i=this.elements,r=t.x,l=t.y,c=t.z;return i[0]*=r,i[4]*=l,i[8]*=c,i[1]*=r,i[5]*=l,i[9]*=c,i[2]*=r,i[6]*=l,i[10]*=c,i[3]*=r,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,r,l))}makeTranslation(t,i,r){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),r=Math.sin(t);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),r=Math.sin(t);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),r=Math.sin(t);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const r=Math.cos(i),l=Math.sin(i),c=1-r,h=t.x,d=t.y,p=t.z,m=c*h,g=c*d;return this.set(m*h+r,m*d-l*p,m*p+l*d,0,m*d+l*p,g*d+r,g*p-l*h,0,m*p-l*d,g*p+l*h,c*p*p+r,0,0,0,0,1),this}makeScale(t,i,r){return this.set(t,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(t,i,r,l,c,h){return this.set(1,r,c,0,t,1,h,0,i,l,1,0,0,0,0,1),this}compose(t,i,r){const l=this.elements,c=i._x,h=i._y,d=i._z,p=i._w,m=c+c,g=h+h,v=d+d,y=c*m,M=c*g,T=c*v,C=h*g,x=h*v,S=d*v,z=p*m,N=p*g,D=p*v,K=r.x,G=r.y,I=r.z;return l[0]=(1-(C+S))*K,l[1]=(M+D)*K,l[2]=(T-N)*K,l[3]=0,l[4]=(M-D)*G,l[5]=(1-(y+S))*G,l[6]=(x+z)*G,l[7]=0,l[8]=(T+N)*I,l[9]=(x-z)*I,l[10]=(1-(y+C))*I,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,r){const l=this.elements;let c=vs.set(l[0],l[1],l[2]).length();const h=vs.set(l[4],l[5],l[6]).length(),d=vs.set(l[8],l[9],l[10]).length();this.determinant()<0&&(c=-c),t.x=l[12],t.y=l[13],t.z=l[14],bi.copy(this);const m=1/c,g=1/h,v=1/d;return bi.elements[0]*=m,bi.elements[1]*=m,bi.elements[2]*=m,bi.elements[4]*=g,bi.elements[5]*=g,bi.elements[6]*=g,bi.elements[8]*=v,bi.elements[9]*=v,bi.elements[10]*=v,i.setFromRotationMatrix(bi),r.x=c,r.y=h,r.z=d,this}makePerspective(t,i,r,l,c,h,d=pa){const p=this.elements,m=2*c/(i-t),g=2*c/(r-l),v=(i+t)/(i-t),y=(r+l)/(r-l);let M,T;if(d===pa)M=-(h+c)/(h-c),T=-2*h*c/(h-c);else if(d===kc)M=-h/(h-c),T=-h*c/(h-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=m,p[4]=0,p[8]=v,p[12]=0,p[1]=0,p[5]=g,p[9]=y,p[13]=0,p[2]=0,p[6]=0,p[10]=M,p[14]=T,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(t,i,r,l,c,h,d=pa){const p=this.elements,m=1/(i-t),g=1/(r-l),v=1/(h-c),y=(i+t)*m,M=(r+l)*g;let T,C;if(d===pa)T=(h+c)*v,C=-2*v;else if(d===kc)T=c*v,C=-1*v;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=2*m,p[4]=0,p[8]=0,p[12]=-y,p[1]=0,p[5]=2*g,p[9]=0,p[13]=-M,p[2]=0,p[6]=0,p[10]=C,p[14]=-T,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(t){const i=this.elements,r=t.elements;for(let l=0;l<16;l++)if(i[l]!==r[l])return!1;return!0}fromArray(t,i=0){for(let r=0;r<16;r++)this.elements[r]=t[r+i];return this}toArray(t=[],i=0){const r=this.elements;return t[i]=r[0],t[i+1]=r[1],t[i+2]=r[2],t[i+3]=r[3],t[i+4]=r[4],t[i+5]=r[5],t[i+6]=r[6],t[i+7]=r[7],t[i+8]=r[8],t[i+9]=r[9],t[i+10]=r[10],t[i+11]=r[11],t[i+12]=r[12],t[i+13]=r[13],t[i+14]=r[14],t[i+15]=r[15],t}}const vs=new at,bi=new Ke,DM=new at(0,0,0),UM=new at(1,1,1),Xa=new at,gc=new at,ii=new at,J_=new Ke,$_=new Ko;class Gi{constructor(t=0,i=0,r=0,l=Gi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=r,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,r,l=this._order){return this._x=t,this._y=i,this._z=r,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,r=!0){const l=t.elements,c=l[0],h=l[4],d=l[8],p=l[1],m=l[5],g=l[9],v=l[2],y=l[6],M=l[10];switch(i){case"XYZ":this._y=Math.asin(xe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-g,M),this._z=Math.atan2(-h,c)):(this._x=Math.atan2(y,m),this._z=0);break;case"YXZ":this._x=Math.asin(-xe(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(d,M),this._z=Math.atan2(p,m)):(this._y=Math.atan2(-v,c),this._z=0);break;case"ZXY":this._x=Math.asin(xe(y,-1,1)),Math.abs(y)<.9999999?(this._y=Math.atan2(-v,M),this._z=Math.atan2(-h,m)):(this._y=0,this._z=Math.atan2(p,c));break;case"ZYX":this._y=Math.asin(-xe(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(y,M),this._z=Math.atan2(p,c)):(this._x=0,this._z=Math.atan2(-h,m));break;case"YZX":this._z=Math.asin(xe(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-g,m),this._y=Math.atan2(-v,c)):(this._x=0,this._y=Math.atan2(d,M));break;case"XZY":this._z=Math.asin(-xe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(y,m),this._y=Math.atan2(d,c)):(this._x=Math.atan2(-g,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,r){return J_.makeRotationFromQuaternion(t),this.setFromRotationMatrix(J_,i,r)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return $_.setFromEuler(this),this.setFromQuaternion($_,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Gi.DEFAULT_ORDER="XYZ";class c0{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let LM=0;const tv=new at,Ss=new Ko,la=new Ke,_c=new at,Bo=new at,NM=new at,OM=new Ko,ev=new at(1,0,0),nv=new at(0,1,0),iv=new at(0,0,1),av={type:"added"},PM={type:"removed"},ys={type:"childadded",child:null},Eh={type:"childremoved",child:null};class Rn extends Is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:LM++}),this.uuid=Zo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rn.DEFAULT_UP.clone();const t=new at,i=new Gi,r=new Ko,l=new at(1,1,1);function c(){r.setFromEuler(i,!1)}function h(){i.setFromQuaternion(r,void 0,!1)}i._onChange(c),r._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new Ke},normalMatrix:{value:new le}}),this.matrix=new Ke,this.matrixWorld=new Ke,this.matrixAutoUpdate=Rn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new c0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return Ss.setFromAxisAngle(t,i),this.quaternion.multiply(Ss),this}rotateOnWorldAxis(t,i){return Ss.setFromAxisAngle(t,i),this.quaternion.premultiply(Ss),this}rotateX(t){return this.rotateOnAxis(ev,t)}rotateY(t){return this.rotateOnAxis(nv,t)}rotateZ(t){return this.rotateOnAxis(iv,t)}translateOnAxis(t,i){return tv.copy(t).applyQuaternion(this.quaternion),this.position.add(tv.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(ev,t)}translateY(t){return this.translateOnAxis(nv,t)}translateZ(t){return this.translateOnAxis(iv,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(la.copy(this.matrixWorld).invert())}lookAt(t,i,r){t.isVector3?_c.copy(t):_c.set(t,i,r);const l=this.parent;this.updateWorldMatrix(!0,!1),Bo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?la.lookAt(Bo,_c,this.up):la.lookAt(_c,Bo,this.up),this.quaternion.setFromRotationMatrix(la),l&&(la.extractRotation(l.matrixWorld),Ss.setFromRotationMatrix(la),this.quaternion.premultiply(Ss.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(av),ys.child=t,this.dispatchEvent(ys),ys.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(PM),Eh.child=t,this.dispatchEvent(Eh),Eh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),la.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),la.multiply(t.parent.matrixWorld)),t.applyMatrix4(la),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(av),ys.child=t,this.dispatchEvent(ys),ys.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let r=0,l=this.children.length;r<l;r++){const h=this.children[r].getObjectByProperty(t,i);if(h!==void 0)return h}}getObjectsByProperty(t,i,r=[]){this[t]===i&&r.push(this);const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].getObjectsByProperty(t,i,r);return r}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bo,t,NM),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bo,OM,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].updateMatrixWorld(t)}updateWorldMatrix(t,i){const r=this.parent;if(t===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",r={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.visibility=this._visibility,l.active=this._active,l.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.geometryCount=this._geometryCount,l.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere={center:l.boundingSphere.center.toArray(),radius:l.boundingSphere.radius}),this.boundingBox!==null&&(l.boundingBox={min:l.boundingBox.min.toArray(),max:l.boundingBox.max.toArray()}));function c(d,p){return d[p.uuid]===void 0&&(d[p.uuid]=p.toJSON(t)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(t.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const p=d.shapes;if(Array.isArray(p))for(let m=0,g=p.length;m<g;m++){const v=p[m];c(t.shapes,v)}else c(t.shapes,p)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let p=0,m=this.material.length;p<m;p++)d.push(c(t.materials,this.material[p]));l.material=d}else l.material=c(t.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const p=this.animations[d];l.animations.push(c(t.animations,p))}}if(i){const d=h(t.geometries),p=h(t.materials),m=h(t.textures),g=h(t.images),v=h(t.shapes),y=h(t.skeletons),M=h(t.animations),T=h(t.nodes);d.length>0&&(r.geometries=d),p.length>0&&(r.materials=p),m.length>0&&(r.textures=m),g.length>0&&(r.images=g),v.length>0&&(r.shapes=v),y.length>0&&(r.skeletons=y),M.length>0&&(r.animations=M),T.length>0&&(r.nodes=T)}return r.object=l,r;function h(d){const p=[];for(const m in d){const g=d[m];delete g.metadata,p.push(g)}return p}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let r=0;r<t.children.length;r++){const l=t.children[r];this.add(l.clone())}return this}}Rn.DEFAULT_UP=new at(0,1,0);Rn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ti=new at,ca=new at,bh=new at,ua=new at,xs=new at,Ms=new at,rv=new at,Th=new at,Ah=new at,Ch=new at,Rh=new nn,wh=new nn,Dh=new nn;class Ci{constructor(t=new at,i=new at,r=new at){this.a=t,this.b=i,this.c=r}static getNormal(t,i,r,l){l.subVectors(r,i),Ti.subVectors(t,i),l.cross(Ti);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(t,i,r,l,c){Ti.subVectors(l,i),ca.subVectors(r,i),bh.subVectors(t,i);const h=Ti.dot(Ti),d=Ti.dot(ca),p=Ti.dot(bh),m=ca.dot(ca),g=ca.dot(bh),v=h*m-d*d;if(v===0)return c.set(0,0,0),null;const y=1/v,M=(m*p-d*g)*y,T=(h*g-d*p)*y;return c.set(1-M-T,T,M)}static containsPoint(t,i,r,l){return this.getBarycoord(t,i,r,l,ua)===null?!1:ua.x>=0&&ua.y>=0&&ua.x+ua.y<=1}static getInterpolation(t,i,r,l,c,h,d,p){return this.getBarycoord(t,i,r,l,ua)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(c,ua.x),p.addScaledVector(h,ua.y),p.addScaledVector(d,ua.z),p)}static getInterpolatedAttribute(t,i,r,l,c,h){return Rh.setScalar(0),wh.setScalar(0),Dh.setScalar(0),Rh.fromBufferAttribute(t,i),wh.fromBufferAttribute(t,r),Dh.fromBufferAttribute(t,l),h.setScalar(0),h.addScaledVector(Rh,c.x),h.addScaledVector(wh,c.y),h.addScaledVector(Dh,c.z),h}static isFrontFacing(t,i,r,l){return Ti.subVectors(r,i),ca.subVectors(t,i),Ti.cross(ca).dot(l)<0}set(t,i,r){return this.a.copy(t),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(t,i,r,l){return this.a.copy(t[i]),this.b.copy(t[r]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,r,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,r),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ti.subVectors(this.c,this.b),ca.subVectors(this.a,this.b),Ti.cross(ca).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ci.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Ci.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,r,l,c){return Ci.getInterpolation(t,this.a,this.b,this.c,i,r,l,c)}containsPoint(t){return Ci.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ci.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const r=this.a,l=this.b,c=this.c;let h,d;xs.subVectors(l,r),Ms.subVectors(c,r),Th.subVectors(t,r);const p=xs.dot(Th),m=Ms.dot(Th);if(p<=0&&m<=0)return i.copy(r);Ah.subVectors(t,l);const g=xs.dot(Ah),v=Ms.dot(Ah);if(g>=0&&v<=g)return i.copy(l);const y=p*v-g*m;if(y<=0&&p>=0&&g<=0)return h=p/(p-g),i.copy(r).addScaledVector(xs,h);Ch.subVectors(t,c);const M=xs.dot(Ch),T=Ms.dot(Ch);if(T>=0&&M<=T)return i.copy(c);const C=M*m-p*T;if(C<=0&&m>=0&&T<=0)return d=m/(m-T),i.copy(r).addScaledVector(Ms,d);const x=g*T-M*v;if(x<=0&&v-g>=0&&M-T>=0)return rv.subVectors(c,l),d=(v-g)/(v-g+(M-T)),i.copy(l).addScaledVector(rv,d);const S=1/(x+C+y);return h=C*S,d=y*S,i.copy(r).addScaledVector(xs,h).addScaledVector(Ms,d)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const u0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wa={h:0,s:0,l:0},vc={h:0,s:0,l:0};function Uh(o,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?o+(t-o)*6*i:i<1/2?t:i<2/3?o+(t-o)*6*(2/3-i):o}class Me{constructor(t,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,r)}set(t,i,r){if(i===void 0&&r===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,r);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=mi){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Re.toWorkingColorSpace(this,i),this}setRGB(t,i,r,l=Re.workingColorSpace){return this.r=t,this.g=i,this.b=r,Re.toWorkingColorSpace(this,l),this}setHSL(t,i,r,l=Re.workingColorSpace){if(t=vM(t,1),i=xe(i,0,1),r=xe(r,0,1),i===0)this.r=this.g=this.b=r;else{const c=r<=.5?r*(1+i):r+i-r*i,h=2*r-c;this.r=Uh(h,c,t+1/3),this.g=Uh(h,c,t),this.b=Uh(h,c,t-1/3)}return Re.toWorkingColorSpace(this,l),this}setStyle(t,i=mi){function r(c){c!==void 0&&parseFloat(c)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let c;const h=l[1],d=l[2];switch(h){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const c=l[1],h=c.length;if(h===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(c,16),i);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=mi){const r=u0[t.toLowerCase()];return r!==void 0?this.setHex(r,i):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ma(t.r),this.g=ma(t.g),this.b=ma(t.b),this}copyLinearToSRGB(t){return this.r=ws(t.r),this.g=ws(t.g),this.b=ws(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=mi){return Re.fromWorkingColorSpace(Nn.copy(this),t),Math.round(xe(Nn.r*255,0,255))*65536+Math.round(xe(Nn.g*255,0,255))*256+Math.round(xe(Nn.b*255,0,255))}getHexString(t=mi){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=Re.workingColorSpace){Re.fromWorkingColorSpace(Nn.copy(this),i);const r=Nn.r,l=Nn.g,c=Nn.b,h=Math.max(r,l,c),d=Math.min(r,l,c);let p,m;const g=(d+h)/2;if(d===h)p=0,m=0;else{const v=h-d;switch(m=g<=.5?v/(h+d):v/(2-h-d),h){case r:p=(l-c)/v+(l<c?6:0);break;case l:p=(c-r)/v+2;break;case c:p=(r-l)/v+4;break}p/=6}return t.h=p,t.s=m,t.l=g,t}getRGB(t,i=Re.workingColorSpace){return Re.fromWorkingColorSpace(Nn.copy(this),i),t.r=Nn.r,t.g=Nn.g,t.b=Nn.b,t}getStyle(t=mi){Re.fromWorkingColorSpace(Nn.copy(this),t);const i=Nn.r,r=Nn.g,l=Nn.b;return t!==mi?`color(${t} ${i.toFixed(3)} ${r.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(r*255)},${Math.round(l*255)})`}offsetHSL(t,i,r){return this.getHSL(Wa),this.setHSL(Wa.h+t,Wa.s+i,Wa.l+r)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,r){return this.r=t.r+(i.r-t.r)*r,this.g=t.g+(i.g-t.g)*r,this.b=t.b+(i.b-t.b)*r,this}lerpHSL(t,i){this.getHSL(Wa),t.getHSL(vc);const r=ph(Wa.h,vc.h,i),l=ph(Wa.s,vc.s,i),c=ph(Wa.l,vc.l,i);return this.setHSL(r,l,c),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,r=this.g,l=this.b,c=t.elements;return this.r=c[0]*i+c[3]*r+c[6]*l,this.g=c[1]*i+c[4]*r+c[7]*l,this.b=c[2]*i+c[5]*r+c[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nn=new Me;Me.NAMES=u0;let IM=0;class zs extends Is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:IM++}),this.uuid=Zo(),this.name="",this.type="Material",this.blending=Rs,this.side=Ka,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xh,this.blendDst=Wh,this.blendEquation=Tr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=Us,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=W_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const r=t[i];if(r===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(r):l&&l.isVector3&&r&&r.isVector3?l.copy(r):this[i]=r}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(t).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(t).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(t).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(t).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(t).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Rs&&(r.blending=this.blending),this.side!==Ka&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Xh&&(r.blendSrc=this.blendSrc),this.blendDst!==Wh&&(r.blendDst=this.blendDst),this.blendEquation!==Tr&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Us&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==W_&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(r.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function l(c){const h=[];for(const d in c){const p=c[d];delete p.metadata,h.push(p)}return h}if(i){const c=l(t.textures),h=l(t.images);c.length>0&&(r.textures=c),h.length>0&&(r.images=h)}return r}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let r=null;if(i!==null){const l=i.length;r=new Array(l);for(let c=0;c!==l;++c)r[c]=i[c].clone()}return this.clippingPlanes=r,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class f0 extends zs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gi,this.combine=qv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const un=new at,Sc=new De;let zM=0;class Hi{constructor(t,i,r=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:zM++}),this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=r,this.usage=q_,this.updateRanges=[],this.gpuType=da,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,r){t*=this.itemSize,r*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[t+l]=i.array[r+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,r=this.count;i<r;i++)Sc.fromBufferAttribute(this,i),Sc.applyMatrix3(t),this.setXY(i,Sc.x,Sc.y);else if(this.itemSize===3)for(let i=0,r=this.count;i<r;i++)un.fromBufferAttribute(this,i),un.applyMatrix3(t),this.setXYZ(i,un.x,un.y,un.z);return this}applyMatrix4(t){for(let i=0,r=this.count;i<r;i++)un.fromBufferAttribute(this,i),un.applyMatrix4(t),this.setXYZ(i,un.x,un.y,un.z);return this}applyNormalMatrix(t){for(let i=0,r=this.count;i<r;i++)un.fromBufferAttribute(this,i),un.applyNormalMatrix(t),this.setXYZ(i,un.x,un.y,un.z);return this}transformDirection(t){for(let i=0,r=this.count;i<r;i++)un.fromBufferAttribute(this,i),un.transformDirection(t),this.setXYZ(i,un.x,un.y,un.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let r=this.array[t*this.itemSize+i];return this.normalized&&(r=Po(r,this.array)),r}setComponent(t,i,r){return this.normalized&&(r=Yn(r,this.array)),this.array[t*this.itemSize+i]=r,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=Po(i,this.array)),i}setX(t,i){return this.normalized&&(i=Yn(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=Po(i,this.array)),i}setY(t,i){return this.normalized&&(i=Yn(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=Po(i,this.array)),i}setZ(t,i){return this.normalized&&(i=Yn(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=Po(i,this.array)),i}setW(t,i){return this.normalized&&(i=Yn(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,r){return t*=this.itemSize,this.normalized&&(i=Yn(i,this.array),r=Yn(r,this.array)),this.array[t+0]=i,this.array[t+1]=r,this}setXYZ(t,i,r,l){return t*=this.itemSize,this.normalized&&(i=Yn(i,this.array),r=Yn(r,this.array),l=Yn(l,this.array)),this.array[t+0]=i,this.array[t+1]=r,this.array[t+2]=l,this}setXYZW(t,i,r,l,c){return t*=this.itemSize,this.normalized&&(i=Yn(i,this.array),r=Yn(r,this.array),l=Yn(l,this.array),c=Yn(c,this.array)),this.array[t+0]=i,this.array[t+1]=r,this.array[t+2]=l,this.array[t+3]=c,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==q_&&(t.usage=this.usage),t}}class h0 extends Hi{constructor(t,i,r){super(new Uint16Array(t),i,r)}}class d0 extends Hi{constructor(t,i,r){super(new Uint32Array(t),i,r)}}class Ui extends Hi{constructor(t,i,r){super(new Float32Array(t),i,r)}}let BM=0;const pi=new Ke,Lh=new Rn,Es=new at,ai=new Qo,Fo=new Qo,yn=new at;class _a extends Is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:BM++}),this.uuid=Zo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(s0(t)?d0:h0)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,r=0){this.groups.push({start:t,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const c=new le().getNormalMatrix(t);r.applyNormalMatrix(c),r.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pi.makeRotationFromQuaternion(t),this.applyMatrix4(pi),this}rotateX(t){return pi.makeRotationX(t),this.applyMatrix4(pi),this}rotateY(t){return pi.makeRotationY(t),this.applyMatrix4(pi),this}rotateZ(t){return pi.makeRotationZ(t),this.applyMatrix4(pi),this}translate(t,i,r){return pi.makeTranslation(t,i,r),this.applyMatrix4(pi),this}scale(t,i,r){return pi.makeScale(t,i,r),this.applyMatrix4(pi),this}lookAt(t){return Lh.lookAt(t),Lh.updateMatrix(),this.applyMatrix4(Lh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Es).negate(),this.translate(Es.x,Es.y,Es.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const r=[];for(let l=0,c=t.length;l<c;l++){const h=t[l];r.push(h.x,h.y,h.z||0)}this.setAttribute("position",new Ui(r,3))}else{const r=Math.min(t.length,i.count);for(let l=0;l<r;l++){const c=t[l];i.setXYZ(l,c.x,c.y,c.z||0)}t.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qo);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new at(-1/0,-1/0,-1/0),new at(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let r=0,l=i.length;r<l;r++){const c=i[r];ai.setFromBufferAttribute(c),this.morphTargetsRelative?(yn.addVectors(this.boundingBox.min,ai.min),this.boundingBox.expandByPoint(yn),yn.addVectors(this.boundingBox.max,ai.max),this.boundingBox.expandByPoint(yn)):(this.boundingBox.expandByPoint(ai.min),this.boundingBox.expandByPoint(ai.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zc);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new at,1/0);return}if(t){const r=this.boundingSphere.center;if(ai.setFromBufferAttribute(t),i)for(let c=0,h=i.length;c<h;c++){const d=i[c];Fo.setFromBufferAttribute(d),this.morphTargetsRelative?(yn.addVectors(ai.min,Fo.min),ai.expandByPoint(yn),yn.addVectors(ai.max,Fo.max),ai.expandByPoint(yn)):(ai.expandByPoint(Fo.min),ai.expandByPoint(Fo.max))}ai.getCenter(r);let l=0;for(let c=0,h=t.count;c<h;c++)yn.fromBufferAttribute(t,c),l=Math.max(l,r.distanceToSquared(yn));if(i)for(let c=0,h=i.length;c<h;c++){const d=i[c],p=this.morphTargetsRelative;for(let m=0,g=d.count;m<g;m++)yn.fromBufferAttribute(d,m),p&&(Es.fromBufferAttribute(t,m),yn.add(Es)),l=Math.max(l,r.distanceToSquared(yn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=i.position,l=i.normal,c=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Hi(new Float32Array(4*r.count),4));const h=this.getAttribute("tangent"),d=[],p=[];for(let Z=0;Z<r.count;Z++)d[Z]=new at,p[Z]=new at;const m=new at,g=new at,v=new at,y=new De,M=new De,T=new De,C=new at,x=new at;function S(Z,w,R){m.fromBufferAttribute(r,Z),g.fromBufferAttribute(r,w),v.fromBufferAttribute(r,R),y.fromBufferAttribute(c,Z),M.fromBufferAttribute(c,w),T.fromBufferAttribute(c,R),g.sub(m),v.sub(m),M.sub(y),T.sub(y);const H=1/(M.x*T.y-T.x*M.y);isFinite(H)&&(C.copy(g).multiplyScalar(T.y).addScaledVector(v,-M.y).multiplyScalar(H),x.copy(v).multiplyScalar(M.x).addScaledVector(g,-T.x).multiplyScalar(H),d[Z].add(C),d[w].add(C),d[R].add(C),p[Z].add(x),p[w].add(x),p[R].add(x))}let z=this.groups;z.length===0&&(z=[{start:0,count:t.count}]);for(let Z=0,w=z.length;Z<w;++Z){const R=z[Z],H=R.start,lt=R.count;for(let st=H,gt=H+lt;st<gt;st+=3)S(t.getX(st+0),t.getX(st+1),t.getX(st+2))}const N=new at,D=new at,K=new at,G=new at;function I(Z){K.fromBufferAttribute(l,Z),G.copy(K);const w=d[Z];N.copy(w),N.sub(K.multiplyScalar(K.dot(w))).normalize(),D.crossVectors(G,w);const H=D.dot(p[Z])<0?-1:1;h.setXYZW(Z,N.x,N.y,N.z,H)}for(let Z=0,w=z.length;Z<w;++Z){const R=z[Z],H=R.start,lt=R.count;for(let st=H,gt=H+lt;st<gt;st+=3)I(t.getX(st+0)),I(t.getX(st+1)),I(t.getX(st+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new Hi(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let y=0,M=r.count;y<M;y++)r.setXYZ(y,0,0,0);const l=new at,c=new at,h=new at,d=new at,p=new at,m=new at,g=new at,v=new at;if(t)for(let y=0,M=t.count;y<M;y+=3){const T=t.getX(y+0),C=t.getX(y+1),x=t.getX(y+2);l.fromBufferAttribute(i,T),c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,x),g.subVectors(h,c),v.subVectors(l,c),g.cross(v),d.fromBufferAttribute(r,T),p.fromBufferAttribute(r,C),m.fromBufferAttribute(r,x),d.add(g),p.add(g),m.add(g),r.setXYZ(T,d.x,d.y,d.z),r.setXYZ(C,p.x,p.y,p.z),r.setXYZ(x,m.x,m.y,m.z)}else for(let y=0,M=i.count;y<M;y+=3)l.fromBufferAttribute(i,y+0),c.fromBufferAttribute(i,y+1),h.fromBufferAttribute(i,y+2),g.subVectors(h,c),v.subVectors(l,c),g.cross(v),r.setXYZ(y+0,g.x,g.y,g.z),r.setXYZ(y+1,g.x,g.y,g.z),r.setXYZ(y+2,g.x,g.y,g.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,r=t.count;i<r;i++)yn.fromBufferAttribute(t,i),yn.normalize(),t.setXYZ(i,yn.x,yn.y,yn.z)}toNonIndexed(){function t(d,p){const m=d.array,g=d.itemSize,v=d.normalized,y=new m.constructor(p.length*g);let M=0,T=0;for(let C=0,x=p.length;C<x;C++){d.isInterleavedBufferAttribute?M=p[C]*d.data.stride+d.offset:M=p[C]*g;for(let S=0;S<g;S++)y[T++]=m[M++]}return new Hi(y,g,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new _a,r=this.index.array,l=this.attributes;for(const d in l){const p=l[d],m=t(p,r);i.setAttribute(d,m)}const c=this.morphAttributes;for(const d in c){const p=[],m=c[d];for(let g=0,v=m.length;g<v;g++){const y=m[g],M=t(y,r);p.push(M)}i.morphAttributes[d]=p}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let d=0,p=h.length;d<p;d++){const m=h[d];i.addGroup(m.start,m.count,m.materialIndex)}return i}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const m in p)p[m]!==void 0&&(t[m]=p[m]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const r=this.attributes;for(const p in r){const m=r[p];t.data.attributes[p]=m.toJSON(t.data)}const l={};let c=!1;for(const p in this.morphAttributes){const m=this.morphAttributes[p],g=[];for(let v=0,y=m.length;v<y;v++){const M=m[v];g.push(M.toJSON(t.data))}g.length>0&&(l[p]=g,c=!0)}c&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(t.data.groups=JSON.parse(JSON.stringify(h)));const d=this.boundingSphere;return d!==null&&(t.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const r=t.index;r!==null&&this.setIndex(r.clone());const l=t.attributes;for(const m in l){const g=l[m];this.setAttribute(m,g.clone(i))}const c=t.morphAttributes;for(const m in c){const g=[],v=c[m];for(let y=0,M=v.length;y<M;y++)g.push(v[y].clone(i));this.morphAttributes[m]=g}this.morphTargetsRelative=t.morphTargetsRelative;const h=t.groups;for(let m=0,g=h.length;m<g;m++){const v=h[m];this.addGroup(v.start,v.count,v.materialIndex)}const d=t.boundingBox;d!==null&&(this.boundingBox=d.clone());const p=t.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const sv=new Ke,Sr=new l0,yc=new Zc,ov=new at,xc=new at,Mc=new at,Ec=new at,Nh=new at,bc=new at,lv=new at,Tc=new at;class Fi extends Rn{constructor(t=new _a,i=new f0){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const d=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}getVertexPosition(t,i){const r=this.geometry,l=r.attributes.position,c=r.morphAttributes.position,h=r.morphTargetsRelative;i.fromBufferAttribute(l,t);const d=this.morphTargetInfluences;if(c&&d){bc.set(0,0,0);for(let p=0,m=c.length;p<m;p++){const g=d[p],v=c[p];g!==0&&(Nh.fromBufferAttribute(v,t),h?bc.addScaledVector(Nh,g):bc.addScaledVector(Nh.sub(i),g))}i.add(bc)}return i}raycast(t,i){const r=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),yc.copy(r.boundingSphere),yc.applyMatrix4(c),Sr.copy(t.ray).recast(t.near),!(yc.containsPoint(Sr.origin)===!1&&(Sr.intersectSphere(yc,ov)===null||Sr.origin.distanceToSquared(ov)>(t.far-t.near)**2))&&(sv.copy(c).invert(),Sr.copy(t.ray).applyMatrix4(sv),!(r.boundingBox!==null&&Sr.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(t,i,Sr)))}_computeIntersections(t,i,r){let l;const c=this.geometry,h=this.material,d=c.index,p=c.attributes.position,m=c.attributes.uv,g=c.attributes.uv1,v=c.attributes.normal,y=c.groups,M=c.drawRange;if(d!==null)if(Array.isArray(h))for(let T=0,C=y.length;T<C;T++){const x=y[T],S=h[x.materialIndex],z=Math.max(x.start,M.start),N=Math.min(d.count,Math.min(x.start+x.count,M.start+M.count));for(let D=z,K=N;D<K;D+=3){const G=d.getX(D),I=d.getX(D+1),Z=d.getX(D+2);l=Ac(this,S,t,r,m,g,v,G,I,Z),l&&(l.faceIndex=Math.floor(D/3),l.face.materialIndex=x.materialIndex,i.push(l))}}else{const T=Math.max(0,M.start),C=Math.min(d.count,M.start+M.count);for(let x=T,S=C;x<S;x+=3){const z=d.getX(x),N=d.getX(x+1),D=d.getX(x+2);l=Ac(this,h,t,r,m,g,v,z,N,D),l&&(l.faceIndex=Math.floor(x/3),i.push(l))}}else if(p!==void 0)if(Array.isArray(h))for(let T=0,C=y.length;T<C;T++){const x=y[T],S=h[x.materialIndex],z=Math.max(x.start,M.start),N=Math.min(p.count,Math.min(x.start+x.count,M.start+M.count));for(let D=z,K=N;D<K;D+=3){const G=D,I=D+1,Z=D+2;l=Ac(this,S,t,r,m,g,v,G,I,Z),l&&(l.faceIndex=Math.floor(D/3),l.face.materialIndex=x.materialIndex,i.push(l))}}else{const T=Math.max(0,M.start),C=Math.min(p.count,M.start+M.count);for(let x=T,S=C;x<S;x+=3){const z=x,N=x+1,D=x+2;l=Ac(this,h,t,r,m,g,v,z,N,D),l&&(l.faceIndex=Math.floor(x/3),i.push(l))}}}}function FM(o,t,i,r,l,c,h,d){let p;if(t.side===jn?p=r.intersectTriangle(h,c,l,!0,d):p=r.intersectTriangle(l,c,h,t.side===Ka,d),p===null)return null;Tc.copy(d),Tc.applyMatrix4(o.matrixWorld);const m=i.ray.origin.distanceTo(Tc);return m<i.near||m>i.far?null:{distance:m,point:Tc.clone(),object:o}}function Ac(o,t,i,r,l,c,h,d,p,m){o.getVertexPosition(d,xc),o.getVertexPosition(p,Mc),o.getVertexPosition(m,Ec);const g=FM(o,t,i,r,xc,Mc,Ec,lv);if(g){const v=new at;Ci.getBarycoord(lv,xc,Mc,Ec,v),l&&(g.uv=Ci.getInterpolatedAttribute(l,d,p,m,v,new De)),c&&(g.uv1=Ci.getInterpolatedAttribute(c,d,p,m,v,new De)),h&&(g.normal=Ci.getInterpolatedAttribute(h,d,p,m,v,new at),g.normal.dot(r.direction)>0&&g.normal.multiplyScalar(-1));const y={a:d,b:p,c:m,normal:new at,materialIndex:0};Ci.getNormal(xc,Mc,Ec,y.normal),g.face=y,g.barycoord=v}return g}class Bs extends _a{constructor(t=1,i=1,r=1,l=1,c=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:r,widthSegments:l,heightSegments:c,depthSegments:h};const d=this;l=Math.floor(l),c=Math.floor(c),h=Math.floor(h);const p=[],m=[],g=[],v=[];let y=0,M=0;T("z","y","x",-1,-1,r,i,t,h,c,0),T("z","y","x",1,-1,r,i,-t,h,c,1),T("x","z","y",1,1,t,r,i,l,h,2),T("x","z","y",1,-1,t,r,-i,l,h,3),T("x","y","z",1,-1,t,i,r,l,c,4),T("x","y","z",-1,-1,t,i,-r,l,c,5),this.setIndex(p),this.setAttribute("position",new Ui(m,3)),this.setAttribute("normal",new Ui(g,3)),this.setAttribute("uv",new Ui(v,2));function T(C,x,S,z,N,D,K,G,I,Z,w){const R=D/I,H=K/Z,lt=D/2,st=K/2,gt=G/2,_t=I+1,O=Z+1;let j=0,Y=0;const xt=new at;for(let Tt=0;Tt<O;Tt++){const L=Tt*H-st;for(let et=0;et<_t;et++){const yt=et*R-lt;xt[C]=yt*z,xt[x]=L*N,xt[S]=gt,m.push(xt.x,xt.y,xt.z),xt[C]=0,xt[x]=0,xt[S]=G>0?1:-1,g.push(xt.x,xt.y,xt.z),v.push(et/I),v.push(1-Tt/Z),j+=1}}for(let Tt=0;Tt<Z;Tt++)for(let L=0;L<I;L++){const et=y+L+_t*Tt,yt=y+L+_t*(Tt+1),q=y+(L+1)+_t*(Tt+1),ut=y+(L+1)+_t*Tt;p.push(et,yt,ut),p.push(yt,q,ut),Y+=6}d.addGroup(M,Y,w),M+=Y,y+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ps(o){const t={};for(const i in o){t[i]={};for(const r in o[i]){const l=o[i][r];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][r]=null):t[i][r]=l.clone():Array.isArray(l)?t[i][r]=l.slice():t[i][r]=l}}return t}function Bn(o){const t={};for(let i=0;i<o.length;i++){const r=Ps(o[i]);for(const l in r)t[l]=r[l]}return t}function HM(o){const t=[];for(let i=0;i<o.length;i++)t.push(o[i].clone());return t}function p0(o){const t=o.getRenderTarget();return t===null?o.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Re.workingColorSpace}const GM={clone:Ps,merge:Bn};var VM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Qa extends zs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=VM,this.fragmentShader=kM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ps(t.uniforms),this.uniformsGroups=HM(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(t).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const r={};for(const l in this.extensions)this.extensions[l]===!0&&(r[l]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class m0 extends Rn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ke,this.projectionMatrix=new Ke,this.projectionMatrixInverse=new Ke,this.coordinateSystem=pa}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qa=new at,cv=new De,uv=new De;class gi extends m0{constructor(t=50,i=1,r=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=wd*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(dh*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return wd*2*Math.atan(Math.tan(dh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,r){qa.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qa.x,qa.y).multiplyScalar(-t/qa.z),qa.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(qa.x,qa.y).multiplyScalar(-t/qa.z)}getViewSize(t,i){return this.getViewBounds(t,cv,uv),i.subVectors(uv,cv)}setViewOffset(t,i,r,l,c,h){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(dh*.5*this.fov)/this.zoom,r=2*i,l=this.aspect*r,c=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const p=h.fullWidth,m=h.fullHeight;c+=h.offsetX*l/p,i-=h.offsetY*r/m,l*=h.width/p,r*=h.height/m}const d=this.filmOffset;d!==0&&(c+=t*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-r,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const bs=-90,Ts=1;class XM extends Rn{constructor(t,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new gi(bs,Ts,t,i);l.layers=this.layers,this.add(l);const c=new gi(bs,Ts,t,i);c.layers=this.layers,this.add(c);const h=new gi(bs,Ts,t,i);h.layers=this.layers,this.add(h);const d=new gi(bs,Ts,t,i);d.layers=this.layers,this.add(d);const p=new gi(bs,Ts,t,i);p.layers=this.layers,this.add(p);const m=new gi(bs,Ts,t,i);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[r,l,c,h,d,p]=i;for(const m of i)this.remove(m);if(t===pa)r.up.set(0,1,0),r.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(t===kc)r.up.set(0,-1,0),r.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const m of i)this.add(m),m.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[c,h,d,p,m,g]=this.children,v=t.getRenderTarget(),y=t.getActiveCubeFace(),M=t.getActiveMipmapLevel(),T=t.xr.enabled;t.xr.enabled=!1;const C=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,t.setRenderTarget(r,0,l),t.render(i,c),t.setRenderTarget(r,1,l),t.render(i,h),t.setRenderTarget(r,2,l),t.render(i,d),t.setRenderTarget(r,3,l),t.render(i,p),t.setRenderTarget(r,4,l),t.render(i,m),r.texture.generateMipmaps=C,t.setRenderTarget(r,5,l),t.render(i,g),t.setRenderTarget(v,y,M),t.xr.enabled=T,r.texture.needsPMREMUpdate=!0}}class g0 extends Zn{constructor(t=[],i=Ls,r,l,c,h,d,p,m,g){super(t,i,r,l,c,h,d,p,m,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class WM extends Nr{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const r={width:t,height:t,depth:1},l=[r,r,r,r,r,r];this.texture=new g0(l,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:Bi}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new Bs(5,5,5),c=new Qa({name:"CubemapFromEquirect",uniforms:Ps(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:jn,blending:ja});c.uniforms.tEquirect.value=i;const h=new Fi(l,c),d=i.minFilter;return i.minFilter===Rr&&(i.minFilter=Bi),new XM(1,10,this).update(t,h),i.minFilter=d,h.geometry.dispose(),h.material.dispose(),this}clear(t,i=!0,r=!0,l=!0){const c=t.getRenderTarget();for(let h=0;h<6;h++)t.setRenderTarget(this,h),t.clear(i,r,l);t.setRenderTarget(c)}}class Cc extends Rn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qM={type:"move"};class Oh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Cc,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Cc,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new at,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new at),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Cc,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new at,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new at),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const r of t.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,r){let l=null,c=null,h=null;const d=this._targetRay,p=this._grip,m=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(m&&t.hand){h=!0;for(const C of t.hand.values()){const x=i.getJointPose(C,r),S=this._getHandJoint(m,C);x!==null&&(S.matrix.fromArray(x.transform.matrix),S.matrix.decompose(S.position,S.rotation,S.scale),S.matrixWorldNeedsUpdate=!0,S.jointRadius=x.radius),S.visible=x!==null}const g=m.joints["index-finger-tip"],v=m.joints["thumb-tip"],y=g.position.distanceTo(v.position),M=.02,T=.005;m.inputState.pinching&&y>M+T?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!m.inputState.pinching&&y<=M-T&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else p!==null&&t.gripSpace&&(c=i.getPose(t.gripSpace,r),c!==null&&(p.matrix.fromArray(c.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,c.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(c.linearVelocity)):p.hasLinearVelocity=!1,c.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(c.angularVelocity)):p.hasAngularVelocity=!1));d!==null&&(l=i.getPose(t.targetRaySpace,r),l===null&&c!==null&&(l=c),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(qM)))}return d!==null&&(d.visible=l!==null),p!==null&&(p.visible=c!==null),m!==null&&(m.visible=h!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const r=new Cc;r.matrixAutoUpdate=!1,r.visible=!1,t.joints[i.jointName]=r,t.add(r)}return t.joints[i.jointName]}}class YM extends Rn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gi,this.environmentIntensity=1,this.environmentRotation=new Gi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Ph=new at,jM=new at,ZM=new le;class Er{constructor(t=new at(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,r,l){return this.normal.set(t,i,r),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,r){const l=Ph.subVectors(r,i).cross(jM.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i){const r=t.delta(Ph),l=this.normal.dot(r);if(l===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const c=-(t.start.dot(this.normal)+this.constant)/l;return c<0||c>1?null:i.copy(t.start).addScaledVector(r,c)}intersectsLine(t){const i=this.distanceToPoint(t.start),r=this.distanceToPoint(t.end);return i<0&&r>0||r<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const r=i||ZM.getNormalMatrix(t),l=this.coplanarPoint(Ph).applyMatrix4(t),c=this.normal.applyMatrix3(r).normalize();return this.constant=-l.dot(c),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const yr=new Zc,Rc=new at;class Xd{constructor(t=new Er,i=new Er,r=new Er,l=new Er,c=new Er,h=new Er){this.planes=[t,i,r,l,c,h]}set(t,i,r,l,c,h){const d=this.planes;return d[0].copy(t),d[1].copy(i),d[2].copy(r),d[3].copy(l),d[4].copy(c),d[5].copy(h),this}copy(t){const i=this.planes;for(let r=0;r<6;r++)i[r].copy(t.planes[r]);return this}setFromProjectionMatrix(t,i=pa){const r=this.planes,l=t.elements,c=l[0],h=l[1],d=l[2],p=l[3],m=l[4],g=l[5],v=l[6],y=l[7],M=l[8],T=l[9],C=l[10],x=l[11],S=l[12],z=l[13],N=l[14],D=l[15];if(r[0].setComponents(p-c,y-m,x-M,D-S).normalize(),r[1].setComponents(p+c,y+m,x+M,D+S).normalize(),r[2].setComponents(p+h,y+g,x+T,D+z).normalize(),r[3].setComponents(p-h,y-g,x-T,D-z).normalize(),r[4].setComponents(p-d,y-v,x-C,D-N).normalize(),i===pa)r[5].setComponents(p+d,y+v,x+C,D+N).normalize();else if(i===kc)r[5].setComponents(d,v,C,N).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),yr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),yr.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(yr)}intersectsSprite(t){return yr.center.set(0,0,0),yr.radius=.7071067811865476,yr.applyMatrix4(t.matrixWorld),this.intersectsSphere(yr)}intersectsSphere(t){const i=this.planes,r=t.center,l=-t.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(r)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let r=0;r<6;r++){const l=i[r];if(Rc.x=l.normal.x>0?t.max.x:t.min.x,Rc.y=l.normal.y>0?t.max.y:t.min.y,Rc.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(Rc)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let r=0;r<6;r++)if(i[r].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class _0 extends zs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Wc=new at,qc=new at,fv=new Ke,Ho=new l0,wc=new Zc,Ih=new at,hv=new at;class KM extends Rn{constructor(t=new _a,i=new _0){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const i=t.attributes.position,r=[0];for(let l=1,c=i.count;l<c;l++)Wc.fromBufferAttribute(i,l-1),qc.fromBufferAttribute(i,l),r[l]=r[l-1],r[l]+=Wc.distanceTo(qc);t.setAttribute("lineDistance",new Ui(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,i){const r=this.geometry,l=this.matrixWorld,c=t.params.Line.threshold,h=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),wc.copy(r.boundingSphere),wc.applyMatrix4(l),wc.radius+=c,t.ray.intersectsSphere(wc)===!1)return;fv.copy(l).invert(),Ho.copy(t.ray).applyMatrix4(fv);const d=c/((this.scale.x+this.scale.y+this.scale.z)/3),p=d*d,m=this.isLineSegments?2:1,g=r.index,y=r.attributes.position;if(g!==null){const M=Math.max(0,h.start),T=Math.min(g.count,h.start+h.count);for(let C=M,x=T-1;C<x;C+=m){const S=g.getX(C),z=g.getX(C+1),N=Dc(this,t,Ho,p,S,z,C);N&&i.push(N)}if(this.isLineLoop){const C=g.getX(T-1),x=g.getX(M),S=Dc(this,t,Ho,p,C,x,T-1);S&&i.push(S)}}else{const M=Math.max(0,h.start),T=Math.min(y.count,h.start+h.count);for(let C=M,x=T-1;C<x;C+=m){const S=Dc(this,t,Ho,p,C,C+1,C);S&&i.push(S)}if(this.isLineLoop){const C=Dc(this,t,Ho,p,T-1,M,T-1);C&&i.push(C)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const d=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}}function Dc(o,t,i,r,l,c,h){const d=o.geometry.attributes.position;if(Wc.fromBufferAttribute(d,l),qc.fromBufferAttribute(d,c),i.distanceSqToSegment(Wc,qc,Ih,hv)>r)return;Ih.applyMatrix4(o.matrixWorld);const m=t.ray.origin.distanceTo(Ih);if(!(m<t.near||m>t.far))return{distance:m,point:hv.clone().applyMatrix4(o.matrixWorld),index:h,face:null,faceIndex:null,barycoord:null,object:o}}const dv=new at,pv=new at;class QM extends KM{constructor(t,i){super(t,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const i=t.attributes.position,r=[];for(let l=0,c=i.count;l<c;l+=2)dv.fromBufferAttribute(i,l),pv.fromBufferAttribute(i,l+1),r[l]=l===0?0:r[l-1],r[l+1]=r[l]+dv.distanceTo(pv);t.setAttribute("lineDistance",new Ui(r,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class v0 extends Zn{constructor(t,i,r=Lr,l,c,h,d=Di,p=Di,m,g=qo){if(g!==qo&&g!==Yo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super(null,l,c,h,d,p,g,r,m),this.isDepthTexture=!0,this.image={width:t,height:i},this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new kd(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Kc extends _a{constructor(t=1,i=1,r=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:r,heightSegments:l};const c=t/2,h=i/2,d=Math.floor(r),p=Math.floor(l),m=d+1,g=p+1,v=t/d,y=i/p,M=[],T=[],C=[],x=[];for(let S=0;S<g;S++){const z=S*y-h;for(let N=0;N<m;N++){const D=N*v-c;T.push(D,-z,0),C.push(0,0,1),x.push(N/d),x.push(1-S/p)}}for(let S=0;S<p;S++)for(let z=0;z<d;z++){const N=z+m*S,D=z+m*(S+1),K=z+1+m*(S+1),G=z+1+m*S;M.push(N,D,G),M.push(D,K,G)}this.setIndex(M),this.setAttribute("position",new Ui(T,3)),this.setAttribute("normal",new Ui(C,3)),this.setAttribute("uv",new Ui(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kc(t.width,t.height,t.widthSegments,t.heightSegments)}}class JM extends zs{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=a0,this.normalScale=new De(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class $M extends zs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class tE extends zs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class S0 extends Rn{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(t),this.intensity=i}dispose(){}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}const zh=new Ke,mv=new at,gv=new at;class eE{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new De(512,512),this.map=null,this.mapPass=null,this.matrix=new Ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xd,this._frameExtents=new De(1,1),this._viewportCount=1,this._viewports=[new nn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,r=this.matrix;mv.setFromMatrixPosition(t.matrixWorld),i.position.copy(mv),gv.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(gv),i.updateMatrixWorld(),zh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zh),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(zh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class y0 extends m0{constructor(t=-1,i=1,r=1,l=-1,c=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=r,this.bottom=l,this.near=c,this.far=h,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,r,l,c,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=r-t,h=r+t,d=l+i,p=l-i;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=m*this.view.offsetX,h=c+m*this.view.width,d-=g*this.view.offsetY,p=d-g*this.view.height}this.projectionMatrix.makeOrthographic(c,h,d,p,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class nE extends eE{constructor(){super(new y0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class iE extends S0{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rn.DEFAULT_UP),this.updateMatrix(),this.target=new Rn,this.shadow=new nE}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class aE extends S0{constructor(t,i){super(t,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class rE extends gi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t,this.index=0}}class sE extends QM{constructor(t=10,i=10,r=4473924,l=8947848){r=new Me(r),l=new Me(l);const c=i/2,h=t/i,d=t/2,p=[],m=[];for(let y=0,M=0,T=-d;y<=i;y++,T+=h){p.push(-d,0,T,d,0,T),p.push(T,0,-d,T,0,d);const C=y===c?r:l;C.toArray(m,M),M+=3,C.toArray(m,M),M+=3,C.toArray(m,M),M+=3,C.toArray(m,M),M+=3}const g=new _a;g.setAttribute("position",new Ui(p,3)),g.setAttribute("color",new Ui(m,3));const v=new _0({vertexColors:!0,toneMapped:!1});super(g,v),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}function _v(o,t,i,r){const l=oE(r);switch(i){case Qv:return o*t;case $v:return o*t;case t0:return o*t*2;case e0:return o*t/l.components*l.byteLength;case Hd:return o*t/l.components*l.byteLength;case n0:return o*t*2/l.components*l.byteLength;case Gd:return o*t*2/l.components*l.byteLength;case Jv:return o*t*3/l.components*l.byteLength;case wi:return o*t*4/l.components*l.byteLength;case Vd:return o*t*4/l.components*l.byteLength;case Oc:case Pc:return Math.floor((o+3)/4)*Math.floor((t+3)/4)*8;case Ic:case zc:return Math.floor((o+3)/4)*Math.floor((t+3)/4)*16;case ad:case sd:return Math.max(o,16)*Math.max(t,8)/4;case id:case rd:return Math.max(o,8)*Math.max(t,8)/2;case od:case ld:return Math.floor((o+3)/4)*Math.floor((t+3)/4)*8;case cd:return Math.floor((o+3)/4)*Math.floor((t+3)/4)*16;case ud:return Math.floor((o+3)/4)*Math.floor((t+3)/4)*16;case fd:return Math.floor((o+4)/5)*Math.floor((t+3)/4)*16;case hd:return Math.floor((o+4)/5)*Math.floor((t+4)/5)*16;case dd:return Math.floor((o+5)/6)*Math.floor((t+4)/5)*16;case pd:return Math.floor((o+5)/6)*Math.floor((t+5)/6)*16;case md:return Math.floor((o+7)/8)*Math.floor((t+4)/5)*16;case gd:return Math.floor((o+7)/8)*Math.floor((t+5)/6)*16;case _d:return Math.floor((o+7)/8)*Math.floor((t+7)/8)*16;case vd:return Math.floor((o+9)/10)*Math.floor((t+4)/5)*16;case Sd:return Math.floor((o+9)/10)*Math.floor((t+5)/6)*16;case yd:return Math.floor((o+9)/10)*Math.floor((t+7)/8)*16;case xd:return Math.floor((o+9)/10)*Math.floor((t+9)/10)*16;case Md:return Math.floor((o+11)/12)*Math.floor((t+9)/10)*16;case Ed:return Math.floor((o+11)/12)*Math.floor((t+11)/12)*16;case Bc:case bd:case Td:return Math.ceil(o/4)*Math.ceil(t/4)*16;case i0:case Ad:return Math.ceil(o/4)*Math.ceil(t/4)*8;case Cd:case Rd:return Math.ceil(o/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function oE(o){switch(o){case ga:case jv:return{byteLength:1,components:1};case Xo:case Zv:case jo:return{byteLength:2,components:1};case Bd:case Fd:return{byteLength:2,components:4};case Lr:case zd:case da:return{byteLength:4,components:1};case Kv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${o}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Id}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Id);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function x0(){let o=null,t=!1,i=null,r=null;function l(c,h){i(c,h),r=o.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&(r=o.requestAnimationFrame(l),t=!0)},stop:function(){o.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(c){i=c},setContext:function(c){o=c}}}function lE(o){const t=new WeakMap;function i(d,p){const m=d.array,g=d.usage,v=m.byteLength,y=o.createBuffer();o.bindBuffer(p,y),o.bufferData(p,m,g),d.onUploadCallback();let M;if(m instanceof Float32Array)M=o.FLOAT;else if(m instanceof Uint16Array)d.isFloat16BufferAttribute?M=o.HALF_FLOAT:M=o.UNSIGNED_SHORT;else if(m instanceof Int16Array)M=o.SHORT;else if(m instanceof Uint32Array)M=o.UNSIGNED_INT;else if(m instanceof Int32Array)M=o.INT;else if(m instanceof Int8Array)M=o.BYTE;else if(m instanceof Uint8Array)M=o.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)M=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:y,type:M,bytesPerElement:m.BYTES_PER_ELEMENT,version:d.version,size:v}}function r(d,p,m){const g=p.array,v=p.updateRanges;if(o.bindBuffer(m,d),v.length===0)o.bufferSubData(m,0,g);else{v.sort((M,T)=>M.start-T.start);let y=0;for(let M=1;M<v.length;M++){const T=v[y],C=v[M];C.start<=T.start+T.count+1?T.count=Math.max(T.count,C.start+C.count-T.start):(++y,v[y]=C)}v.length=y+1;for(let M=0,T=v.length;M<T;M++){const C=v[M];o.bufferSubData(m,C.start*g.BYTES_PER_ELEMENT,g,C.start,C.count)}p.clearUpdateRanges()}p.onUploadCallback()}function l(d){return d.isInterleavedBufferAttribute&&(d=d.data),t.get(d)}function c(d){d.isInterleavedBufferAttribute&&(d=d.data);const p=t.get(d);p&&(o.deleteBuffer(p.buffer),t.delete(d))}function h(d,p){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const g=t.get(d);(!g||g.version<d.version)&&t.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const m=t.get(d);if(m===void 0)t.set(d,i(d,p));else if(m.version<d.version){if(m.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,d,p),m.version=d.version}}return{get:l,remove:c,update:h}}var cE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uE=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mE=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,gE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_E=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,vE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,SE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ME=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,EE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,bE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,TE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,AE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,CE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,RE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,DE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,UE=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,LE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,NE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,OE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,PE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,IE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,BE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,FE="gl_FragColor = linearToOutputTexel( gl_FragColor );",HE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,GE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,VE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,XE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,WE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,YE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ZE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,KE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,QE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,JE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$E=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tb=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,eb=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,nb=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ib=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ab=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rb=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sb=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ob=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lb=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,cb=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ub=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fb=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hb=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,db=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pb=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,mb=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gb=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,_b=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,vb=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sb=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yb=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xb=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Mb=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Eb=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bb=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Tb=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ab=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cb=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Rb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Db=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ub=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Lb=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nb=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ob=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Pb=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ib=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zb=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Bb=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fb=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hb=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gb=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vb=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kb=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xb=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Wb=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,qb=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Yb=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,jb=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zb=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Kb=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qb=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Jb=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$b=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,eT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,nT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,iT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,aT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,sT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,oT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cT=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fT=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,mT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,gT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,_T=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,vT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ST=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,MT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ET=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,TT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AT=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,CT=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RT=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,wT=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,DT=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,UT=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,LT=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,NT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,OT=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,PT=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,zT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,BT=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,FT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,HT=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,GT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ce={alphahash_fragment:cE,alphahash_pars_fragment:uE,alphamap_fragment:fE,alphamap_pars_fragment:hE,alphatest_fragment:dE,alphatest_pars_fragment:pE,aomap_fragment:mE,aomap_pars_fragment:gE,batching_pars_vertex:_E,batching_vertex:vE,begin_vertex:SE,beginnormal_vertex:yE,bsdfs:xE,iridescence_fragment:ME,bumpmap_pars_fragment:EE,clipping_planes_fragment:bE,clipping_planes_pars_fragment:TE,clipping_planes_pars_vertex:AE,clipping_planes_vertex:CE,color_fragment:RE,color_pars_fragment:wE,color_pars_vertex:DE,color_vertex:UE,common:LE,cube_uv_reflection_fragment:NE,defaultnormal_vertex:OE,displacementmap_pars_vertex:PE,displacementmap_vertex:IE,emissivemap_fragment:zE,emissivemap_pars_fragment:BE,colorspace_fragment:FE,colorspace_pars_fragment:HE,envmap_fragment:GE,envmap_common_pars_fragment:VE,envmap_pars_fragment:kE,envmap_pars_vertex:XE,envmap_physical_pars_fragment:eb,envmap_vertex:WE,fog_vertex:qE,fog_pars_vertex:YE,fog_fragment:jE,fog_pars_fragment:ZE,gradientmap_pars_fragment:KE,lightmap_pars_fragment:QE,lights_lambert_fragment:JE,lights_lambert_pars_fragment:$E,lights_pars_begin:tb,lights_toon_fragment:nb,lights_toon_pars_fragment:ib,lights_phong_fragment:ab,lights_phong_pars_fragment:rb,lights_physical_fragment:sb,lights_physical_pars_fragment:ob,lights_fragment_begin:lb,lights_fragment_maps:cb,lights_fragment_end:ub,logdepthbuf_fragment:fb,logdepthbuf_pars_fragment:hb,logdepthbuf_pars_vertex:db,logdepthbuf_vertex:pb,map_fragment:mb,map_pars_fragment:gb,map_particle_fragment:_b,map_particle_pars_fragment:vb,metalnessmap_fragment:Sb,metalnessmap_pars_fragment:yb,morphinstance_vertex:xb,morphcolor_vertex:Mb,morphnormal_vertex:Eb,morphtarget_pars_vertex:bb,morphtarget_vertex:Tb,normal_fragment_begin:Ab,normal_fragment_maps:Cb,normal_pars_fragment:Rb,normal_pars_vertex:wb,normal_vertex:Db,normalmap_pars_fragment:Ub,clearcoat_normal_fragment_begin:Lb,clearcoat_normal_fragment_maps:Nb,clearcoat_pars_fragment:Ob,iridescence_pars_fragment:Pb,opaque_fragment:Ib,packing:zb,premultiplied_alpha_fragment:Bb,project_vertex:Fb,dithering_fragment:Hb,dithering_pars_fragment:Gb,roughnessmap_fragment:Vb,roughnessmap_pars_fragment:kb,shadowmap_pars_fragment:Xb,shadowmap_pars_vertex:Wb,shadowmap_vertex:qb,shadowmask_pars_fragment:Yb,skinbase_vertex:jb,skinning_pars_vertex:Zb,skinning_vertex:Kb,skinnormal_vertex:Qb,specularmap_fragment:Jb,specularmap_pars_fragment:$b,tonemapping_fragment:tT,tonemapping_pars_fragment:eT,transmission_fragment:nT,transmission_pars_fragment:iT,uv_pars_fragment:aT,uv_pars_vertex:rT,uv_vertex:sT,worldpos_vertex:oT,background_vert:lT,background_frag:cT,backgroundCube_vert:uT,backgroundCube_frag:fT,cube_vert:hT,cube_frag:dT,depth_vert:pT,depth_frag:mT,distanceRGBA_vert:gT,distanceRGBA_frag:_T,equirect_vert:vT,equirect_frag:ST,linedashed_vert:yT,linedashed_frag:xT,meshbasic_vert:MT,meshbasic_frag:ET,meshlambert_vert:bT,meshlambert_frag:TT,meshmatcap_vert:AT,meshmatcap_frag:CT,meshnormal_vert:RT,meshnormal_frag:wT,meshphong_vert:DT,meshphong_frag:UT,meshphysical_vert:LT,meshphysical_frag:NT,meshtoon_vert:OT,meshtoon_frag:PT,points_vert:IT,points_frag:zT,shadow_vert:BT,shadow_frag:FT,sprite_vert:HT,sprite_frag:GT},Lt={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new le}},envmap:{envMap:{value:null},envMapRotation:{value:new le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new le},normalScale:{value:new De(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0},uvTransform:{value:new le}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new De(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new le},alphaMap:{value:null},alphaMapTransform:{value:new le},alphaTest:{value:0}}},zi={basic:{uniforms:Bn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.fog]),vertexShader:ce.meshbasic_vert,fragmentShader:ce.meshbasic_frag},lambert:{uniforms:Bn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new Me(0)}}]),vertexShader:ce.meshlambert_vert,fragmentShader:ce.meshlambert_frag},phong:{uniforms:Bn([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:ce.meshphong_vert,fragmentShader:ce.meshphong_frag},standard:{uniforms:Bn([Lt.common,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.roughnessmap,Lt.metalnessmap,Lt.fog,Lt.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag},toon:{uniforms:Bn([Lt.common,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.gradientmap,Lt.fog,Lt.lights,{emissive:{value:new Me(0)}}]),vertexShader:ce.meshtoon_vert,fragmentShader:ce.meshtoon_frag},matcap:{uniforms:Bn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,{matcap:{value:null}}]),vertexShader:ce.meshmatcap_vert,fragmentShader:ce.meshmatcap_frag},points:{uniforms:Bn([Lt.points,Lt.fog]),vertexShader:ce.points_vert,fragmentShader:ce.points_frag},dashed:{uniforms:Bn([Lt.common,Lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ce.linedashed_vert,fragmentShader:ce.linedashed_frag},depth:{uniforms:Bn([Lt.common,Lt.displacementmap]),vertexShader:ce.depth_vert,fragmentShader:ce.depth_frag},normal:{uniforms:Bn([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,{opacity:{value:1}}]),vertexShader:ce.meshnormal_vert,fragmentShader:ce.meshnormal_frag},sprite:{uniforms:Bn([Lt.sprite,Lt.fog]),vertexShader:ce.sprite_vert,fragmentShader:ce.sprite_frag},background:{uniforms:{uvTransform:{value:new le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ce.background_vert,fragmentShader:ce.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new le}},vertexShader:ce.backgroundCube_vert,fragmentShader:ce.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ce.cube_vert,fragmentShader:ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ce.equirect_vert,fragmentShader:ce.equirect_frag},distanceRGBA:{uniforms:Bn([Lt.common,Lt.displacementmap,{referencePosition:{value:new at},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ce.distanceRGBA_vert,fragmentShader:ce.distanceRGBA_frag},shadow:{uniforms:Bn([Lt.lights,Lt.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:ce.shadow_vert,fragmentShader:ce.shadow_frag}};zi.physical={uniforms:Bn([zi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new le},clearcoatNormalScale:{value:new De(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new le},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new le},transmissionSamplerSize:{value:new De},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new le},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new le},anisotropyVector:{value:new De},anisotropyMap:{value:null},anisotropyMapTransform:{value:new le}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag};const Uc={r:0,b:0,g:0},xr=new Gi,VT=new Ke;function kT(o,t,i,r,l,c,h){const d=new Me(0);let p=c===!0?0:1,m,g,v=null,y=0,M=null;function T(N){let D=N.isScene===!0?N.background:null;return D&&D.isTexture&&(D=(N.backgroundBlurriness>0?i:t).get(D)),D}function C(N){let D=!1;const K=T(N);K===null?S(d,p):K&&K.isColor&&(S(K,1),D=!0);const G=o.xr.getEnvironmentBlendMode();G==="additive"?r.buffers.color.setClear(0,0,0,1,h):G==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,h),(o.autoClear||D)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function x(N,D){const K=T(D);K&&(K.isCubeTexture||K.mapping===jc)?(g===void 0&&(g=new Fi(new Bs(1,1,1),new Qa({name:"BackgroundCubeMaterial",uniforms:Ps(zi.backgroundCube.uniforms),vertexShader:zi.backgroundCube.vertexShader,fragmentShader:zi.backgroundCube.fragmentShader,side:jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(G,I,Z){this.matrixWorld.copyPosition(Z.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(g)),xr.copy(D.backgroundRotation),xr.x*=-1,xr.y*=-1,xr.z*=-1,K.isCubeTexture&&K.isRenderTargetTexture===!1&&(xr.y*=-1,xr.z*=-1),g.material.uniforms.envMap.value=K,g.material.uniforms.flipEnvMap.value=K.isCubeTexture&&K.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=D.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(VT.makeRotationFromEuler(xr)),g.material.toneMapped=Re.getTransfer(K.colorSpace)!==Fe,(v!==K||y!==K.version||M!==o.toneMapping)&&(g.material.needsUpdate=!0,v=K,y=K.version,M=o.toneMapping),g.layers.enableAll(),N.unshift(g,g.geometry,g.material,0,0,null)):K&&K.isTexture&&(m===void 0&&(m=new Fi(new Kc(2,2),new Qa({name:"BackgroundMaterial",uniforms:Ps(zi.background.uniforms),vertexShader:zi.background.vertexShader,fragmentShader:zi.background.fragmentShader,side:Ka,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(m)),m.material.uniforms.t2D.value=K,m.material.uniforms.backgroundIntensity.value=D.backgroundIntensity,m.material.toneMapped=Re.getTransfer(K.colorSpace)!==Fe,K.matrixAutoUpdate===!0&&K.updateMatrix(),m.material.uniforms.uvTransform.value.copy(K.matrix),(v!==K||y!==K.version||M!==o.toneMapping)&&(m.material.needsUpdate=!0,v=K,y=K.version,M=o.toneMapping),m.layers.enableAll(),N.unshift(m,m.geometry,m.material,0,0,null))}function S(N,D){N.getRGB(Uc,p0(o)),r.buffers.color.setClear(Uc.r,Uc.g,Uc.b,D,h)}function z(){g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0),m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0)}return{getClearColor:function(){return d},setClearColor:function(N,D=1){d.set(N),p=D,S(d,p)},getClearAlpha:function(){return p},setClearAlpha:function(N){p=N,S(d,p)},render:C,addToRenderList:x,dispose:z}}function XT(o,t){const i=o.getParameter(o.MAX_VERTEX_ATTRIBS),r={},l=y(null);let c=l,h=!1;function d(R,H,lt,st,gt){let _t=!1;const O=v(st,lt,H);c!==O&&(c=O,m(c.object)),_t=M(R,st,lt,gt),_t&&T(R,st,lt,gt),gt!==null&&t.update(gt,o.ELEMENT_ARRAY_BUFFER),(_t||h)&&(h=!1,D(R,H,lt,st),gt!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,t.get(gt).buffer))}function p(){return o.createVertexArray()}function m(R){return o.bindVertexArray(R)}function g(R){return o.deleteVertexArray(R)}function v(R,H,lt){const st=lt.wireframe===!0;let gt=r[R.id];gt===void 0&&(gt={},r[R.id]=gt);let _t=gt[H.id];_t===void 0&&(_t={},gt[H.id]=_t);let O=_t[st];return O===void 0&&(O=y(p()),_t[st]=O),O}function y(R){const H=[],lt=[],st=[];for(let gt=0;gt<i;gt++)H[gt]=0,lt[gt]=0,st[gt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:H,enabledAttributes:lt,attributeDivisors:st,object:R,attributes:{},index:null}}function M(R,H,lt,st){const gt=c.attributes,_t=H.attributes;let O=0;const j=lt.getAttributes();for(const Y in j)if(j[Y].location>=0){const Tt=gt[Y];let L=_t[Y];if(L===void 0&&(Y==="instanceMatrix"&&R.instanceMatrix&&(L=R.instanceMatrix),Y==="instanceColor"&&R.instanceColor&&(L=R.instanceColor)),Tt===void 0||Tt.attribute!==L||L&&Tt.data!==L.data)return!0;O++}return c.attributesNum!==O||c.index!==st}function T(R,H,lt,st){const gt={},_t=H.attributes;let O=0;const j=lt.getAttributes();for(const Y in j)if(j[Y].location>=0){let Tt=_t[Y];Tt===void 0&&(Y==="instanceMatrix"&&R.instanceMatrix&&(Tt=R.instanceMatrix),Y==="instanceColor"&&R.instanceColor&&(Tt=R.instanceColor));const L={};L.attribute=Tt,Tt&&Tt.data&&(L.data=Tt.data),gt[Y]=L,O++}c.attributes=gt,c.attributesNum=O,c.index=st}function C(){const R=c.newAttributes;for(let H=0,lt=R.length;H<lt;H++)R[H]=0}function x(R){S(R,0)}function S(R,H){const lt=c.newAttributes,st=c.enabledAttributes,gt=c.attributeDivisors;lt[R]=1,st[R]===0&&(o.enableVertexAttribArray(R),st[R]=1),gt[R]!==H&&(o.vertexAttribDivisor(R,H),gt[R]=H)}function z(){const R=c.newAttributes,H=c.enabledAttributes;for(let lt=0,st=H.length;lt<st;lt++)H[lt]!==R[lt]&&(o.disableVertexAttribArray(lt),H[lt]=0)}function N(R,H,lt,st,gt,_t,O){O===!0?o.vertexAttribIPointer(R,H,lt,gt,_t):o.vertexAttribPointer(R,H,lt,st,gt,_t)}function D(R,H,lt,st){C();const gt=st.attributes,_t=lt.getAttributes(),O=H.defaultAttributeValues;for(const j in _t){const Y=_t[j];if(Y.location>=0){let xt=gt[j];if(xt===void 0&&(j==="instanceMatrix"&&R.instanceMatrix&&(xt=R.instanceMatrix),j==="instanceColor"&&R.instanceColor&&(xt=R.instanceColor)),xt!==void 0){const Tt=xt.normalized,L=xt.itemSize,et=t.get(xt);if(et===void 0)continue;const yt=et.buffer,q=et.type,ut=et.bytesPerElement,Et=q===o.INT||q===o.UNSIGNED_INT||xt.gpuType===zd;if(xt.isInterleavedBufferAttribute){const St=xt.data,Ft=St.stride,jt=xt.offset;if(St.isInstancedInterleavedBuffer){for(let Kt=0;Kt<Y.locationSize;Kt++)S(Y.location+Kt,St.meshPerAttribute);R.isInstancedMesh!==!0&&st._maxInstanceCount===void 0&&(st._maxInstanceCount=St.meshPerAttribute*St.count)}else for(let Kt=0;Kt<Y.locationSize;Kt++)x(Y.location+Kt);o.bindBuffer(o.ARRAY_BUFFER,yt);for(let Kt=0;Kt<Y.locationSize;Kt++)N(Y.location+Kt,L/Y.locationSize,q,Tt,Ft*ut,(jt+L/Y.locationSize*Kt)*ut,Et)}else{if(xt.isInstancedBufferAttribute){for(let St=0;St<Y.locationSize;St++)S(Y.location+St,xt.meshPerAttribute);R.isInstancedMesh!==!0&&st._maxInstanceCount===void 0&&(st._maxInstanceCount=xt.meshPerAttribute*xt.count)}else for(let St=0;St<Y.locationSize;St++)x(Y.location+St);o.bindBuffer(o.ARRAY_BUFFER,yt);for(let St=0;St<Y.locationSize;St++)N(Y.location+St,L/Y.locationSize,q,Tt,L*ut,L/Y.locationSize*St*ut,Et)}}else if(O!==void 0){const Tt=O[j];if(Tt!==void 0)switch(Tt.length){case 2:o.vertexAttrib2fv(Y.location,Tt);break;case 3:o.vertexAttrib3fv(Y.location,Tt);break;case 4:o.vertexAttrib4fv(Y.location,Tt);break;default:o.vertexAttrib1fv(Y.location,Tt)}}}}z()}function K(){Z();for(const R in r){const H=r[R];for(const lt in H){const st=H[lt];for(const gt in st)g(st[gt].object),delete st[gt];delete H[lt]}delete r[R]}}function G(R){if(r[R.id]===void 0)return;const H=r[R.id];for(const lt in H){const st=H[lt];for(const gt in st)g(st[gt].object),delete st[gt];delete H[lt]}delete r[R.id]}function I(R){for(const H in r){const lt=r[H];if(lt[R.id]===void 0)continue;const st=lt[R.id];for(const gt in st)g(st[gt].object),delete st[gt];delete lt[R.id]}}function Z(){w(),h=!0,c!==l&&(c=l,m(c.object))}function w(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:Z,resetDefaultState:w,dispose:K,releaseStatesOfGeometry:G,releaseStatesOfProgram:I,initAttributes:C,enableAttribute:x,disableUnusedAttributes:z}}function WT(o,t,i){let r;function l(m){r=m}function c(m,g){o.drawArrays(r,m,g),i.update(g,r,1)}function h(m,g,v){v!==0&&(o.drawArraysInstanced(r,m,g,v),i.update(g,r,v))}function d(m,g,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,g,0,v);let M=0;for(let T=0;T<v;T++)M+=g[T];i.update(M,r,1)}function p(m,g,v,y){if(v===0)return;const M=t.get("WEBGL_multi_draw");if(M===null)for(let T=0;T<m.length;T++)h(m[T],g[T],y[T]);else{M.multiDrawArraysInstancedWEBGL(r,m,0,g,0,y,0,v);let T=0;for(let C=0;C<v;C++)T+=g[C]*y[C];i.update(T,r,1)}}this.setMode=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function qT(o,t,i,r){let l;function c(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const I=t.get("EXT_texture_filter_anisotropic");l=o.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(I){return!(I!==wi&&r.convert(I)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(I){const Z=I===jo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==ga&&r.convert(I)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==da&&!Z)}function p(I){if(I==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=i.precision!==void 0?i.precision:"highp";const g=p(m);g!==m&&(console.warn("THREE.WebGLRenderer:",m,"not supported, using",g,"instead."),m=g);const v=i.logarithmicDepthBuffer===!0,y=i.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),M=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),T=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),C=o.getParameter(o.MAX_TEXTURE_SIZE),x=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),S=o.getParameter(o.MAX_VERTEX_ATTRIBS),z=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),N=o.getParameter(o.MAX_VARYING_VECTORS),D=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),K=T>0,G=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:p,textureFormatReadable:h,textureTypeReadable:d,precision:m,logarithmicDepthBuffer:v,reverseDepthBuffer:y,maxTextures:M,maxVertexTextures:T,maxTextureSize:C,maxCubemapSize:x,maxAttributes:S,maxVertexUniforms:z,maxVaryings:N,maxFragmentUniforms:D,vertexTextures:K,maxSamples:G}}function YT(o){const t=this;let i=null,r=0,l=!1,c=!1;const h=new Er,d=new le,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(v,y){const M=v.length!==0||y||r!==0||l;return l=y,r=v.length,M},this.beginShadows=function(){c=!0,g(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(v,y){i=g(v,y,0)},this.setState=function(v,y,M){const T=v.clippingPlanes,C=v.clipIntersection,x=v.clipShadows,S=o.get(v);if(!l||T===null||T.length===0||c&&!x)c?g(null):m();else{const z=c?0:r,N=z*4;let D=S.clippingState||null;p.value=D,D=g(T,y,N,M);for(let K=0;K!==N;++K)D[K]=i[K];S.clippingState=D,this.numIntersection=C?this.numPlanes:0,this.numPlanes+=z}};function m(){p.value!==i&&(p.value=i,p.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function g(v,y,M,T){const C=v!==null?v.length:0;let x=null;if(C!==0){if(x=p.value,T!==!0||x===null){const S=M+C*4,z=y.matrixWorldInverse;d.getNormalMatrix(z),(x===null||x.length<S)&&(x=new Float32Array(S));for(let N=0,D=M;N!==C;++N,D+=4)h.copy(v[N]).applyMatrix4(z,d),h.normal.toArray(x,D),x[D+3]=h.constant}p.value=x,p.needsUpdate=!0}return t.numPlanes=C,t.numIntersection=0,x}}function jT(o){let t=new WeakMap;function i(h,d){return d===$h?h.mapping=Ls:d===td&&(h.mapping=Ns),h}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===$h||d===td)if(t.has(h)){const p=t.get(h).texture;return i(p,h.mapping)}else{const p=h.image;if(p&&p.height>0){const m=new WM(p.height);return m.fromEquirectangularTexture(o,h),t.set(h,m),h.addEventListener("dispose",l),i(m.texture,h.mapping)}else return null}}return h}function l(h){const d=h.target;d.removeEventListener("dispose",l);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function c(){t=new WeakMap}return{get:r,dispose:c}}const Cs=4,vv=[.125,.215,.35,.446,.526,.582],Ar=20,Bh=new y0,Sv=new Me;let Fh=null,Hh=0,Gh=0,Vh=!1;const br=(1+Math.sqrt(5))/2,As=1/br,yv=[new at(-br,As,0),new at(br,As,0),new at(-As,0,br),new at(As,0,br),new at(0,br,-As),new at(0,br,As),new at(-1,1,-1),new at(1,1,-1),new at(-1,1,1),new at(1,1,1)],ZT=new at;class xv{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,i=0,r=.1,l=100,c={}){const{size:h=256,position:d=ZT}=c;Fh=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Gh=this._renderer.getActiveMipmapLevel(),Vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const p=this._allocateTargets();return p.depthBuffer=!0,this._sceneToCubeUV(t,r,l,p,d),i>0&&this._blur(p,0,0,i),this._applyPMREM(p),this._cleanup(p),p}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=bv(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ev(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Fh,Hh,Gh),this._renderer.xr.enabled=Vh,t.scissorTest=!1,Lc(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===Ls||t.mapping===Ns?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Fh=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Gh=this._renderer.getActiveMipmapLevel(),Vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=i||this._allocateTargets();return this._textureToCubeUV(t,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:Bi,minFilter:Bi,generateMipmaps:!1,type:jo,format:wi,colorSpace:Os,depthBuffer:!1},l=Mv(t,i,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mv(t,i,r);const{_lodMax:c}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=KT(c)),this._blurMaterial=QT(c,t,i)}return l}_compileMaterial(t){const i=new Fi(this._lodPlanes[0],t);this._renderer.compile(i,Bh)}_sceneToCubeUV(t,i,r,l,c){const p=new gi(90,1,i,r),m=[1,-1,1,1,1,1],g=[1,1,1,-1,-1,-1],v=this._renderer,y=v.autoClear,M=v.toneMapping;v.getClearColor(Sv),v.toneMapping=Za,v.autoClear=!1;const T=new f0({name:"PMREM.Background",side:jn,depthWrite:!1,depthTest:!1}),C=new Fi(new Bs,T);let x=!1;const S=t.background;S?S.isColor&&(T.color.copy(S),t.background=null,x=!0):(T.color.copy(Sv),x=!0);for(let z=0;z<6;z++){const N=z%3;N===0?(p.up.set(0,m[z],0),p.position.set(c.x,c.y,c.z),p.lookAt(c.x+g[z],c.y,c.z)):N===1?(p.up.set(0,0,m[z]),p.position.set(c.x,c.y,c.z),p.lookAt(c.x,c.y+g[z],c.z)):(p.up.set(0,m[z],0),p.position.set(c.x,c.y,c.z),p.lookAt(c.x,c.y,c.z+g[z]));const D=this._cubeSize;Lc(l,N*D,z>2?D:0,D,D),v.setRenderTarget(l),x&&v.render(C,p),v.render(t,p)}C.geometry.dispose(),C.material.dispose(),v.toneMapping=M,v.autoClear=y,t.background=S}_textureToCubeUV(t,i){const r=this._renderer,l=t.mapping===Ls||t.mapping===Ns;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=bv()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ev());const c=l?this._cubemapMaterial:this._equirectMaterial,h=new Fi(this._lodPlanes[0],c),d=c.uniforms;d.envMap.value=t;const p=this._cubeSize;Lc(i,0,0,3*p,2*p),r.setRenderTarget(i),r.render(h,Bh)}_applyPMREM(t){const i=this._renderer,r=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let c=1;c<l;c++){const h=Math.sqrt(this._sigmas[c]*this._sigmas[c]-this._sigmas[c-1]*this._sigmas[c-1]),d=yv[(l-c-1)%yv.length];this._blur(t,c-1,c,h,d)}i.autoClear=r}_blur(t,i,r,l,c){const h=this._pingPongRenderTarget;this._halfBlur(t,h,i,r,l,"latitudinal",c),this._halfBlur(h,t,r,r,l,"longitudinal",c)}_halfBlur(t,i,r,l,c,h,d){const p=this._renderer,m=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,v=new Fi(this._lodPlanes[l],m),y=m.uniforms,M=this._sizeLods[r]-1,T=isFinite(c)?Math.PI/(2*M):2*Math.PI/(2*Ar-1),C=c/T,x=isFinite(c)?1+Math.floor(g*C):Ar;x>Ar&&console.warn(`sigmaRadians, ${c}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Ar}`);const S=[];let z=0;for(let I=0;I<Ar;++I){const Z=I/C,w=Math.exp(-Z*Z/2);S.push(w),I===0?z+=w:I<x&&(z+=2*w)}for(let I=0;I<S.length;I++)S[I]=S[I]/z;y.envMap.value=t.texture,y.samples.value=x,y.weights.value=S,y.latitudinal.value=h==="latitudinal",d&&(y.poleAxis.value=d);const{_lodMax:N}=this;y.dTheta.value=T,y.mipInt.value=N-r;const D=this._sizeLods[l],K=3*D*(l>N-Cs?l-N+Cs:0),G=4*(this._cubeSize-D);Lc(i,K,G,3*D,2*D),p.setRenderTarget(i),p.render(v,Bh)}}function KT(o){const t=[],i=[],r=[];let l=o;const c=o-Cs+1+vv.length;for(let h=0;h<c;h++){const d=Math.pow(2,l);i.push(d);let p=1/d;h>o-Cs?p=vv[h-o+Cs-1]:h===0&&(p=0),r.push(p);const m=1/(d-2),g=-m,v=1+m,y=[g,g,v,g,v,v,g,g,v,v,g,v],M=6,T=6,C=3,x=2,S=1,z=new Float32Array(C*T*M),N=new Float32Array(x*T*M),D=new Float32Array(S*T*M);for(let G=0;G<M;G++){const I=G%3*2/3-1,Z=G>2?0:-1,w=[I,Z,0,I+2/3,Z,0,I+2/3,Z+1,0,I,Z,0,I+2/3,Z+1,0,I,Z+1,0];z.set(w,C*T*G),N.set(y,x*T*G);const R=[G,G,G,G,G,G];D.set(R,S*T*G)}const K=new _a;K.setAttribute("position",new Hi(z,C)),K.setAttribute("uv",new Hi(N,x)),K.setAttribute("faceIndex",new Hi(D,S)),t.push(K),l>Cs&&l--}return{lodPlanes:t,sizeLods:i,sigmas:r}}function Mv(o,t,i){const r=new Nr(o,t,i);return r.texture.mapping=jc,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Lc(o,t,i,r,l){o.viewport.set(t,i,r,l),o.scissor.set(t,i,r,l)}function QT(o,t,i){const r=new Float32Array(Ar),l=new at(0,1,0);return new Qa({name:"SphericalGaussianBlur",defines:{n:Ar,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Wd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ja,depthTest:!1,depthWrite:!1})}function Ev(){return new Qa({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ja,depthTest:!1,depthWrite:!1})}function bv(){return new Qa({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ja,depthTest:!1,depthWrite:!1})}function Wd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function JT(o){let t=new WeakMap,i=null;function r(d){if(d&&d.isTexture){const p=d.mapping,m=p===$h||p===td,g=p===Ls||p===Ns;if(m||g){let v=t.get(d);const y=v!==void 0?v.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==y)return i===null&&(i=new xv(o)),v=m?i.fromEquirectangular(d,v):i.fromCubemap(d,v),v.texture.pmremVersion=d.pmremVersion,t.set(d,v),v.texture;if(v!==void 0)return v.texture;{const M=d.image;return m&&M&&M.height>0||g&&M&&l(M)?(i===null&&(i=new xv(o)),v=m?i.fromEquirectangular(d):i.fromCubemap(d),v.texture.pmremVersion=d.pmremVersion,t.set(d,v),d.addEventListener("dispose",c),v.texture):null}}}return d}function l(d){let p=0;const m=6;for(let g=0;g<m;g++)d[g]!==void 0&&p++;return p===m}function c(d){const p=d.target;p.removeEventListener("dispose",c);const m=t.get(p);m!==void 0&&(t.delete(p),m.dispose())}function h(){t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function $T(o){const t={};function i(r){if(t[r]!==void 0)return t[r];let l;switch(r){case"WEBGL_depth_texture":l=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=o.getExtension(r)}return t[r]=l,l}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){const l=i(r);return l===null&&Fc("THREE.WebGLRenderer: "+r+" extension not supported."),l}}}function tA(o,t,i,r){const l={},c=new WeakMap;function h(v){const y=v.target;y.index!==null&&t.remove(y.index);for(const T in y.attributes)t.remove(y.attributes[T]);y.removeEventListener("dispose",h),delete l[y.id];const M=c.get(y);M&&(t.remove(M),c.delete(y)),r.releaseStatesOfGeometry(y),y.isInstancedBufferGeometry===!0&&delete y._maxInstanceCount,i.memory.geometries--}function d(v,y){return l[y.id]===!0||(y.addEventListener("dispose",h),l[y.id]=!0,i.memory.geometries++),y}function p(v){const y=v.attributes;for(const M in y)t.update(y[M],o.ARRAY_BUFFER)}function m(v){const y=[],M=v.index,T=v.attributes.position;let C=0;if(M!==null){const z=M.array;C=M.version;for(let N=0,D=z.length;N<D;N+=3){const K=z[N+0],G=z[N+1],I=z[N+2];y.push(K,G,G,I,I,K)}}else if(T!==void 0){const z=T.array;C=T.version;for(let N=0,D=z.length/3-1;N<D;N+=3){const K=N+0,G=N+1,I=N+2;y.push(K,G,G,I,I,K)}}else return;const x=new(s0(y)?d0:h0)(y,1);x.version=C;const S=c.get(v);S&&t.remove(S),c.set(v,x)}function g(v){const y=c.get(v);if(y){const M=v.index;M!==null&&y.version<M.version&&m(v)}else m(v);return c.get(v)}return{get:d,update:p,getWireframeAttribute:g}}function eA(o,t,i){let r;function l(y){r=y}let c,h;function d(y){c=y.type,h=y.bytesPerElement}function p(y,M){o.drawElements(r,M,c,y*h),i.update(M,r,1)}function m(y,M,T){T!==0&&(o.drawElementsInstanced(r,M,c,y*h,T),i.update(M,r,T))}function g(y,M,T){if(T===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,M,0,c,y,0,T);let x=0;for(let S=0;S<T;S++)x+=M[S];i.update(x,r,1)}function v(y,M,T,C){if(T===0)return;const x=t.get("WEBGL_multi_draw");if(x===null)for(let S=0;S<y.length;S++)m(y[S]/h,M[S],C[S]);else{x.multiDrawElementsInstancedWEBGL(r,M,0,c,y,0,C,0,T);let S=0;for(let z=0;z<T;z++)S+=M[z]*C[z];i.update(S,r,1)}}this.setMode=l,this.setIndex=d,this.render=p,this.renderInstances=m,this.renderMultiDraw=g,this.renderMultiDrawInstances=v}function nA(o){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(c,h,d){switch(i.calls++,h){case o.TRIANGLES:i.triangles+=d*(c/3);break;case o.LINES:i.lines+=d*(c/2);break;case o.LINE_STRIP:i.lines+=d*(c-1);break;case o.LINE_LOOP:i.lines+=d*c;break;case o.POINTS:i.points+=d*c;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:r}}function iA(o,t,i){const r=new WeakMap,l=new nn;function c(h,d,p){const m=h.morphTargetInfluences,g=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,v=g!==void 0?g.length:0;let y=r.get(d);if(y===void 0||y.count!==v){let R=function(){Z.dispose(),r.delete(d),d.removeEventListener("dispose",R)};var M=R;y!==void 0&&y.texture.dispose();const T=d.morphAttributes.position!==void 0,C=d.morphAttributes.normal!==void 0,x=d.morphAttributes.color!==void 0,S=d.morphAttributes.position||[],z=d.morphAttributes.normal||[],N=d.morphAttributes.color||[];let D=0;T===!0&&(D=1),C===!0&&(D=2),x===!0&&(D=3);let K=d.attributes.position.count*D,G=1;K>t.maxTextureSize&&(G=Math.ceil(K/t.maxTextureSize),K=t.maxTextureSize);const I=new Float32Array(K*G*4*v),Z=new o0(I,K,G,v);Z.type=da,Z.needsUpdate=!0;const w=D*4;for(let H=0;H<v;H++){const lt=S[H],st=z[H],gt=N[H],_t=K*G*4*H;for(let O=0;O<lt.count;O++){const j=O*w;T===!0&&(l.fromBufferAttribute(lt,O),I[_t+j+0]=l.x,I[_t+j+1]=l.y,I[_t+j+2]=l.z,I[_t+j+3]=0),C===!0&&(l.fromBufferAttribute(st,O),I[_t+j+4]=l.x,I[_t+j+5]=l.y,I[_t+j+6]=l.z,I[_t+j+7]=0),x===!0&&(l.fromBufferAttribute(gt,O),I[_t+j+8]=l.x,I[_t+j+9]=l.y,I[_t+j+10]=l.z,I[_t+j+11]=gt.itemSize===4?l.w:1)}}y={count:v,texture:Z,size:new De(K,G)},r.set(d,y),d.addEventListener("dispose",R)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)p.getUniforms().setValue(o,"morphTexture",h.morphTexture,i);else{let T=0;for(let x=0;x<m.length;x++)T+=m[x];const C=d.morphTargetsRelative?1:1-T;p.getUniforms().setValue(o,"morphTargetBaseInfluence",C),p.getUniforms().setValue(o,"morphTargetInfluences",m)}p.getUniforms().setValue(o,"morphTargetsTexture",y.texture,i),p.getUniforms().setValue(o,"morphTargetsTextureSize",y.size)}return{update:c}}function aA(o,t,i,r){let l=new WeakMap;function c(p){const m=r.render.frame,g=p.geometry,v=t.get(p,g);if(l.get(v)!==m&&(t.update(v),l.set(v,m)),p.isInstancedMesh&&(p.hasEventListener("dispose",d)===!1&&p.addEventListener("dispose",d),l.get(p)!==m&&(i.update(p.instanceMatrix,o.ARRAY_BUFFER),p.instanceColor!==null&&i.update(p.instanceColor,o.ARRAY_BUFFER),l.set(p,m))),p.isSkinnedMesh){const y=p.skeleton;l.get(y)!==m&&(y.update(),l.set(y,m))}return v}function h(){l=new WeakMap}function d(p){const m=p.target;m.removeEventListener("dispose",d),i.remove(m.instanceMatrix),m.instanceColor!==null&&i.remove(m.instanceColor)}return{update:c,dispose:h}}const M0=new Zn,Tv=new v0(1,1),E0=new o0,b0=new RM,T0=new g0,Av=[],Cv=[],Rv=new Float32Array(16),wv=new Float32Array(9),Dv=new Float32Array(4);function Fs(o,t,i){const r=o[0];if(r<=0||r>0)return o;const l=t*i;let c=Av[l];if(c===void 0&&(c=new Float32Array(l),Av[l]=c),t!==0){r.toArray(c,0);for(let h=1,d=0;h!==t;++h)d+=i,o[h].toArray(c,d)}return c}function gn(o,t){if(o.length!==t.length)return!1;for(let i=0,r=o.length;i<r;i++)if(o[i]!==t[i])return!1;return!0}function _n(o,t){for(let i=0,r=t.length;i<r;i++)o[i]=t[i]}function Qc(o,t){let i=Cv[t];i===void 0&&(i=new Int32Array(t),Cv[t]=i);for(let r=0;r!==t;++r)i[r]=o.allocateTextureUnit();return i}function rA(o,t){const i=this.cache;i[0]!==t&&(o.uniform1f(this.addr,t),i[0]=t)}function sA(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(o.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(gn(i,t))return;o.uniform2fv(this.addr,t),_n(i,t)}}function oA(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(o.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(o.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(gn(i,t))return;o.uniform3fv(this.addr,t),_n(i,t)}}function lA(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(o.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(gn(i,t))return;o.uniform4fv(this.addr,t),_n(i,t)}}function cA(o,t){const i=this.cache,r=t.elements;if(r===void 0){if(gn(i,t))return;o.uniformMatrix2fv(this.addr,!1,t),_n(i,t)}else{if(gn(i,r))return;Dv.set(r),o.uniformMatrix2fv(this.addr,!1,Dv),_n(i,r)}}function uA(o,t){const i=this.cache,r=t.elements;if(r===void 0){if(gn(i,t))return;o.uniformMatrix3fv(this.addr,!1,t),_n(i,t)}else{if(gn(i,r))return;wv.set(r),o.uniformMatrix3fv(this.addr,!1,wv),_n(i,r)}}function fA(o,t){const i=this.cache,r=t.elements;if(r===void 0){if(gn(i,t))return;o.uniformMatrix4fv(this.addr,!1,t),_n(i,t)}else{if(gn(i,r))return;Rv.set(r),o.uniformMatrix4fv(this.addr,!1,Rv),_n(i,r)}}function hA(o,t){const i=this.cache;i[0]!==t&&(o.uniform1i(this.addr,t),i[0]=t)}function dA(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(o.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(gn(i,t))return;o.uniform2iv(this.addr,t),_n(i,t)}}function pA(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(o.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(gn(i,t))return;o.uniform3iv(this.addr,t),_n(i,t)}}function mA(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(o.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(gn(i,t))return;o.uniform4iv(this.addr,t),_n(i,t)}}function gA(o,t){const i=this.cache;i[0]!==t&&(o.uniform1ui(this.addr,t),i[0]=t)}function _A(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(o.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(gn(i,t))return;o.uniform2uiv(this.addr,t),_n(i,t)}}function vA(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(o.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(gn(i,t))return;o.uniform3uiv(this.addr,t),_n(i,t)}}function SA(o,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(o.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(gn(i,t))return;o.uniform4uiv(this.addr,t),_n(i,t)}}function yA(o,t,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l);let c;this.type===o.SAMPLER_2D_SHADOW?(Tv.compareFunction=r0,c=Tv):c=M0,i.setTexture2D(t||c,l)}function xA(o,t,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture3D(t||b0,l)}function MA(o,t,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTextureCube(t||T0,l)}function EA(o,t,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture2DArray(t||E0,l)}function bA(o){switch(o){case 5126:return rA;case 35664:return sA;case 35665:return oA;case 35666:return lA;case 35674:return cA;case 35675:return uA;case 35676:return fA;case 5124:case 35670:return hA;case 35667:case 35671:return dA;case 35668:case 35672:return pA;case 35669:case 35673:return mA;case 5125:return gA;case 36294:return _A;case 36295:return vA;case 36296:return SA;case 35678:case 36198:case 36298:case 36306:case 35682:return yA;case 35679:case 36299:case 36307:return xA;case 35680:case 36300:case 36308:case 36293:return MA;case 36289:case 36303:case 36311:case 36292:return EA}}function TA(o,t){o.uniform1fv(this.addr,t)}function AA(o,t){const i=Fs(t,this.size,2);o.uniform2fv(this.addr,i)}function CA(o,t){const i=Fs(t,this.size,3);o.uniform3fv(this.addr,i)}function RA(o,t){const i=Fs(t,this.size,4);o.uniform4fv(this.addr,i)}function wA(o,t){const i=Fs(t,this.size,4);o.uniformMatrix2fv(this.addr,!1,i)}function DA(o,t){const i=Fs(t,this.size,9);o.uniformMatrix3fv(this.addr,!1,i)}function UA(o,t){const i=Fs(t,this.size,16);o.uniformMatrix4fv(this.addr,!1,i)}function LA(o,t){o.uniform1iv(this.addr,t)}function NA(o,t){o.uniform2iv(this.addr,t)}function OA(o,t){o.uniform3iv(this.addr,t)}function PA(o,t){o.uniform4iv(this.addr,t)}function IA(o,t){o.uniform1uiv(this.addr,t)}function zA(o,t){o.uniform2uiv(this.addr,t)}function BA(o,t){o.uniform3uiv(this.addr,t)}function FA(o,t){o.uniform4uiv(this.addr,t)}function HA(o,t,i){const r=this.cache,l=t.length,c=Qc(i,l);gn(r,c)||(o.uniform1iv(this.addr,c),_n(r,c));for(let h=0;h!==l;++h)i.setTexture2D(t[h]||M0,c[h])}function GA(o,t,i){const r=this.cache,l=t.length,c=Qc(i,l);gn(r,c)||(o.uniform1iv(this.addr,c),_n(r,c));for(let h=0;h!==l;++h)i.setTexture3D(t[h]||b0,c[h])}function VA(o,t,i){const r=this.cache,l=t.length,c=Qc(i,l);gn(r,c)||(o.uniform1iv(this.addr,c),_n(r,c));for(let h=0;h!==l;++h)i.setTextureCube(t[h]||T0,c[h])}function kA(o,t,i){const r=this.cache,l=t.length,c=Qc(i,l);gn(r,c)||(o.uniform1iv(this.addr,c),_n(r,c));for(let h=0;h!==l;++h)i.setTexture2DArray(t[h]||E0,c[h])}function XA(o){switch(o){case 5126:return TA;case 35664:return AA;case 35665:return CA;case 35666:return RA;case 35674:return wA;case 35675:return DA;case 35676:return UA;case 5124:case 35670:return LA;case 35667:case 35671:return NA;case 35668:case 35672:return OA;case 35669:case 35673:return PA;case 5125:return IA;case 36294:return zA;case 36295:return BA;case 36296:return FA;case 35678:case 36198:case 36298:case 36306:case 35682:return HA;case 35679:case 36299:case 36307:return GA;case 35680:case 36300:case 36308:case 36293:return VA;case 36289:case 36303:case 36311:case 36292:return kA}}class WA{constructor(t,i,r){this.id=t,this.addr=r,this.cache=[],this.type=i.type,this.setValue=bA(i.type)}}class qA{constructor(t,i,r){this.id=t,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=XA(i.type)}}class YA{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,r){const l=this.seq;for(let c=0,h=l.length;c!==h;++c){const d=l[c];d.setValue(t,i[d.id],r)}}}const kh=/(\w+)(\])?(\[|\.)?/g;function Uv(o,t){o.seq.push(t),o.map[t.id]=t}function jA(o,t,i){const r=o.name,l=r.length;for(kh.lastIndex=0;;){const c=kh.exec(r),h=kh.lastIndex;let d=c[1];const p=c[2]==="]",m=c[3];if(p&&(d=d|0),m===void 0||m==="["&&h+2===l){Uv(i,m===void 0?new WA(d,o,t):new qA(d,o,t));break}else{let v=i.map[d];v===void 0&&(v=new YA(d),Uv(i,v)),i=v}}}class Hc{constructor(t,i){this.seq=[],this.map={};const r=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let l=0;l<r;++l){const c=t.getActiveUniform(i,l),h=t.getUniformLocation(i,c.name);jA(c,h,this)}}setValue(t,i,r,l){const c=this.map[i];c!==void 0&&c.setValue(t,r,l)}setOptional(t,i,r){const l=i[r];l!==void 0&&this.setValue(t,r,l)}static upload(t,i,r,l){for(let c=0,h=i.length;c!==h;++c){const d=i[c],p=r[d.id];p.needsUpdate!==!1&&d.setValue(t,p.value,l)}}static seqWithValue(t,i){const r=[];for(let l=0,c=t.length;l!==c;++l){const h=t[l];h.id in i&&r.push(h)}return r}}function Lv(o,t,i){const r=o.createShader(t);return o.shaderSource(r,i),o.compileShader(r),r}const ZA=37297;let KA=0;function QA(o,t){const i=o.split(`
`),r=[],l=Math.max(t-6,0),c=Math.min(t+6,i.length);for(let h=l;h<c;h++){const d=h+1;r.push(`${d===t?">":" "} ${d}: ${i[h]}`)}return r.join(`
`)}const Nv=new le;function JA(o){Re._getMatrix(Nv,Re.workingColorSpace,o);const t=`mat3( ${Nv.elements.map(i=>i.toFixed(4))} )`;switch(Re.getTransfer(o)){case Vc:return[t,"LinearTransferOETF"];case Fe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",o),[t,"LinearTransferOETF"]}}function Ov(o,t,i){const r=o.getShaderParameter(t,o.COMPILE_STATUS),l=o.getShaderInfoLog(t).trim();if(r&&l==="")return"";const c=/ERROR: 0:(\d+)/.exec(l);if(c){const h=parseInt(c[1]);return i.toUpperCase()+`

`+l+`

`+QA(o.getShaderSource(t),h)}else return l}function $A(o,t){const i=JA(t);return[`vec4 ${o}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function t1(o,t){let i;switch(t){case tM:i="Linear";break;case eM:i="Reinhard";break;case nM:i="Cineon";break;case iM:i="ACESFilmic";break;case rM:i="AgX";break;case sM:i="Neutral";break;case aM:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),i="Linear"}return"vec3 "+o+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Nc=new at;function e1(){Re.getLuminanceCoefficients(Nc);const o=Nc.x.toFixed(4),t=Nc.y.toFixed(4),i=Nc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function n1(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Go).join(`
`)}function i1(o){const t=[];for(const i in o){const r=o[i];r!==!1&&t.push("#define "+i+" "+r)}return t.join(`
`)}function a1(o,t){const i={},r=o.getProgramParameter(t,o.ACTIVE_ATTRIBUTES);for(let l=0;l<r;l++){const c=o.getActiveAttrib(t,l),h=c.name;let d=1;c.type===o.FLOAT_MAT2&&(d=2),c.type===o.FLOAT_MAT3&&(d=3),c.type===o.FLOAT_MAT4&&(d=4),i[h]={type:c.type,location:o.getAttribLocation(t,h),locationSize:d}}return i}function Go(o){return o!==""}function Pv(o,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Iv(o,t){return o.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const r1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dd(o){return o.replace(r1,o1)}const s1=new Map;function o1(o,t){let i=ce[t];if(i===void 0){const r=s1.get(t);if(r!==void 0)i=ce[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,r);else throw new Error("Can not resolve #include <"+t+">")}return Dd(i)}const l1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zv(o){return o.replace(l1,c1)}function c1(o,t,i,r){let l="";for(let c=parseInt(t);c<parseInt(i);c++)l+=r.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function Bv(o){let t=`precision ${o.precision} float;
	precision ${o.precision} int;
	precision ${o.precision} sampler2D;
	precision ${o.precision} samplerCube;
	precision ${o.precision} sampler3D;
	precision ${o.precision} sampler2DArray;
	precision ${o.precision} sampler2DShadow;
	precision ${o.precision} samplerCubeShadow;
	precision ${o.precision} sampler2DArrayShadow;
	precision ${o.precision} isampler2D;
	precision ${o.precision} isampler3D;
	precision ${o.precision} isamplerCube;
	precision ${o.precision} isampler2DArray;
	precision ${o.precision} usampler2D;
	precision ${o.precision} usampler3D;
	precision ${o.precision} usamplerCube;
	precision ${o.precision} usampler2DArray;
	`;return o.precision==="highp"?t+=`
#define HIGH_PRECISION`:o.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function u1(o){let t="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===Wv?t="SHADOWMAP_TYPE_PCF":o.shadowMapType===Nx?t="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===fa&&(t="SHADOWMAP_TYPE_VSM"),t}function f1(o){let t="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case Ls:case Ns:t="ENVMAP_TYPE_CUBE";break;case jc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function h1(o){let t="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case Ns:t="ENVMAP_MODE_REFRACTION";break}return t}function d1(o){let t="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case qv:t="ENVMAP_BLENDING_MULTIPLY";break;case Jx:t="ENVMAP_BLENDING_MIX";break;case $x:t="ENVMAP_BLENDING_ADD";break}return t}function p1(o){const t=o.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function m1(o,t,i,r){const l=o.getContext(),c=i.defines;let h=i.vertexShader,d=i.fragmentShader;const p=u1(i),m=f1(i),g=h1(i),v=d1(i),y=p1(i),M=n1(i),T=i1(c),C=l.createProgram();let x,S,z=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(x=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(Go).join(`
`),x.length>0&&(x+=`
`),S=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(Go).join(`
`),S.length>0&&(S+=`
`)):(x=[Bv(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Go).join(`
`),S=[Bv(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+m:"",i.envMap?"#define "+g:"",i.envMap?"#define "+v:"",y?"#define CUBEUV_TEXEL_WIDTH "+y.texelWidth:"",y?"#define CUBEUV_TEXEL_HEIGHT "+y.texelHeight:"",y?"#define CUBEUV_MAX_MIP "+y.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+p:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Za?"#define TONE_MAPPING":"",i.toneMapping!==Za?ce.tonemapping_pars_fragment:"",i.toneMapping!==Za?t1("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",ce.colorspace_pars_fragment,$A("linearToOutputTexel",i.outputColorSpace),e1(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(Go).join(`
`)),h=Dd(h),h=Pv(h,i),h=Iv(h,i),d=Dd(d),d=Pv(d,i),d=Iv(d,i),h=zv(h),d=zv(d),i.isRawShaderMaterial!==!0&&(z=`#version 300 es
`,x=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,S=["#define varying in",i.glslVersion===Y_?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===Y_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+S);const N=z+x+h,D=z+S+d,K=Lv(l,l.VERTEX_SHADER,N),G=Lv(l,l.FRAGMENT_SHADER,D);l.attachShader(C,K),l.attachShader(C,G),i.index0AttributeName!==void 0?l.bindAttribLocation(C,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(C,0,"position"),l.linkProgram(C);function I(H){if(o.debug.checkShaderErrors){const lt=l.getProgramInfoLog(C).trim(),st=l.getShaderInfoLog(K).trim(),gt=l.getShaderInfoLog(G).trim();let _t=!0,O=!0;if(l.getProgramParameter(C,l.LINK_STATUS)===!1)if(_t=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(l,C,K,G);else{const j=Ov(l,K,"vertex"),Y=Ov(l,G,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(C,l.VALIDATE_STATUS)+`

Material Name: `+H.name+`
Material Type: `+H.type+`

Program Info Log: `+lt+`
`+j+`
`+Y)}else lt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",lt):(st===""||gt==="")&&(O=!1);O&&(H.diagnostics={runnable:_t,programLog:lt,vertexShader:{log:st,prefix:x},fragmentShader:{log:gt,prefix:S}})}l.deleteShader(K),l.deleteShader(G),Z=new Hc(l,C),w=a1(l,C)}let Z;this.getUniforms=function(){return Z===void 0&&I(this),Z};let w;this.getAttributes=function(){return w===void 0&&I(this),w};let R=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=l.getProgramParameter(C,ZA)),R},this.destroy=function(){r.releaseStatesOfProgram(this),l.deleteProgram(C),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=KA++,this.cacheKey=t,this.usedTimes=1,this.program=C,this.vertexShader=K,this.fragmentShader=G,this}let g1=0;class _1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,r=t.fragmentShader,l=this._getShaderStage(i),c=this._getShaderStage(r),h=this._getShaderCacheForMaterial(t);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(c)===!1&&(h.add(c),c.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const r of i)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let r=i.get(t);return r===void 0&&(r=new Set,i.set(t,r)),r}_getShaderStage(t){const i=this.shaderCache;let r=i.get(t);return r===void 0&&(r=new v1(t),i.set(t,r)),r}}class v1{constructor(t){this.id=g1++,this.code=t,this.usedTimes=0}}function S1(o,t,i,r,l,c,h){const d=new c0,p=new _1,m=new Set,g=[],v=l.logarithmicDepthBuffer,y=l.vertexTextures;let M=l.precision;const T={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function C(w){return m.add(w),w===0?"uv":`uv${w}`}function x(w,R,H,lt,st){const gt=lt.fog,_t=st.geometry,O=w.isMeshStandardMaterial?lt.environment:null,j=(w.isMeshStandardMaterial?i:t).get(w.envMap||O),Y=j&&j.mapping===jc?j.image.height:null,xt=T[w.type];w.precision!==null&&(M=l.getMaxPrecision(w.precision),M!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",M,"instead."));const Tt=_t.morphAttributes.position||_t.morphAttributes.normal||_t.morphAttributes.color,L=Tt!==void 0?Tt.length:0;let et=0;_t.morphAttributes.position!==void 0&&(et=1),_t.morphAttributes.normal!==void 0&&(et=2),_t.morphAttributes.color!==void 0&&(et=3);let yt,q,ut,Et;if(xt){const be=zi[xt];yt=be.vertexShader,q=be.fragmentShader}else yt=w.vertexShader,q=w.fragmentShader,p.update(w),ut=p.getVertexShaderID(w),Et=p.getFragmentShaderID(w);const St=o.getRenderTarget(),Ft=o.state.buffers.depth.getReversed(),jt=st.isInstancedMesh===!0,Kt=st.isBatchedMesh===!0,Ve=!!w.map,He=!!w.matcap,ue=!!j,B=!!w.aoMap,wn=!!w.lightMap,fe=!!w.bumpMap,pe=!!w.normalMap,Xt=!!w.displacementMap,Ue=!!w.emissiveMap,kt=!!w.metalnessMap,U=!!w.roughnessMap,b=w.anisotropy>0,tt=w.clearcoat>0,ft=w.dispersion>0,Mt=w.iridescence>0,pt=w.sheen>0,Gt=w.transmission>0,Rt=b&&!!w.anisotropyMap,It=tt&&!!w.clearcoatMap,me=tt&&!!w.clearcoatNormalMap,At=tt&&!!w.clearcoatRoughnessMap,zt=Mt&&!!w.iridescenceMap,Zt=Mt&&!!w.iridescenceThicknessMap,Vt=pt&&!!w.sheenColorMap,Ot=pt&&!!w.sheenRoughnessMap,$t=!!w.specularMap,re=!!w.specularColorMap,Oe=!!w.specularIntensityMap,k=Gt&&!!w.transmissionMap,wt=Gt&&!!w.thicknessMap,ot=!!w.gradientMap,vt=!!w.alphaMap,Ct=w.alphaTest>0,Dt=!!w.alphaHash,te=!!w.extensions;let qe=Za;w.toneMapped&&(St===null||St.isXRRenderTarget===!0)&&(qe=o.toneMapping);const hn={shaderID:xt,shaderType:w.type,shaderName:w.name,vertexShader:yt,fragmentShader:q,defines:w.defines,customVertexShaderID:ut,customFragmentShaderID:Et,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:M,batching:Kt,batchingColor:Kt&&st._colorsTexture!==null,instancing:jt,instancingColor:jt&&st.instanceColor!==null,instancingMorph:jt&&st.morphTexture!==null,supportsVertexTextures:y,outputColorSpace:St===null?o.outputColorSpace:St.isXRRenderTarget===!0?St.texture.colorSpace:Os,alphaToCoverage:!!w.alphaToCoverage,map:Ve,matcap:He,envMap:ue,envMapMode:ue&&j.mapping,envMapCubeUVHeight:Y,aoMap:B,lightMap:wn,bumpMap:fe,normalMap:pe,displacementMap:y&&Xt,emissiveMap:Ue,normalMapObjectSpace:pe&&w.normalMapType===uM,normalMapTangentSpace:pe&&w.normalMapType===a0,metalnessMap:kt,roughnessMap:U,anisotropy:b,anisotropyMap:Rt,clearcoat:tt,clearcoatMap:It,clearcoatNormalMap:me,clearcoatRoughnessMap:At,dispersion:ft,iridescence:Mt,iridescenceMap:zt,iridescenceThicknessMap:Zt,sheen:pt,sheenColorMap:Vt,sheenRoughnessMap:Ot,specularMap:$t,specularColorMap:re,specularIntensityMap:Oe,transmission:Gt,transmissionMap:k,thicknessMap:wt,gradientMap:ot,opaque:w.transparent===!1&&w.blending===Rs&&w.alphaToCoverage===!1,alphaMap:vt,alphaTest:Ct,alphaHash:Dt,combine:w.combine,mapUv:Ve&&C(w.map.channel),aoMapUv:B&&C(w.aoMap.channel),lightMapUv:wn&&C(w.lightMap.channel),bumpMapUv:fe&&C(w.bumpMap.channel),normalMapUv:pe&&C(w.normalMap.channel),displacementMapUv:Xt&&C(w.displacementMap.channel),emissiveMapUv:Ue&&C(w.emissiveMap.channel),metalnessMapUv:kt&&C(w.metalnessMap.channel),roughnessMapUv:U&&C(w.roughnessMap.channel),anisotropyMapUv:Rt&&C(w.anisotropyMap.channel),clearcoatMapUv:It&&C(w.clearcoatMap.channel),clearcoatNormalMapUv:me&&C(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:At&&C(w.clearcoatRoughnessMap.channel),iridescenceMapUv:zt&&C(w.iridescenceMap.channel),iridescenceThicknessMapUv:Zt&&C(w.iridescenceThicknessMap.channel),sheenColorMapUv:Vt&&C(w.sheenColorMap.channel),sheenRoughnessMapUv:Ot&&C(w.sheenRoughnessMap.channel),specularMapUv:$t&&C(w.specularMap.channel),specularColorMapUv:re&&C(w.specularColorMap.channel),specularIntensityMapUv:Oe&&C(w.specularIntensityMap.channel),transmissionMapUv:k&&C(w.transmissionMap.channel),thicknessMapUv:wt&&C(w.thicknessMap.channel),alphaMapUv:vt&&C(w.alphaMap.channel),vertexTangents:!!_t.attributes.tangent&&(pe||b),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!_t.attributes.color&&_t.attributes.color.itemSize===4,pointsUvs:st.isPoints===!0&&!!_t.attributes.uv&&(Ve||vt),fog:!!gt,useFog:w.fog===!0,fogExp2:!!gt&&gt.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:v,reverseDepthBuffer:Ft,skinning:st.isSkinnedMesh===!0,morphTargets:_t.morphAttributes.position!==void 0,morphNormals:_t.morphAttributes.normal!==void 0,morphColors:_t.morphAttributes.color!==void 0,morphTargetsCount:L,morphTextureStride:et,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:w.dithering,shadowMapEnabled:o.shadowMap.enabled&&H.length>0,shadowMapType:o.shadowMap.type,toneMapping:qe,decodeVideoTexture:Ve&&w.map.isVideoTexture===!0&&Re.getTransfer(w.map.colorSpace)===Fe,decodeVideoTextureEmissive:Ue&&w.emissiveMap.isVideoTexture===!0&&Re.getTransfer(w.emissiveMap.colorSpace)===Fe,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===ha,flipSided:w.side===jn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:te&&w.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(te&&w.extensions.multiDraw===!0||Kt)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return hn.vertexUv1s=m.has(1),hn.vertexUv2s=m.has(2),hn.vertexUv3s=m.has(3),m.clear(),hn}function S(w){const R=[];if(w.shaderID?R.push(w.shaderID):(R.push(w.customVertexShaderID),R.push(w.customFragmentShaderID)),w.defines!==void 0)for(const H in w.defines)R.push(H),R.push(w.defines[H]);return w.isRawShaderMaterial===!1&&(z(R,w),N(R,w),R.push(o.outputColorSpace)),R.push(w.customProgramCacheKey),R.join()}function z(w,R){w.push(R.precision),w.push(R.outputColorSpace),w.push(R.envMapMode),w.push(R.envMapCubeUVHeight),w.push(R.mapUv),w.push(R.alphaMapUv),w.push(R.lightMapUv),w.push(R.aoMapUv),w.push(R.bumpMapUv),w.push(R.normalMapUv),w.push(R.displacementMapUv),w.push(R.emissiveMapUv),w.push(R.metalnessMapUv),w.push(R.roughnessMapUv),w.push(R.anisotropyMapUv),w.push(R.clearcoatMapUv),w.push(R.clearcoatNormalMapUv),w.push(R.clearcoatRoughnessMapUv),w.push(R.iridescenceMapUv),w.push(R.iridescenceThicknessMapUv),w.push(R.sheenColorMapUv),w.push(R.sheenRoughnessMapUv),w.push(R.specularMapUv),w.push(R.specularColorMapUv),w.push(R.specularIntensityMapUv),w.push(R.transmissionMapUv),w.push(R.thicknessMapUv),w.push(R.combine),w.push(R.fogExp2),w.push(R.sizeAttenuation),w.push(R.morphTargetsCount),w.push(R.morphAttributeCount),w.push(R.numDirLights),w.push(R.numPointLights),w.push(R.numSpotLights),w.push(R.numSpotLightMaps),w.push(R.numHemiLights),w.push(R.numRectAreaLights),w.push(R.numDirLightShadows),w.push(R.numPointLightShadows),w.push(R.numSpotLightShadows),w.push(R.numSpotLightShadowsWithMaps),w.push(R.numLightProbes),w.push(R.shadowMapType),w.push(R.toneMapping),w.push(R.numClippingPlanes),w.push(R.numClipIntersection),w.push(R.depthPacking)}function N(w,R){d.disableAll(),R.supportsVertexTextures&&d.enable(0),R.instancing&&d.enable(1),R.instancingColor&&d.enable(2),R.instancingMorph&&d.enable(3),R.matcap&&d.enable(4),R.envMap&&d.enable(5),R.normalMapObjectSpace&&d.enable(6),R.normalMapTangentSpace&&d.enable(7),R.clearcoat&&d.enable(8),R.iridescence&&d.enable(9),R.alphaTest&&d.enable(10),R.vertexColors&&d.enable(11),R.vertexAlphas&&d.enable(12),R.vertexUv1s&&d.enable(13),R.vertexUv2s&&d.enable(14),R.vertexUv3s&&d.enable(15),R.vertexTangents&&d.enable(16),R.anisotropy&&d.enable(17),R.alphaHash&&d.enable(18),R.batching&&d.enable(19),R.dispersion&&d.enable(20),R.batchingColor&&d.enable(21),w.push(d.mask),d.disableAll(),R.fog&&d.enable(0),R.useFog&&d.enable(1),R.flatShading&&d.enable(2),R.logarithmicDepthBuffer&&d.enable(3),R.reverseDepthBuffer&&d.enable(4),R.skinning&&d.enable(5),R.morphTargets&&d.enable(6),R.morphNormals&&d.enable(7),R.morphColors&&d.enable(8),R.premultipliedAlpha&&d.enable(9),R.shadowMapEnabled&&d.enable(10),R.doubleSided&&d.enable(11),R.flipSided&&d.enable(12),R.useDepthPacking&&d.enable(13),R.dithering&&d.enable(14),R.transmission&&d.enable(15),R.sheen&&d.enable(16),R.opaque&&d.enable(17),R.pointsUvs&&d.enable(18),R.decodeVideoTexture&&d.enable(19),R.decodeVideoTextureEmissive&&d.enable(20),R.alphaToCoverage&&d.enable(21),w.push(d.mask)}function D(w){const R=T[w.type];let H;if(R){const lt=zi[R];H=GM.clone(lt.uniforms)}else H=w.uniforms;return H}function K(w,R){let H;for(let lt=0,st=g.length;lt<st;lt++){const gt=g[lt];if(gt.cacheKey===R){H=gt,++H.usedTimes;break}}return H===void 0&&(H=new m1(o,R,w,c),g.push(H)),H}function G(w){if(--w.usedTimes===0){const R=g.indexOf(w);g[R]=g[g.length-1],g.pop(),w.destroy()}}function I(w){p.remove(w)}function Z(){p.dispose()}return{getParameters:x,getProgramCacheKey:S,getUniforms:D,acquireProgram:K,releaseProgram:G,releaseShaderCache:I,programs:g,dispose:Z}}function y1(){let o=new WeakMap;function t(h){return o.has(h)}function i(h){let d=o.get(h);return d===void 0&&(d={},o.set(h,d)),d}function r(h){o.delete(h)}function l(h,d,p){o.get(h)[d]=p}function c(){o=new WeakMap}return{has:t,get:i,remove:r,update:l,dispose:c}}function x1(o,t){return o.groupOrder!==t.groupOrder?o.groupOrder-t.groupOrder:o.renderOrder!==t.renderOrder?o.renderOrder-t.renderOrder:o.material.id!==t.material.id?o.material.id-t.material.id:o.z!==t.z?o.z-t.z:o.id-t.id}function Fv(o,t){return o.groupOrder!==t.groupOrder?o.groupOrder-t.groupOrder:o.renderOrder!==t.renderOrder?o.renderOrder-t.renderOrder:o.z!==t.z?t.z-o.z:o.id-t.id}function Hv(){const o=[];let t=0;const i=[],r=[],l=[];function c(){t=0,i.length=0,r.length=0,l.length=0}function h(v,y,M,T,C,x){let S=o[t];return S===void 0?(S={id:v.id,object:v,geometry:y,material:M,groupOrder:T,renderOrder:v.renderOrder,z:C,group:x},o[t]=S):(S.id=v.id,S.object=v,S.geometry=y,S.material=M,S.groupOrder=T,S.renderOrder=v.renderOrder,S.z=C,S.group=x),t++,S}function d(v,y,M,T,C,x){const S=h(v,y,M,T,C,x);M.transmission>0?r.push(S):M.transparent===!0?l.push(S):i.push(S)}function p(v,y,M,T,C,x){const S=h(v,y,M,T,C,x);M.transmission>0?r.unshift(S):M.transparent===!0?l.unshift(S):i.unshift(S)}function m(v,y){i.length>1&&i.sort(v||x1),r.length>1&&r.sort(y||Fv),l.length>1&&l.sort(y||Fv)}function g(){for(let v=t,y=o.length;v<y;v++){const M=o[v];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:i,transmissive:r,transparent:l,init:c,push:d,unshift:p,finish:g,sort:m}}function M1(){let o=new WeakMap;function t(r,l){const c=o.get(r);let h;return c===void 0?(h=new Hv,o.set(r,[h])):l>=c.length?(h=new Hv,c.push(h)):h=c[l],h}function i(){o=new WeakMap}return{get:t,dispose:i}}function E1(){const o={};return{get:function(t){if(o[t.id]!==void 0)return o[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new at,color:new Me};break;case"SpotLight":i={position:new at,direction:new at,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new at,color:new Me,distance:0,decay:0};break;case"HemisphereLight":i={direction:new at,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":i={color:new Me,position:new at,halfWidth:new at,halfHeight:new at};break}return o[t.id]=i,i}}}function b1(){const o={};return{get:function(t){if(o[t.id]!==void 0)return o[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[t.id]=i,i}}}let T1=0;function A1(o,t){return(t.castShadow?2:0)-(o.castShadow?2:0)+(t.map?1:0)-(o.map?1:0)}function C1(o){const t=new E1,i=b1(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new at);const l=new at,c=new Ke,h=new Ke;function d(m){let g=0,v=0,y=0;for(let w=0;w<9;w++)r.probe[w].set(0,0,0);let M=0,T=0,C=0,x=0,S=0,z=0,N=0,D=0,K=0,G=0,I=0;m.sort(A1);for(let w=0,R=m.length;w<R;w++){const H=m[w],lt=H.color,st=H.intensity,gt=H.distance,_t=H.shadow&&H.shadow.map?H.shadow.map.texture:null;if(H.isAmbientLight)g+=lt.r*st,v+=lt.g*st,y+=lt.b*st;else if(H.isLightProbe){for(let O=0;O<9;O++)r.probe[O].addScaledVector(H.sh.coefficients[O],st);I++}else if(H.isDirectionalLight){const O=t.get(H);if(O.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){const j=H.shadow,Y=i.get(H);Y.shadowIntensity=j.intensity,Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,r.directionalShadow[M]=Y,r.directionalShadowMap[M]=_t,r.directionalShadowMatrix[M]=H.shadow.matrix,z++}r.directional[M]=O,M++}else if(H.isSpotLight){const O=t.get(H);O.position.setFromMatrixPosition(H.matrixWorld),O.color.copy(lt).multiplyScalar(st),O.distance=gt,O.coneCos=Math.cos(H.angle),O.penumbraCos=Math.cos(H.angle*(1-H.penumbra)),O.decay=H.decay,r.spot[C]=O;const j=H.shadow;if(H.map&&(r.spotLightMap[K]=H.map,K++,j.updateMatrices(H),H.castShadow&&G++),r.spotLightMatrix[C]=j.matrix,H.castShadow){const Y=i.get(H);Y.shadowIntensity=j.intensity,Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,r.spotShadow[C]=Y,r.spotShadowMap[C]=_t,D++}C++}else if(H.isRectAreaLight){const O=t.get(H);O.color.copy(lt).multiplyScalar(st),O.halfWidth.set(H.width*.5,0,0),O.halfHeight.set(0,H.height*.5,0),r.rectArea[x]=O,x++}else if(H.isPointLight){const O=t.get(H);if(O.color.copy(H.color).multiplyScalar(H.intensity),O.distance=H.distance,O.decay=H.decay,H.castShadow){const j=H.shadow,Y=i.get(H);Y.shadowIntensity=j.intensity,Y.shadowBias=j.bias,Y.shadowNormalBias=j.normalBias,Y.shadowRadius=j.radius,Y.shadowMapSize=j.mapSize,Y.shadowCameraNear=j.camera.near,Y.shadowCameraFar=j.camera.far,r.pointShadow[T]=Y,r.pointShadowMap[T]=_t,r.pointShadowMatrix[T]=H.shadow.matrix,N++}r.point[T]=O,T++}else if(H.isHemisphereLight){const O=t.get(H);O.skyColor.copy(H.color).multiplyScalar(st),O.groundColor.copy(H.groundColor).multiplyScalar(st),r.hemi[S]=O,S++}}x>0&&(o.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Lt.LTC_FLOAT_1,r.rectAreaLTC2=Lt.LTC_FLOAT_2):(r.rectAreaLTC1=Lt.LTC_HALF_1,r.rectAreaLTC2=Lt.LTC_HALF_2)),r.ambient[0]=g,r.ambient[1]=v,r.ambient[2]=y;const Z=r.hash;(Z.directionalLength!==M||Z.pointLength!==T||Z.spotLength!==C||Z.rectAreaLength!==x||Z.hemiLength!==S||Z.numDirectionalShadows!==z||Z.numPointShadows!==N||Z.numSpotShadows!==D||Z.numSpotMaps!==K||Z.numLightProbes!==I)&&(r.directional.length=M,r.spot.length=C,r.rectArea.length=x,r.point.length=T,r.hemi.length=S,r.directionalShadow.length=z,r.directionalShadowMap.length=z,r.pointShadow.length=N,r.pointShadowMap.length=N,r.spotShadow.length=D,r.spotShadowMap.length=D,r.directionalShadowMatrix.length=z,r.pointShadowMatrix.length=N,r.spotLightMatrix.length=D+K-G,r.spotLightMap.length=K,r.numSpotLightShadowsWithMaps=G,r.numLightProbes=I,Z.directionalLength=M,Z.pointLength=T,Z.spotLength=C,Z.rectAreaLength=x,Z.hemiLength=S,Z.numDirectionalShadows=z,Z.numPointShadows=N,Z.numSpotShadows=D,Z.numSpotMaps=K,Z.numLightProbes=I,r.version=T1++)}function p(m,g){let v=0,y=0,M=0,T=0,C=0;const x=g.matrixWorldInverse;for(let S=0,z=m.length;S<z;S++){const N=m[S];if(N.isDirectionalLight){const D=r.directional[v];D.direction.setFromMatrixPosition(N.matrixWorld),l.setFromMatrixPosition(N.target.matrixWorld),D.direction.sub(l),D.direction.transformDirection(x),v++}else if(N.isSpotLight){const D=r.spot[M];D.position.setFromMatrixPosition(N.matrixWorld),D.position.applyMatrix4(x),D.direction.setFromMatrixPosition(N.matrixWorld),l.setFromMatrixPosition(N.target.matrixWorld),D.direction.sub(l),D.direction.transformDirection(x),M++}else if(N.isRectAreaLight){const D=r.rectArea[T];D.position.setFromMatrixPosition(N.matrixWorld),D.position.applyMatrix4(x),h.identity(),c.copy(N.matrixWorld),c.premultiply(x),h.extractRotation(c),D.halfWidth.set(N.width*.5,0,0),D.halfHeight.set(0,N.height*.5,0),D.halfWidth.applyMatrix4(h),D.halfHeight.applyMatrix4(h),T++}else if(N.isPointLight){const D=r.point[y];D.position.setFromMatrixPosition(N.matrixWorld),D.position.applyMatrix4(x),y++}else if(N.isHemisphereLight){const D=r.hemi[C];D.direction.setFromMatrixPosition(N.matrixWorld),D.direction.transformDirection(x),C++}}}return{setup:d,setupView:p,state:r}}function Gv(o){const t=new C1(o),i=[],r=[];function l(g){m.camera=g,i.length=0,r.length=0}function c(g){i.push(g)}function h(g){r.push(g)}function d(){t.setup(i)}function p(g){t.setupView(i,g)}const m={lightsArray:i,shadowsArray:r,camera:null,lights:t,transmissionRenderTarget:{}};return{init:l,state:m,setupLights:d,setupLightsView:p,pushLight:c,pushShadow:h}}function R1(o){let t=new WeakMap;function i(l,c=0){const h=t.get(l);let d;return h===void 0?(d=new Gv(o),t.set(l,[d])):c>=h.length?(d=new Gv(o),h.push(d)):d=h[c],d}function r(){t=new WeakMap}return{get:i,dispose:r}}const w1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function U1(o,t,i){let r=new Xd;const l=new De,c=new De,h=new nn,d=new $M({depthPacking:cM}),p=new tE,m={},g=i.maxTextureSize,v={[Ka]:jn,[jn]:Ka,[ha]:ha},y=new Qa({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new De},radius:{value:4}},vertexShader:w1,fragmentShader:D1}),M=y.clone();M.defines.HORIZONTAL_PASS=1;const T=new _a;T.setAttribute("position",new Hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const C=new Fi(T,y),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wv;let S=this.type;this.render=function(G,I,Z){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||G.length===0)return;const w=o.getRenderTarget(),R=o.getActiveCubeFace(),H=o.getActiveMipmapLevel(),lt=o.state;lt.setBlending(ja),lt.buffers.color.setClear(1,1,1,1),lt.buffers.depth.setTest(!0),lt.setScissorTest(!1);const st=S!==fa&&this.type===fa,gt=S===fa&&this.type!==fa;for(let _t=0,O=G.length;_t<O;_t++){const j=G[_t],Y=j.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;l.copy(Y.mapSize);const xt=Y.getFrameExtents();if(l.multiply(xt),c.copy(Y.mapSize),(l.x>g||l.y>g)&&(l.x>g&&(c.x=Math.floor(g/xt.x),l.x=c.x*xt.x,Y.mapSize.x=c.x),l.y>g&&(c.y=Math.floor(g/xt.y),l.y=c.y*xt.y,Y.mapSize.y=c.y)),Y.map===null||st===!0||gt===!0){const L=this.type!==fa?{minFilter:Di,magFilter:Di}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Nr(l.x,l.y,L),Y.map.texture.name=j.name+".shadowMap",Y.camera.updateProjectionMatrix()}o.setRenderTarget(Y.map),o.clear();const Tt=Y.getViewportCount();for(let L=0;L<Tt;L++){const et=Y.getViewport(L);h.set(c.x*et.x,c.y*et.y,c.x*et.z,c.y*et.w),lt.viewport(h),Y.updateMatrices(j,L),r=Y.getFrustum(),D(I,Z,Y.camera,j,this.type)}Y.isPointLightShadow!==!0&&this.type===fa&&z(Y,Z),Y.needsUpdate=!1}S=this.type,x.needsUpdate=!1,o.setRenderTarget(w,R,H)};function z(G,I){const Z=t.update(C);y.defines.VSM_SAMPLES!==G.blurSamples&&(y.defines.VSM_SAMPLES=G.blurSamples,M.defines.VSM_SAMPLES=G.blurSamples,y.needsUpdate=!0,M.needsUpdate=!0),G.mapPass===null&&(G.mapPass=new Nr(l.x,l.y)),y.uniforms.shadow_pass.value=G.map.texture,y.uniforms.resolution.value=G.mapSize,y.uniforms.radius.value=G.radius,o.setRenderTarget(G.mapPass),o.clear(),o.renderBufferDirect(I,null,Z,y,C,null),M.uniforms.shadow_pass.value=G.mapPass.texture,M.uniforms.resolution.value=G.mapSize,M.uniforms.radius.value=G.radius,o.setRenderTarget(G.map),o.clear(),o.renderBufferDirect(I,null,Z,M,C,null)}function N(G,I,Z,w){let R=null;const H=Z.isPointLight===!0?G.customDistanceMaterial:G.customDepthMaterial;if(H!==void 0)R=H;else if(R=Z.isPointLight===!0?p:d,o.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){const lt=R.uuid,st=I.uuid;let gt=m[lt];gt===void 0&&(gt={},m[lt]=gt);let _t=gt[st];_t===void 0&&(_t=R.clone(),gt[st]=_t,I.addEventListener("dispose",K)),R=_t}if(R.visible=I.visible,R.wireframe=I.wireframe,w===fa?R.side=I.shadowSide!==null?I.shadowSide:I.side:R.side=I.shadowSide!==null?I.shadowSide:v[I.side],R.alphaMap=I.alphaMap,R.alphaTest=I.alphaTest,R.map=I.map,R.clipShadows=I.clipShadows,R.clippingPlanes=I.clippingPlanes,R.clipIntersection=I.clipIntersection,R.displacementMap=I.displacementMap,R.displacementScale=I.displacementScale,R.displacementBias=I.displacementBias,R.wireframeLinewidth=I.wireframeLinewidth,R.linewidth=I.linewidth,Z.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const lt=o.properties.get(R);lt.light=Z}return R}function D(G,I,Z,w,R){if(G.visible===!1)return;if(G.layers.test(I.layers)&&(G.isMesh||G.isLine||G.isPoints)&&(G.castShadow||G.receiveShadow&&R===fa)&&(!G.frustumCulled||r.intersectsObject(G))){G.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,G.matrixWorld);const st=t.update(G),gt=G.material;if(Array.isArray(gt)){const _t=st.groups;for(let O=0,j=_t.length;O<j;O++){const Y=_t[O],xt=gt[Y.materialIndex];if(xt&&xt.visible){const Tt=N(G,xt,w,R);G.onBeforeShadow(o,G,I,Z,st,Tt,Y),o.renderBufferDirect(Z,null,st,Tt,G,Y),G.onAfterShadow(o,G,I,Z,st,Tt,Y)}}}else if(gt.visible){const _t=N(G,gt,w,R);G.onBeforeShadow(o,G,I,Z,st,_t,null),o.renderBufferDirect(Z,null,st,_t,G,null),G.onAfterShadow(o,G,I,Z,st,_t,null)}}const lt=G.children;for(let st=0,gt=lt.length;st<gt;st++)D(lt[st],I,Z,w,R)}function K(G){G.target.removeEventListener("dispose",K);for(const Z in m){const w=m[Z],R=G.target.uuid;R in w&&(w[R].dispose(),delete w[R])}}}const L1={[qh]:Yh,[jh]:Qh,[Zh]:Jh,[Us]:Kh,[Yh]:qh,[Qh]:jh,[Jh]:Zh,[Kh]:Us};function N1(o,t){function i(){let k=!1;const wt=new nn;let ot=null;const vt=new nn(0,0,0,0);return{setMask:function(Ct){ot!==Ct&&!k&&(o.colorMask(Ct,Ct,Ct,Ct),ot=Ct)},setLocked:function(Ct){k=Ct},setClear:function(Ct,Dt,te,qe,hn){hn===!0&&(Ct*=qe,Dt*=qe,te*=qe),wt.set(Ct,Dt,te,qe),vt.equals(wt)===!1&&(o.clearColor(Ct,Dt,te,qe),vt.copy(wt))},reset:function(){k=!1,ot=null,vt.set(-1,0,0,0)}}}function r(){let k=!1,wt=!1,ot=null,vt=null,Ct=null;return{setReversed:function(Dt){if(wt!==Dt){const te=t.get("EXT_clip_control");Dt?te.clipControlEXT(te.LOWER_LEFT_EXT,te.ZERO_TO_ONE_EXT):te.clipControlEXT(te.LOWER_LEFT_EXT,te.NEGATIVE_ONE_TO_ONE_EXT),wt=Dt;const qe=Ct;Ct=null,this.setClear(qe)}},getReversed:function(){return wt},setTest:function(Dt){Dt?St(o.DEPTH_TEST):Ft(o.DEPTH_TEST)},setMask:function(Dt){ot!==Dt&&!k&&(o.depthMask(Dt),ot=Dt)},setFunc:function(Dt){if(wt&&(Dt=L1[Dt]),vt!==Dt){switch(Dt){case qh:o.depthFunc(o.NEVER);break;case Yh:o.depthFunc(o.ALWAYS);break;case jh:o.depthFunc(o.LESS);break;case Us:o.depthFunc(o.LEQUAL);break;case Zh:o.depthFunc(o.EQUAL);break;case Kh:o.depthFunc(o.GEQUAL);break;case Qh:o.depthFunc(o.GREATER);break;case Jh:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}vt=Dt}},setLocked:function(Dt){k=Dt},setClear:function(Dt){Ct!==Dt&&(wt&&(Dt=1-Dt),o.clearDepth(Dt),Ct=Dt)},reset:function(){k=!1,ot=null,vt=null,Ct=null,wt=!1}}}function l(){let k=!1,wt=null,ot=null,vt=null,Ct=null,Dt=null,te=null,qe=null,hn=null;return{setTest:function(be){k||(be?St(o.STENCIL_TEST):Ft(o.STENCIL_TEST))},setMask:function(be){wt!==be&&!k&&(o.stencilMask(be),wt=be)},setFunc:function(be,xn,_i){(ot!==be||vt!==xn||Ct!==_i)&&(o.stencilFunc(be,xn,_i),ot=be,vt=xn,Ct=_i)},setOp:function(be,xn,_i){(Dt!==be||te!==xn||qe!==_i)&&(o.stencilOp(be,xn,_i),Dt=be,te=xn,qe=_i)},setLocked:function(be){k=be},setClear:function(be){hn!==be&&(o.clearStencil(be),hn=be)},reset:function(){k=!1,wt=null,ot=null,vt=null,Ct=null,Dt=null,te=null,qe=null,hn=null}}}const c=new i,h=new r,d=new l,p=new WeakMap,m=new WeakMap;let g={},v={},y=new WeakMap,M=[],T=null,C=!1,x=null,S=null,z=null,N=null,D=null,K=null,G=null,I=new Me(0,0,0),Z=0,w=!1,R=null,H=null,lt=null,st=null,gt=null;const _t=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,j=0;const Y=o.getParameter(o.VERSION);Y.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(Y)[1]),O=j>=1):Y.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),O=j>=2);let xt=null,Tt={};const L=o.getParameter(o.SCISSOR_BOX),et=o.getParameter(o.VIEWPORT),yt=new nn().fromArray(L),q=new nn().fromArray(et);function ut(k,wt,ot,vt){const Ct=new Uint8Array(4),Dt=o.createTexture();o.bindTexture(k,Dt),o.texParameteri(k,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(k,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let te=0;te<ot;te++)k===o.TEXTURE_3D||k===o.TEXTURE_2D_ARRAY?o.texImage3D(wt,0,o.RGBA,1,1,vt,0,o.RGBA,o.UNSIGNED_BYTE,Ct):o.texImage2D(wt+te,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,Ct);return Dt}const Et={};Et[o.TEXTURE_2D]=ut(o.TEXTURE_2D,o.TEXTURE_2D,1),Et[o.TEXTURE_CUBE_MAP]=ut(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),Et[o.TEXTURE_2D_ARRAY]=ut(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),Et[o.TEXTURE_3D]=ut(o.TEXTURE_3D,o.TEXTURE_3D,1,1),c.setClear(0,0,0,1),h.setClear(1),d.setClear(0),St(o.DEPTH_TEST),h.setFunc(Us),fe(!1),pe(G_),St(o.CULL_FACE),B(ja);function St(k){g[k]!==!0&&(o.enable(k),g[k]=!0)}function Ft(k){g[k]!==!1&&(o.disable(k),g[k]=!1)}function jt(k,wt){return v[k]!==wt?(o.bindFramebuffer(k,wt),v[k]=wt,k===o.DRAW_FRAMEBUFFER&&(v[o.FRAMEBUFFER]=wt),k===o.FRAMEBUFFER&&(v[o.DRAW_FRAMEBUFFER]=wt),!0):!1}function Kt(k,wt){let ot=M,vt=!1;if(k){ot=y.get(wt),ot===void 0&&(ot=[],y.set(wt,ot));const Ct=k.textures;if(ot.length!==Ct.length||ot[0]!==o.COLOR_ATTACHMENT0){for(let Dt=0,te=Ct.length;Dt<te;Dt++)ot[Dt]=o.COLOR_ATTACHMENT0+Dt;ot.length=Ct.length,vt=!0}}else ot[0]!==o.BACK&&(ot[0]=o.BACK,vt=!0);vt&&o.drawBuffers(ot)}function Ve(k){return T!==k?(o.useProgram(k),T=k,!0):!1}const He={[Tr]:o.FUNC_ADD,[Px]:o.FUNC_SUBTRACT,[Ix]:o.FUNC_REVERSE_SUBTRACT};He[zx]=o.MIN,He[Bx]=o.MAX;const ue={[Fx]:o.ZERO,[Hx]:o.ONE,[Gx]:o.SRC_COLOR,[Xh]:o.SRC_ALPHA,[Yx]:o.SRC_ALPHA_SATURATE,[Wx]:o.DST_COLOR,[kx]:o.DST_ALPHA,[Vx]:o.ONE_MINUS_SRC_COLOR,[Wh]:o.ONE_MINUS_SRC_ALPHA,[qx]:o.ONE_MINUS_DST_COLOR,[Xx]:o.ONE_MINUS_DST_ALPHA,[jx]:o.CONSTANT_COLOR,[Zx]:o.ONE_MINUS_CONSTANT_COLOR,[Kx]:o.CONSTANT_ALPHA,[Qx]:o.ONE_MINUS_CONSTANT_ALPHA};function B(k,wt,ot,vt,Ct,Dt,te,qe,hn,be){if(k===ja){C===!0&&(Ft(o.BLEND),C=!1);return}if(C===!1&&(St(o.BLEND),C=!0),k!==Ox){if(k!==x||be!==w){if((S!==Tr||D!==Tr)&&(o.blendEquation(o.FUNC_ADD),S=Tr,D=Tr),be)switch(k){case Rs:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case V_:o.blendFunc(o.ONE,o.ONE);break;case k_:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case X_:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case Rs:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case V_:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case k_:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case X_:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}z=null,N=null,K=null,G=null,I.set(0,0,0),Z=0,x=k,w=be}return}Ct=Ct||wt,Dt=Dt||ot,te=te||vt,(wt!==S||Ct!==D)&&(o.blendEquationSeparate(He[wt],He[Ct]),S=wt,D=Ct),(ot!==z||vt!==N||Dt!==K||te!==G)&&(o.blendFuncSeparate(ue[ot],ue[vt],ue[Dt],ue[te]),z=ot,N=vt,K=Dt,G=te),(qe.equals(I)===!1||hn!==Z)&&(o.blendColor(qe.r,qe.g,qe.b,hn),I.copy(qe),Z=hn),x=k,w=!1}function wn(k,wt){k.side===ha?Ft(o.CULL_FACE):St(o.CULL_FACE);let ot=k.side===jn;wt&&(ot=!ot),fe(ot),k.blending===Rs&&k.transparent===!1?B(ja):B(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),h.setFunc(k.depthFunc),h.setTest(k.depthTest),h.setMask(k.depthWrite),c.setMask(k.colorWrite);const vt=k.stencilWrite;d.setTest(vt),vt&&(d.setMask(k.stencilWriteMask),d.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),d.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Ue(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?St(o.SAMPLE_ALPHA_TO_COVERAGE):Ft(o.SAMPLE_ALPHA_TO_COVERAGE)}function fe(k){R!==k&&(k?o.frontFace(o.CW):o.frontFace(o.CCW),R=k)}function pe(k){k!==Ux?(St(o.CULL_FACE),k!==H&&(k===G_?o.cullFace(o.BACK):k===Lx?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):Ft(o.CULL_FACE),H=k}function Xt(k){k!==lt&&(O&&o.lineWidth(k),lt=k)}function Ue(k,wt,ot){k?(St(o.POLYGON_OFFSET_FILL),(st!==wt||gt!==ot)&&(o.polygonOffset(wt,ot),st=wt,gt=ot)):Ft(o.POLYGON_OFFSET_FILL)}function kt(k){k?St(o.SCISSOR_TEST):Ft(o.SCISSOR_TEST)}function U(k){k===void 0&&(k=o.TEXTURE0+_t-1),xt!==k&&(o.activeTexture(k),xt=k)}function b(k,wt,ot){ot===void 0&&(xt===null?ot=o.TEXTURE0+_t-1:ot=xt);let vt=Tt[ot];vt===void 0&&(vt={type:void 0,texture:void 0},Tt[ot]=vt),(vt.type!==k||vt.texture!==wt)&&(xt!==ot&&(o.activeTexture(ot),xt=ot),o.bindTexture(k,wt||Et[k]),vt.type=k,vt.texture=wt)}function tt(){const k=Tt[xt];k!==void 0&&k.type!==void 0&&(o.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function ft(){try{o.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Mt(){try{o.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function pt(){try{o.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Gt(){try{o.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Rt(){try{o.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function It(){try{o.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function me(){try{o.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function At(){try{o.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function zt(){try{o.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Zt(){try{o.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Vt(k){yt.equals(k)===!1&&(o.scissor(k.x,k.y,k.z,k.w),yt.copy(k))}function Ot(k){q.equals(k)===!1&&(o.viewport(k.x,k.y,k.z,k.w),q.copy(k))}function $t(k,wt){let ot=m.get(wt);ot===void 0&&(ot=new WeakMap,m.set(wt,ot));let vt=ot.get(k);vt===void 0&&(vt=o.getUniformBlockIndex(wt,k.name),ot.set(k,vt))}function re(k,wt){const vt=m.get(wt).get(k);p.get(wt)!==vt&&(o.uniformBlockBinding(wt,vt,k.__bindingPointIndex),p.set(wt,vt))}function Oe(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),h.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),g={},xt=null,Tt={},v={},y=new WeakMap,M=[],T=null,C=!1,x=null,S=null,z=null,N=null,D=null,K=null,G=null,I=new Me(0,0,0),Z=0,w=!1,R=null,H=null,lt=null,st=null,gt=null,yt.set(0,0,o.canvas.width,o.canvas.height),q.set(0,0,o.canvas.width,o.canvas.height),c.reset(),h.reset(),d.reset()}return{buffers:{color:c,depth:h,stencil:d},enable:St,disable:Ft,bindFramebuffer:jt,drawBuffers:Kt,useProgram:Ve,setBlending:B,setMaterial:wn,setFlipSided:fe,setCullFace:pe,setLineWidth:Xt,setPolygonOffset:Ue,setScissorTest:kt,activeTexture:U,bindTexture:b,unbindTexture:tt,compressedTexImage2D:ft,compressedTexImage3D:Mt,texImage2D:zt,texImage3D:Zt,updateUBOMapping:$t,uniformBlockBinding:re,texStorage2D:me,texStorage3D:At,texSubImage2D:pt,texSubImage3D:Gt,compressedTexSubImage2D:Rt,compressedTexSubImage3D:It,scissor:Vt,viewport:Ot,reset:Oe}}function O1(o,t,i,r,l,c,h){const d=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new De,g=new WeakMap;let v;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function T(U,b){return M?new OffscreenCanvas(U,b):Xc("canvas")}function C(U,b,tt){let ft=1;const Mt=kt(U);if((Mt.width>tt||Mt.height>tt)&&(ft=tt/Math.max(Mt.width,Mt.height)),ft<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const pt=Math.floor(ft*Mt.width),Gt=Math.floor(ft*Mt.height);v===void 0&&(v=T(pt,Gt));const Rt=b?T(pt,Gt):v;return Rt.width=pt,Rt.height=Gt,Rt.getContext("2d").drawImage(U,0,0,pt,Gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Mt.width+"x"+Mt.height+") to ("+pt+"x"+Gt+")."),Rt}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Mt.width+"x"+Mt.height+")."),U;return U}function x(U){return U.generateMipmaps}function S(U){o.generateMipmap(U)}function z(U){return U.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?o.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function N(U,b,tt,ft,Mt=!1){if(U!==null){if(o[U]!==void 0)return o[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let pt=b;if(b===o.RED&&(tt===o.FLOAT&&(pt=o.R32F),tt===o.HALF_FLOAT&&(pt=o.R16F),tt===o.UNSIGNED_BYTE&&(pt=o.R8)),b===o.RED_INTEGER&&(tt===o.UNSIGNED_BYTE&&(pt=o.R8UI),tt===o.UNSIGNED_SHORT&&(pt=o.R16UI),tt===o.UNSIGNED_INT&&(pt=o.R32UI),tt===o.BYTE&&(pt=o.R8I),tt===o.SHORT&&(pt=o.R16I),tt===o.INT&&(pt=o.R32I)),b===o.RG&&(tt===o.FLOAT&&(pt=o.RG32F),tt===o.HALF_FLOAT&&(pt=o.RG16F),tt===o.UNSIGNED_BYTE&&(pt=o.RG8)),b===o.RG_INTEGER&&(tt===o.UNSIGNED_BYTE&&(pt=o.RG8UI),tt===o.UNSIGNED_SHORT&&(pt=o.RG16UI),tt===o.UNSIGNED_INT&&(pt=o.RG32UI),tt===o.BYTE&&(pt=o.RG8I),tt===o.SHORT&&(pt=o.RG16I),tt===o.INT&&(pt=o.RG32I)),b===o.RGB_INTEGER&&(tt===o.UNSIGNED_BYTE&&(pt=o.RGB8UI),tt===o.UNSIGNED_SHORT&&(pt=o.RGB16UI),tt===o.UNSIGNED_INT&&(pt=o.RGB32UI),tt===o.BYTE&&(pt=o.RGB8I),tt===o.SHORT&&(pt=o.RGB16I),tt===o.INT&&(pt=o.RGB32I)),b===o.RGBA_INTEGER&&(tt===o.UNSIGNED_BYTE&&(pt=o.RGBA8UI),tt===o.UNSIGNED_SHORT&&(pt=o.RGBA16UI),tt===o.UNSIGNED_INT&&(pt=o.RGBA32UI),tt===o.BYTE&&(pt=o.RGBA8I),tt===o.SHORT&&(pt=o.RGBA16I),tt===o.INT&&(pt=o.RGBA32I)),b===o.RGB&&tt===o.UNSIGNED_INT_5_9_9_9_REV&&(pt=o.RGB9_E5),b===o.RGBA){const Gt=Mt?Vc:Re.getTransfer(ft);tt===o.FLOAT&&(pt=o.RGBA32F),tt===o.HALF_FLOAT&&(pt=o.RGBA16F),tt===o.UNSIGNED_BYTE&&(pt=Gt===Fe?o.SRGB8_ALPHA8:o.RGBA8),tt===o.UNSIGNED_SHORT_4_4_4_4&&(pt=o.RGBA4),tt===o.UNSIGNED_SHORT_5_5_5_1&&(pt=o.RGB5_A1)}return(pt===o.R16F||pt===o.R32F||pt===o.RG16F||pt===o.RG32F||pt===o.RGBA16F||pt===o.RGBA32F)&&t.get("EXT_color_buffer_float"),pt}function D(U,b){let tt;return U?b===null||b===Lr||b===Wo?tt=o.DEPTH24_STENCIL8:b===da?tt=o.DEPTH32F_STENCIL8:b===Xo&&(tt=o.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Lr||b===Wo?tt=o.DEPTH_COMPONENT24:b===da?tt=o.DEPTH_COMPONENT32F:b===Xo&&(tt=o.DEPTH_COMPONENT16),tt}function K(U,b){return x(U)===!0||U.isFramebufferTexture&&U.minFilter!==Di&&U.minFilter!==Bi?Math.log2(Math.max(b.width,b.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?b.mipmaps.length:1}function G(U){const b=U.target;b.removeEventListener("dispose",G),Z(b),b.isVideoTexture&&g.delete(b)}function I(U){const b=U.target;b.removeEventListener("dispose",I),R(b)}function Z(U){const b=r.get(U);if(b.__webglInit===void 0)return;const tt=U.source,ft=y.get(tt);if(ft){const Mt=ft[b.__cacheKey];Mt.usedTimes--,Mt.usedTimes===0&&w(U),Object.keys(ft).length===0&&y.delete(tt)}r.remove(U)}function w(U){const b=r.get(U);o.deleteTexture(b.__webglTexture);const tt=U.source,ft=y.get(tt);delete ft[b.__cacheKey],h.memory.textures--}function R(U){const b=r.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),r.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let ft=0;ft<6;ft++){if(Array.isArray(b.__webglFramebuffer[ft]))for(let Mt=0;Mt<b.__webglFramebuffer[ft].length;Mt++)o.deleteFramebuffer(b.__webglFramebuffer[ft][Mt]);else o.deleteFramebuffer(b.__webglFramebuffer[ft]);b.__webglDepthbuffer&&o.deleteRenderbuffer(b.__webglDepthbuffer[ft])}else{if(Array.isArray(b.__webglFramebuffer))for(let ft=0;ft<b.__webglFramebuffer.length;ft++)o.deleteFramebuffer(b.__webglFramebuffer[ft]);else o.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&o.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&o.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let ft=0;ft<b.__webglColorRenderbuffer.length;ft++)b.__webglColorRenderbuffer[ft]&&o.deleteRenderbuffer(b.__webglColorRenderbuffer[ft]);b.__webglDepthRenderbuffer&&o.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const tt=U.textures;for(let ft=0,Mt=tt.length;ft<Mt;ft++){const pt=r.get(tt[ft]);pt.__webglTexture&&(o.deleteTexture(pt.__webglTexture),h.memory.textures--),r.remove(tt[ft])}r.remove(U)}let H=0;function lt(){H=0}function st(){const U=H;return U>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+l.maxTextures),H+=1,U}function gt(U){const b=[];return b.push(U.wrapS),b.push(U.wrapT),b.push(U.wrapR||0),b.push(U.magFilter),b.push(U.minFilter),b.push(U.anisotropy),b.push(U.internalFormat),b.push(U.format),b.push(U.type),b.push(U.generateMipmaps),b.push(U.premultiplyAlpha),b.push(U.flipY),b.push(U.unpackAlignment),b.push(U.colorSpace),b.join()}function _t(U,b){const tt=r.get(U);if(U.isVideoTexture&&Xt(U),U.isRenderTargetTexture===!1&&U.version>0&&tt.__version!==U.version){const ft=U.image;if(ft===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ft.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(tt,U,b);return}}i.bindTexture(o.TEXTURE_2D,tt.__webglTexture,o.TEXTURE0+b)}function O(U,b){const tt=r.get(U);if(U.version>0&&tt.__version!==U.version){q(tt,U,b);return}i.bindTexture(o.TEXTURE_2D_ARRAY,tt.__webglTexture,o.TEXTURE0+b)}function j(U,b){const tt=r.get(U);if(U.version>0&&tt.__version!==U.version){q(tt,U,b);return}i.bindTexture(o.TEXTURE_3D,tt.__webglTexture,o.TEXTURE0+b)}function Y(U,b){const tt=r.get(U);if(U.version>0&&tt.__version!==U.version){ut(tt,U,b);return}i.bindTexture(o.TEXTURE_CUBE_MAP,tt.__webglTexture,o.TEXTURE0+b)}const xt={[ed]:o.REPEAT,[Cr]:o.CLAMP_TO_EDGE,[nd]:o.MIRRORED_REPEAT},Tt={[Di]:o.NEAREST,[oM]:o.NEAREST_MIPMAP_NEAREST,[uc]:o.NEAREST_MIPMAP_LINEAR,[Bi]:o.LINEAR,[hh]:o.LINEAR_MIPMAP_NEAREST,[Rr]:o.LINEAR_MIPMAP_LINEAR},L={[fM]:o.NEVER,[_M]:o.ALWAYS,[hM]:o.LESS,[r0]:o.LEQUAL,[dM]:o.EQUAL,[gM]:o.GEQUAL,[pM]:o.GREATER,[mM]:o.NOTEQUAL};function et(U,b){if(b.type===da&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Bi||b.magFilter===hh||b.magFilter===uc||b.magFilter===Rr||b.minFilter===Bi||b.minFilter===hh||b.minFilter===uc||b.minFilter===Rr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(U,o.TEXTURE_WRAP_S,xt[b.wrapS]),o.texParameteri(U,o.TEXTURE_WRAP_T,xt[b.wrapT]),(U===o.TEXTURE_3D||U===o.TEXTURE_2D_ARRAY)&&o.texParameteri(U,o.TEXTURE_WRAP_R,xt[b.wrapR]),o.texParameteri(U,o.TEXTURE_MAG_FILTER,Tt[b.magFilter]),o.texParameteri(U,o.TEXTURE_MIN_FILTER,Tt[b.minFilter]),b.compareFunction&&(o.texParameteri(U,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(U,o.TEXTURE_COMPARE_FUNC,L[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Di||b.minFilter!==uc&&b.minFilter!==Rr||b.type===da&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||r.get(b).__currentAnisotropy){const tt=t.get("EXT_texture_filter_anisotropic");o.texParameterf(U,tt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,l.getMaxAnisotropy())),r.get(b).__currentAnisotropy=b.anisotropy}}}function yt(U,b){let tt=!1;U.__webglInit===void 0&&(U.__webglInit=!0,b.addEventListener("dispose",G));const ft=b.source;let Mt=y.get(ft);Mt===void 0&&(Mt={},y.set(ft,Mt));const pt=gt(b);if(pt!==U.__cacheKey){Mt[pt]===void 0&&(Mt[pt]={texture:o.createTexture(),usedTimes:0},h.memory.textures++,tt=!0),Mt[pt].usedTimes++;const Gt=Mt[U.__cacheKey];Gt!==void 0&&(Mt[U.__cacheKey].usedTimes--,Gt.usedTimes===0&&w(b)),U.__cacheKey=pt,U.__webglTexture=Mt[pt].texture}return tt}function q(U,b,tt){let ft=o.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(ft=o.TEXTURE_2D_ARRAY),b.isData3DTexture&&(ft=o.TEXTURE_3D);const Mt=yt(U,b),pt=b.source;i.bindTexture(ft,U.__webglTexture,o.TEXTURE0+tt);const Gt=r.get(pt);if(pt.version!==Gt.__version||Mt===!0){i.activeTexture(o.TEXTURE0+tt);const Rt=Re.getPrimaries(Re.workingColorSpace),It=b.colorSpace===Ya?null:Re.getPrimaries(b.colorSpace),me=b.colorSpace===Ya||Rt===It?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,b.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,b.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);let At=C(b.image,!1,l.maxTextureSize);At=Ue(b,At);const zt=c.convert(b.format,b.colorSpace),Zt=c.convert(b.type);let Vt=N(b.internalFormat,zt,Zt,b.colorSpace,b.isVideoTexture);et(ft,b);let Ot;const $t=b.mipmaps,re=b.isVideoTexture!==!0,Oe=Gt.__version===void 0||Mt===!0,k=pt.dataReady,wt=K(b,At);if(b.isDepthTexture)Vt=D(b.format===Yo,b.type),Oe&&(re?i.texStorage2D(o.TEXTURE_2D,1,Vt,At.width,At.height):i.texImage2D(o.TEXTURE_2D,0,Vt,At.width,At.height,0,zt,Zt,null));else if(b.isDataTexture)if($t.length>0){re&&Oe&&i.texStorage2D(o.TEXTURE_2D,wt,Vt,$t[0].width,$t[0].height);for(let ot=0,vt=$t.length;ot<vt;ot++)Ot=$t[ot],re?k&&i.texSubImage2D(o.TEXTURE_2D,ot,0,0,Ot.width,Ot.height,zt,Zt,Ot.data):i.texImage2D(o.TEXTURE_2D,ot,Vt,Ot.width,Ot.height,0,zt,Zt,Ot.data);b.generateMipmaps=!1}else re?(Oe&&i.texStorage2D(o.TEXTURE_2D,wt,Vt,At.width,At.height),k&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,At.width,At.height,zt,Zt,At.data)):i.texImage2D(o.TEXTURE_2D,0,Vt,At.width,At.height,0,zt,Zt,At.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){re&&Oe&&i.texStorage3D(o.TEXTURE_2D_ARRAY,wt,Vt,$t[0].width,$t[0].height,At.depth);for(let ot=0,vt=$t.length;ot<vt;ot++)if(Ot=$t[ot],b.format!==wi)if(zt!==null)if(re){if(k)if(b.layerUpdates.size>0){const Ct=_v(Ot.width,Ot.height,b.format,b.type);for(const Dt of b.layerUpdates){const te=Ot.data.subarray(Dt*Ct/Ot.data.BYTES_PER_ELEMENT,(Dt+1)*Ct/Ot.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,ot,0,0,Dt,Ot.width,Ot.height,1,zt,te)}b.clearLayerUpdates()}else i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,ot,0,0,0,Ot.width,Ot.height,At.depth,zt,Ot.data)}else i.compressedTexImage3D(o.TEXTURE_2D_ARRAY,ot,Vt,Ot.width,Ot.height,At.depth,0,Ot.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else re?k&&i.texSubImage3D(o.TEXTURE_2D_ARRAY,ot,0,0,0,Ot.width,Ot.height,At.depth,zt,Zt,Ot.data):i.texImage3D(o.TEXTURE_2D_ARRAY,ot,Vt,Ot.width,Ot.height,At.depth,0,zt,Zt,Ot.data)}else{re&&Oe&&i.texStorage2D(o.TEXTURE_2D,wt,Vt,$t[0].width,$t[0].height);for(let ot=0,vt=$t.length;ot<vt;ot++)Ot=$t[ot],b.format!==wi?zt!==null?re?k&&i.compressedTexSubImage2D(o.TEXTURE_2D,ot,0,0,Ot.width,Ot.height,zt,Ot.data):i.compressedTexImage2D(o.TEXTURE_2D,ot,Vt,Ot.width,Ot.height,0,Ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):re?k&&i.texSubImage2D(o.TEXTURE_2D,ot,0,0,Ot.width,Ot.height,zt,Zt,Ot.data):i.texImage2D(o.TEXTURE_2D,ot,Vt,Ot.width,Ot.height,0,zt,Zt,Ot.data)}else if(b.isDataArrayTexture)if(re){if(Oe&&i.texStorage3D(o.TEXTURE_2D_ARRAY,wt,Vt,At.width,At.height,At.depth),k)if(b.layerUpdates.size>0){const ot=_v(At.width,At.height,b.format,b.type);for(const vt of b.layerUpdates){const Ct=At.data.subarray(vt*ot/At.data.BYTES_PER_ELEMENT,(vt+1)*ot/At.data.BYTES_PER_ELEMENT);i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,vt,At.width,At.height,1,zt,Zt,Ct)}b.clearLayerUpdates()}else i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,At.width,At.height,At.depth,zt,Zt,At.data)}else i.texImage3D(o.TEXTURE_2D_ARRAY,0,Vt,At.width,At.height,At.depth,0,zt,Zt,At.data);else if(b.isData3DTexture)re?(Oe&&i.texStorage3D(o.TEXTURE_3D,wt,Vt,At.width,At.height,At.depth),k&&i.texSubImage3D(o.TEXTURE_3D,0,0,0,0,At.width,At.height,At.depth,zt,Zt,At.data)):i.texImage3D(o.TEXTURE_3D,0,Vt,At.width,At.height,At.depth,0,zt,Zt,At.data);else if(b.isFramebufferTexture){if(Oe)if(re)i.texStorage2D(o.TEXTURE_2D,wt,Vt,At.width,At.height);else{let ot=At.width,vt=At.height;for(let Ct=0;Ct<wt;Ct++)i.texImage2D(o.TEXTURE_2D,Ct,Vt,ot,vt,0,zt,Zt,null),ot>>=1,vt>>=1}}else if($t.length>0){if(re&&Oe){const ot=kt($t[0]);i.texStorage2D(o.TEXTURE_2D,wt,Vt,ot.width,ot.height)}for(let ot=0,vt=$t.length;ot<vt;ot++)Ot=$t[ot],re?k&&i.texSubImage2D(o.TEXTURE_2D,ot,0,0,zt,Zt,Ot):i.texImage2D(o.TEXTURE_2D,ot,Vt,zt,Zt,Ot);b.generateMipmaps=!1}else if(re){if(Oe){const ot=kt(At);i.texStorage2D(o.TEXTURE_2D,wt,Vt,ot.width,ot.height)}k&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,zt,Zt,At)}else i.texImage2D(o.TEXTURE_2D,0,Vt,zt,Zt,At);x(b)&&S(ft),Gt.__version=pt.version,b.onUpdate&&b.onUpdate(b)}U.__version=b.version}function ut(U,b,tt){if(b.image.length!==6)return;const ft=yt(U,b),Mt=b.source;i.bindTexture(o.TEXTURE_CUBE_MAP,U.__webglTexture,o.TEXTURE0+tt);const pt=r.get(Mt);if(Mt.version!==pt.__version||ft===!0){i.activeTexture(o.TEXTURE0+tt);const Gt=Re.getPrimaries(Re.workingColorSpace),Rt=b.colorSpace===Ya?null:Re.getPrimaries(b.colorSpace),It=b.colorSpace===Ya||Gt===Rt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,b.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,b.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);const me=b.isCompressedTexture||b.image[0].isCompressedTexture,At=b.image[0]&&b.image[0].isDataTexture,zt=[];for(let vt=0;vt<6;vt++)!me&&!At?zt[vt]=C(b.image[vt],!0,l.maxCubemapSize):zt[vt]=At?b.image[vt].image:b.image[vt],zt[vt]=Ue(b,zt[vt]);const Zt=zt[0],Vt=c.convert(b.format,b.colorSpace),Ot=c.convert(b.type),$t=N(b.internalFormat,Vt,Ot,b.colorSpace),re=b.isVideoTexture!==!0,Oe=pt.__version===void 0||ft===!0,k=Mt.dataReady;let wt=K(b,Zt);et(o.TEXTURE_CUBE_MAP,b);let ot;if(me){re&&Oe&&i.texStorage2D(o.TEXTURE_CUBE_MAP,wt,$t,Zt.width,Zt.height);for(let vt=0;vt<6;vt++){ot=zt[vt].mipmaps;for(let Ct=0;Ct<ot.length;Ct++){const Dt=ot[Ct];b.format!==wi?Vt!==null?re?k&&i.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Ct,0,0,Dt.width,Dt.height,Vt,Dt.data):i.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Ct,$t,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):re?k&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Ct,0,0,Dt.width,Dt.height,Vt,Ot,Dt.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Ct,$t,Dt.width,Dt.height,0,Vt,Ot,Dt.data)}}}else{if(ot=b.mipmaps,re&&Oe){ot.length>0&&wt++;const vt=kt(zt[0]);i.texStorage2D(o.TEXTURE_CUBE_MAP,wt,$t,vt.width,vt.height)}for(let vt=0;vt<6;vt++)if(At){re?k&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,0,0,zt[vt].width,zt[vt].height,Vt,Ot,zt[vt].data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,$t,zt[vt].width,zt[vt].height,0,Vt,Ot,zt[vt].data);for(let Ct=0;Ct<ot.length;Ct++){const te=ot[Ct].image[vt].image;re?k&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Ct+1,0,0,te.width,te.height,Vt,Ot,te.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Ct+1,$t,te.width,te.height,0,Vt,Ot,te.data)}}else{re?k&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,0,0,Vt,Ot,zt[vt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,$t,Vt,Ot,zt[vt]);for(let Ct=0;Ct<ot.length;Ct++){const Dt=ot[Ct];re?k&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Ct+1,0,0,Vt,Ot,Dt.image[vt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+vt,Ct+1,$t,Vt,Ot,Dt.image[vt])}}}x(b)&&S(o.TEXTURE_CUBE_MAP),pt.__version=Mt.version,b.onUpdate&&b.onUpdate(b)}U.__version=b.version}function Et(U,b,tt,ft,Mt,pt){const Gt=c.convert(tt.format,tt.colorSpace),Rt=c.convert(tt.type),It=N(tt.internalFormat,Gt,Rt,tt.colorSpace),me=r.get(b),At=r.get(tt);if(At.__renderTarget=b,!me.__hasExternalTextures){const zt=Math.max(1,b.width>>pt),Zt=Math.max(1,b.height>>pt);Mt===o.TEXTURE_3D||Mt===o.TEXTURE_2D_ARRAY?i.texImage3D(Mt,pt,It,zt,Zt,b.depth,0,Gt,Rt,null):i.texImage2D(Mt,pt,It,zt,Zt,0,Gt,Rt,null)}i.bindFramebuffer(o.FRAMEBUFFER,U),pe(b)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,ft,Mt,At.__webglTexture,0,fe(b)):(Mt===o.TEXTURE_2D||Mt>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&Mt<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,ft,Mt,At.__webglTexture,pt),i.bindFramebuffer(o.FRAMEBUFFER,null)}function St(U,b,tt){if(o.bindRenderbuffer(o.RENDERBUFFER,U),b.depthBuffer){const ft=b.depthTexture,Mt=ft&&ft.isDepthTexture?ft.type:null,pt=D(b.stencilBuffer,Mt),Gt=b.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Rt=fe(b);pe(b)?d.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Rt,pt,b.width,b.height):tt?o.renderbufferStorageMultisample(o.RENDERBUFFER,Rt,pt,b.width,b.height):o.renderbufferStorage(o.RENDERBUFFER,pt,b.width,b.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,Gt,o.RENDERBUFFER,U)}else{const ft=b.textures;for(let Mt=0;Mt<ft.length;Mt++){const pt=ft[Mt],Gt=c.convert(pt.format,pt.colorSpace),Rt=c.convert(pt.type),It=N(pt.internalFormat,Gt,Rt,pt.colorSpace),me=fe(b);tt&&pe(b)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,me,It,b.width,b.height):pe(b)?d.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,me,It,b.width,b.height):o.renderbufferStorage(o.RENDERBUFFER,It,b.width,b.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function Ft(U,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(o.FRAMEBUFFER,U),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ft=r.get(b.depthTexture);ft.__renderTarget=b,(!ft.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),_t(b.depthTexture,0);const Mt=ft.__webglTexture,pt=fe(b);if(b.depthTexture.format===qo)pe(b)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Mt,0,pt):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,Mt,0);else if(b.depthTexture.format===Yo)pe(b)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Mt,0,pt):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,Mt,0);else throw new Error("Unknown depthTexture format")}function jt(U){const b=r.get(U),tt=U.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==U.depthTexture){const ft=U.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),ft){const Mt=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,ft.removeEventListener("dispose",Mt)};ft.addEventListener("dispose",Mt),b.__depthDisposeCallback=Mt}b.__boundDepthTexture=ft}if(U.depthTexture&&!b.__autoAllocateDepthBuffer){if(tt)throw new Error("target.depthTexture not supported in Cube render targets");Ft(b.__webglFramebuffer,U)}else if(tt){b.__webglDepthbuffer=[];for(let ft=0;ft<6;ft++)if(i.bindFramebuffer(o.FRAMEBUFFER,b.__webglFramebuffer[ft]),b.__webglDepthbuffer[ft]===void 0)b.__webglDepthbuffer[ft]=o.createRenderbuffer(),St(b.__webglDepthbuffer[ft],U,!1);else{const Mt=U.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,pt=b.__webglDepthbuffer[ft];o.bindRenderbuffer(o.RENDERBUFFER,pt),o.framebufferRenderbuffer(o.FRAMEBUFFER,Mt,o.RENDERBUFFER,pt)}}else if(i.bindFramebuffer(o.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=o.createRenderbuffer(),St(b.__webglDepthbuffer,U,!1);else{const ft=U.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Mt=b.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,Mt),o.framebufferRenderbuffer(o.FRAMEBUFFER,ft,o.RENDERBUFFER,Mt)}i.bindFramebuffer(o.FRAMEBUFFER,null)}function Kt(U,b,tt){const ft=r.get(U);b!==void 0&&Et(ft.__webglFramebuffer,U,U.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),tt!==void 0&&jt(U)}function Ve(U){const b=U.texture,tt=r.get(U),ft=r.get(b);U.addEventListener("dispose",I);const Mt=U.textures,pt=U.isWebGLCubeRenderTarget===!0,Gt=Mt.length>1;if(Gt||(ft.__webglTexture===void 0&&(ft.__webglTexture=o.createTexture()),ft.__version=b.version,h.memory.textures++),pt){tt.__webglFramebuffer=[];for(let Rt=0;Rt<6;Rt++)if(b.mipmaps&&b.mipmaps.length>0){tt.__webglFramebuffer[Rt]=[];for(let It=0;It<b.mipmaps.length;It++)tt.__webglFramebuffer[Rt][It]=o.createFramebuffer()}else tt.__webglFramebuffer[Rt]=o.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){tt.__webglFramebuffer=[];for(let Rt=0;Rt<b.mipmaps.length;Rt++)tt.__webglFramebuffer[Rt]=o.createFramebuffer()}else tt.__webglFramebuffer=o.createFramebuffer();if(Gt)for(let Rt=0,It=Mt.length;Rt<It;Rt++){const me=r.get(Mt[Rt]);me.__webglTexture===void 0&&(me.__webglTexture=o.createTexture(),h.memory.textures++)}if(U.samples>0&&pe(U)===!1){tt.__webglMultisampledFramebuffer=o.createFramebuffer(),tt.__webglColorRenderbuffer=[],i.bindFramebuffer(o.FRAMEBUFFER,tt.__webglMultisampledFramebuffer);for(let Rt=0;Rt<Mt.length;Rt++){const It=Mt[Rt];tt.__webglColorRenderbuffer[Rt]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,tt.__webglColorRenderbuffer[Rt]);const me=c.convert(It.format,It.colorSpace),At=c.convert(It.type),zt=N(It.internalFormat,me,At,It.colorSpace,U.isXRRenderTarget===!0),Zt=fe(U);o.renderbufferStorageMultisample(o.RENDERBUFFER,Zt,zt,U.width,U.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Rt,o.RENDERBUFFER,tt.__webglColorRenderbuffer[Rt])}o.bindRenderbuffer(o.RENDERBUFFER,null),U.depthBuffer&&(tt.__webglDepthRenderbuffer=o.createRenderbuffer(),St(tt.__webglDepthRenderbuffer,U,!0)),i.bindFramebuffer(o.FRAMEBUFFER,null)}}if(pt){i.bindTexture(o.TEXTURE_CUBE_MAP,ft.__webglTexture),et(o.TEXTURE_CUBE_MAP,b);for(let Rt=0;Rt<6;Rt++)if(b.mipmaps&&b.mipmaps.length>0)for(let It=0;It<b.mipmaps.length;It++)Et(tt.__webglFramebuffer[Rt][It],U,b,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,It);else Et(tt.__webglFramebuffer[Rt],U,b,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,0);x(b)&&S(o.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Gt){for(let Rt=0,It=Mt.length;Rt<It;Rt++){const me=Mt[Rt],At=r.get(me);i.bindTexture(o.TEXTURE_2D,At.__webglTexture),et(o.TEXTURE_2D,me),Et(tt.__webglFramebuffer,U,me,o.COLOR_ATTACHMENT0+Rt,o.TEXTURE_2D,0),x(me)&&S(o.TEXTURE_2D)}i.unbindTexture()}else{let Rt=o.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Rt=U.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),i.bindTexture(Rt,ft.__webglTexture),et(Rt,b),b.mipmaps&&b.mipmaps.length>0)for(let It=0;It<b.mipmaps.length;It++)Et(tt.__webglFramebuffer[It],U,b,o.COLOR_ATTACHMENT0,Rt,It);else Et(tt.__webglFramebuffer,U,b,o.COLOR_ATTACHMENT0,Rt,0);x(b)&&S(Rt),i.unbindTexture()}U.depthBuffer&&jt(U)}function He(U){const b=U.textures;for(let tt=0,ft=b.length;tt<ft;tt++){const Mt=b[tt];if(x(Mt)){const pt=z(U),Gt=r.get(Mt).__webglTexture;i.bindTexture(pt,Gt),S(pt),i.unbindTexture()}}}const ue=[],B=[];function wn(U){if(U.samples>0){if(pe(U)===!1){const b=U.textures,tt=U.width,ft=U.height;let Mt=o.COLOR_BUFFER_BIT;const pt=U.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Gt=r.get(U),Rt=b.length>1;if(Rt)for(let It=0;It<b.length;It++)i.bindFramebuffer(o.FRAMEBUFFER,Gt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+It,o.RENDERBUFFER,null),i.bindFramebuffer(o.FRAMEBUFFER,Gt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+It,o.TEXTURE_2D,null,0);i.bindFramebuffer(o.READ_FRAMEBUFFER,Gt.__webglMultisampledFramebuffer),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Gt.__webglFramebuffer);for(let It=0;It<b.length;It++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(Mt|=o.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(Mt|=o.STENCIL_BUFFER_BIT)),Rt){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,Gt.__webglColorRenderbuffer[It]);const me=r.get(b[It]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,me,0)}o.blitFramebuffer(0,0,tt,ft,0,0,tt,ft,Mt,o.NEAREST),p===!0&&(ue.length=0,B.length=0,ue.push(o.COLOR_ATTACHMENT0+It),U.depthBuffer&&U.resolveDepthBuffer===!1&&(ue.push(pt),B.push(pt),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,B)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,ue))}if(i.bindFramebuffer(o.READ_FRAMEBUFFER,null),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),Rt)for(let It=0;It<b.length;It++){i.bindFramebuffer(o.FRAMEBUFFER,Gt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+It,o.RENDERBUFFER,Gt.__webglColorRenderbuffer[It]);const me=r.get(b[It]).__webglTexture;i.bindFramebuffer(o.FRAMEBUFFER,Gt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+It,o.TEXTURE_2D,me,0)}i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Gt.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&p){const b=U.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[b])}}}function fe(U){return Math.min(l.maxSamples,U.samples)}function pe(U){const b=r.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Xt(U){const b=h.render.frame;g.get(U)!==b&&(g.set(U,b),U.update())}function Ue(U,b){const tt=U.colorSpace,ft=U.format,Mt=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||tt!==Os&&tt!==Ya&&(Re.getTransfer(tt)===Fe?(ft!==wi||Mt!==ga)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",tt)),b}function kt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(m.width=U.naturalWidth||U.width,m.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(m.width=U.displayWidth,m.height=U.displayHeight):(m.width=U.width,m.height=U.height),m}this.allocateTextureUnit=st,this.resetTextureUnits=lt,this.setTexture2D=_t,this.setTexture2DArray=O,this.setTexture3D=j,this.setTextureCube=Y,this.rebindTextures=Kt,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=He,this.updateMultisampleRenderTarget=wn,this.setupDepthRenderbuffer=jt,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=pe}function P1(o,t){function i(r,l=Ya){let c;const h=Re.getTransfer(l);if(r===ga)return o.UNSIGNED_BYTE;if(r===Bd)return o.UNSIGNED_SHORT_4_4_4_4;if(r===Fd)return o.UNSIGNED_SHORT_5_5_5_1;if(r===Kv)return o.UNSIGNED_INT_5_9_9_9_REV;if(r===jv)return o.BYTE;if(r===Zv)return o.SHORT;if(r===Xo)return o.UNSIGNED_SHORT;if(r===zd)return o.INT;if(r===Lr)return o.UNSIGNED_INT;if(r===da)return o.FLOAT;if(r===jo)return o.HALF_FLOAT;if(r===Qv)return o.ALPHA;if(r===Jv)return o.RGB;if(r===wi)return o.RGBA;if(r===$v)return o.LUMINANCE;if(r===t0)return o.LUMINANCE_ALPHA;if(r===qo)return o.DEPTH_COMPONENT;if(r===Yo)return o.DEPTH_STENCIL;if(r===e0)return o.RED;if(r===Hd)return o.RED_INTEGER;if(r===n0)return o.RG;if(r===Gd)return o.RG_INTEGER;if(r===Vd)return o.RGBA_INTEGER;if(r===Oc||r===Pc||r===Ic||r===zc)if(h===Fe)if(c=t.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(r===Oc)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Pc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Ic)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===zc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=t.get("WEBGL_compressed_texture_s3tc"),c!==null){if(r===Oc)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Pc)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Ic)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===zc)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===id||r===ad||r===rd||r===sd)if(c=t.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(r===id)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ad)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===rd)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===sd)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===od||r===ld||r===cd)if(c=t.get("WEBGL_compressed_texture_etc"),c!==null){if(r===od||r===ld)return h===Fe?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(r===cd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===ud||r===fd||r===hd||r===dd||r===pd||r===md||r===gd||r===_d||r===vd||r===Sd||r===yd||r===xd||r===Md||r===Ed)if(c=t.get("WEBGL_compressed_texture_astc"),c!==null){if(r===ud)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===fd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===hd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===dd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===pd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===md)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===gd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===_d)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===vd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Sd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===yd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===xd)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Md)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ed)return h===Fe?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Bc||r===bd||r===Td)if(c=t.get("EXT_texture_compression_bptc"),c!==null){if(r===Bc)return h===Fe?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===bd)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Td)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===i0||r===Ad||r===Cd||r===Rd)if(c=t.get("EXT_texture_compression_rgtc"),c!==null){if(r===Bc)return c.COMPRESSED_RED_RGTC1_EXT;if(r===Ad)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Cd)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Rd)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Wo?o.UNSIGNED_INT_24_8:o[r]!==void 0?o[r]:null}return{convert:i}}const I1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,z1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class B1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i,r){if(this.texture===null){const l=new Zn,c=t.properties.get(l);c.__webglTexture=i.texture,(i.depthNear!==r.depthNear||i.depthFar!==r.depthFar)&&(this.depthNear=i.depthNear,this.depthFar=i.depthFar),this.texture=l}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,r=new Qa({vertexShader:I1,fragmentShader:z1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Fi(new Kc(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class F1 extends Is{constructor(t,i){super();const r=this;let l=null,c=1,h=null,d="local-floor",p=1,m=null,g=null,v=null,y=null,M=null,T=null;const C=new B1,x=i.getContextAttributes();let S=null,z=null;const N=[],D=[],K=new De;let G=null;const I=new gi;I.viewport=new nn;const Z=new gi;Z.viewport=new nn;const w=[I,Z],R=new rE;let H=null,lt=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let ut=N[q];return ut===void 0&&(ut=new Oh,N[q]=ut),ut.getTargetRaySpace()},this.getControllerGrip=function(q){let ut=N[q];return ut===void 0&&(ut=new Oh,N[q]=ut),ut.getGripSpace()},this.getHand=function(q){let ut=N[q];return ut===void 0&&(ut=new Oh,N[q]=ut),ut.getHandSpace()};function st(q){const ut=D.indexOf(q.inputSource);if(ut===-1)return;const Et=N[ut];Et!==void 0&&(Et.update(q.inputSource,q.frame,m||h),Et.dispatchEvent({type:q.type,data:q.inputSource}))}function gt(){l.removeEventListener("select",st),l.removeEventListener("selectstart",st),l.removeEventListener("selectend",st),l.removeEventListener("squeeze",st),l.removeEventListener("squeezestart",st),l.removeEventListener("squeezeend",st),l.removeEventListener("end",gt),l.removeEventListener("inputsourceschange",_t);for(let q=0;q<N.length;q++){const ut=D[q];ut!==null&&(D[q]=null,N[q].disconnect(ut))}H=null,lt=null,C.reset(),t.setRenderTarget(S),M=null,y=null,v=null,l=null,z=null,yt.stop(),r.isPresenting=!1,t.setPixelRatio(G),t.setSize(K.width,K.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){c=q,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){d=q,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||h},this.setReferenceSpace=function(q){m=q},this.getBaseLayer=function(){return y!==null?y:M},this.getBinding=function(){return v},this.getFrame=function(){return T},this.getSession=function(){return l},this.setSession=async function(q){if(l=q,l!==null){if(S=t.getRenderTarget(),l.addEventListener("select",st),l.addEventListener("selectstart",st),l.addEventListener("selectend",st),l.addEventListener("squeeze",st),l.addEventListener("squeezestart",st),l.addEventListener("squeezeend",st),l.addEventListener("end",gt),l.addEventListener("inputsourceschange",_t),x.xrCompatible!==!0&&await i.makeXRCompatible(),G=t.getPixelRatio(),t.getSize(K),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Et=null,St=null,Ft=null;x.depth&&(Ft=x.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,Et=x.stencil?Yo:qo,St=x.stencil?Wo:Lr);const jt={colorFormat:i.RGBA8,depthFormat:Ft,scaleFactor:c};v=new XRWebGLBinding(l,i),y=v.createProjectionLayer(jt),l.updateRenderState({layers:[y]}),t.setPixelRatio(1),t.setSize(y.textureWidth,y.textureHeight,!1),z=new Nr(y.textureWidth,y.textureHeight,{format:wi,type:ga,depthTexture:new v0(y.textureWidth,y.textureHeight,St,void 0,void 0,void 0,void 0,void 0,void 0,Et),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1})}else{const Et={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:c};M=new XRWebGLLayer(l,i,Et),l.updateRenderState({baseLayer:M}),t.setPixelRatio(1),t.setSize(M.framebufferWidth,M.framebufferHeight,!1),z=new Nr(M.framebufferWidth,M.framebufferHeight,{format:wi,type:ga,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}z.isXRRenderTarget=!0,this.setFoveation(p),m=null,h=await l.requestReferenceSpace(d),yt.setContext(l),yt.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return C.getDepthTexture()};function _t(q){for(let ut=0;ut<q.removed.length;ut++){const Et=q.removed[ut],St=D.indexOf(Et);St>=0&&(D[St]=null,N[St].disconnect(Et))}for(let ut=0;ut<q.added.length;ut++){const Et=q.added[ut];let St=D.indexOf(Et);if(St===-1){for(let jt=0;jt<N.length;jt++)if(jt>=D.length){D.push(Et),St=jt;break}else if(D[jt]===null){D[jt]=Et,St=jt;break}if(St===-1)break}const Ft=N[St];Ft&&Ft.connect(Et)}}const O=new at,j=new at;function Y(q,ut,Et){O.setFromMatrixPosition(ut.matrixWorld),j.setFromMatrixPosition(Et.matrixWorld);const St=O.distanceTo(j),Ft=ut.projectionMatrix.elements,jt=Et.projectionMatrix.elements,Kt=Ft[14]/(Ft[10]-1),Ve=Ft[14]/(Ft[10]+1),He=(Ft[9]+1)/Ft[5],ue=(Ft[9]-1)/Ft[5],B=(Ft[8]-1)/Ft[0],wn=(jt[8]+1)/jt[0],fe=Kt*B,pe=Kt*wn,Xt=St/(-B+wn),Ue=Xt*-B;if(ut.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Ue),q.translateZ(Xt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Ft[10]===-1)q.projectionMatrix.copy(ut.projectionMatrix),q.projectionMatrixInverse.copy(ut.projectionMatrixInverse);else{const kt=Kt+Xt,U=Ve+Xt,b=fe-Ue,tt=pe+(St-Ue),ft=He*Ve/U*kt,Mt=ue*Ve/U*kt;q.projectionMatrix.makePerspective(b,tt,ft,Mt,kt,U),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function xt(q,ut){ut===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(ut.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(l===null)return;let ut=q.near,Et=q.far;C.texture!==null&&(C.depthNear>0&&(ut=C.depthNear),C.depthFar>0&&(Et=C.depthFar)),R.near=Z.near=I.near=ut,R.far=Z.far=I.far=Et,(H!==R.near||lt!==R.far)&&(l.updateRenderState({depthNear:R.near,depthFar:R.far}),H=R.near,lt=R.far),I.layers.mask=q.layers.mask|2,Z.layers.mask=q.layers.mask|4,R.layers.mask=I.layers.mask|Z.layers.mask;const St=q.parent,Ft=R.cameras;xt(R,St);for(let jt=0;jt<Ft.length;jt++)xt(Ft[jt],St);Ft.length===2?Y(R,I,Z):R.projectionMatrix.copy(I.projectionMatrix),Tt(q,R,St)};function Tt(q,ut,Et){Et===null?q.matrix.copy(ut.matrixWorld):(q.matrix.copy(Et.matrixWorld),q.matrix.invert(),q.matrix.multiply(ut.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(ut.projectionMatrix),q.projectionMatrixInverse.copy(ut.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=wd*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(y===null&&M===null))return p},this.setFoveation=function(q){p=q,y!==null&&(y.fixedFoveation=q),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=q)},this.hasDepthSensing=function(){return C.texture!==null},this.getDepthSensingMesh=function(){return C.getMesh(R)};let L=null;function et(q,ut){if(g=ut.getViewerPose(m||h),T=ut,g!==null){const Et=g.views;M!==null&&(t.setRenderTargetFramebuffer(z,M.framebuffer),t.setRenderTarget(z));let St=!1;Et.length!==R.cameras.length&&(R.cameras.length=0,St=!0);for(let Kt=0;Kt<Et.length;Kt++){const Ve=Et[Kt];let He=null;if(M!==null)He=M.getViewport(Ve);else{const B=v.getViewSubImage(y,Ve);He=B.viewport,Kt===0&&(t.setRenderTargetTextures(z,B.colorTexture,B.depthStencilTexture),t.setRenderTarget(z))}let ue=w[Kt];ue===void 0&&(ue=new gi,ue.layers.enable(Kt),ue.viewport=new nn,w[Kt]=ue),ue.matrix.fromArray(Ve.transform.matrix),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.projectionMatrix.fromArray(Ve.projectionMatrix),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert(),ue.viewport.set(He.x,He.y,He.width,He.height),Kt===0&&(R.matrix.copy(ue.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),St===!0&&R.cameras.push(ue)}const Ft=l.enabledFeatures;if(Ft&&Ft.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&v){const Kt=v.getDepthInformation(Et[0]);Kt&&Kt.isValid&&Kt.texture&&C.init(t,Kt,l.renderState)}}for(let Et=0;Et<N.length;Et++){const St=D[Et],Ft=N[Et];St!==null&&Ft!==void 0&&Ft.update(St,ut,m||h)}L&&L(q,ut),ut.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:ut}),T=null}const yt=new x0;yt.setAnimationLoop(et),this.setAnimationLoop=function(q){L=q},this.dispose=function(){}}}const Mr=new Gi,H1=new Ke;function G1(o,t){function i(x,S){x.matrixAutoUpdate===!0&&x.updateMatrix(),S.value.copy(x.matrix)}function r(x,S){S.color.getRGB(x.fogColor.value,p0(o)),S.isFog?(x.fogNear.value=S.near,x.fogFar.value=S.far):S.isFogExp2&&(x.fogDensity.value=S.density)}function l(x,S,z,N,D){S.isMeshBasicMaterial||S.isMeshLambertMaterial?c(x,S):S.isMeshToonMaterial?(c(x,S),v(x,S)):S.isMeshPhongMaterial?(c(x,S),g(x,S)):S.isMeshStandardMaterial?(c(x,S),y(x,S),S.isMeshPhysicalMaterial&&M(x,S,D)):S.isMeshMatcapMaterial?(c(x,S),T(x,S)):S.isMeshDepthMaterial?c(x,S):S.isMeshDistanceMaterial?(c(x,S),C(x,S)):S.isMeshNormalMaterial?c(x,S):S.isLineBasicMaterial?(h(x,S),S.isLineDashedMaterial&&d(x,S)):S.isPointsMaterial?p(x,S,z,N):S.isSpriteMaterial?m(x,S):S.isShadowMaterial?(x.color.value.copy(S.color),x.opacity.value=S.opacity):S.isShaderMaterial&&(S.uniformsNeedUpdate=!1)}function c(x,S){x.opacity.value=S.opacity,S.color&&x.diffuse.value.copy(S.color),S.emissive&&x.emissive.value.copy(S.emissive).multiplyScalar(S.emissiveIntensity),S.map&&(x.map.value=S.map,i(S.map,x.mapTransform)),S.alphaMap&&(x.alphaMap.value=S.alphaMap,i(S.alphaMap,x.alphaMapTransform)),S.bumpMap&&(x.bumpMap.value=S.bumpMap,i(S.bumpMap,x.bumpMapTransform),x.bumpScale.value=S.bumpScale,S.side===jn&&(x.bumpScale.value*=-1)),S.normalMap&&(x.normalMap.value=S.normalMap,i(S.normalMap,x.normalMapTransform),x.normalScale.value.copy(S.normalScale),S.side===jn&&x.normalScale.value.negate()),S.displacementMap&&(x.displacementMap.value=S.displacementMap,i(S.displacementMap,x.displacementMapTransform),x.displacementScale.value=S.displacementScale,x.displacementBias.value=S.displacementBias),S.emissiveMap&&(x.emissiveMap.value=S.emissiveMap,i(S.emissiveMap,x.emissiveMapTransform)),S.specularMap&&(x.specularMap.value=S.specularMap,i(S.specularMap,x.specularMapTransform)),S.alphaTest>0&&(x.alphaTest.value=S.alphaTest);const z=t.get(S),N=z.envMap,D=z.envMapRotation;N&&(x.envMap.value=N,Mr.copy(D),Mr.x*=-1,Mr.y*=-1,Mr.z*=-1,N.isCubeTexture&&N.isRenderTargetTexture===!1&&(Mr.y*=-1,Mr.z*=-1),x.envMapRotation.value.setFromMatrix4(H1.makeRotationFromEuler(Mr)),x.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=S.reflectivity,x.ior.value=S.ior,x.refractionRatio.value=S.refractionRatio),S.lightMap&&(x.lightMap.value=S.lightMap,x.lightMapIntensity.value=S.lightMapIntensity,i(S.lightMap,x.lightMapTransform)),S.aoMap&&(x.aoMap.value=S.aoMap,x.aoMapIntensity.value=S.aoMapIntensity,i(S.aoMap,x.aoMapTransform))}function h(x,S){x.diffuse.value.copy(S.color),x.opacity.value=S.opacity,S.map&&(x.map.value=S.map,i(S.map,x.mapTransform))}function d(x,S){x.dashSize.value=S.dashSize,x.totalSize.value=S.dashSize+S.gapSize,x.scale.value=S.scale}function p(x,S,z,N){x.diffuse.value.copy(S.color),x.opacity.value=S.opacity,x.size.value=S.size*z,x.scale.value=N*.5,S.map&&(x.map.value=S.map,i(S.map,x.uvTransform)),S.alphaMap&&(x.alphaMap.value=S.alphaMap,i(S.alphaMap,x.alphaMapTransform)),S.alphaTest>0&&(x.alphaTest.value=S.alphaTest)}function m(x,S){x.diffuse.value.copy(S.color),x.opacity.value=S.opacity,x.rotation.value=S.rotation,S.map&&(x.map.value=S.map,i(S.map,x.mapTransform)),S.alphaMap&&(x.alphaMap.value=S.alphaMap,i(S.alphaMap,x.alphaMapTransform)),S.alphaTest>0&&(x.alphaTest.value=S.alphaTest)}function g(x,S){x.specular.value.copy(S.specular),x.shininess.value=Math.max(S.shininess,1e-4)}function v(x,S){S.gradientMap&&(x.gradientMap.value=S.gradientMap)}function y(x,S){x.metalness.value=S.metalness,S.metalnessMap&&(x.metalnessMap.value=S.metalnessMap,i(S.metalnessMap,x.metalnessMapTransform)),x.roughness.value=S.roughness,S.roughnessMap&&(x.roughnessMap.value=S.roughnessMap,i(S.roughnessMap,x.roughnessMapTransform)),S.envMap&&(x.envMapIntensity.value=S.envMapIntensity)}function M(x,S,z){x.ior.value=S.ior,S.sheen>0&&(x.sheenColor.value.copy(S.sheenColor).multiplyScalar(S.sheen),x.sheenRoughness.value=S.sheenRoughness,S.sheenColorMap&&(x.sheenColorMap.value=S.sheenColorMap,i(S.sheenColorMap,x.sheenColorMapTransform)),S.sheenRoughnessMap&&(x.sheenRoughnessMap.value=S.sheenRoughnessMap,i(S.sheenRoughnessMap,x.sheenRoughnessMapTransform))),S.clearcoat>0&&(x.clearcoat.value=S.clearcoat,x.clearcoatRoughness.value=S.clearcoatRoughness,S.clearcoatMap&&(x.clearcoatMap.value=S.clearcoatMap,i(S.clearcoatMap,x.clearcoatMapTransform)),S.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=S.clearcoatRoughnessMap,i(S.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),S.clearcoatNormalMap&&(x.clearcoatNormalMap.value=S.clearcoatNormalMap,i(S.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(S.clearcoatNormalScale),S.side===jn&&x.clearcoatNormalScale.value.negate())),S.dispersion>0&&(x.dispersion.value=S.dispersion),S.iridescence>0&&(x.iridescence.value=S.iridescence,x.iridescenceIOR.value=S.iridescenceIOR,x.iridescenceThicknessMinimum.value=S.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=S.iridescenceThicknessRange[1],S.iridescenceMap&&(x.iridescenceMap.value=S.iridescenceMap,i(S.iridescenceMap,x.iridescenceMapTransform)),S.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=S.iridescenceThicknessMap,i(S.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),S.transmission>0&&(x.transmission.value=S.transmission,x.transmissionSamplerMap.value=z.texture,x.transmissionSamplerSize.value.set(z.width,z.height),S.transmissionMap&&(x.transmissionMap.value=S.transmissionMap,i(S.transmissionMap,x.transmissionMapTransform)),x.thickness.value=S.thickness,S.thicknessMap&&(x.thicknessMap.value=S.thicknessMap,i(S.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=S.attenuationDistance,x.attenuationColor.value.copy(S.attenuationColor)),S.anisotropy>0&&(x.anisotropyVector.value.set(S.anisotropy*Math.cos(S.anisotropyRotation),S.anisotropy*Math.sin(S.anisotropyRotation)),S.anisotropyMap&&(x.anisotropyMap.value=S.anisotropyMap,i(S.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=S.specularIntensity,x.specularColor.value.copy(S.specularColor),S.specularColorMap&&(x.specularColorMap.value=S.specularColorMap,i(S.specularColorMap,x.specularColorMapTransform)),S.specularIntensityMap&&(x.specularIntensityMap.value=S.specularIntensityMap,i(S.specularIntensityMap,x.specularIntensityMapTransform))}function T(x,S){S.matcap&&(x.matcap.value=S.matcap)}function C(x,S){const z=t.get(S).light;x.referencePosition.value.setFromMatrixPosition(z.matrixWorld),x.nearDistance.value=z.shadow.camera.near,x.farDistance.value=z.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}function V1(o,t,i,r){let l={},c={},h=[];const d=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function p(z,N){const D=N.program;r.uniformBlockBinding(z,D)}function m(z,N){let D=l[z.id];D===void 0&&(T(z),D=g(z),l[z.id]=D,z.addEventListener("dispose",x));const K=N.program;r.updateUBOMapping(z,K);const G=t.render.frame;c[z.id]!==G&&(y(z),c[z.id]=G)}function g(z){const N=v();z.__bindingPointIndex=N;const D=o.createBuffer(),K=z.__size,G=z.usage;return o.bindBuffer(o.UNIFORM_BUFFER,D),o.bufferData(o.UNIFORM_BUFFER,K,G),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,N,D),D}function v(){for(let z=0;z<d;z++)if(h.indexOf(z)===-1)return h.push(z),z;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function y(z){const N=l[z.id],D=z.uniforms,K=z.__cache;o.bindBuffer(o.UNIFORM_BUFFER,N);for(let G=0,I=D.length;G<I;G++){const Z=Array.isArray(D[G])?D[G]:[D[G]];for(let w=0,R=Z.length;w<R;w++){const H=Z[w];if(M(H,G,w,K)===!0){const lt=H.__offset,st=Array.isArray(H.value)?H.value:[H.value];let gt=0;for(let _t=0;_t<st.length;_t++){const O=st[_t],j=C(O);typeof O=="number"||typeof O=="boolean"?(H.__data[0]=O,o.bufferSubData(o.UNIFORM_BUFFER,lt+gt,H.__data)):O.isMatrix3?(H.__data[0]=O.elements[0],H.__data[1]=O.elements[1],H.__data[2]=O.elements[2],H.__data[3]=0,H.__data[4]=O.elements[3],H.__data[5]=O.elements[4],H.__data[6]=O.elements[5],H.__data[7]=0,H.__data[8]=O.elements[6],H.__data[9]=O.elements[7],H.__data[10]=O.elements[8],H.__data[11]=0):(O.toArray(H.__data,gt),gt+=j.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,lt,H.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function M(z,N,D,K){const G=z.value,I=N+"_"+D;if(K[I]===void 0)return typeof G=="number"||typeof G=="boolean"?K[I]=G:K[I]=G.clone(),!0;{const Z=K[I];if(typeof G=="number"||typeof G=="boolean"){if(Z!==G)return K[I]=G,!0}else if(Z.equals(G)===!1)return Z.copy(G),!0}return!1}function T(z){const N=z.uniforms;let D=0;const K=16;for(let I=0,Z=N.length;I<Z;I++){const w=Array.isArray(N[I])?N[I]:[N[I]];for(let R=0,H=w.length;R<H;R++){const lt=w[R],st=Array.isArray(lt.value)?lt.value:[lt.value];for(let gt=0,_t=st.length;gt<_t;gt++){const O=st[gt],j=C(O),Y=D%K,xt=Y%j.boundary,Tt=Y+xt;D+=xt,Tt!==0&&K-Tt<j.storage&&(D+=K-Tt),lt.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),lt.__offset=D,D+=j.storage}}}const G=D%K;return G>0&&(D+=K-G),z.__size=D,z.__cache={},this}function C(z){const N={boundary:0,storage:0};return typeof z=="number"||typeof z=="boolean"?(N.boundary=4,N.storage=4):z.isVector2?(N.boundary=8,N.storage=8):z.isVector3||z.isColor?(N.boundary=16,N.storage=12):z.isVector4?(N.boundary=16,N.storage=16):z.isMatrix3?(N.boundary=48,N.storage=48):z.isMatrix4?(N.boundary=64,N.storage=64):z.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",z),N}function x(z){const N=z.target;N.removeEventListener("dispose",x);const D=h.indexOf(N.__bindingPointIndex);h.splice(D,1),o.deleteBuffer(l[N.id]),delete l[N.id],delete c[N.id]}function S(){for(const z in l)o.deleteBuffer(l[z]);h=[],l={},c={}}return{bind:p,update:m,dispose:S}}class k1{constructor(t={}){const{canvas:i=SM(),context:r=null,depth:l=!0,stencil:c=!1,alpha:h=!1,antialias:d=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:m=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:v=!1,reverseDepthBuffer:y=!1}=t;this.isWebGLRenderer=!0;let M;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=r.getContextAttributes().alpha}else M=h;const T=new Uint32Array(4),C=new Int32Array(4);let x=null,S=null;const z=[],N=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Za,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let K=!1;this._outputColorSpace=mi;let G=0,I=0,Z=null,w=-1,R=null;const H=new nn,lt=new nn;let st=null;const gt=new Me(0);let _t=0,O=i.width,j=i.height,Y=1,xt=null,Tt=null;const L=new nn(0,0,O,j),et=new nn(0,0,O,j);let yt=!1;const q=new Xd;let ut=!1,Et=!1;const St=new Ke,Ft=new Ke,jt=new at,Kt=new nn,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let He=!1;function ue(){return Z===null?Y:1}let B=r;function wn(A,X){return i.getContext(A,X)}try{const A={alpha:!0,depth:l,stencil:c,antialias:d,premultipliedAlpha:p,preserveDrawingBuffer:m,powerPreference:g,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Id}`),i.addEventListener("webglcontextlost",vt,!1),i.addEventListener("webglcontextrestored",Ct,!1),i.addEventListener("webglcontextcreationerror",Dt,!1),B===null){const X="webgl2";if(B=wn(X,A),B===null)throw wn(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let fe,pe,Xt,Ue,kt,U,b,tt,ft,Mt,pt,Gt,Rt,It,me,At,zt,Zt,Vt,Ot,$t,re,Oe,k;function wt(){fe=new $T(B),fe.init(),re=new P1(B,fe),pe=new qT(B,fe,t,re),Xt=new N1(B,fe),pe.reverseDepthBuffer&&y&&Xt.buffers.depth.setReversed(!0),Ue=new nA(B),kt=new y1,U=new O1(B,fe,Xt,kt,pe,re,Ue),b=new jT(D),tt=new JT(D),ft=new lE(B),Oe=new XT(B,ft),Mt=new tA(B,ft,Ue,Oe),pt=new aA(B,Mt,ft,Ue),Vt=new iA(B,pe,U),At=new YT(kt),Gt=new S1(D,b,tt,fe,pe,Oe,At),Rt=new G1(D,kt),It=new M1,me=new R1(fe),Zt=new kT(D,b,tt,Xt,pt,M,p),zt=new U1(D,pt,pe),k=new V1(B,Ue,pe,Xt),Ot=new WT(B,fe,Ue),$t=new eA(B,fe,Ue),Ue.programs=Gt.programs,D.capabilities=pe,D.extensions=fe,D.properties=kt,D.renderLists=It,D.shadowMap=zt,D.state=Xt,D.info=Ue}wt();const ot=new F1(D,B);this.xr=ot,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const A=fe.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=fe.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(A){A!==void 0&&(Y=A,this.setSize(O,j,!1))},this.getSize=function(A){return A.set(O,j)},this.setSize=function(A,X,nt=!0){if(ot.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=A,j=X,i.width=Math.floor(A*Y),i.height=Math.floor(X*Y),nt===!0&&(i.style.width=A+"px",i.style.height=X+"px"),this.setViewport(0,0,A,X)},this.getDrawingBufferSize=function(A){return A.set(O*Y,j*Y).floor()},this.setDrawingBufferSize=function(A,X,nt){O=A,j=X,Y=nt,i.width=Math.floor(A*nt),i.height=Math.floor(X*nt),this.setViewport(0,0,A,X)},this.getCurrentViewport=function(A){return A.copy(H)},this.getViewport=function(A){return A.copy(L)},this.setViewport=function(A,X,nt,it){A.isVector4?L.set(A.x,A.y,A.z,A.w):L.set(A,X,nt,it),Xt.viewport(H.copy(L).multiplyScalar(Y).round())},this.getScissor=function(A){return A.copy(et)},this.setScissor=function(A,X,nt,it){A.isVector4?et.set(A.x,A.y,A.z,A.w):et.set(A,X,nt,it),Xt.scissor(lt.copy(et).multiplyScalar(Y).round())},this.getScissorTest=function(){return yt},this.setScissorTest=function(A){Xt.setScissorTest(yt=A)},this.setOpaqueSort=function(A){xt=A},this.setTransparentSort=function(A){Tt=A},this.getClearColor=function(A){return A.copy(Zt.getClearColor())},this.setClearColor=function(){Zt.setClearColor(...arguments)},this.getClearAlpha=function(){return Zt.getClearAlpha()},this.setClearAlpha=function(){Zt.setClearAlpha(...arguments)},this.clear=function(A=!0,X=!0,nt=!0){let it=0;if(A){let V=!1;if(Z!==null){const bt=Z.texture.format;V=bt===Vd||bt===Gd||bt===Hd}if(V){const bt=Z.texture.type,Ut=bt===ga||bt===Lr||bt===Xo||bt===Wo||bt===Bd||bt===Fd,Nt=Zt.getClearColor(),Pt=Zt.getClearAlpha(),ee=Nt.r,Jt=Nt.g,Wt=Nt.b;Ut?(T[0]=ee,T[1]=Jt,T[2]=Wt,T[3]=Pt,B.clearBufferuiv(B.COLOR,0,T)):(C[0]=ee,C[1]=Jt,C[2]=Wt,C[3]=Pt,B.clearBufferiv(B.COLOR,0,C))}else it|=B.COLOR_BUFFER_BIT}X&&(it|=B.DEPTH_BUFFER_BIT),nt&&(it|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(it)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",vt,!1),i.removeEventListener("webglcontextrestored",Ct,!1),i.removeEventListener("webglcontextcreationerror",Dt,!1),Zt.dispose(),It.dispose(),me.dispose(),kt.dispose(),b.dispose(),tt.dispose(),pt.dispose(),Oe.dispose(),k.dispose(),Gt.dispose(),ot.dispose(),ot.removeEventListener("sessionstart",Hs),ot.removeEventListener("sessionend",Gs),Li.stop()};function vt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),K=!0}function Ct(){console.log("THREE.WebGLRenderer: Context Restored."),K=!1;const A=Ue.autoReset,X=zt.enabled,nt=zt.autoUpdate,it=zt.needsUpdate,V=zt.type;wt(),Ue.autoReset=A,zt.enabled=X,zt.autoUpdate=nt,zt.needsUpdate=it,zt.type=V}function Dt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function te(A){const X=A.target;X.removeEventListener("dispose",te),qe(X)}function qe(A){hn(A),kt.remove(A)}function hn(A){const X=kt.get(A).programs;X!==void 0&&(X.forEach(function(nt){Gt.releaseProgram(nt)}),A.isShaderMaterial&&Gt.releaseShaderCache(A))}this.renderBufferDirect=function(A,X,nt,it,V,bt){X===null&&(X=Ve);const Ut=V.isMesh&&V.matrixWorld.determinant()<0,Nt=ks(A,X,nt,it,V);Xt.setMaterial(it,Ut);let Pt=nt.index,ee=1;if(it.wireframe===!0){if(Pt=Mt.getWireframeAttribute(nt),Pt===void 0)return;ee=2}const Jt=nt.drawRange,Wt=nt.attributes.position;let ve=Jt.start*ee,Se=(Jt.start+Jt.count)*ee;bt!==null&&(ve=Math.max(ve,bt.start*ee),Se=Math.min(Se,(bt.start+bt.count)*ee)),Pt!==null?(ve=Math.max(ve,0),Se=Math.min(Se,Pt.count)):Wt!=null&&(ve=Math.max(ve,0),Se=Math.min(Se,Wt.count));const ke=Se-ve;if(ke<0||ke===1/0)return;Oe.setup(V,it,Nt,nt,Pt);let Te,ne=Ot;if(Pt!==null&&(Te=ft.get(Pt),ne=$t,ne.setIndex(Te)),V.isMesh)it.wireframe===!0?(Xt.setLineWidth(it.wireframeLinewidth*ue()),ne.setMode(B.LINES)):ne.setMode(B.TRIANGLES);else if(V.isLine){let Yt=it.linewidth;Yt===void 0&&(Yt=1),Xt.setLineWidth(Yt*ue()),V.isLineSegments?ne.setMode(B.LINES):V.isLineLoop?ne.setMode(B.LINE_LOOP):ne.setMode(B.LINE_STRIP)}else V.isPoints?ne.setMode(B.POINTS):V.isSprite&&ne.setMode(B.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)Fc("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ne.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(fe.get("WEBGL_multi_draw"))ne.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Yt=V._multiDrawStarts,dn=V._multiDrawCounts,Ee=V._multiDrawCount,Fn=Pt?ft.get(Pt).bytesPerElement:1,Si=kt.get(it).currentProgram.getUniforms();for(let Pn=0;Pn<Ee;Pn++)Si.setValue(B,"_gl_DrawID",Pn),ne.render(Yt[Pn]/Fn,dn[Pn])}else if(V.isInstancedMesh)ne.renderInstances(ve,ke,V.count);else if(nt.isInstancedBufferGeometry){const Yt=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,dn=Math.min(nt.instanceCount,Yt);ne.renderInstances(ve,ke,dn)}else ne.render(ve,ke)};function be(A,X,nt){A.transparent===!0&&A.side===ha&&A.forceSinglePass===!1?(A.side=jn,A.needsUpdate=!0,Qe(A,X,nt),A.side=Ka,A.needsUpdate=!0,Qe(A,X,nt),A.side=ha):Qe(A,X,nt)}this.compile=function(A,X,nt=null){nt===null&&(nt=A),S=me.get(nt),S.init(X),N.push(S),nt.traverseVisible(function(V){V.isLight&&V.layers.test(X.layers)&&(S.pushLight(V),V.castShadow&&S.pushShadow(V))}),A!==nt&&A.traverseVisible(function(V){V.isLight&&V.layers.test(X.layers)&&(S.pushLight(V),V.castShadow&&S.pushShadow(V))}),S.setupLights();const it=new Set;return A.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const bt=V.material;if(bt)if(Array.isArray(bt))for(let Ut=0;Ut<bt.length;Ut++){const Nt=bt[Ut];be(Nt,nt,V),it.add(Nt)}else be(bt,nt,V),it.add(bt)}),S=N.pop(),it},this.compileAsync=function(A,X,nt=null){const it=this.compile(A,X,nt);return new Promise(V=>{function bt(){if(it.forEach(function(Ut){kt.get(Ut).currentProgram.isReady()&&it.delete(Ut)}),it.size===0){V(A);return}setTimeout(bt,10)}fe.get("KHR_parallel_shader_compile")!==null?bt():setTimeout(bt,10)})};let xn=null;function _i(A){xn&&xn(A)}function Hs(){Li.stop()}function Gs(){Li.start()}const Li=new x0;Li.setAnimationLoop(_i),typeof self<"u"&&Li.setContext(self),this.setAnimationLoop=function(A){xn=A,ot.setAnimationLoop(A),A===null?Li.stop():Li.start()},ot.addEventListener("sessionstart",Hs),ot.addEventListener("sessionend",Gs),this.render=function(A,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(K===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(X),X=ot.getCamera()),A.isScene===!0&&A.onBeforeRender(D,A,X,Z),S=me.get(A,N.length),S.init(X),N.push(S),Ft.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),q.setFromProjectionMatrix(Ft),Et=this.localClippingEnabled,ut=At.init(this.clippingPlanes,Et),x=It.get(A,z.length),x.init(),z.push(x),ot.enabled===!0&&ot.isPresenting===!0){const bt=D.xr.getDepthSensingMesh();bt!==null&&Ja(bt,X,-1/0,D.sortObjects)}Ja(A,X,0,D.sortObjects),x.finish(),D.sortObjects===!0&&x.sort(xt,Tt),He=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,He&&Zt.addToRenderList(x,A),this.info.render.frame++,ut===!0&&At.beginShadows();const nt=S.state.shadowsArray;zt.render(nt,A,X),ut===!0&&At.endShadows(),this.info.autoReset===!0&&this.info.reset();const it=x.opaque,V=x.transmissive;if(S.setupLights(),X.isArrayCamera){const bt=X.cameras;if(V.length>0)for(let Ut=0,Nt=bt.length;Ut<Nt;Ut++){const Pt=bt[Ut];Vs(it,V,A,Pt)}He&&Zt.render(A);for(let Ut=0,Nt=bt.length;Ut<Nt;Ut++){const Pt=bt[Ut];Or(x,A,Pt,Pt.viewport)}}else V.length>0&&Vs(it,V,A,X),He&&Zt.render(A),Or(x,A,X);Z!==null&&I===0&&(U.updateMultisampleRenderTarget(Z),U.updateRenderTargetMipmap(Z)),A.isScene===!0&&A.onAfterRender(D,A,X),Oe.resetDefaultState(),w=-1,R=null,N.pop(),N.length>0?(S=N[N.length-1],ut===!0&&At.setGlobalState(D.clippingPlanes,S.state.camera)):S=null,z.pop(),z.length>0?x=z[z.length-1]:x=null};function Ja(A,X,nt,it){if(A.visible===!1)return;if(A.layers.test(X.layers)){if(A.isGroup)nt=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(X);else if(A.isLight)S.pushLight(A),A.castShadow&&S.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||q.intersectsSprite(A)){it&&Kt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Ft);const Ut=pt.update(A),Nt=A.material;Nt.visible&&x.push(A,Ut,Nt,nt,Kt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||q.intersectsObject(A))){const Ut=pt.update(A),Nt=A.material;if(it&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Kt.copy(A.boundingSphere.center)):(Ut.boundingSphere===null&&Ut.computeBoundingSphere(),Kt.copy(Ut.boundingSphere.center)),Kt.applyMatrix4(A.matrixWorld).applyMatrix4(Ft)),Array.isArray(Nt)){const Pt=Ut.groups;for(let ee=0,Jt=Pt.length;ee<Jt;ee++){const Wt=Pt[ee],ve=Nt[Wt.materialIndex];ve&&ve.visible&&x.push(A,Ut,ve,nt,Kt.z,Wt)}}else Nt.visible&&x.push(A,Ut,Nt,nt,Kt.z,null)}}const bt=A.children;for(let Ut=0,Nt=bt.length;Ut<Nt;Ut++)Ja(bt[Ut],X,nt,it)}function Or(A,X,nt,it){const V=A.opaque,bt=A.transmissive,Ut=A.transparent;S.setupLightsView(nt),ut===!0&&At.setGlobalState(D.clippingPlanes,nt),it&&Xt.viewport(H.copy(it)),V.length>0&&$a(V,X,nt),bt.length>0&&$a(bt,X,nt),Ut.length>0&&$a(Ut,X,nt),Xt.buffers.depth.setTest(!0),Xt.buffers.depth.setMask(!0),Xt.buffers.color.setMask(!0),Xt.setPolygonOffset(!1)}function Vs(A,X,nt,it){if((nt.isScene===!0?nt.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[it.id]===void 0&&(S.state.transmissionRenderTarget[it.id]=new Nr(1,1,{generateMipmaps:!0,type:fe.has("EXT_color_buffer_half_float")||fe.has("EXT_color_buffer_float")?jo:ga,minFilter:Rr,samples:4,stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Re.workingColorSpace}));const bt=S.state.transmissionRenderTarget[it.id],Ut=it.viewport||H;bt.setSize(Ut.z*D.transmissionResolutionScale,Ut.w*D.transmissionResolutionScale);const Nt=D.getRenderTarget();D.setRenderTarget(bt),D.getClearColor(gt),_t=D.getClearAlpha(),_t<1&&D.setClearColor(16777215,.5),D.clear(),He&&Zt.render(nt);const Pt=D.toneMapping;D.toneMapping=Za;const ee=it.viewport;if(it.viewport!==void 0&&(it.viewport=void 0),S.setupLightsView(it),ut===!0&&At.setGlobalState(D.clippingPlanes,it),$a(A,nt,it),U.updateMultisampleRenderTarget(bt),U.updateRenderTargetMipmap(bt),fe.has("WEBGL_multisampled_render_to_texture")===!1){let Jt=!1;for(let Wt=0,ve=X.length;Wt<ve;Wt++){const Se=X[Wt],ke=Se.object,Te=Se.geometry,ne=Se.material,Yt=Se.group;if(ne.side===ha&&ke.layers.test(it.layers)){const dn=ne.side;ne.side=jn,ne.needsUpdate=!0,vi(ke,nt,it,Te,ne,Yt),ne.side=dn,ne.needsUpdate=!0,Jt=!0}}Jt===!0&&(U.updateMultisampleRenderTarget(bt),U.updateRenderTargetMipmap(bt))}D.setRenderTarget(Nt),D.setClearColor(gt,_t),ee!==void 0&&(it.viewport=ee),D.toneMapping=Pt}function $a(A,X,nt){const it=X.isScene===!0?X.overrideMaterial:null;for(let V=0,bt=A.length;V<bt;V++){const Ut=A[V],Nt=Ut.object,Pt=Ut.geometry,ee=Ut.group;let Jt=Ut.material;Jt.allowOverride===!0&&it!==null&&(Jt=it),Nt.layers.test(nt.layers)&&vi(Nt,X,nt,Pt,Jt,ee)}}function vi(A,X,nt,it,V,bt){A.onBeforeRender(D,X,nt,it,V,bt),A.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),V.onBeforeRender(D,X,nt,it,A,bt),V.transparent===!0&&V.side===ha&&V.forceSinglePass===!1?(V.side=jn,V.needsUpdate=!0,D.renderBufferDirect(nt,X,it,V,A,bt),V.side=Ka,V.needsUpdate=!0,D.renderBufferDirect(nt,X,it,V,A,bt),V.side=ha):D.renderBufferDirect(nt,X,it,V,A,bt),A.onAfterRender(D,X,nt,it,V,bt)}function Qe(A,X,nt){X.isScene!==!0&&(X=Ve);const it=kt.get(A),V=S.state.lights,bt=S.state.shadowsArray,Ut=V.state.version,Nt=Gt.getParameters(A,V.state,bt,X,nt),Pt=Gt.getProgramCacheKey(Nt);let ee=it.programs;it.environment=A.isMeshStandardMaterial?X.environment:null,it.fog=X.fog,it.envMap=(A.isMeshStandardMaterial?tt:b).get(A.envMap||it.environment),it.envMapRotation=it.environment!==null&&A.envMap===null?X.environmentRotation:A.envMapRotation,ee===void 0&&(A.addEventListener("dispose",te),ee=new Map,it.programs=ee);let Jt=ee.get(Pt);if(Jt!==void 0){if(it.currentProgram===Jt&&it.lightsStateVersion===Ut)return Vi(A,Nt),Jt}else Nt.uniforms=Gt.getUniforms(A),A.onBeforeCompile(Nt,D),Jt=Gt.acquireProgram(Nt,Pt),ee.set(Pt,Jt),it.uniforms=Nt.uniforms;const Wt=it.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Wt.clippingPlanes=At.uniform),Vi(A,Nt),it.needsLights=$c(A),it.lightsStateVersion=Ut,it.needsLights&&(Wt.ambientLightColor.value=V.state.ambient,Wt.lightProbe.value=V.state.probe,Wt.directionalLights.value=V.state.directional,Wt.directionalLightShadows.value=V.state.directionalShadow,Wt.spotLights.value=V.state.spot,Wt.spotLightShadows.value=V.state.spotShadow,Wt.rectAreaLights.value=V.state.rectArea,Wt.ltc_1.value=V.state.rectAreaLTC1,Wt.ltc_2.value=V.state.rectAreaLTC2,Wt.pointLights.value=V.state.point,Wt.pointLightShadows.value=V.state.pointShadow,Wt.hemisphereLights.value=V.state.hemi,Wt.directionalShadowMap.value=V.state.directionalShadowMap,Wt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Wt.spotShadowMap.value=V.state.spotShadowMap,Wt.spotLightMatrix.value=V.state.spotLightMatrix,Wt.spotLightMap.value=V.state.spotLightMap,Wt.pointShadowMap.value=V.state.pointShadowMap,Wt.pointShadowMatrix.value=V.state.pointShadowMatrix),it.currentProgram=Jt,it.uniformsList=null,Jt}function Mn(A){if(A.uniformsList===null){const X=A.currentProgram.getUniforms();A.uniformsList=Hc.seqWithValue(X.seq,A.uniforms)}return A.uniformsList}function Vi(A,X){const nt=kt.get(A);nt.outputColorSpace=X.outputColorSpace,nt.batching=X.batching,nt.batchingColor=X.batchingColor,nt.instancing=X.instancing,nt.instancingColor=X.instancingColor,nt.instancingMorph=X.instancingMorph,nt.skinning=X.skinning,nt.morphTargets=X.morphTargets,nt.morphNormals=X.morphNormals,nt.morphColors=X.morphColors,nt.morphTargetsCount=X.morphTargetsCount,nt.numClippingPlanes=X.numClippingPlanes,nt.numIntersection=X.numClipIntersection,nt.vertexAlphas=X.vertexAlphas,nt.vertexTangents=X.vertexTangents,nt.toneMapping=X.toneMapping}function ks(A,X,nt,it,V){X.isScene!==!0&&(X=Ve),U.resetTextureUnits();const bt=X.fog,Ut=it.isMeshStandardMaterial?X.environment:null,Nt=Z===null?D.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Os,Pt=(it.isMeshStandardMaterial?tt:b).get(it.envMap||Ut),ee=it.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,Jt=!!nt.attributes.tangent&&(!!it.normalMap||it.anisotropy>0),Wt=!!nt.morphAttributes.position,ve=!!nt.morphAttributes.normal,Se=!!nt.morphAttributes.color;let ke=Za;it.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(ke=D.toneMapping);const Te=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,ne=Te!==void 0?Te.length:0,Yt=kt.get(it),dn=S.state.lights;if(ut===!0&&(Et===!0||A!==R)){const Je=A===R&&it.id===w;At.setState(it,A,Je)}let Ee=!1;it.version===Yt.__version?(Yt.needsLights&&Yt.lightsStateVersion!==dn.state.version||Yt.outputColorSpace!==Nt||V.isBatchedMesh&&Yt.batching===!1||!V.isBatchedMesh&&Yt.batching===!0||V.isBatchedMesh&&Yt.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Yt.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Yt.instancing===!1||!V.isInstancedMesh&&Yt.instancing===!0||V.isSkinnedMesh&&Yt.skinning===!1||!V.isSkinnedMesh&&Yt.skinning===!0||V.isInstancedMesh&&Yt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Yt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Yt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Yt.instancingMorph===!1&&V.morphTexture!==null||Yt.envMap!==Pt||it.fog===!0&&Yt.fog!==bt||Yt.numClippingPlanes!==void 0&&(Yt.numClippingPlanes!==At.numPlanes||Yt.numIntersection!==At.numIntersection)||Yt.vertexAlphas!==ee||Yt.vertexTangents!==Jt||Yt.morphTargets!==Wt||Yt.morphNormals!==ve||Yt.morphColors!==Se||Yt.toneMapping!==ke||Yt.morphTargetsCount!==ne)&&(Ee=!0):(Ee=!0,Yt.__version=it.version);let Fn=Yt.currentProgram;Ee===!0&&(Fn=Qe(it,X,V));let Si=!1,Pn=!1,vn=!1;const Pe=Fn.getUniforms(),In=Yt.uniforms;if(Xt.useProgram(Fn.program)&&(Si=!0,Pn=!0,vn=!0),it.id!==w&&(w=it.id,Pn=!0),Si||R!==A){Xt.buffers.depth.getReversed()?(St.copy(A.projectionMatrix),xM(St),MM(St),Pe.setValue(B,"projectionMatrix",St)):Pe.setValue(B,"projectionMatrix",A.projectionMatrix),Pe.setValue(B,"viewMatrix",A.matrixWorldInverse);const En=Pe.map.cameraPosition;En!==void 0&&En.setValue(B,jt.setFromMatrixPosition(A.matrixWorld)),pe.logarithmicDepthBuffer&&Pe.setValue(B,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(it.isMeshPhongMaterial||it.isMeshToonMaterial||it.isMeshLambertMaterial||it.isMeshBasicMaterial||it.isMeshStandardMaterial||it.isShaderMaterial)&&Pe.setValue(B,"isOrthographic",A.isOrthographicCamera===!0),R!==A&&(R=A,Pn=!0,vn=!0)}if(V.isSkinnedMesh){Pe.setOptional(B,V,"bindMatrix"),Pe.setOptional(B,V,"bindMatrixInverse");const Je=V.skeleton;Je&&(Je.boneTexture===null&&Je.computeBoneTexture(),Pe.setValue(B,"boneTexture",Je.boneTexture,U))}V.isBatchedMesh&&(Pe.setOptional(B,V,"batchingTexture"),Pe.setValue(B,"batchingTexture",V._matricesTexture,U),Pe.setOptional(B,V,"batchingIdTexture"),Pe.setValue(B,"batchingIdTexture",V._indirectTexture,U),Pe.setOptional(B,V,"batchingColorTexture"),V._colorsTexture!==null&&Pe.setValue(B,"batchingColorTexture",V._colorsTexture,U));const Dn=nt.morphAttributes;if((Dn.position!==void 0||Dn.normal!==void 0||Dn.color!==void 0)&&Vt.update(V,nt,Fn),(Pn||Yt.receiveShadow!==V.receiveShadow)&&(Yt.receiveShadow=V.receiveShadow,Pe.setValue(B,"receiveShadow",V.receiveShadow)),it.isMeshGouraudMaterial&&it.envMap!==null&&(In.envMap.value=Pt,In.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),it.isMeshStandardMaterial&&it.envMap===null&&X.environment!==null&&(In.envMapIntensity.value=X.environmentIntensity),Pn&&(Pe.setValue(B,"toneMappingExposure",D.toneMappingExposure),Yt.needsLights&&Jc(In,vn),bt&&it.fog===!0&&Rt.refreshFogUniforms(In,bt),Rt.refreshMaterialUniforms(In,it,Y,j,S.state.transmissionRenderTarget[A.id]),Hc.upload(B,Mn(Yt),In,U)),it.isShaderMaterial&&it.uniformsNeedUpdate===!0&&(Hc.upload(B,Mn(Yt),In,U),it.uniformsNeedUpdate=!1),it.isSpriteMaterial&&Pe.setValue(B,"center",V.center),Pe.setValue(B,"modelViewMatrix",V.modelViewMatrix),Pe.setValue(B,"normalMatrix",V.normalMatrix),Pe.setValue(B,"modelMatrix",V.matrixWorld),it.isShaderMaterial||it.isRawShaderMaterial){const Je=it.uniformsGroups;for(let En=0,Pr=Je.length;En<Pr;En++){const Hn=Je[En];k.update(Hn,Fn),k.bind(Hn,Fn)}}return Fn}function Jc(A,X){A.ambientLightColor.needsUpdate=X,A.lightProbe.needsUpdate=X,A.directionalLights.needsUpdate=X,A.directionalLightShadows.needsUpdate=X,A.pointLights.needsUpdate=X,A.pointLightShadows.needsUpdate=X,A.spotLights.needsUpdate=X,A.spotLightShadows.needsUpdate=X,A.rectAreaLights.needsUpdate=X,A.hemisphereLights.needsUpdate=X}function $c(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(A,X,nt){const it=kt.get(A);it.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,it.__autoAllocateDepthBuffer===!1&&(it.__useRenderToTexture=!1),kt.get(A.texture).__webglTexture=X,kt.get(A.depthTexture).__webglTexture=it.__autoAllocateDepthBuffer?void 0:nt,it.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,X){const nt=kt.get(A);nt.__webglFramebuffer=X,nt.__useDefaultFramebuffer=X===void 0};const Jo=B.createFramebuffer();this.setRenderTarget=function(A,X=0,nt=0){Z=A,G=X,I=nt;let it=!0,V=null,bt=!1,Ut=!1;if(A){const Pt=kt.get(A);if(Pt.__useDefaultFramebuffer!==void 0)Xt.bindFramebuffer(B.FRAMEBUFFER,null),it=!1;else if(Pt.__webglFramebuffer===void 0)U.setupRenderTarget(A);else if(Pt.__hasExternalTextures)U.rebindTextures(A,kt.get(A.texture).__webglTexture,kt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Wt=A.depthTexture;if(Pt.__boundDepthTexture!==Wt){if(Wt!==null&&kt.has(Wt)&&(A.width!==Wt.image.width||A.height!==Wt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(A)}}const ee=A.texture;(ee.isData3DTexture||ee.isDataArrayTexture||ee.isCompressedArrayTexture)&&(Ut=!0);const Jt=kt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Jt[X])?V=Jt[X][nt]:V=Jt[X],bt=!0):A.samples>0&&U.useMultisampledRTT(A)===!1?V=kt.get(A).__webglMultisampledFramebuffer:Array.isArray(Jt)?V=Jt[nt]:V=Jt,H.copy(A.viewport),lt.copy(A.scissor),st=A.scissorTest}else H.copy(L).multiplyScalar(Y).floor(),lt.copy(et).multiplyScalar(Y).floor(),st=yt;if(nt!==0&&(V=Jo),Xt.bindFramebuffer(B.FRAMEBUFFER,V)&&it&&Xt.drawBuffers(A,V),Xt.viewport(H),Xt.scissor(lt),Xt.setScissorTest(st),bt){const Pt=kt.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+X,Pt.__webglTexture,nt)}else if(Ut){const Pt=kt.get(A.texture),ee=X;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Pt.__webglTexture,nt,ee)}else if(A!==null&&nt!==0){const Pt=kt.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Pt.__webglTexture,nt)}w=-1},this.readRenderTargetPixels=function(A,X,nt,it,V,bt,Ut){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Nt=kt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ut!==void 0&&(Nt=Nt[Ut]),Nt){Xt.bindFramebuffer(B.FRAMEBUFFER,Nt);try{const Pt=A.texture,ee=Pt.format,Jt=Pt.type;if(!pe.textureFormatReadable(ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pe.textureTypeReadable(Jt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=A.width-it&&nt>=0&&nt<=A.height-V&&B.readPixels(X,nt,it,V,re.convert(ee),re.convert(Jt),bt)}finally{const Pt=Z!==null?kt.get(Z).__webglFramebuffer:null;Xt.bindFramebuffer(B.FRAMEBUFFER,Pt)}}},this.readRenderTargetPixelsAsync=async function(A,X,nt,it,V,bt,Ut){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Nt=kt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ut!==void 0&&(Nt=Nt[Ut]),Nt)if(X>=0&&X<=A.width-it&&nt>=0&&nt<=A.height-V){Xt.bindFramebuffer(B.FRAMEBUFFER,Nt);const Pt=A.texture,ee=Pt.format,Jt=Pt.type;if(!pe.textureFormatReadable(ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pe.textureTypeReadable(Jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Wt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Wt),B.bufferData(B.PIXEL_PACK_BUFFER,bt.byteLength,B.STREAM_READ),B.readPixels(X,nt,it,V,re.convert(ee),re.convert(Jt),0);const ve=Z!==null?kt.get(Z).__webglFramebuffer:null;Xt.bindFramebuffer(B.FRAMEBUFFER,ve);const Se=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await yM(B,Se,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Wt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,bt),B.deleteBuffer(Wt),B.deleteSync(Se),bt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,X=null,nt=0){const it=Math.pow(2,-nt),V=Math.floor(A.image.width*it),bt=Math.floor(A.image.height*it),Ut=X!==null?X.x:0,Nt=X!==null?X.y:0;U.setTexture2D(A,0),B.copyTexSubImage2D(B.TEXTURE_2D,nt,0,0,Ut,Nt,V,bt),Xt.unbindTexture()};const tr=B.createFramebuffer(),Xs=B.createFramebuffer();this.copyTextureToTexture=function(A,X,nt=null,it=null,V=0,bt=null){bt===null&&(V!==0?(Fc("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),bt=V,V=0):bt=0);let Ut,Nt,Pt,ee,Jt,Wt,ve,Se,ke;const Te=A.isCompressedTexture?A.mipmaps[bt]:A.image;if(nt!==null)Ut=nt.max.x-nt.min.x,Nt=nt.max.y-nt.min.y,Pt=nt.isBox3?nt.max.z-nt.min.z:1,ee=nt.min.x,Jt=nt.min.y,Wt=nt.isBox3?nt.min.z:0;else{const Dn=Math.pow(2,-V);Ut=Math.floor(Te.width*Dn),Nt=Math.floor(Te.height*Dn),A.isDataArrayTexture?Pt=Te.depth:A.isData3DTexture?Pt=Math.floor(Te.depth*Dn):Pt=1,ee=0,Jt=0,Wt=0}it!==null?(ve=it.x,Se=it.y,ke=it.z):(ve=0,Se=0,ke=0);const ne=re.convert(X.format),Yt=re.convert(X.type);let dn;X.isData3DTexture?(U.setTexture3D(X,0),dn=B.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(U.setTexture2DArray(X,0),dn=B.TEXTURE_2D_ARRAY):(U.setTexture2D(X,0),dn=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,X.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,X.unpackAlignment);const Ee=B.getParameter(B.UNPACK_ROW_LENGTH),Fn=B.getParameter(B.UNPACK_IMAGE_HEIGHT),Si=B.getParameter(B.UNPACK_SKIP_PIXELS),Pn=B.getParameter(B.UNPACK_SKIP_ROWS),vn=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Te.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Te.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,ee),B.pixelStorei(B.UNPACK_SKIP_ROWS,Jt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Wt);const Pe=A.isDataArrayTexture||A.isData3DTexture,In=X.isDataArrayTexture||X.isData3DTexture;if(A.isDepthTexture){const Dn=kt.get(A),Je=kt.get(X),En=kt.get(Dn.__renderTarget),Pr=kt.get(Je.__renderTarget);Xt.bindFramebuffer(B.READ_FRAMEBUFFER,En.__webglFramebuffer),Xt.bindFramebuffer(B.DRAW_FRAMEBUFFER,Pr.__webglFramebuffer);for(let Hn=0;Hn<Pt;Hn++)Pe&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,kt.get(A).__webglTexture,V,Wt+Hn),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,kt.get(X).__webglTexture,bt,ke+Hn)),B.blitFramebuffer(ee,Jt,Ut,Nt,ve,Se,Ut,Nt,B.DEPTH_BUFFER_BIT,B.NEAREST);Xt.bindFramebuffer(B.READ_FRAMEBUFFER,null),Xt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(V!==0||A.isRenderTargetTexture||kt.has(A)){const Dn=kt.get(A),Je=kt.get(X);Xt.bindFramebuffer(B.READ_FRAMEBUFFER,tr),Xt.bindFramebuffer(B.DRAW_FRAMEBUFFER,Xs);for(let En=0;En<Pt;En++)Pe?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Dn.__webglTexture,V,Wt+En):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Dn.__webglTexture,V),In?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Je.__webglTexture,bt,ke+En):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Je.__webglTexture,bt),V!==0?B.blitFramebuffer(ee,Jt,Ut,Nt,ve,Se,Ut,Nt,B.COLOR_BUFFER_BIT,B.NEAREST):In?B.copyTexSubImage3D(dn,bt,ve,Se,ke+En,ee,Jt,Ut,Nt):B.copyTexSubImage2D(dn,bt,ve,Se,ee,Jt,Ut,Nt);Xt.bindFramebuffer(B.READ_FRAMEBUFFER,null),Xt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else In?A.isDataTexture||A.isData3DTexture?B.texSubImage3D(dn,bt,ve,Se,ke,Ut,Nt,Pt,ne,Yt,Te.data):X.isCompressedArrayTexture?B.compressedTexSubImage3D(dn,bt,ve,Se,ke,Ut,Nt,Pt,ne,Te.data):B.texSubImage3D(dn,bt,ve,Se,ke,Ut,Nt,Pt,ne,Yt,Te):A.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,bt,ve,Se,Ut,Nt,ne,Yt,Te.data):A.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,bt,ve,Se,Te.width,Te.height,ne,Te.data):B.texSubImage2D(B.TEXTURE_2D,bt,ve,Se,Ut,Nt,ne,Yt,Te);B.pixelStorei(B.UNPACK_ROW_LENGTH,Ee),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Fn),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Si),B.pixelStorei(B.UNPACK_SKIP_ROWS,Pn),B.pixelStorei(B.UNPACK_SKIP_IMAGES,vn),bt===0&&X.generateMipmaps&&B.generateMipmap(dn),Xt.unbindTexture()},this.copyTextureToTexture3D=function(A,X,nt=null,it=null,V=0){return Fc('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,X,nt,it,V)},this.initRenderTarget=function(A){kt.get(A).__webglFramebuffer===void 0&&U.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?U.setTextureCube(A,0):A.isData3DTexture?U.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?U.setTexture2DArray(A,0):U.setTexture2D(A,0),Xt.unbindTexture()},this.resetState=function(){G=0,I=0,Z=null,Xt.reset(),Oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pa}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorSpace=Re._getDrawingBufferColorSpace(t),i.unpackColorSpace=Re._getUnpackColorSpace()}}function X1({job:o}){const t=Ai.useRef(null),i=Ai.useRef(null);return Ai.useEffect(()=>{const r=t.current;if(!r)return;const l=r.clientWidth,c=r.clientHeight,h=new YM;h.background=new Me(986898);const d=new gi(60,l/c,1,4096);d.position.set(0,128,256),d.lookAt(0,0,0);const p=new k1({antialias:!0});p.setSize(l,c),r.appendChild(p.domElement),i.current=p;const m=new sE(512,64,4473924,2236962);h.add(m);const g=new aE(4210752);h.add(g);const v=new Bs(64,64,64),y=new JM({color:3368601,roughness:.8}),M=new Fi(v,y);M.position.y=32,h.add(M);const T=new iE(16777215,1);T.position.set(100,200,100),h.add(T);let C=0;const x=()=>{C=requestAnimationFrame(x),M.rotation.y+=.005,p.render(h,d)};x();const S=()=>{const z=r.clientWidth,N=r.clientHeight;d.aspect=z/N,d.updateProjectionMatrix(),p.setSize(z,N)};return window.addEventListener("resize",S),()=>{window.removeEventListener("resize",S),cancelAnimationFrame(C),p.dispose(),r.contains(p.domElement)&&r.removeChild(p.domElement)}},[]),en.jsx("div",{ref:t,style:{width:"100%",height:"100%",position:"relative"},children:en.jsx("div",{style:{position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.5)",padding:"4px 8px",borderRadius:4,fontSize:12},children:o?o.name:"No job selected"})})}function W1(){const[o,t]=Ai.useState(null);return en.jsxs("div",{style:{display:"flex",height:"100vh"},children:[en.jsxs("aside",{style:{width:320,borderRight:"1px solid #333",display:"flex",flexDirection:"column"},children:[en.jsxs("header",{style:{padding:12,borderBottom:"1px solid #333"},children:[en.jsx("h1",{style:{margin:0,fontSize:16},children:"BspLightReSlopper"}),en.jsx("p",{style:{margin:0,fontSize:11,color:"#888"},children:"v2.0 (P1-P5)"})]}),en.jsx(Dx,{onSelect:t,selected:o})]}),en.jsx("main",{style:{flex:1,display:"flex",flexDirection:"column"},children:en.jsx("div",{style:{flex:1,position:"relative"},children:en.jsx(X1,{job:o})})})]})}Vy.createRoot(document.getElementById("root")).render(en.jsx(Oy.StrictMode,{children:en.jsx(W1,{})}));
