this.WS=this.WS||{},this.WS.SDKMultiActionHack=function(){"use strict";function t(){return"unsafeWindow"in window?window.unsafeWindow:window}class n{constructor(t,n,i){this._target=t,this._methodName=n,this._interceptor=i,this._isEnabled=!1,this.managedInterceptor=(...t)=>this._isEnabled?this._interceptor(((...t)=>this.invokeOriginal(...t)),...t):this.invokeOriginal(...t),this.initialize()}initialize(){this._originalMethod=this._target[this._methodName],this._target[this._methodName]=this.managedInterceptor}invokeOriginal(...t){return this._originalMethod.apply(this._target,t)}enable(){this._isEnabled=!0}disable(){this._isEnabled=!1}}function i(n){const i=function(){try{return t().require("Waze/Action/MultiAction")}catch(t){return null}}();if(!i)throw new Error("Unable to retrieve MultiAction");return new i(n)}class a{constructor(t){this._actionsInTransaction=[],this._hasActiveTransaction=!1,this._interceptor=new n(t,"add",((i,a)=>{if(!this.isTransactionOpen)return i(a);if(a.undoSupported()){let i=!1;new n(a,"doAction",((t,...n)=>!!i||(i=t(...n)))).enable(),new n(a,"undoAction",((t,...n)=>{const a=t(...n);return i=!1,a})).enable(),a.doAction(t.dataModel)}return this._actionsInTransaction.push(a),!0})),this._interceptor.enable()}closeTransaction(){return this._hasActiveTransaction=!1,this.getTransactionActions()}openTransaction(){this._actionsInTransaction=[],this._hasActiveTransaction=!0}get isTransactionOpen(){return this._hasActiveTransaction}beginTransaction(){this.openTransaction()}getTransactionActions(){return this._actionsInTransaction}commitTransaction(t){const n=this.closeTransaction(),a=i(n);a?(t&&(a._description=t),this._interceptor.invokeOriginal(a)):n.forEach((t=>this._interceptor.invokeOriginal(t)))}}const e=t();let s;return e.SDK_INITIALIZED.then((()=>{s=new a(e.W.model.actionManager)})),{beginTransaction:()=>s.beginTransaction(),commitTransaction:t=>s.commitTransaction(t),groupActions(t,n){s.beginTransaction();try{t()}catch(t){throw t}finally{s.commitTransaction(n)}}}}();