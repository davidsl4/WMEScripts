// ==UserScript==
// @name         WME Roundabout Junction Box
// @version      1.0.1.1
// @author       r0den
// @match        https://*.waze.com/*editor*
// @match        https://waze.com/*editor*
// @icon         https://www.waze.com/favicon.ico
// @description  Make a Junction Box same geometry as your roundabout
// @grant        none
// ==/UserScript==

(function(){var k={en:{"convert-to-roundaboutjb":"Convert to Roundabout JB","roundaboutjb-added-action":"Added roundabout JB"},he:{"convert-to-roundaboutjb":"\u05e9\u05e0\u05d4 \u05dc\u05e7\u05d5\u05e4\u05e1\u05ea \u05db\u05d9\u05db\u05e8","roundaboutjb-added-action":"\u05e7\u05d5\u05e4\u05e1\u05ea \u05db\u05d9\u05db\u05e8 \u05e0\u05d5\u05e1\u05e4\u05d4"}},m=function(f){if(0==W.model.junctions.objects.hasOwnProperty(f))return null;var h=W.model.junctions.objects[f].attributes.segIDs;if(0==h.length)return null;
for(var e=0;e<h.length&&0==W.model.segments.objects.hasOwnProperty(h[e]);)e++;if(e==h.length)return null;var a=W.model.segments.objects[h[e]];h=h[e];e=[];for(var b=!1;!b;){var d=a.geometry.getVertices();if(a.attributes.fwdDirection){for(var c=0;c<d.length-1;c++)e.push(d[c].clone());d=W.model.nodes.objects[a.attributes.toNodeID]}else{for(c=d.length-1;0<c;c--)e.push(d[c].clone());d=W.model.nodes.objects[a.attributes.fromNodeID]}var g=null;for(c=0;c<d.attributes.segIDs.length;c++)if(g=W.model.segments.objects[d.attributes.segIDs[c]],
g.attributes.id!=a.attributes.id&&null!=g.attributes.junctionID&&g.attributes.junctionID==f){if(g.attributes.id==h){b=!0;break}break}if(!b&&g.attributes.id==a.attributes.id)return null;a=g}f=new OpenLayers.Geometry.LinearRing(e);f=f.resize(1.2,f.getCentroid());f=new OpenLayers.Geometry.Polygon(f);f.calculateBounds();return f},l=function(){if(window.require){console.log("%cRoundaboutJB loaded","color: darkgoldenrod");var f=k[I18n.locale]||k.en,h={},e;W.model.actionManager.events.on("beforeaction",
function(a){a.action.bigJunction&&(e=function(){var b=W.model.segments.objects[a.action.bigJunction.attributes.segIDs[0]].attributes.junctionID;if(null!=b&&(b=m(b),null!=b)){a.action._description=f["roundaboutjb-added-action"];a.action.initialGeometry=a.action.bigJunction.attributes.geometry=b;var d=W.selectionManager.getSelectedFeatures()[0].layer;d.geometry=a.action.initialGeometry;var c=d._featureMap[a.action.bigJunction.attributes.id];d.removeFeatures(c);c.geometry=b;d.addFeatures(c);return h[a.action.bigJunction.attributes.id]=
!0}})});W.model.actionManager.events.on("afteraction",function(a){e&&(0===a.action.bigJunction.attributes.segIDs.filter(function(b){return!W.model.segments.objects[b].isInRoundabout()}).length&&(h[a.action.bigJunction.attributes.id]=e),e=null)});W.selectionManager.events.on("selectionchanged",function(a){var b=a.selected;if(0!=b.length&&"bigJunction"==b[0].model.type&&!(0<=b[0].model.attributes.junctionID)&&(a=h[b[0].model.attributes.id],"undefined"!==typeof a)){var d=document.getElementById("big-junction-edit-general").getElementsByClassName("junction-actions")[0],
c=d.parentNode;c.classList.remove("side-panel-section");c.classList.add("more-actions");var g=document.createElement("button");g.classList.add("action-button","select-short-segments","waze-btn","waze-btn-smaller","waze-btn-white");g.innerHTML=f["convert-to-roundaboutjb"];!0===a?g.disabled=!0:g.onclick=function(){h[b[0].model.attributes.id]();g.disabled=!0};d.appendChild(g)}})}else setTimeout(l,100)};setTimeout(l,100)})();