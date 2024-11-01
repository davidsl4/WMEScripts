/*

Name: Closures UI Enhancer
Description: A set of utility functions to enhance the UI of closure elements in the WME
Author: r0den
Version: 0.1.0

Capabilities:
  - Registering your own commands to the dropdown of the closure cards (including finished and turn closures)

Usage:
  - All the functionality for this library is defined in the WS.UI.Closures property

Methods:
  - registerCustomCommand(title, onClick, shouldAdd?): Adds a custom menu item to the drop-down menu of closures.
      - onClick is called with the closure in question
      - shouldAdd is called with the closure in question, and must return true if this menu item should be added to this closure card
      - if shouldAdd is not provided, the command will be added to all closures

*/
this.WS=this.WS||{},this.WS.UI=this.WS.UI||{},this.WS.UI.Closures=function(){"use strict";function t(t,e,n){const s=document.createElement("wz-menu-item");s.innerText=e,s.addEventListener("click",n),t.appendChild(s)}var e;function n(t){return"wz-card"===t.tagName.toLowerCase()&&t.classList.contains("closure-item")}function s(t){var n,s;const i=null===(s=null===(n=function(t,e){for(;t;){if(e(t))return t;t=t.return}return null}(function(t){const e=Object.keys(t);for(let n=0;n<e.length;n++){const s=e[n];if(s.startsWith("__reactFiber$"))return t[s].return}return null}(t),(t=>["model","dataModel","canEdit","allowApplyToAll","onClickDelete"].every((e=>e in t.memoizedProps)))))||void 0===n?void 0:n.memoizedProps)||void 0===s?void 0:s.model.attributes;if(!i)return null;return"closures"in i?Object.assign(Object.assign({},i),{closures:i.closures.map((t=>{var e;return null!==(e=t.attributes)&&void 0!==e?e:t})),segments:i.segments.map((t=>t.getAttribute("id")))}):{closures:[i],createdBy:i.createdBy,direction:i.forward?e.Forward:e.Reverse,startDate:i.startDate,endDate:i.endDate,eventId:i.eventId,permanent:i.permanent,provider:i.provider,reason:i.reason,segments:[i.segID].filter((t=>t>0))}}!function(t){t[t.Unknown=0]="Unknown",t[t.Forward=1]="Forward",t[t.Reverse=2]="Reverse",t[t.Both=3]="Both"}(e||(e={}));const i="unsafeWindow"in window?window.unsafeWindow:window,o=new class{constructor(t){this.t=new Set,this.i(t)}o(){this.u&&this.u.disconnect()}i(t){this.o(),this.u=new MutationObserver((t=>{function e(t,n=[]){return n.push(t),t.childNodes.forEach((t=>{t.nodeType===Node.ELEMENT_NODE&&t instanceof HTMLElement&&e(t,n)})),n}t.flatMap((t=>Array.from(t.addedNodes).flatMap((t=>t.nodeType!==Node.ELEMENT_NODE?[]:t instanceof HTMLElement?e(t):[])))).forEach((t=>this.l(t)))})),this.u.observe(t,{childList:!0,subtree:!0})}l(t){this.t.forEach((e=>{e.condition(t)&&e.callback(t)}))}subscribe(t,e){const n={condition:t,callback:e};return this.t.add(n),()=>{this.t.delete(n)}}}(i.document.body),r=new class{constructor(t){this.h=new Set,this.m=t=>{const e=s(t);this.h.forEach((n=>n(e,t)))},this.v=t.subscribe(n,this.m)}dispose(){this.v()}onNewClosure(t){return this.h.add(t),()=>{this.h.delete(t)}}}(o),c=new class{constructor(e){this.C=new Set,this.p=(e,n)=>{const s=this.k(e);if(!s.length)return;const i=n.querySelector(".closure-title");let o=i.querySelector("wz-button:has(.menu-initiator) + wz-menu");if(!o){const{menu:e,button:s}=function(){const e=document.createElement("wz-menu");e.setAttribute("fixed","true"),e.style.position="absolute";const n=document.createElement("wz-button");return n.setAttribute("color","clear-icon"),n.setAttribute("size","sm"),n.innerHTML='<i class="menu-initiator w-icon w-icon-dot-menu"></i>',n.addEventListener("click",(t=>{t.stopPropagation(),e.toggleMenu(t)})),{menu:e,button:n,addItem:(n,s)=>t(e,n,s)}}();i.appendChild(s),n.parentElement.appendChild(e),o=e}s.forEach((n=>{t(o,n.text,(()=>n.onClick(e)))}))},this.O=e.onNewClosure(this.p)}dispose(){this.O()}k(t){const e=[];return this.C.forEach((n=>{(!n.shouldAdd||n.shouldAdd(t))&&e.push(n)})),e}registerCustomMenuItem(t,e,n){const s={text:t,onClick:e,shouldAdd:n};return this.C.add(s),()=>{this.C.delete(s)}}}(r);return{registerClosureCommand(t,e,n){c.registerCustomMenuItem(t,e,n)}}}();
