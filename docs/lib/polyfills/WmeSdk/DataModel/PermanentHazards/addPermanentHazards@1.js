this.WS=this.WS||{},this.WS.SDKHooks=this.WS.SDKHooks||{},this.WS.SDKHooks.permanentHazardsHook=function(){var t;!function(t){t[t.SpeedBump=1]="SpeedBump",t[t.Topes=2]="Topes",t[t.TollBooth=3]="TollBooth",t[t.DangerousCurve=4]="DangerousCurve",t[t.DangerousIntersection=5]="DangerousIntersection",t[t.DangerousMerge=7]="DangerousMerge",t[t.PedestrianCrossing=8]="PedestrianCrossing",t[t.SchoolZone=9]="SchoolZone"}(t||(t={}));class n{constructor(t,n,e){this.t=t,this.o=n,this.i=e,this.u=!1,this.h=this.l()}l(){if(this.u)return this.h;const t=this.t[this.o];if("function"!=typeof t)throw new Error("Unable to refresh the original function, type of property is incompatible ("+typeof t+")");return t}m(){if(!this.u)return;const t=this.t[this.o];if("function"!=typeof t)throw new Error("Unable to restore original function, type of property is incompatible ("+typeof t+")");this.t[this.o]=this.h}enable(){this.u||(this.h=this.l(),this.t[this.o]=this.p.bind(this),this.u=!0)}disable(){this.u&&(this.m(),this.u=!1)}get isEnabled(){return this.u}A(...t){return this.h.apply(this.t,t)}P(...t){return this.i.apply(this.t,t)}}class e extends n{constructor(t,n,e){super(t,n,e)}static _(t){return t===e.CONTINUE_EXECUTION}static v(t){return!!Array.isArray(t)&&this._(t[0])}p(...t){const n=this.P(...t);if(!e.v(n)&&!e._(n))return n;if(e.v(n)){const[,...t]=n;return this.A(...t)}return this.A(...t)}}function r(){return"unsafeWindow"in window?window.unsafeWindow:window}e.CONTINUE_EXECUTION=Symbol("__CONTINUE_EXECUTION__");const o=new Map;function i(){const t=function(t){const n=Object.keys(t);for(let e=0;e<n.length;e++){const r=n[e];if(r.startsWith("__reactFiber$"))return t[r].return}return null}(function(){const t=document.getElementById("drawer").querySelector("[class^=menu] wz-menu-item:has(wz-icon[name=school-zone])");if(!t)throw new Error("DrawSchoolZone menu item is not found");return t}());if(!t)throw new Error("DrawBigJunction menu-item fiber is not available");return t}function s(t,n){return function(t,n){return"object"==typeof t&&t.hasOwnProperty("current")&&n(t.current)}(t,n)?[!0,t.current]:function(t,n){return Array.isArray(t)&&2===t.length&&Array.isArray(t[1])&&n(t[0])}(t,n)?[!0,t[0]]:n(t)?[!0,t]:[!1,null]}function a(t){let n=t.memoizedState;for(;n;){const t=n.memoizedState,[e,r]=s(t,(t=>"object"==typeof t&&t.__proto__.hasOwnProperty("CLASS_NAME")&&"Waze.Control.DrawFeature"===t.__proto__.CLASS_NAME&&"function"==typeof t.drawCallback));if(e)return r;n=n.next}return null}new e(r(),"fetch",(t=>{const n=function(t){const n=new URL(t);return n.search="",n.toString()}(function(t){if(t instanceof URL)return t;const n="string"==typeof t?t:t.url;return new URL(n,location.toString())}(t));if(o.has(n)){const t=o.get(n);return o.delete(n),Promise.resolve(t)}return e.CONTINUE_EXECUTION}));const u=[function(){const t=function(t,n){for(;t;){if(n(t))return t;t=t.return}return null}(i(),(t=>!!a(t)));if(!t)throw new Error("DrawSchoolZone HOC fiber is not available");return a(t).drawCallback}];function c(t){const n=function(t){return{getGeometry:()=>t}}(t);(function(){for(const t of u)try{return t()}catch(t){}throw new Error("Neither of the provided getters was able to resolve to a BigJunction drawCallback")})()(n)}r().require("Waze/Action/UpdateObject").__proto__,r().require("Waze/Action/CreateObject");const h=r().require("Waze/Action/MultiAction");function f(t){return function(t){const n=[],o=new e(r().W.model.actionManager,"add",(t=>{n.push(t)}));return o.enable(),t(),o.disable(),n}((()=>{c(t)})).find((t=>function(t){return"ADD_PERMANENT_HAZARD"===t.actionName}(t)))}h.Base=h.__proto__,r().require("Waze/Action/UpdateObject");let l=null,d=null;function m(){if(l&&d)return{PermanentHazard:l,AddPermanentHazard:d};const t=f(function(t,n,e={}){for(const n of t){if(n.length<4)throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");if(n[n.length-1].length!==n[0].length)throw new Error("First and last Position are not equivalent.");for(let t=0;t<n[n.length-1].length;t++)if(n[n.length-1][t]!==n[0][t])throw new Error("First and last Position are not equivalent.")}return function(t,n,e={}){const r={type:"Feature"};return(0===e.id||e.id)&&(r.id=e.id),e.bbox&&(r.bbox=e.bbox),r.properties={},r.geometry=t,r}({type:"Polygon",coordinates:t},0,e)}([[[0,0],[0,1],[1,1],[1,0],[0,0]]]).geometry);return d=t.constructor,l=t.object.constructor,{PermanentHazard:l,AddPermanentHazard:d}}class b{constructor(t,n,e){this.O=new Map,this.j=t,this.S=n,this.H=Object.assign(Object.assign({},b.defaultOptions),e)}k(t){const n=this.j.split(".");n.pop();let e=t;for(const t of n)e=e[t];return Object.getPrototypeOf(e)||e}install(t){var n;const e=this.k(t),r=this.j.split(".").pop(),o=e[r];(null===(n=this.H)||void 0===n?void 0:n.onlyIfNotExists)&&o||(e[r]=this.S,this.O.set(t,o))}uninstall(t){const n=this.k(t),e=this.j.split(".").pop(),r=this.O.get(t);r&&(n[e]=r)}}b.defaultOptions={onlyIfNotExists:!0};const y={};function w(t,n){let e=!1;return"string"==typeof n?n=[n]:"[object Array]"===Object.prototype.toString.call(n)?0===n.length&&(e=!0):e=!0,t?n:e}function p(t,n){let e;if(function(t){return"function"==typeof t}(y[t])){try{e=y[t](n)}catch(n){e=["Problem with custom definition for "+t+": "+n]}if("[object Array]"===Object.prototype.toString.call(e))return e}return[]}function g(t,n){let e=[];return Array.isArray(t)?(t.forEach(((t,n)=>{const r=function(t,n=!1){let e=[];return Array.isArray(t)?(t.length<=1&&e.push("Position must be at least two elements"),t.forEach(((t,n)=>{"number"!=typeof t&&e.push("Position must only contain numbers. Item "+t+" at index "+n+" is invalid.")}))):e.push("Position must be an array"),e=e.concat(p("Position",t)),w(n,e)}(t,!0);r.length&&(r[0]="at "+n+": ".concat(r[0]),e=e.concat(r))})),t[0].toString()!==t[t.length-1].toString()&&e.push("The first and last positions must be equivalent"),t.length<4&&e.push("coordinates must have at least four positions")):e.push("coordinates must be an array"),w(n,e)}function A(t,n=!1){if((e=t)!==Object(e))return w(n,["must be a JSON Object"]);var e;let r=[];if("bbox"in t){const n=function(t,n=!1){let e=[];Array.isArray(t)?t.length%2!=0&&e.push("bbox, must be a 2*n array"):e.push("bbox must be an array");return e=e.concat(p("Bbox",t)),w(n,e)}(t.bbox,!0);n.length&&(r=r.concat(n))}if("type"in t?"Polygon"!==t.type&&r.push('type must be "Polygon"'):r.push('must have a member with the name "type"'),"coordinates"in t){const n=function(t,n=!1){let e=[];return Array.isArray(t)?t.forEach(((t,n)=>{const r=g(t,!0);r.length&&(r[0]="at "+n+": ".concat(r[0]),e=e.concat(r))})):e.push("coordinates must be an array"),w(n,e)}(t.coordinates,!0);n.length&&(r=r.concat(n))}else r.push('must have a member with the name "coordinates"');return r=r.concat(p("Polygon",t)),w(n,r)}const P=new class{constructor(){this.C=[],this.D=[]}N(t){return this.D.some((n=>n.sdk===t))}F(t){this.N(t)||(this.C.forEach((n=>n.install(t))),this.D.push({sdk:t,hooks:this.C}))}I(t){const n=this.D.find((n=>n.sdk===t));n&&n.hooks.forEach((n=>n.uninstall(t)))}R(t){this.C.push(t)}U(t){const n=this.C.indexOf(t);-1!==n&&this.C.splice(n,1)}};return P.R(new b("DataModel.PermanentHazards.addSchoolZone",(function(n){if(!A(n.geometry))throw new Error("Invalid geometry: expected a Polygon");return function(t,n=r().W.model){const{PermanentHazard:e,AddPermanentHazard:o}=m(),i=new o(new e(t),n.permanentHazards);n.actionManager.add(i)}({geoJSONGeometry:n.geometry,type:t.SchoolZone,name:n.name,speedLimit:n.speedLimit,excludedRoadTypes:n.excludedRoadTypes})}))),function(t){P.F(t)}}();
