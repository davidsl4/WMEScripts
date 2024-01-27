// ==UserScript==
// @name WME Speed Bumps Monitor
// @description WME Speed Bumps Monitor is a utility script written for the Israeli community to count and monitor the speed bumps added during the testing period
// @version 1.1.1
// @author r0den
// @match https://*.beta.waze.com/*editor*
// @match https://beta.waze.com/*editor*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// ==/UserScript==

/*! For license information please see wme-speed-bumps-monitor.user.js.LICENSE.txt */
(()=>{var webpackQueues,webpackExports,webpackError,resolveQueue,__webpack_modules__={634:(module,__unused_webpack___webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.a(module,(async(__webpack_handle_async_dependencies__,__webpack_async_result__)=>{try{var _utils__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(428),_main__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(523);function waitForEvent(node,eventName,skip=!1){return skip?Promise.resolve():new Promise((resolve=>{node.addEventListener(eventName,(()=>resolve(void 0)),{once:!0})}))}await waitForEvent(document,"wme-initialized",(0,_utils__WEBPACK_IMPORTED_MODULE_1__.F)().W?.userscripts?.state?.isInitialized),(0,_main__WEBPACK_IMPORTED_MODULE_0__.Z)(),__webpack_async_result__()}catch(e){__webpack_async_result__(e)}}),1)},523:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>bootstrap});var router_Action,utils_window=__webpack_require__(428),react_module_wrapper=__webpack_require__(74);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}!function(Action){Action.Pop="POP",Action.Push="PUSH",Action.Replace="REPLACE"}(router_Action||(router_Action={}));function invariant(value,message){if(!1===value||null==value)throw new Error(message)}function warning(cond,message){if(!cond){"undefined"!=typeof console&&console.warn(message);try{throw new Error(message)}catch(e){}}}function createLocation(current,to,state,key){return void 0===state&&(state=null),_extends({pathname:"string"==typeof current?current:current.pathname,search:"",hash:""},"string"==typeof to?router_parsePath(to):to,{state,key:to&&to.key||key||Math.random().toString(36).substr(2,8)})}function createPath(_ref){let{pathname="/",search="",hash=""}=_ref;return search&&"?"!==search&&(pathname+="?"===search.charAt(0)?search:"?"+search),hash&&"#"!==hash&&(pathname+="#"===hash.charAt(0)?hash:"#"+hash),pathname}function router_parsePath(path){let parsedPath={};if(path){let hashIndex=path.indexOf("#");hashIndex>=0&&(parsedPath.hash=path.substr(hashIndex),path=path.substr(0,hashIndex));let searchIndex=path.indexOf("?");searchIndex>=0&&(parsedPath.search=path.substr(searchIndex),path=path.substr(0,searchIndex)),path&&(parsedPath.pathname=path)}return parsedPath}var ResultType;!function(ResultType){ResultType.data="data",ResultType.deferred="deferred",ResultType.redirect="redirect",ResultType.error="error"}(ResultType||(ResultType={}));new Set(["lazy","caseSensitive","path","id","index","children"]);function router_stripBasename(pathname,basename){if("/"===basename)return pathname;if(!pathname.toLowerCase().startsWith(basename.toLowerCase()))return null;let startIndex=basename.endsWith("/")?basename.length-1:basename.length,nextChar=pathname.charAt(startIndex);return nextChar&&"/"!==nextChar?null:pathname.slice(startIndex)||"/"}Error;const validMutationMethodsArr=["post","put","patch","delete"],validRequestMethodsArr=(new Set(validMutationMethodsArr),["get",...validMutationMethodsArr]);new Set(validRequestMethodsArr),new Set([301,302,303,307,308]),new Set([307,308]);Symbol("deferred");const NavigationContext=react_module_wrapper.createContext(null);const LocationContext=react_module_wrapper.createContext(null);function useInRouterContext(){return null!=react_module_wrapper.useContext(LocationContext)}react_module_wrapper.Component;const startTransitionImpl=react_module_wrapper.startTransition;function MemoryRouter(_ref3){let{basename,children,initialEntries,initialIndex,future}=_ref3,historyRef=react_module_wrapper.useRef();null==historyRef.current&&(historyRef.current=function(options){void 0===options&&(options={});let entries,{initialEntries=["/"],initialIndex,v5Compat=!1}=options;entries=initialEntries.map(((entry,index)=>createMemoryLocation(entry,"string"==typeof entry?null:entry.state,0===index?"default":void 0)));let index=clampIndex(null==initialIndex?entries.length-1:initialIndex),action=router_Action.Pop,listener=null;function clampIndex(n){return Math.min(Math.max(n,0),entries.length-1)}function getCurrentLocation(){return entries[index]}function createMemoryLocation(to,state,key){void 0===state&&(state=null);let location=createLocation(entries?getCurrentLocation().pathname:"/",to,state,key);return warning("/"===location.pathname.charAt(0),"relative pathnames are not supported in memory history: "+JSON.stringify(to)),location}function createHref(to){return"string"==typeof to?to:createPath(to)}return{get index(){return index},get action(){return action},get location(){return getCurrentLocation()},createHref,createURL:to=>new URL(createHref(to),"http://localhost"),encodeLocation(to){let path="string"==typeof to?router_parsePath(to):to;return{pathname:path.pathname||"",search:path.search||"",hash:path.hash||""}},push(to,state){action=router_Action.Push;let nextLocation=createMemoryLocation(to,state);index+=1,entries.splice(index,entries.length,nextLocation),v5Compat&&listener&&listener({action,location:nextLocation,delta:1})},replace(to,state){action=router_Action.Replace;let nextLocation=createMemoryLocation(to,state);entries[index]=nextLocation,v5Compat&&listener&&listener({action,location:nextLocation,delta:0})},go(delta){action=router_Action.Pop;let nextIndex=clampIndex(index+delta),nextLocation=entries[nextIndex];index=nextIndex,listener&&listener({action,location:nextLocation,delta})},listen:fn=>(listener=fn,()=>{listener=null})}}({initialEntries,initialIndex,v5Compat:!0}));let history=historyRef.current,[state,setStateImpl]=react_module_wrapper.useState({action:history.action,location:history.location}),{v7_startTransition}=future||{},setState=react_module_wrapper.useCallback((newState=>{v7_startTransition&&startTransitionImpl?startTransitionImpl((()=>setStateImpl(newState))):setStateImpl(newState)}),[setStateImpl,v7_startTransition]);return react_module_wrapper.useLayoutEffect((()=>history.listen(setState)),[history,setState]),react_module_wrapper.createElement(Router,{basename,children,location:state.location,navigationType:state.action,navigator:history})}function Router(_ref5){let{basename:basenameProp="/",children=null,location:locationProp,navigationType=router_Action.Pop,navigator,static:staticProp=!1}=_ref5;useInRouterContext()&&invariant(!1);let basename=basenameProp.replace(/^\/*/,"/"),navigationContext=react_module_wrapper.useMemo((()=>({basename,navigator,static:staticProp})),[basename,navigator,staticProp]);"string"==typeof locationProp&&(locationProp=router_parsePath(locationProp));let{pathname="/",search="",hash="",state=null,key="default"}=locationProp,locationContext=react_module_wrapper.useMemo((()=>{let trailingPathname=router_stripBasename(pathname,basename);return null==trailingPathname?null:{location:{pathname:trailingPathname,search,hash,state,key},navigationType}}),[basename,pathname,search,hash,state,key,navigationType]);return null==locationContext?null:react_module_wrapper.createElement(NavigationContext.Provider,{value:navigationContext},react_module_wrapper.createElement(LocationContext.Provider,{children,value:locationContext}))}new Promise((()=>{}));react_module_wrapper.Component;const translations={en:JSON.parse('{"general":{"script_name":"Speed Bumps Monitor"},"header_section":{"counter":"%{count}/%{limit} speed bumps added"},"objects":{"permanentHazard":{"pending_save":"Pending save","state":{"DELETE":"Deleted","INSERT":"Inserted"}}},"layer_switcher":{"enable_layer_group":{"message":"“%{layer_name}” layer is disabled in the Map Layers panel","action":"Enable layer"}}}'),he:JSON.parse('{"general":{"script_name":"מוניטור פסי האטה"},"header_section":{"counter":"%{count}/%{limit} פסי האטה נוספו"},"objects":{"permanentHazard":{"pending_save":"לא נשמר","state":{"DELETE":"נמחק","INSERT":"נוסף"}}},"layer_switcher":{"enable_layer_group":{"message":"שכבת ה“%{layer_name}” לא פעילה","action":"הפעל שכבה"}}}')},availableLocales=new Set(Object.keys(translations)),defaultLocale="en";function getBestSuitableLocale(locale){const localeVariants=function(locale){const variants=new Set;for(;locale;){variants.add(locale);const hyphenIndex=locale.lastIndexOf("-");if(-1===hyphenIndex)break;locale=locale.substring(0,hyphenIndex)}return Array.from(variants)}(locale);for(const localeVariant of localeVariants)if(availableLocales.has(localeVariant))return localeVariant;return defaultLocale}function mergeDeep(target,source){const isObject=obj=>obj&&"object"==typeof obj;return isObject(target)&&isObject(source)?(Object.keys(source).forEach((key=>{const targetValue=target[key],sourceValue=source[key];Array.isArray(targetValue)&&Array.isArray(sourceValue)?target[key]=targetValue.concat(sourceValue):isObject(targetValue)&&isObject(sourceValue)?target[key]=mergeDeep(Object.assign({},targetValue),sourceValue):target[key]=sourceValue})),target):source}const LocalizationContext=(0,react_module_wrapper.createContext)(null);function createLocalizationInstance(translations){const originalI18n=(0,utils_window.F)().I18n,mergedTranslations=mergeDeep(structuredClone(originalI18n.translations),translations),i18nInstance={...originalI18n,translations:mergedTranslations,locale:getBestSuitableLocale(originalI18n.locale)};return i18nInstance.t=i18nInstance.translate.bind(i18nInstance),i18nInstance.locales={...i18nInstance.locales,get:i18nInstance.locales.get.bind(i18nInstance.locales,i18nInstance.locale)},i18nInstance}const ON_ALERT_DISMISSED_EVENT_NAME="alertDismissed",ON_ALERT_ACTION_CLICKED_EVENT_NAME="actionClicked";function WzAlert(props){const alertRef=(0,utils_window.F)().React.useRef(),registeredOnDismiss=(0,utils_window.F)().React.useRef(null),registeredOnAction=(0,utils_window.F)().React.useRef(null);return(0,utils_window.F)().React.useEffect((()=>{registeredOnDismiss.current&&alertRef.current.removeEventListener(ON_ALERT_DISMISSED_EVENT_NAME,registeredOnDismiss.current),props.onDismiss&&alertRef.current.addEventListener(ON_ALERT_DISMISSED_EVENT_NAME,props.onDismiss),registeredOnDismiss.current=props.onDismiss}),[props.onDismiss]),(0,utils_window.F)().React.useEffect((()=>{registeredOnAction.current&&alertRef.current.removeEventListener(ON_ALERT_ACTION_CLICKED_EVENT_NAME,registeredOnAction.current),props.onAction&&alertRef.current.addEventListener(ON_ALERT_ACTION_CLICKED_EVENT_NAME,props.onAction),registeredOnAction.current=props.onAction}),[props.onAction]),React.createElement("wz-alert",{variant:props.variant,level:props.level,multiline:props.multiline,ref:alertRef},props.customIcon&&React.createElement("div",{slot:"icon"},props.customIcon),React.createElement("div",{className:"sidebar-alert-content"},props.children),props.dismissText&&React.createElement("span",{slot:"dismiss"},props.dismissText),props.actionText&&React.createElement("span",{slot:"action",role:"button"},props.actionText))}const PERMANENT_HAZARD_TOGGLER_ID="ITEM_PERMANENT_HAZARDS";function getIsLayerEnabled(){return(0,utils_window.F)().W.layerSwitcherController.getTogglerState(PERMANENT_HAZARD_TOGGLER_ID)}function PermanentHazardLayerDisabledAlert(){const{t}=(0,react_module_wrapper.useContext)(LocalizationContext),[layerEnabled,setLayerEnabled]=(0,react_module_wrapper.useState)(getIsLayerEnabled),updateDisabledState=(0,react_module_wrapper.useCallback)((()=>{setLayerEnabled(getIsLayerEnabled)}),[setLayerEnabled,getIsLayerEnabled]);(0,react_module_wrapper.useEffect)((()=>{const layerSwitcherController=(0,utils_window.F)().W.layerSwitcherController;return layerSwitcherController.on("toggles-changed",updateDisabledState),()=>{layerSwitcherController.off("toggles-changed",updateDisabledState)}}),[]);const enableLayer=(0,react_module_wrapper.useCallback)((()=>(0,utils_window.F)().W.layerSwitcherController.setTogglerState(PERMANENT_HAZARD_TOGGLER_ID,!0)),[]),layerTogglerName=(0,react_module_wrapper.useMemo)((()=>t(`layer_switcher.togglers.${PERMANENT_HAZARD_TOGGLER_ID}`)),[t]);return layerEnabled?React.createElement(React.Fragment,null):React.createElement(WzAlert,{level:"page",variant:"warning",actionText:t("layer_switcher.enable_layer_group.action"),onAction:enableLayer},t("layer_switcher.enable_layer_group.message",{layer_name:layerTogglerName}))}const MAX_SPEED_BUMPS_COUNT=100;let SpeedBumpState=function(SpeedBumpState){return SpeedBumpState.Default="DEFAULT",SpeedBumpState.Deleted="DELETE",SpeedBumpState.Inserted="INSERT",SpeedBumpState}({});const useIsomorphicLayoutEffect_useIsomorphicLayoutEffect="undefined"!=typeof window?react_module_wrapper.useLayoutEffect:react_module_wrapper.useEffect;function useEventListener(eventName,handler,element,options){const savedHandler=(0,react_module_wrapper.useRef)(handler);useIsomorphicLayoutEffect_useIsomorphicLayoutEffect((()=>{savedHandler.current=handler}),[handler]),(0,react_module_wrapper.useEffect)((()=>{var _a;const targetElement=null!==(_a=null==element?void 0:element.current)&&void 0!==_a?_a:window;if(!targetElement||!targetElement.addEventListener)return;const listener=event=>savedHandler.current(event);return targetElement.addEventListener(eventName,listener,options),()=>{targetElement.removeEventListener(eventName,listener,options)}}),[eventName,element,options])}const IS_SERVER="undefined"==typeof window;function useLocalStorage(key,initialValue,options={}){const[storedValue,setStoredValue]=(0,react_module_wrapper.useState)(initialValue),serializer=(0,react_module_wrapper.useCallback)((value=>options.serializer?options.serializer(value):value instanceof Map?JSON.stringify(Object.fromEntries(value)):value instanceof Set?JSON.stringify(Array.from(value)):JSON.stringify(value)),[options]),deserializer=(0,react_module_wrapper.useCallback)((value=>{if(options.deserializer)return options.deserializer(value);if("undefined"===value)return;const parsed=JSON.parse(value);return initialValue instanceof Set?new Set(parsed):initialValue instanceof Map?new Map(Object.entries(parsed)):initialValue instanceof Date?new Date(parsed):parsed}),[options,initialValue]),readValue=(0,react_module_wrapper.useCallback)((()=>{const initialValueToUse=initialValue instanceof Function?initialValue():initialValue;if(IS_SERVER)return initialValueToUse;try{const raw=window.localStorage.getItem(key);return raw?deserializer(raw):initialValueToUse}catch(error){return console.warn(`Error reading localStorage key “${key}”:`,error),initialValueToUse}}),[initialValue,key,deserializer]),setValue=function(fn){const ref=(0,react_module_wrapper.useRef)((()=>{throw new Error("Cannot call an event handler while rendering.")}));return useIsomorphicLayoutEffect_useIsomorphicLayoutEffect((()=>{ref.current=fn}),[fn]),(0,react_module_wrapper.useCallback)(((...args)=>ref.current(...args)),[ref])}((value=>{IS_SERVER&&console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);try{const newValue=value instanceof Function?value(readValue()):value;window.localStorage.setItem(key,serializer(newValue)),setStoredValue(newValue),window.dispatchEvent(new StorageEvent("local-storage",{key}))}catch(error){console.warn(`Error setting localStorage key “${key}”:`,error)}}));(0,react_module_wrapper.useEffect)((()=>{setStoredValue(readValue())}),[key]);const handleStorageChange=(0,react_module_wrapper.useCallback)((event=>{(null==event?void 0:event.key)&&event.key!==key||setStoredValue(readValue())}),[key,readValue]);return useEventListener("storage",handleStorageChange),useEventListener("local-storage",handleStorageChange),[storedValue,setValue]}const INSERTED_OBJECTS_STATE_NAME="INSERT",DELETED_OBJECTS_STATE_NAME="DELETE";function transformSpeedBumpModel(speedBumpModel,state,segmentsRepository){const segment=segmentsRepository.getObjectById(speedBumpModel.getAttribute("segmentId"));return{permanentHazardId:speedBumpModel.getID(),permanentHazardModel:speedBumpModel,roadName:segment.getAddress().format(),coordinates:{latitude:speedBumpModel.getGeometry().coordinates[1],longitude:speedBumpModel.getGeometry().coordinates[0]},state}}const SpeedBumpsRepositoryContextObject=(0,react_module_wrapper.createContext)([]);const SpeedBumpsRepositoryContext={...SpeedBumpsRepositoryContextObject,Provider:function({children}){const modifiedSpeedBumps=function(){const[deletedModels,setDeletedModels]=(0,react_module_wrapper.useState)([]),[insertedModels,setInsertedModels]=(0,react_module_wrapper.useState)([]),refreshModelsState=(0,react_module_wrapper.useCallback)((()=>{const isNewId=(0,utils_window.F)().W.model.permanentHazards.idGenerator.constructor.isNewID,modifiedObjects=(0,utils_window.F)().W.model.permanentHazards.getObjectArray((hazard=>1===hazard.getAttribute("type"))).reduce(((acc,speedBump)=>(speedBump.state===INSERTED_OBJECTS_STATE_NAME||isNewId(speedBump.getID())?acc[INSERTED_OBJECTS_STATE_NAME].push(speedBump):speedBump.state===DELETED_OBJECTS_STATE_NAME&&acc[DELETED_OBJECTS_STATE_NAME].push(speedBump),acc)),{[INSERTED_OBJECTS_STATE_NAME]:[],[DELETED_OBJECTS_STATE_NAME]:[]}),{[INSERTED_OBJECTS_STATE_NAME]:insertedObjects,[DELETED_OBJECTS_STATE_NAME]:deletedObjects}=modifiedObjects;setDeletedModels(deletedObjects),setInsertedModels(insertedObjects)}),[setDeletedModels,setInsertedModels]);(0,react_module_wrapper.useEffect)((()=>{refreshModelsState()}),[]),(0,react_module_wrapper.useEffect)((()=>((0,utils_window.F)().W.model.permanentHazards.on("objectsupdated",refreshModelsState),()=>{(0,utils_window.F)().W.model.permanentHazards.off("objectsupdated",refreshModelsState)})),[refreshModelsState]);const segmentsRepository=(0,utils_window.F)().W.model.segments;return(0,react_module_wrapper.useMemo)((()=>[...insertedModels.map((object=>transformSpeedBumpModel(object,SpeedBumpState.Inserted,segmentsRepository))),...deletedModels.map((object=>transformSpeedBumpModel(object,SpeedBumpState.Deleted,segmentsRepository)))]),[deletedModels,insertedModels])}(),[storedSpeedBumps,setStoredSpeedBumps]=useLocalStorage("userscripts.r0den.il.community-pretest-speed-bumps-monitor.speed-bumps",[]);(0,react_module_wrapper.useEffect)((()=>{const originalSave=(0,utils_window.F)().W.controller.save;return(0,utils_window.F)().W.controller.save=async(...args)=>{const response=await originalSave.apply((0,utils_window.F)().W.controller,args);return setStoredSpeedBumps((oldSpeedBumps=>{const filteredSpeedBumps=oldSpeedBumps.filter((speedBump=>!modifiedSpeedBumps.some((modifiedSpeedBump=>modifiedSpeedBump.permanentHazardId===speedBump.permanentHazardId)))),newSpeedBumps=modifiedSpeedBumps.filter((speedBump=>speedBump.state===SpeedBumpState.Inserted));return newSpeedBumps.forEach((speedBump=>speedBump.state=SpeedBumpState.Default)),filteredSpeedBumps.concat(newSpeedBumps).map((data=>{const{permanentHazardModel,...speedBump}=data;return{...speedBump,permanentHazardId:permanentHazardModel?.getID?.()||speedBump.permanentHazardId}}))})),response},()=>{(0,utils_window.F)().W.controller.save=originalSave}}),[modifiedSpeedBumps]);const concatenatedSpeedBumps=(0,react_module_wrapper.useMemo)((()=>storedSpeedBumps.filter((speedBump=>!modifiedSpeedBumps.some((modifiedSpeedBump=>speedBump.permanentHazardId===modifiedSpeedBump.permanentHazardId)))).concat(modifiedSpeedBumps)),[storedSpeedBumps,modifiedSpeedBumps]);return React.createElement(SpeedBumpsRepositoryContextObject.Provider,{value:concatenatedSpeedBumps},children)}};function useSpeedBumpsRepositoryContext(){return(0,react_module_wrapper.useContext)(SpeedBumpsRepositoryContextObject)}const OnMapSpeedBumpsCountContext=(0,react_module_wrapper.createContext)(0);function OnMapSpeedBumpsCountContextProvider({children}){const allSpeedBumps=useSpeedBumpsRepositoryContext(),onMapSpeedBumpsCount=(0,react_module_wrapper.useMemo)((()=>allSpeedBumps.reduce(((count,speedBump)=>speedBump.state===SpeedBumpState.Deleted?count:count+1),0)),[allSpeedBumps]);return React.createElement(OnMapSpeedBumpsCountContext.Provider,{value:onMapSpeedBumpsCount},children)}function ScriptNameSection(){const{t}=(0,react_module_wrapper.useContext)(LocalizationContext),onMapSpeedBumpsCount=(0,react_module_wrapper.useContext)(OnMapSpeedBumpsCountContext);return React.createElement("wz-section-header",{headline:t("general.script_name"),subtitle:t("header_section.counter",{count:onMapSpeedBumpsCount,limit:MAX_SPEED_BUMPS_COUNT})},React.createElement("i",{slot:"icon",className:"w-icon w-icon-alert-danger-outline"}))}const PropsMapping={className:"class",elevation:"elevation-on-hover"};function WzCard(props){const rawProps=Object.entries(props).reduce(((acc,[key,value])=>(void 0===value||(acc[PropsMapping[key]||key]=value),acc)),{});return React.createElement("wz-card",rawProps)}const REQUIRED_ZOOM_FOR_PH=16,PREFERRED_ZOOM_FOR_PH=19;function SpeedBumpListItem({speedBump,isSaved}){const projectedCoordinates=function(latitude,longitude){const openLayersMapInstance=(0,utils_window.F)().W.map.getOLMap(),OpenLayersPoint=(0,utils_window.F)().OpenLayers.Geometry.Point,destinationProjection=openLayersMapInstance.getProjection();return(0,react_module_wrapper.useMemo)((()=>{const point=new OpenLayersPoint(longitude,latitude);return point.transform("EPSG:4326",destinationProjection),{latitude:point.y,longitude:point.x}}),[latitude,longitude])}(speedBump.coordinates.latitude,speedBump.coordinates.longitude);return React.createElement(WzCard,{elevation:4,onClick:()=>{const{map}=(0,utils_window.F)().W;map.getZoom()<REQUIRED_ZOOM_FOR_PH&&map.getOLMap().zoomTo(PREFERRED_ZOOM_FOR_PH),map.setProjectedCenter({lat:projectedCoordinates.latitude,lon:projectedCoordinates.longitude})},className:"list-item-card",disabled:speedBump.state===SpeedBumpState.Deleted},React.createElement("div",{className:"list-item-card-layout"},React.createElement("div",{className:"list-item-card-icon list-item-card-icon-grey-200"},React.createElement("wz-icon",{name:"speed-bumps",size:24})),React.createElement("div",{className:"list-item-card-info"},React.createElement("div",null,speedBump.roadName),!isSaved&&React.createElement(PendingSaveLabel,{state:speedBump.state}))))}function PendingSaveLabel({state}){const{t}=(0,react_module_wrapper.useContext)(LocalizationContext);return React.createElement("div",null,t(`objects.permanentHazard.state.${state}`)," · ",t("objects.permanentHazard.pending_save"))}function SpeedBumpsList(){const speedBumps=useSpeedBumpsRepositoryContext(),concatenatedSpeedBumpsDetails=(0,react_module_wrapper.useMemo)((()=>speedBumps.map((speedBump=>({speedBump,isSaved:!speedBump.state||speedBump.state===SpeedBumpState.Default})))),[speedBumps]);return React.createElement("ul",{className:"issue-tracker"},concatenatedSpeedBumpsDetails.map((speedBumpDetails=>React.createElement("li",{key:speedBumpDetails.speedBump.permanentHazardId,style:{cursor:"pointer",margin:"5px 0 10px"}},React.createElement(SpeedBumpListItem,{speedBump:speedBumpDetails.speedBump,isSaved:speedBumpDetails.isSaved})))))}function App(){return React.createElement(LocalizationContext.Provider,{value:createLocalizationInstance(translations)},React.createElement(MemoryRouter,null,React.createElement(SpeedBumpsRepositoryContext.Provider,null,React.createElement(OnMapSpeedBumpsCountContextProvider,null,React.createElement(ScriptNameSection,null),React.createElement(PermanentHazardLayerDisabledAlert,null),React.createElement(SpeedBumpsList,null)))))}async function bootstrap(){const{tabLabel,tabPane}=(0,utils_window.F)().W.userscripts.registerSidebarTab("pXYFYOBfvK93RKkJyuIoO");tabLabel.innerHTML="SBM",tabLabel.title="Speed Bumps Monitor",(0,utils_window.F)().ReactDOM.render((0,utils_window.F)().React.createElement(App),tabPane)}App.displayName="userscript(ImportObjects-pXYFYOBfvK93RKkJyuIoO)"},428:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function getRealWindow(){return"unsafeWindow"in window?window.unsafeWindow:window}__webpack_require__.d(__webpack_exports__,{F:()=>getRealWindow})},74:module=>{function getWindow(){return"unsafeWindow"in window?window.unsafeWindow:window}module.exports=new Proxy({},{get:(_target,prop)=>getWindow().React[prop],set:(_target,prop,value)=>getWindow().React[prop]=value})}},__webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;var module=__webpack_module_cache__[moduleId]={exports:{}};return __webpack_modules__[moduleId](module,module.exports,__webpack_require__),module.exports}webpackQueues="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",webpackExports="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",webpackError="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",resolveQueue=queue=>{queue&&queue.d<1&&(queue.d=1,queue.forEach((fn=>fn.r--)),queue.forEach((fn=>fn.r--?fn.r++:fn())))},__webpack_require__.a=(module,body,hasAwait)=>{var queue;hasAwait&&((queue=[]).d=-1);var currentDeps,outerResolve,reject,depQueues=new Set,exports=module.exports,promise=new Promise(((resolve,rej)=>{reject=rej,outerResolve=resolve}));promise[webpackExports]=exports,promise[webpackQueues]=fn=>(queue&&fn(queue),depQueues.forEach(fn),promise.catch((x=>{}))),module.exports=promise,body((deps=>{var fn;currentDeps=(deps=>deps.map((dep=>{if(null!==dep&&"object"==typeof dep){if(dep[webpackQueues])return dep;if(dep.then){var queue=[];queue.d=0,dep.then((r=>{obj[webpackExports]=r,resolveQueue(queue)}),(e=>{obj[webpackError]=e,resolveQueue(queue)}));var obj={};return obj[webpackQueues]=fn=>fn(queue),obj}}var ret={};return ret[webpackQueues]=x=>{},ret[webpackExports]=dep,ret})))(deps);var getResult=()=>currentDeps.map((d=>{if(d[webpackError])throw d[webpackError];return d[webpackExports]})),promise=new Promise((resolve=>{(fn=()=>resolve(getResult)).r=0;var fnQueue=q=>q!==queue&&!depQueues.has(q)&&(depQueues.add(q),q&&!q.d&&(fn.r++,q.push(fn)));currentDeps.map((dep=>dep[webpackQueues](fnQueue)))}));return fn.r?promise:getResult()}),(err=>(err?reject(promise[webpackError]=err):outerResolve(exports),resolveQueue(queue)))),queue&&queue.d<0&&(queue.d=0)},__webpack_require__.d=(exports,definition)=>{for(var key in definition)__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)&&Object.defineProperty(exports,key,{enumerable:!0,get:definition[key]})},__webpack_require__.o=(obj,prop)=>Object.prototype.hasOwnProperty.call(obj,prop);__webpack_require__(634)})();