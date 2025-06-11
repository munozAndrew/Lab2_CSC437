(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();var K,ze;class mt extends Error{}mt.prototype.name="InvalidTokenError";function es(o){return decodeURIComponent(atob(o).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function rs(o){let t=o.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return es(t)}catch{return atob(t)}}function hr(o,t){if(typeof o!="string")throw new mt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=o.split(".")[e];if(typeof s!="string")throw new mt(`Invalid token specified: missing part #${e+1}`);let r;try{r=rs(s)}catch(i){throw new mt(`Invalid token specified: invalid base64 for part #${e+1} (${i.message})`)}try{return JSON.parse(r)}catch(i){throw new mt(`Invalid token specified: invalid json for part #${e+1} (${i.message})`)}}const ss="mu:context",ne=`${ss}:change`;class os{constructor(t,e){this._proxy=is(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class pe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new os(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ne,t),t}detach(t){this.removeEventListener(ne,t)}}function is(o,t){return new Proxy(o,{get:(s,r,i)=>{if(r==="then")return;const n=Reflect.get(s,r,i);return console.log(`Context['${r}'] => `,n),n},set:(s,r,i,n)=>{const l=o[r];console.log(`Context['${r.toString()}'] <= `,i);const a=Reflect.set(s,r,i,n);if(a){let u=new CustomEvent(ne,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:r,oldValue:l,value:i}),t.dispatchEvent(u)}else console.log(`Context['${r}] was not set to ${i}`);return a}})}function ns(o,t){const e=dr(t,o);return new Promise((s,r)=>{if(e){const i=e.localName;customElements.whenDefined(i).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function dr(o,t){const e=`[provides="${o}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return dr(o,r.host)}class as extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ur(o="mu:message"){return(t,...e)=>t.dispatchEvent(new as(e,o))}class me{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ls(o){return t=>({...t,...o})}const ae="mu:auth:jwt",pr=class mr extends me{constructor(t,e){super((s,r)=>this.update(s,r),t,mr.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(hs(s)),te(r);case"auth/signout":return e(ds()),te(this._redirectForLogin);case"auth/redirect":return te(this._redirectForLogin,{next:window.location.href});default:const i=t[0];throw new Error(`Unhandled Auth message "${i}"`)}}};pr.EVENT_TYPE="auth:message";let fr=pr;const gr=ur(fr.EVENT_TYPE);function te(o,t={}){if(!o)return;const e=window.location.href,s=new URL(o,e);return Object.entries(t).forEach(([r,i])=>s.searchParams.set(r,i)),()=>{console.log("Redirecting to ",o),window.location.assign(s)}}class cs extends pe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=st.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new fr(this.context,this.redirect).attach(this)}}class rt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ae),t}}class st extends rt{constructor(t){super();const e=hr(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new st(t);return localStorage.setItem(ae,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ae);return t?st.authenticate(t):new rt}}function hs(o){return ls({user:st.authenticate(o),token:o})}function ds(){return o=>{const t=o.user;return{user:t&&t.authenticated?rt.deauthenticate(t):t,token:""}}}function us(o){return o.authenticated?{Authorization:`Bearer ${o.token||"NO_TOKEN"}`}:{}}function ps(o){return o.authenticated?hr(o.token||""):{}}const tt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:st,Provider:cs,User:rt,dispatch:gr,headers:us,payload:ps},Symbol.toStringTag,{value:"Module"}));function le(o,t,e){const s=o.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${o.type}:`,r),s.dispatchEvent(r),o.stopPropagation()}function Ne(o,t="*"){return o.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}function br(o,...t){const e=o.map((r,i)=>i?[t[i-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ms=new DOMParser;function B(o,...t){const e=t.map(l),s=o.map((a,u)=>{if(u===0)return[a];const m=e[u-1];return m instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[m,a]}).flat().join(""),r=ms.parseFromString(s,"text/html"),i=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...i),e.forEach((a,u)=>{if(a instanceof Node){const m=n.querySelector(`ins#mu-html-${u}`);if(m){const d=m.parentNode;d==null||d.replaceChild(a,m)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),n;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return je(a);case"bigint":case"boolean":case"number":case"symbol":return je(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const m=new DocumentFragment,d=a.map(l);return m.replaceChildren(...d),m}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function je(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function qt(o,t={mode:"open"}){const e=o.attachShadow(t),s={template:r,styles:i};return s;function r(n){const l=n.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function i(...n){e.adoptedStyleSheets=n}}let fs=(K=class extends HTMLElement{constructor(){super(),this._state={},qt(this).template(K.template).styles(K.styles),this.addEventListener("change",o=>{const t=o.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",o=>{o.preventDefault(),le(o,"mu-form:submit",this._state)})}set init(o){this._state=o||{},gs(this._state,this)}get form(){var o;return(o=this.shadowRoot)==null?void 0:o.querySelector("form")}},K.template=B`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,K.styles=br`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,K);function gs(o,t){const e=Object.entries(o);for(const[s,r]of e){const i=t.querySelector(`[name="${s}"]`);if(i){const n=i;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;case"date":n.value=r.toISOString().substr(0,10);break;default:n.value=r;break}}}return o}const fe=Object.freeze(Object.defineProperty({__proto__:null,Element:fs},Symbol.toStringTag,{value:"Module"})),yr=class vr extends me{constructor(t){super((e,s)=>this.update(e,s),t,vr.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(ys(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(vs(s,r));break}}}};yr.EVENT_TYPE="history:message";let ge=yr;class Me extends pe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=bs(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),be(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ge(this.context).attach(this)}}function bs(o){const t=o.currentTarget,e=s=>s.tagName=="A"&&s.href;if(o.button===0)if(o.composed){const r=o.composedPath().find(e);return r||void 0}else{for(let s=o.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ys(o,t={}){return history.pushState(t,"",o),()=>({location:document.location,state:history.state})}function vs(o,t={}){return history.replaceState(t,"",o),()=>({location:document.location,state:history.state})}const be=ur(ge.EVENT_TYPE),_r=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Me,Provider:Me,Service:ge,dispatch:be},Symbol.toStringTag,{value:"Module"}));class yt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Le(this._provider,t);this._effects.push(r),e(r)}else ns(this._target,this._contextLabel).then(r=>{const i=new Le(r,t);this._provider=r,this._effects.push(i),r.attach(n=>this._handleChange(n)),e(i)}).catch(r=>console.log(`Observer ${this._contextLabel}: ${r}`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Le{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const $r=class kr extends HTMLElement{constructor(){super(),this._state={},this._user=new rt,this._authObserver=new yt(this,"blazing:auth"),qt(this).template(kr.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;_s(r,this._state,e,this.authorization).then(i=>ht(i,this)).then(i=>{const n=`mu-rest-form:${s}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:i,url:r}});this.dispatchEvent(l)}).catch(i=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:i,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ht(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ie(this.src,this.authorization).then(e=>{this._state=e,ht(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ie(this.src,this.authorization).then(r=>{this._state=r,ht(r,this)});break;case"new":s&&(this._state={},ht({},this));break}}};$r.observedAttributes=["src","new","action"];$r.template=B`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Ie(o,t){return fetch(o,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${o}:`,e))}function ht(o,t){const e=Object.entries(o);for(const[s,r]of e){const i=t.querySelector(`[name="${s}"]`);if(i){const n=i;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;default:n.value=r;break}}}return o}function _s(o,t,e="PUT",s={}){return fetch(o,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const wr=class xr extends me{constructor(t,e){super(e,t,xr.EVENT_TYPE,!1)}};wr.EVENT_TYPE="mu:message";let Er=wr;class $s extends pe{constructor(t,e,s){super(e),this._user=new rt,this._updateFn=t,this._authObserver=new yt(this,s)}connectedCallback(){const t=new Er(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const ks=Object.freeze(Object.defineProperty({__proto__:null,Provider:$s,Service:Er},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jt=globalThis,ye=jt.ShadowRoot&&(jt.ShadyCSS===void 0||jt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ve=Symbol(),He=new WeakMap;let Ar=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ye&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&He.set(e,t))}return t}toString(){return this.cssText}};const ws=o=>new Ar(typeof o=="string"?o:o+"",void 0,ve),xs=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+o[i+1],o[0]);return new Ar(e,o,ve)},Es=(o,t)=>{if(ye)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=jt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,o.appendChild(s)}},De=ye?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ws(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:As,defineProperty:Ss,getOwnPropertyDescriptor:Ps,getOwnPropertyNames:Os,getOwnPropertySymbols:Cs,getPrototypeOf:Ts}=Object,ot=globalThis,Be=ot.trustedTypes,Rs=Be?Be.emptyScript:"",Fe=ot.reactiveElementPolyfillSupport,ft=(o,t)=>o,Lt={toAttribute(o,t){switch(t){case Boolean:o=o?Rs:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},_e=(o,t)=>!As(o,t),Ve={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:_e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ot.litPropertyMetadata??(ot.litPropertyMetadata=new WeakMap);let Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ve){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Ss(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:i}=Ps(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return r==null?void 0:r.call(this)},set(n){const l=r==null?void 0:r.call(this);i.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ve}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=Ts(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...Os(e),...Cs(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(De(r))}else t!==void 0&&e.push(De(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Es(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Lt).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=r.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Lt;this._$Em=i,this[i]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??_e)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[i,n]of r)n.wrapped!==!0||this._$AL.has(i)||this[i]===void 0||this.P(i,this[i],n)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var i;return(i=r.hostUpdate)==null?void 0:i.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[ft("elementProperties")]=new Map,Q[ft("finalized")]=new Map,Fe==null||Fe({ReactiveElement:Q}),(ot.reactiveElementVersions??(ot.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=globalThis,Ht=It.trustedTypes,qe=Ht?Ht.createPolicy("lit-html",{createHTML:o=>o}):void 0,Sr="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Pr="?"+C,Us=`<${Pr}>`,V=document,vt=()=>V.createComment(""),_t=o=>o===null||typeof o!="object"&&typeof o!="function",$e=Array.isArray,zs=o=>$e(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",ee=`[ 	
\f\r]`,dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ye=/-->/g,We=/>/g,L=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Je=/"/g,Or=/^(?:script|style|textarea|title)$/i,Ns=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),ut=Ns(1),it=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ke=new WeakMap,H=V.createTreeWalker(V,129);function Cr(o,t){if(!$e(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const js=(o,t)=>{const e=o.length-1,s=[];let r,i=t===2?"<svg>":t===3?"<math>":"",n=dt;for(let l=0;l<e;l++){const a=o[l];let u,m,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,m=n.exec(a),m!==null);)c=n.lastIndex,n===dt?m[1]==="!--"?n=Ye:m[1]!==void 0?n=We:m[2]!==void 0?(Or.test(m[2])&&(r=RegExp("</"+m[2],"g")),n=L):m[3]!==void 0&&(n=L):n===L?m[0]===">"?(n=r??dt,d=-1):m[1]===void 0?d=-2:(d=n.lastIndex-m[2].length,u=m[1],n=m[3]===void 0?L:m[3]==='"'?Je:Ge):n===Je||n===Ge?n=L:n===Ye||n===We?n=dt:(n=L,r=void 0);const h=n===L&&o[l+1].startsWith("/>")?" ":"";i+=n===dt?a+Us:d>=0?(s.push(u),a.slice(0,d)+Sr+a.slice(d)+C+h):a+C+(d===-2?l:h)}return[Cr(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ce=class Tr{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,n=0;const l=t.length-1,a=this.parts,[u,m]=js(t,e);if(this.el=Tr.createElement(u,s),H.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=H.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Sr)){const c=m[n++],h=r.getAttribute(d).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:i,name:p[2],strings:h,ctor:p[1]==="."?Ls:p[1]==="?"?Is:p[1]==="@"?Hs:Yt}),r.removeAttribute(d)}else d.startsWith(C)&&(a.push({type:6,index:i}),r.removeAttribute(d));if(Or.test(r.tagName)){const d=r.textContent.split(C),c=d.length-1;if(c>0){r.textContent=Ht?Ht.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],vt()),H.nextNode(),a.push({type:2,index:++i});r.append(d[c],vt())}}}else if(r.nodeType===8)if(r.data===Pr)a.push({type:2,index:i});else{let d=-1;for(;(d=r.data.indexOf(C,d+1))!==-1;)a.push({type:7,index:i}),d+=C.length-1}i++}}static createElement(t,e){const s=V.createElement("template");return s.innerHTML=t,s}};function nt(o,t,e=o,s){var r,i;if(t===it)return t;let n=s!==void 0?(r=e.o)==null?void 0:r[s]:e.l;const l=_t(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==l&&((i=n==null?void 0:n._$AO)==null||i.call(n,!1),l===void 0?n=void 0:(n=new l(o),n._$AT(o,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=n:e.l=n),n!==void 0&&(t=nt(o,n._$AS(o,t.values),n,s)),t}class Ms{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??V).importNode(e,!0);H.currentNode=r;let i=H.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new Pt(i,i.nextSibling,this,t):a.type===1?u=new a.ctor(i,a.name,a.strings,this,t):a.type===6&&(u=new Ds(i,this,t)),this._$AV.push(u),a=s[++l]}n!==(a==null?void 0:a.index)&&(i=H.nextNode(),n++)}return H.currentNode=V,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Pt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this.v=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),_t(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):zs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ce.createElement(Cr(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===i)this._$AH.p(s);else{const n=new Ms(i,this),l=n.u(this.options);n.p(s),this.T(l),this._$AH=n}}_$AC(t){let e=Ke.get(t.strings);return e===void 0&&Ke.set(t.strings,e=new ce(t)),e}k(t){$e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const i of t)r===e.length?e.push(s=new Pt(this.O(vt()),this.O(vt()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Yt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const i=this.strings;let n=!1;if(i===void 0)t=nt(this,t,e,0),n=!_t(t)||t!==this._$AH&&t!==it,n&&(this._$AH=t);else{const l=t;let a,u;for(t=i[0],a=0;a<i.length-1;a++)u=nt(this,l[s+a],e,a),u===it&&(u=this._$AH[a]),n||(n=!_t(u)||u!==this._$AH[a]),u===_?t=_:t!==_&&(t+=(u??"")+i[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ls extends Yt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Is extends Yt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Hs extends Yt{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??_)===it)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ds{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}}const Ze=It.litHtmlPolyfillSupport;Ze==null||Ze(ce,Pt),(It.litHtmlVersions??(It.litHtmlVersions=[])).push("3.2.0");const Bs=(o,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const i=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Pt(t.insertBefore(vt(),i),i,void 0,e??{})}return r._$AI(o),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let et=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Bs(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return it}};et._$litElement$=!0,et.finalized=!0,(ze=globalThis.litElementHydrateSupport)==null||ze.call(globalThis,{LitElement:et});const Qe=globalThis.litElementPolyfillSupport;Qe==null||Qe({LitElement:et});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fs={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:_e},Vs=(o=Fs,t,e)=>{const{kind:s,metadata:r}=e;let i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),i.set(e.name,o),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,o)},init(l){return l!==void 0&&this.P(n,void 0,o),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,o)}}throw Error("Unsupported decorator location: "+s)};function Rr(o){return(t,e)=>typeof e=="object"?Vs(o,t,e):((s,r,i)=>{const n=r.hasOwnProperty(i);return r.constructor.createProperty(i,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(o,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ur(o){return Rr({...o,state:!0,attribute:!1})}function qs(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}function Ys(o){throw new Error('Could not dynamically require "'+o+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var zr={};(function(o){var t=function(){var e=function(d,c,h,p){for(h=h||{},p=d.length;p--;h[d[p]]=c);return h},s=[1,9],r=[1,10],i=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,b,g,y,Jt){var x=y.length-1;switch(g){case 1:return new b.Root({},[y[x-1]]);case 2:return new b.Root({},[new b.Literal({value:""})]);case 3:this.$=new b.Concat({},[y[x-1],y[x]]);break;case 4:case 5:this.$=y[x];break;case 6:this.$=new b.Literal({value:y[x]});break;case 7:this.$=new b.Splat({name:y[x]});break;case 8:this.$=new b.Param({name:y[x]});break;case 9:this.$=new b.Optional({},[y[x-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:i,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:i,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:i,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:i,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(b,g){this.message=b,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],b=[null],g=[],y=this.table,Jt="",x=0,Te=0,Zr=2,Re=1,Qr=g.slice.call(arguments,1),v=Object.create(this.lexer),j={yy:{}};for(var Kt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Kt)&&(j.yy[Kt]=this.yy[Kt]);v.setInput(c,j.yy),j.yy.lexer=v,j.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var Zt=v.yylloc;g.push(Zt);var Xr=v.options&&v.options.ranges;typeof j.yy.parseError=="function"?this.parseError=j.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ts=function(){var J;return J=v.lex()||Re,typeof J!="number"&&(J=h.symbols_[J]||J),J},w,M,E,Qt,G={},zt,P,Ue,Nt;;){if(M=p[p.length-1],this.defaultActions[M]?E=this.defaultActions[M]:((w===null||typeof w>"u")&&(w=ts()),E=y[M]&&y[M][w]),typeof E>"u"||!E.length||!E[0]){var Xt="";Nt=[];for(zt in y[M])this.terminals_[zt]&&zt>Zr&&Nt.push("'"+this.terminals_[zt]+"'");v.showPosition?Xt="Parse error on line "+(x+1)+`:
`+v.showPosition()+`
Expecting `+Nt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Xt="Parse error on line "+(x+1)+": Unexpected "+(w==Re?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Xt,{text:v.match,token:this.terminals_[w]||w,line:v.yylineno,loc:Zt,expected:Nt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+w);switch(E[0]){case 1:p.push(w),b.push(v.yytext),g.push(v.yylloc),p.push(E[1]),w=null,Te=v.yyleng,Jt=v.yytext,x=v.yylineno,Zt=v.yylloc;break;case 2:if(P=this.productions_[E[1]][1],G.$=b[b.length-P],G._$={first_line:g[g.length-(P||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(P||1)].first_column,last_column:g[g.length-1].last_column},Xr&&(G._$.range=[g[g.length-(P||1)].range[0],g[g.length-1].range[1]]),Qt=this.performAction.apply(G,[Jt,Te,x,j.yy,E[1],b,g].concat(Qr)),typeof Qt<"u")return Qt;P&&(p=p.slice(0,-1*P*2),b=b.slice(0,-1*P),g=g.slice(0,-1*P)),p.push(this.productions_[E[1]][0]),b.push(G.$),g.push(G._$),Ue=y[p[p.length-2]][p[p.length-1]],p.push(Ue);break;case 3:return!0}}return!0}},u=function(){var d={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var b=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===b.length?this.yylloc.first_column:0)+b[b.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,b,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),b=c[0].match(/(?:\r\n?|\n).*/g),b&&(this.yylineno+=b.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:b?b[b.length-1].length-b[b.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,b;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,b=y,this.options.backtrack_lexer){if(c=this.test_match(p,g[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[b]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,b,g){switch(b){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=u;function m(){this.yy={}}return m.prototype=a,a.Parser=m,new m}();typeof Ys<"u"&&(o.parser=t,o.Parser=t.Parser,o.parse=function(){return t.parse.apply(t,arguments)})})(zr);function Z(o){return function(t,e){return{displayName:o,props:t,children:e||[]}}}var Nr={Root:Z("Root"),Concat:Z("Concat"),Literal:Z("Literal"),Splat:Z("Splat"),Param:Z("Param"),Optional:Z("Optional")},jr=zr.parser;jr.yy=Nr;var Ws=jr,Gs=Object.keys(Nr);function Js(o){return Gs.forEach(function(t){if(typeof o[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:o}}var Mr=Js,Ks=Mr,Zs=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Lr(o){this.captures=o.captures,this.re=o.re}Lr.prototype.match=function(o){var t=this.re.exec(o),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Qs=Ks({Concat:function(o){return o.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(o){return{re:o.props.value.replace(Zs,"\\$&"),captures:[]}},Splat:function(o){return{re:"([^?]*?)",captures:[o.props.name]}},Param:function(o){return{re:"([^\\/\\?]+)",captures:[o.props.name]}},Optional:function(o){var t=this.visit(o.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(o){var t=this.visit(o.children[0]);return new Lr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Xs=Qs,to=Mr,eo=to({Concat:function(o,t){var e=o.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(o){return decodeURI(o.props.value)},Splat:function(o,t){return t[o.props.name]?t[o.props.name]:!1},Param:function(o,t){return t[o.props.name]?t[o.props.name]:!1},Optional:function(o,t){var e=this.visit(o.children[0],t);return e||""},Root:function(o,t){t=t||{};var e=this.visit(o.children[0],t);return e?encodeURI(e):!1}}),ro=eo,so=Ws,oo=Xs,io=ro;Ot.prototype=Object.create(null);Ot.prototype.match=function(o){var t=oo.visit(this.ast),e=t.match(o);return e||!1};Ot.prototype.reverse=function(o){return io.visit(this.ast,o)};function Ot(o){var t;if(this?t=this:t=Object.create(Ot.prototype),typeof o>"u")throw new Error("A route spec is required");return t.spec=o,t.ast=so.parse(o),t}var no=Ot,ao=no,lo=ao;const co=qs(lo);var ho=Object.defineProperty,Ir=(o,t,e,s)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&ho(t,e,r),r};const Hr=class extends et{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ut` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new co(r.path)})),this._historyObserver=new yt(this,e),this._authObserver=new yt(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ut` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(gr(this,"auth/redirect"),ut` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ut` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ut` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),i=s+e;for(const n of this._cases){const l=n.route.match(i);if(l)return{...n,path:s,params:l,query:r}}}redirect(t){be(this,"history/redirect",{href:t})}};Hr.styles=xs`
    :host,
    main {
      display: contents;
    }
  `;let Dt=Hr;Ir([Ur()],Dt.prototype,"_user");Ir([Ur()],Dt.prototype,"_match");const uo=Object.freeze(Object.defineProperty({__proto__:null,Element:Dt,Switch:Dt},Symbol.toStringTag,{value:"Module"})),po=class Dr extends HTMLElement{constructor(){if(super(),qt(this).template(Dr.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};po.template=B`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Br=class he extends HTMLElement{constructor(){super(),this._array=[],qt(this).template(he.template).styles(he.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Fr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,i=e.closest("label");if(i){const n=Array.from(this.children).indexOf(i);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Ne(t,"button.add")?le(t,"input-array:add"):Ne(t,"button.remove")&&le(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],mo(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Br.template=B`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Br.styles=br`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function mo(o,t){t.replaceChildren(),o.forEach((e,s)=>t.append(Fr(e)))}function Fr(o,t){const e=o===void 0?B`<input />`:B`<input value="${o}" />`;return B`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function fo(o){return Object.entries(o).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var go=Object.defineProperty,bo=Object.getOwnPropertyDescriptor,yo=(o,t,e,s)=>{for(var r=bo(t,e),i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&go(t,e,r),r};class Ct extends et{constructor(t){super(),this._pending=[],this._observer=new yt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}yo([Rr()],Ct.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,ke=Mt.ShadowRoot&&(Mt.ShadyCSS===void 0||Mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,we=Symbol(),Xe=new WeakMap;let Vr=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==we)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ke&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Xe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Xe.set(e,t))}return t}toString(){return this.cssText}};const vo=o=>new Vr(typeof o=="string"?o:o+"",void 0,we),S=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((s,r,i)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+o[i+1],o[0]);return new Vr(e,o,we)},_o=(o,t)=>{if(ke)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Mt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,o.appendChild(s)}},tr=ke?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return vo(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$o,defineProperty:ko,getOwnPropertyDescriptor:wo,getOwnPropertyNames:xo,getOwnPropertySymbols:Eo,getPrototypeOf:Ao}=Object,R=globalThis,er=R.trustedTypes,So=er?er.emptyScript:"",re=R.reactiveElementPolyfillSupport,gt=(o,t)=>o,Bt={toAttribute(o,t){switch(t){case Boolean:o=o?So:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},xe=(o,t)=>!$o(o,t),rr={attribute:!0,type:String,converter:Bt,reflect:!1,useDefault:!1,hasChanged:xe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),R.litPropertyMetadata??(R.litPropertyMetadata=new WeakMap);let X=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=rr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&ko(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:i}=wo(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r==null?void 0:r.call(this);i==null||i.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??rr}static _$Ei(){if(this.hasOwnProperty(gt("elementProperties")))return;const t=Ao(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(gt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(gt("properties"))){const e=this.properties,s=[...xo(e),...Eo(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(tr(r))}else t!==void 0&&e.push(tr(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _o(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var i;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:Bt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var i,n;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((i=l.converter)==null?void 0:i.fromAttribute)!==void 0?l.converter:Bt;this._$Em=r,this[r]=a.fromAttribute(e,l.type)??((n=this._$Ej)==null?void 0:n.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const i=this.constructor,n=this[t];if(s??(s=i.getPropertyOptions(t)),!((s.hasChanged??xe)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:i},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[i,n]of r){const{wrapped:l}=n,a=this[i];l!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,n,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var i;return(i=r.hostUpdate)==null?void 0:i.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[gt("elementProperties")]=new Map,X[gt("finalized")]=new Map,re==null||re({ReactiveElement:X}),(R.reactiveElementVersions??(R.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,Ft=bt.trustedTypes,sr=Ft?Ft.createPolicy("lit-html",{createHTML:o=>o}):void 0,qr="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Yr="?"+T,Po=`<${Yr}>`,q=document,$t=()=>q.createComment(""),kt=o=>o===null||typeof o!="object"&&typeof o!="function",Ee=Array.isArray,Oo=o=>Ee(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",se=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,or=/-->/g,ir=/>/g,I=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),nr=/'/g,ar=/"/g,Wr=/^(?:script|style|textarea|title)$/i,Co=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),f=Co(1),at=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),lr=new WeakMap,D=q.createTreeWalker(q,129);function Gr(o,t){if(!Ee(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return sr!==void 0?sr.createHTML(t):t}const To=(o,t)=>{const e=o.length-1,s=[];let r,i=t===2?"<svg>":t===3?"<math>":"",n=pt;for(let l=0;l<e;l++){const a=o[l];let u,m,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,m=n.exec(a),m!==null);)c=n.lastIndex,n===pt?m[1]==="!--"?n=or:m[1]!==void 0?n=ir:m[2]!==void 0?(Wr.test(m[2])&&(r=RegExp("</"+m[2],"g")),n=I):m[3]!==void 0&&(n=I):n===I?m[0]===">"?(n=r??pt,d=-1):m[1]===void 0?d=-2:(d=n.lastIndex-m[2].length,u=m[1],n=m[3]===void 0?I:m[3]==='"'?ar:nr):n===ar||n===nr?n=I:n===or||n===ir?n=pt:(n=I,r=void 0);const h=n===I&&o[l+1].startsWith("/>")?" ":"";i+=n===pt?a+Po:d>=0?(s.push(u),a.slice(0,d)+qr+a.slice(d)+T+h):a+T+(d===-2?l:h)}return[Gr(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class wt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,n=0;const l=t.length-1,a=this.parts,[u,m]=To(t,e);if(this.el=wt.createElement(u,s),D.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=D.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(qr)){const c=m[n++],h=r.getAttribute(d).split(T),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:i,name:p[2],strings:h,ctor:p[1]==="."?Uo:p[1]==="?"?zo:p[1]==="@"?No:Wt}),r.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:i}),r.removeAttribute(d));if(Wr.test(r.tagName)){const d=r.textContent.split(T),c=d.length-1;if(c>0){r.textContent=Ft?Ft.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],$t()),D.nextNode(),a.push({type:2,index:++i});r.append(d[c],$t())}}}else if(r.nodeType===8)if(r.data===Yr)a.push({type:2,index:i});else{let d=-1;for(;(d=r.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:i}),d+=T.length-1}i++}}static createElement(t,e){const s=q.createElement("template");return s.innerHTML=t,s}}function lt(o,t,e=o,s){var n,l;if(t===at)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const i=kt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==i&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),i===void 0?r=void 0:(r=new i(o),r._$AT(o,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=lt(o,r._$AS(o,t.values),r,s)),t}class Ro{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??q).importNode(e,!0);D.currentNode=r;let i=D.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new Tt(i,i.nextSibling,this,t):a.type===1?u=new a.ctor(i,a.name,a.strings,this,t):a.type===6&&(u=new jo(i,this,t)),this._$AV.push(u),a=s[++l]}n!==(a==null?void 0:a.index)&&(i=D.nextNode(),n++)}return D.currentNode=q,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Tt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=lt(this,t,e),kt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==at&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Oo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&kt(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){var i;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=wt.createElement(Gr(s.h,s.h[0]),this.options)),s);if(((i=this._$AH)==null?void 0:i._$AD)===r)this._$AH.p(e);else{const n=new Ro(r,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=lr.get(t.strings);return e===void 0&&lr.set(t.strings,e=new wt(t)),e}k(t){Ee(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const i of t)r===e.length?e.push(s=new Tt(this.O($t()),this.O($t()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Wt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const i=this.strings;let n=!1;if(i===void 0)t=lt(this,t,e,0),n=!kt(t)||t!==this._$AH&&t!==at,n&&(this._$AH=t);else{const l=t;let a,u;for(t=i[0],a=0;a<i.length-1;a++)u=lt(this,l[s+a],e,a),u===at&&(u=this._$AH[a]),n||(n=!kt(u)||u!==this._$AH[a]),u===$?t=$:t!==$&&(t+=(u??"")+i[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Uo extends Wt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class zo extends Wt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class No extends Wt{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=lt(this,t,e,0)??$)===at)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class jo{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){lt(this,t)}}const oe=bt.litHtmlPolyfillSupport;oe==null||oe(wt,Tt),(bt.litHtmlVersions??(bt.litHtmlVersions=[])).push("3.3.0");const Mo=(o,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const i=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Tt(t.insertBefore($t(),i),i,void 0,e??{})}return r._$AI(o),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=globalThis;class A extends X{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mo(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return at}}var cr;A._$litElement$=!0,A.finalized=!0,(cr=F.litElementHydrateSupport)==null||cr.call(F,{LitElement:A});const ie=F.litElementPolyfillSupport;ie==null||ie({LitElement:A});(F.litElementVersions??(F.litElementVersions=[])).push("4.2.0");const Lo={};function Io(){try{const o=tt.AuthenticatedUser.authenticateFromLocalStorage();return tt.headers(o)}catch{return{}}}function O(o,t={}){const e={...Io(),...t.headers};return fetch(o,{...t,headers:e})}function Ho(o,t,e){switch(o[0]){case"bookmarks/load":O("/api/bookmarks",{headers:tt.headers(e)}).then(r=>r.json()).then(r=>t(i=>({...i,bookmarks:r}))).catch(r=>console.error("load bookmarks:",r));break;case"groups/load":O("/api/groups",{headers:tt.headers(e)}).then(r=>r.json()).then(r=>t(i=>({...i,groups:r}))).catch(r=>console.error("load groups:",r));break;case"bookmark/save":O(`/api/bookmarks/${o[1].id}`,{method:"PUT",headers:{"Content-Type":"application/json",...tt.headers(e)},body:JSON.stringify(o[1].bookmark)}).then(r=>r.ok?r.json():Promise.reject(new Error(`HTTP ${r.status}`))).then(r=>t(i=>{var n;return{...i,bookmarks:(n=i.bookmarks)==null?void 0:n.map(l=>l.id===r.id?r:l)}})).then(()=>{var r,i;return(i=(r=o[1]).onSuccess)==null?void 0:i.call(r)}).catch(r=>{var i,n;return(n=(i=o[1]).onFailure)==null?void 0:n.call(i,r)});break;default:const s=o[0];throw new Error(`Unhandled message "${s}"`)}}const Pe=class Pe extends A{render(){return f`
      <header>
        <h1 style="display:inline">TabSaver</h1>
        <nav style="display:inline">
          <a href="/app">Home</a>
          <a href="/app/about">About</a>
          <a href="/app/bookmarks">Bookmarks</a>
          <a href="/app/groups">Groups</a>
          <a href="/app/login">Login</a>

        </nav>
      </header>`}};Pe.styles=S`
  header {
    padding: 1.5rem 2rem;
    background: linear-gradient(135deg, rgb(30, 41, 59), rgb(51, 65, 85));
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(45deg, rgb(96, 165, 250), rgb(147, 197, 253));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  nav {
    display: flex;
    gap: 0.5rem;
  }

  a {
    color: rgb(203, 213, 225);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    font-size: 0.95rem;
  }

  a:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateY(-1px);
  }

  a:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
      padding: 1rem;
    }

    nav {
      justify-content: center;
      flex-wrap: wrap;
    }

    h1 {
      font-size: 1.5rem;
    }
  }
`;let de=Pe;const Oe=class Oe extends A{render(){return f`
      <section>
        <h2>Welcome to TabSaver!</h2>
        <p>Your bookmark management app is ready!</p>
      </section>
    `}};Oe.styles=S`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    section {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    h2 {
      color: rgb(59, 130, 246);
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    p {
      color: rgb(75, 85, 99);
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      section {
        padding: 2rem 1rem;
      }

      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }
    }
  `;let ue=Oe;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Do={attribute:!0,type:String,converter:Bt,reflect:!1,hasChanged:xe},Bo=(o=Do,t,e)=>{const{kind:s,metadata:r}=e;let i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),s==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(e.name,o),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,o)},init(l){return l!==void 0&&this.C(n,void 0,o,l),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,o)}}throw Error("Unsupported decorator location: "+s)};function Rt(o){return(t,e)=>typeof e=="object"?Bo(o,t,e):((s,r,i)=>{const n=r.hasOwnProperty(i);return r.constructor.createProperty(i,s),n?Object.getOwnPropertyDescriptor(r,i):void 0})(o,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function k(o){return Rt({...o,state:!0,attribute:!1})}var Fo=Object.defineProperty,Vo=Object.getOwnPropertyDescriptor,Ae=(o,t,e,s)=>{for(var r=s>1?void 0:s?Vo(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Fo(t,e,r),r};let xt=class extends A{constructor(){super(...arguments),this.data={name:"",url:"",description:""},this.handleSubmit=o=>{o.preventDefault();const t={...this.data,id:crypto.randomUUID()};O("/api/bookmarks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(e=>{if(e.status!==201)throw new Error(e.statusText);return e.json()}).then(e=>{this.dispatchEvent(new CustomEvent("bookmark:created",{bubbles:!0,composed:!0,detail:e})),this.data={name:"",url:"",description:""},this.error=void 0}).catch(e=>this.error=e.message)}}handleChange(o){const t=o.target;this.data={...this.data,[t.name]:t.value}}render(){const{name:o,url:t,description:e}=this.data,s=!(o&&t);return f`
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <input placeholder="Bookmark Name" name="name" .value=${o} required />
        <input placeholder="https://example.com" name="url" .value=${t} required type="url" />
        <textarea placeholder="Description (optional)"
                  name="description"
                  rows="3">${e}</textarea>
        <button type="submit" ?disabled=${s}>Add Bookmark</button>
        ${this.error?f`<p class="error">${this.error}</p>`:null}
      </form>
    `}};xt.styles=S`
    :host {
      display: block;
    }

    form {
      display: grid;
      gap: 1.5rem;
      max-width: 500px;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    input, textarea {
      padding: 0.75rem;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: white;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: rgb(59, 130, 246);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input::placeholder, textarea::placeholder {
      color: rgb(156, 163, 175);
    }

    textarea {
      min-height: 80px;
      resize: vertical;
      font-family: inherit;
    }

    button {
      padding: 0.75rem 1.5rem;
      background: rgb(59, 130, 246);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      font-family: inherit;
    }

    button:hover:not(:disabled) {
      background: rgb(37, 99, 235);
      transform: translateY(-1px);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      background: rgb(156, 163, 175);
      cursor: not-allowed;
      transform: none;
    }

    .error {
      background: rgb(254, 242, 242);
      color: rgb(185, 28, 28);
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid rgb(252, 165, 165);
      font-size: 0.9rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      form {
        padding: 1.5rem;
        max-width: 100%;
      }

      input, textarea, button {
        font-size: 16px;
      }
    }
  `;Ae([k()],xt.prototype,"data",2);Ae([k()],xt.prototype,"error",2);xt=Ae([N("bookmark-form")],xt);var qo=Object.defineProperty,Yo=Object.getOwnPropertyDescriptor,Jr=(o,t,e,s)=>{for(var r=s>1?void 0:s?Yo(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&qo(t,e,r),r};let Et=class extends Ct{constructor(){super("tabsaver:model")}get list(){return this.model.bookmarks??[]}connectedCallback(){super.connectedCallback(),this.model.bookmarks||this.dispatchMessage(["bookmarks/load",{}]),this.addEventListener("bookmark:created",()=>this.dispatchMessage(["bookmarks/load",{}]))}render(){return f`
      <h2>Your Bookmarks</h2>

      ${this.list.length?f`
            <ul>
              ${this.list.map(o=>f`
                <li>
                  <a href=${o.url} target="_blank">${o.name}</a>
                  <a class="edit" href="/app/bookmarks/${o.id}/edit"
                     title="Edit bookmark">✎ Edit</a>
                  ${o.description?f`<small>${o.description}</small>`:null}
                </li>`)}
            </ul>`:f`<p>Loading your bookmarks...</p>`}

      <h3>Add New Bookmark</h3>
      <bookmark-form></bookmark-form>
    `}};Et.styles=S`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2, h3 {
      color: rgb(59, 130, 246);
      font-weight: 700;
      margin-bottom: 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h2 {
      font-size: 2.25rem;
      margin-top: 0;
    }

    h3 {
      font-size: 1.5rem;
      margin-top: 3rem;
      border-top: 1px solid rgb(229, 231, 235);
      padding-top: 2rem;
    }

    ul {
      list-style: none;
      padding: 0;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    li {
      padding: 1.5rem;
      border-bottom: 1px solid rgb(243, 244, 246);
      transition: background-color 0.2s;
    }

    li:last-child {
      border-bottom: none;
    }

    li:hover {
      background-color: rgb(249, 250, 251);
    }

    a {
      color: rgb(59, 130, 246);
      text-decoration: none;
      font-weight: 500;
      font-size: 1.1rem;
      transition: color 0.2s;
    }

    a:hover {
      color: rgb(37, 99, 235);
      text-decoration: underline;
    }

    .edit {
      margin-left: 1rem;
      font-size: 1rem;
      color: rgb(107, 114, 128);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s, color 0.2s;
    }

    .edit:hover {
      background-color: rgb(243, 244, 246);
      color: rgb(55, 65, 81);
    }

    small {
      display: block;
      color: rgb(107, 114, 128);
      font-size: 0.9rem;
      margin-top: 0.5rem;
      line-height: 1.4;
    }

    p {
      color: rgb(75, 85, 99);
      font-size: 1.1rem;
      text-align: center;
      padding: 2rem;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      h2 {
        font-size: 2rem;
      }

      h3 {
        font-size: 1.25rem;
      }

      li {
        padding: 1rem;
      }

      .edit {
        display: block;
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
  `;Jr([k()],Et.prototype,"list",1);Et=Jr([N("bookmarks-view")],Et);var Wo=Object.defineProperty,Go=Object.getOwnPropertyDescriptor,Ut=(o,t,e,s)=>{for(var r=s>1?void 0:s?Go(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Wo(t,e,r),r};let Y=class extends A{constructor(){super(...arguments),this.bookmarks=[],this.loading=!1,this.handleOpenAll=()=>{this.bookmarks.length&&(this.bookmarks.forEach((o,t)=>{o.url&&(t===0?window.open(o.url,"_blank","noopener,noreferrer"):setTimeout(()=>{window.open(o.url,"_blank","noopener,noreferrer")},t*100))}),this.bookmarks.length>5&&setTimeout(()=>{alert(`atempted to open ${this.bookmarks.length} bookmark`)},500))}}connectedCallback(){var o,t;super.connectedCallback(),(t=(o=this.group)==null?void 0:o.bookmarkIds)!=null&&t.length&&this.loadBookmarks()}async loadBookmarks(){if(this.group.bookmarkIds.length){this.loading=!0,this.error=void 0;try{let o=await O(`/api/bookmarks?ids=${this.group.bookmarkIds.join(",")}`);if(!o.ok){const e=new URLSearchParams;this.group.bookmarkIds.forEach(s=>e.append("id",s)),o=await O(`/api/bookmarks?${e.toString()}`)}if(!o.ok){if(o=await O("/api/bookmarks"),o.ok){const e=await o.json();this.bookmarks=e.filter(s=>this.group.bookmarkIds.includes(s.id));return}throw new Error(`HTTP ${o.status}: ${o.statusText}`)}const t=await o.json();this.bookmarks=Array.isArray(t)?t.filter(e=>this.group.bookmarkIds.includes(e.id)):[]}catch(o){console.error("Error loading bookmarks for group:",this.group.id,o),this.error=o instanceof Error?o.message:"Failed to load bookmarks",this.bookmarks=[]}finally{this.loading=!1}}}updated(o){var t,e;o.has("group")&&(this.bookmarks=[],(e=(t=this.group)==null?void 0:t.bookmarkIds)!=null&&e.length&&this.loadBookmarks())}render(){const o=this.group,t=this.bookmarks.length>0;return f`
      <article>
        <div class="header-actions">
          <div>
            <h3>${o.name}</h3>
            ${o.description?f`
              <p class="description">${o.description}</p>
            `:""}
          </div>
          
          ${t?f`
            <button 
              class="open-all-btn" 
              @click=${this.handleOpenAll}
              ?disabled=${this.loading}
              title="Open all bookmarks in new tabs"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open All
            </button>
          `:""}
        </div>

        ${this.loading?f`
          <p class="loading">Loading bookmarks...</p>
        `:t?f`
          <ul>
            ${this.bookmarks.map(e=>f`
              <li>
                <a href=${e.url} target="_blank" rel="noopener noreferrer">
                  ${e.name}
                </a>
              </li>
            `)}
          </ul>
          <p class="bookmark-count">
            ${this.bookmarks.length} bookmark${this.bookmarks.length===1?"":"s"}
          </p>
        `:f`
          <p class="dim">
            ${o.bookmarkIds.length>0?"No bookmarks found":"No bookmarks in this group"}
          </p>
        `}

        ${this.error?f`
          <p class="error">Error: ${this.error}</p>
        `:""}
      </article>
    `}};Y.styles=S`
    article {
      border: 1px solid rgb(229, 231, 235);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      background: white;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    article:hover {
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    h3 {
      margin: 0 0 0.5rem 0;
      color: rgb(17, 24, 39);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .description {
      color: rgb(107, 114, 128);
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .open-all-btn {
      padding: 0.5rem 1rem;
      background: rgb(16, 185, 129);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .open-all-btn:hover:not(:disabled) {
      background: rgb(5, 150, 105);
      transform: translateY(-1px);
    }

    .open-all-btn:disabled {
      background: rgb(156, 163, 175);
      cursor: not-allowed;
      transform: none;
    }

    .open-all-btn svg {
      width: 14px;
      height: 14px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.5rem;
    }

    li {
      margin: 0;
    }

    a {
      color: rgb(59, 130, 246);
      text-decoration: none;
      font-size: 0.9rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      background: rgb(248, 250, 252);
      border: 1px solid rgb(226, 232, 240);
      display: block;
      transition: all 0.2s;
    }

    a:hover {
      background: rgb(239, 246, 255);
      border-color: rgb(59, 130, 246);
      color: rgb(37, 99, 235);
      transform: translateX(4px);
    }

    .dim {
      color: rgb(156, 163, 175);
      font-style: italic;
      margin: 0;
      font-size: 0.9rem;
    }

    .error {
      background: rgb(254, 242, 242);
      color: rgb(185, 28, 28);
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid rgb(252, 165, 165);
      font-size: 0.9rem;
      margin: 0.5rem 0 0 0;
    }

    .bookmark-count {
      color: rgb(107, 114, 128);
      font-size: 0.8rem;
      margin: 0.5rem 0 0 0;
    }

    .loading {
      color: rgb(107, 114, 128);
      font-style: italic;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .header-actions {
        flex-direction: column;
        gap: 0.5rem;
        align-items: stretch;
      }
      
      .open-all-btn {
        align-self: flex-end;
      }
    }
  `;Ut([Rt({type:Object})],Y.prototype,"group",2);Ut([k()],Y.prototype,"bookmarks",2);Ut([k()],Y.prototype,"error",2);Ut([k()],Y.prototype,"loading",2);Y=Ut([N("group-card")],Y);var Jo=Object.defineProperty,Ko=Object.getOwnPropertyDescriptor,ct=(o,t,e,s)=>{for(var r=s>1?void 0:s?Ko(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Jo(t,e,r),r};let U=class extends A{constructor(){super(...arguments),this.data={name:"",description:""},this.bookmarks=[],this.selectedBookmarkIds=new Set,this.loading=!0,this.handleSubmit=o=>{o.preventDefault();const t={...this.data,id:crypto.randomUUID(),bookmarkIds:Array.from(this.selectedBookmarkIds)};O("/api/groups",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(e=>e.status===201?e.json():Promise.reject(e.statusText)).then(e=>{this.dispatchEvent(new CustomEvent("group:created",{bubbles:!0,composed:!0,detail:e})),this.data={name:"",description:""},this.selectedBookmarkIds=new Set,this.error=void 0}).catch(e=>this.error=e)}}connectedCallback(){super.connectedCallback(),this.loadBookmarks()}async loadBookmarks(){try{const o=await O("/api/bookmarks");o.ok?this.bookmarks=await o.json():this.error="Failed to load bookmarks"}catch{this.error="Failed to load bookmarks"}finally{this.loading=!1}}handleChange(o){const t=o.target;this.data={...this.data,[t.name]:t.value}}handleBookmarkToggle(o){const t=new Set(this.selectedBookmarkIds);t.has(o)?t.delete(o):t.add(o),this.selectedBookmarkIds=t}render(){const{name:o,description:t}=this.data,e=this.selectedBookmarkIds.size;return f`
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <input 
          name="name" 
          placeholder="Group name" 
          .value=${o} 
          required 
        />
        
        <textarea 
          name="description" 
          rows="2"
          placeholder="Description (optional)"
        >${t}</textarea>

        <div class="bookmarks-section">
          <h3 class="bookmarks-header">Select Bookmarks for Group</h3>
          
          ${this.loading?f`
            <div class="loading">Loading bookmarks...</div>
          `:this.bookmarks.length===0?f`
            <div class="no-bookmarks">
              No bookmarks available. Create a couple of bookmarks first to add them to groups.
            </div>
          `:f`
            <div class="bookmarks-list">
              ${this.bookmarks.map(s=>f`
                <div 
                  class="bookmark-item ${this.selectedBookmarkIds.has(s.id)?"selected":""}"
                  @click=${()=>this.handleBookmarkToggle(s.id)}
                >
                  <input 
                    type="checkbox" 
                    class="bookmark-checkbox"
                    .checked=${this.selectedBookmarkIds.has(s.id)}
                    @change=${r=>r.stopPropagation()}
                  />
                  <div class="bookmark-info">
                    <p class="bookmark-name">${s.name}</p>
                    <p class="bookmark-url">${s.url}</p>
                  </div>
                </div>
              `)}
            </div>
            
            ${e>0?f`
              <p class="selection-summary">
                ${e} bookmark${e===1?"":"s"} selected
              </p>
            `:""}
          `}
        </div>

        <button type="submit" ?disabled=${!o}>
          Add Group
        </button>
        
        ${this.error?f`<p class="error">${this.error}</p>`:null}
      </form>
    `}};U.styles=S`
    :host {
      display: block;
    }

    form {
      display: grid;
      gap: 1.5rem;
      max-width: 500px;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    input, textarea {
      padding: 0.75rem;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: white;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: rgb(59, 130, 246);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input::placeholder, textarea::placeholder {
      color: rgb(156, 163, 175);
    }

    textarea {
      min-height: 80px;
      resize: vertical;
      font-family: inherit;
    }

    button {
      padding: 0.75rem 1.5rem;
      background: rgb(59, 130, 246);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      font-family: inherit;
    }

    button:hover:not(:disabled) {
      background: rgb(37, 99, 235);
      transform: translateY(-1px);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      background: rgb(156, 163, 175);
      cursor: not-allowed;
      transform: none;
    }

    .error {
      background: rgb(254, 242, 242);
      color: rgb(185, 28, 28);
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid rgb(252, 165, 165);
      font-size: 0.9rem;
      margin: 0;
    }

    .bookmarks-section {
      display: grid;
      gap: 1rem;
    }

    .bookmarks-header {
      font-size: 1rem;
      font-weight: 600;
      color: rgb(55, 65, 81);
      margin: 0;
    }

    .bookmarks-list {
      display: grid;
      gap: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 0.5rem;
      padding: 0.75rem;
      background: rgb(249, 250, 251);
    }

    .bookmark-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 0.375rem;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      cursor: pointer;
      transition: background-color 0.2s, border-color 0.2s;
    }

    .bookmark-item:hover {
      background: rgb(243, 244, 246);
      border-color: rgb(209, 213, 219);
    }

    .bookmark-item.selected {
      background: rgb(239, 246, 255);
      border-color: rgb(59, 130, 246);
    }

    .bookmark-checkbox {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }

    .bookmark-info {
      flex: 1;
      min-width: 0;
    }

    .bookmark-name {
      font-weight: 500;
      color: rgb(17, 24, 39);
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }

    .bookmark-url {
      color: rgb(107, 114, 128);
      font-size: 0.8rem;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .loading {
      text-align: center;
      color: rgb(107, 114, 128);
      font-style: italic;
    }

    .no-bookmarks {
      text-align: center;
      color: rgb(107, 114, 128);
      font-style: italic;
      padding: 1rem;
    }

    .selection-summary {
      font-size: 0.9rem;
      color: rgb(107, 114, 128);
      margin: 0;
    }

    @media (max-width: 768px) {
      form {
        padding: 1.5rem;
        max-width: 100%;
      }

      input, textarea, button {
        font-size: 16px;
      }

      .bookmarks-list {
        max-height: 150px;
      }
    }
  `;ct([k()],U.prototype,"data",2);ct([k()],U.prototype,"error",2);ct([k()],U.prototype,"bookmarks",2);ct([k()],U.prototype,"selectedBookmarkIds",2);ct([k()],U.prototype,"loading",2);U=ct([N("group-form")],U);var Zo=Object.defineProperty,Qo=Object.getOwnPropertyDescriptor,Kr=(o,t,e,s)=>{for(var r=s>1?void 0:s?Qo(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Zo(t,e,r),r};let At=class extends Ct{constructor(){super("tabsaver:model")}get list(){return this.model.groups??[]}connectedCallback(){super.connectedCallback(),this.model.groups||this.dispatchMessage(["groups/load",{}]),this.addEventListener("group:created",()=>this.dispatchMessage(["groups/load",{}]))}render(){return f`
      <h2>Your Groups</h2>

      ${this.list.length?f`
            <main>
              ${this.list.map(o=>f`<group-card .group=${o}></group-card>`)}
            </main>`:f`<p>Loading your groups...</p>`}

      <h3>Create New Group</h3>
      <group-form></group-form>
    `}};At.styles=S`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2, h3 {
      color: rgb(59, 130, 246);
      font-weight: 700;
      margin-bottom: 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    h2 {
      font-size: 2.25rem;
      margin-top: 0;
    }

    h3 {
      font-size: 1.5rem;
      margin-top: 3rem;
      border-top: 1px solid rgb(229, 231, 235);
      padding-top: 2rem;
    }

    main {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    p {
      color: rgb(75, 85, 99);
      font-size: 1.1rem;
      text-align: center;
      padding: 3rem;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      margin: 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    group-form {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: block;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      h2 {
        font-size: 2rem;
      }

      h3 {
        font-size: 1.25rem;
      }

      main {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      group-form {
        padding: 1.5rem;
      }

      p {
        padding: 2rem 1rem;
      }
    }
  `;Kr([k()],At.prototype,"list",1);At=Kr([N("groups-view")],At);var Xo=Object.defineProperty,ti=Object.getOwnPropertyDescriptor,Se=(o,t,e,s)=>{for(var r=s>1?void 0:s?ti(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Xo(t,e,r),r};let W=class extends Ct{constructor(){super("tabsaver:model"),this.handleSubmit=o=>{this.dispatchMessage(["bookmark/save",{id:this.id,bookmark:o.detail,onSuccess:()=>_r.dispatch(this,"history/navigate",{href:"/app/bookmarks"}),onFailure:t=>console.error(t)}])}}get bm(){var o;return(o=this.model.bookmarks)==null?void 0:o.find(t=>t.id===this.id)}render(){var o,t,e;return f`
      <main class="page">
        <h2>Edit Bookmark</h2>
        <mu-form .init=${this.bm} @mu-form:submit=${this.handleSubmit}>
          <label>Name <input name="name" .value=${((o=this.bm)==null?void 0:o.name)??""}></label>
          <label>URL  <input name="url"  .value=${((t=this.bm)==null?void 0:t.url)??""}></label>
          <label>Description
            <textarea name="description">${((e=this.bm)==null?void 0:e.description)??""}</textarea>
          </label>
        </mu-form>
      </main>
    `}};W.uses={"mu-form":fe.Element};W.styles=S`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    main {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 3rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: rgb(59, 130, 246);
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      margin-top: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    mu-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-weight: 600;
      color: rgb(55, 65, 81);
      font-size: 1rem;
    }

    input, textarea {
      padding: 0.75rem;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: rgb(59, 130, 246);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      main {
        padding: 2rem 1rem;
      }

      h2 {
        font-size: 1.75rem;
      }
    }
  `;Se([Rt({attribute:"id"})],W.prototype,"id",2);Se([k()],W.prototype,"bm",1);W=Se([N("bookmark-edit")],W);var ei=Object.getOwnPropertyDescriptor,ri=(o,t,e,s)=>{for(var r=s>1?void 0:s?ei(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(r)||r);return r};let Vt=class extends A{render(){return f`
      <div class="hero">
        <h1>TabSaver</h1>
        <p>Your bookmark management solution. Save, organize, and schedule your favorite websites with ease.</p>
      </div>

      <div class="features">
        <div class="feature-card">
          <span class="feature-icon">🔖</span>
          <h3>Smart Bookmarking</h3>
          <p>Save any website URL with custom names and detailed descriptions. Never lose track of important resources again.</p>
        </div>

        <div class="feature-card">
          <span class="feature-icon">📂</span>
          <h3>Organized Groups</h3>
          <p>Create custom groups to categorize your bookmarks. Keep work, personal, and project links perfectly organized.</p>
        </div>

        <div class="feature-card">
          <span class="feature-icon">📅</span>
          <h3>Weekly Scheduler</h3>
          <p>Plan your browsing with our 7-day calendar. Assign bookmark groups to specific days for structured web navigation.</p>
        </div>
      </div>

      <div class="workflow">
        <h2>How It Works</h2>
        <div class="workflow-steps">
          <div class="workflow-step">
            <div class="step-number">1</div>
            <h4>Save Bookmarks</h4>
            <p>Add websites with custom names and descriptions for easy identification.</p>
          </div>

          <div class="workflow-step">
            <div class="step-number">2</div>
            <h4>Create Groups</h4>
            <p>Organize your bookmarks into themed groups like "Work Tools" or "Learning Resources".</p>
          </div>

          <div class="workflow-step">
            <div class="step-number">3</div>
            <h4>Schedule Access</h4>
            <p>Assign groups to specific days of the week to create a structured browsing routine.</p>
          </div>

          <div class="workflow-step">
            <div class="step-number">4</div>
            <h4>Stay Organized</h4>
            <p>Access your scheduled content each day and maintain a focused, productive workflow.</p>
          </div>
        </div>
      </div>

      <div class="getting-started">
        <h2>Ready to Get Organized?</h2>
        <p>Transform the way you manage your online resources. Start building your personalized bookmark system today.</p>
        <div class="cta-buttons">
          <a href="/app/bookmarks" class="btn btn-primary">View Bookmarks</a>
          <a href="/app/groups" class="btn btn-secondary">Manage Groups</a>
        </div>
      </div>
    `}};Vt.styles=S`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;
    }

    .hero h1 {
      color: rgb(59, 130, 246);
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .hero p {
      color: rgb(75, 85, 99);
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0;
      max-width: 600px;
      margin: 0 auto;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
    }

    .feature-card h3 {
      color: rgb(59, 130, 246);
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .feature-card p {
      color: rgb(75, 85, 99);
      line-height: 1.6;
      margin: 0;
    }

    .workflow {
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 3rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 3rem;
    }

    .workflow h2 {
      color: rgb(59, 130, 246);
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .workflow-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .workflow-step {
      text-align: center;
      position: relative;
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      background: rgb(59, 130, 246);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .workflow-step h4 {
      color: rgb(55, 65, 81);
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .workflow-step p {
      color: rgb(75, 85, 99);
      line-height: 1.5;
      margin: 0;
    }

    .getting-started {
      background: linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%);
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      color: white;
    }

    .getting-started h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .getting-started p {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .btn-primary {
      background: white;
      color: rgb(59, 130, 246);
    }

    .btn-primary:hover {
      background: rgb(243, 244, 246);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
      :host {
        padding: 1rem;
      }

      .hero {
        padding: 2rem 1rem;
      }

      .hero h1 {
        font-size: 2.5rem;
      }

      .hero p {
        font-size: 1.1rem;
      }

      .features {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .feature-card {
        padding: 1.5rem;
      }

      .workflow {
        padding: 2rem 1rem;
      }

      .workflow-steps {
        grid-template-columns: 1fr;
      }

      .getting-started {
        padding: 2rem 1rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 200px;
        justify-content: center;
      }
    }
  `;Vt=ri([N("about-view")],Vt);var si=Object.defineProperty,Gt=(o,t,e,s)=>{for(var r=void 0,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(t,e,r)||r);return r&&si(t,e,r),r};const Ce=class Ce extends A{constructor(){super(...arguments),this.formData={},this.redirect="/",this.handleChange=t=>{const e=t.target;this.formData={...this.formData,[e.name]:e.value}},this.handleSubmit=t=>{t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw new Error("Login failed");return e.json()}).then(({token:e})=>{this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e,redirect:this.redirect}]}))}).catch(e=>this.error=e.message)}}get canSubmit(){const{username:t,password:e}=this.formData;return!!(this.api&&(t!=null&&t.length)&&(e!=null&&e.length))}render(){return f`
      <form
        @change=${this.handleChange}
        @submit=${this.handleSubmit}>
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        ${this.error?f`<div class="error">${this.error}</div>`:null}
      </form>`}};Ce.styles=S`
    form { display:flex; flex-direction:column; gap:.5rem; }
    .error { color:red; font-size:.9rem; }
    button[disabled] { opacity:.6; cursor:not-allowed; }
  `;let z=Ce;Gt([k()],z.prototype,"formData");Gt([Rt()],z.prototype,"api");Gt([Rt()],z.prototype,"redirect");Gt([k()],z.prototype,"error");var oi=Object.getOwnPropertyDescriptor,ii=(o,t,e,s)=>{for(var r=s>1?void 0:s?oi(t,e):t,i=o.length-1,n;i>=0;i--)(n=o[i])&&(r=n(r)||r);return r};let St=class extends Ct{constructor(){super("tabsaver:model")}render(){return f`
      <div class="card">
        <h2>User Login</h2>
        
        <login-form api="/auth/login" redirect="/">
          <label>
            Username:
            <input name="username" autocomplete="off" placeholder="Enter your username" />
          </label>
          <label>
            Password:
            <input name="password" type="password" placeholder="Enter your password" />
          </label>
        </login-form>
        
        <p class="register-link">
          New user?
          <a href="/app/register">Register here</a>
        </p>
      </div>
    `}};St.uses={"login-form":z,"mu-form":fe.Element};St.styles=S`
    :host {
      display: flex;
      place-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: rgb(249, 250, 251);
      padding: 1rem;
    }

    .card {
      display: grid;
      gap: 1.5rem;
      max-width: 400px;
      width: 100%;
      background: white;
      border: 1px solid rgb(229, 231, 235);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: rgb(17, 24, 39);
      text-align: center;
    }

    login-form {
      display: block;
    }

    login-form form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-weight: 500;
      color: rgb(55, 65, 81);
    }

    input {
      padding: 0.75rem;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: white;
    }

    input:focus {
      outline: none;
      border-color: rgb(59, 130, 246);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input::placeholder {
      color: rgb(156, 163, 175);
    }

    button {
      padding: 0.75rem 1.5rem;
      background: rgb(59, 130, 246);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
      font-family: inherit;
    }

    button:hover:not(:disabled) {
      background: rgb(37, 99, 235);
      transform: translateY(-1px);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      background: rgb(156, 163, 175);
      cursor: not-allowed;
      transform: none;
    }

    .register-link {
      text-align: center;
      font-size: 0.9rem;
      color: rgb(107, 114, 128);
      margin: 0;
    }

    .register-link a {
      color: rgb(59, 130, 246);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .register-link a:hover {
      color: rgb(37, 99, 235);
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .card {
        padding: 1.5rem;
        max-width: 100%;
      }

      input, button {
        font-size: 16px;
      }
    }
  `;St=ii([N("login-view")],St);const ni=[{path:"/app/login",view:()=>f`<login-view></login-view>`},{path:"/app/bookmarks/:id/edit",protected:!0,view:o=>f`<bookmark-edit id=${o.id}></bookmark-edit>`},{path:"/app/groups",protected:!0,view:()=>f`<groups-view></groups-view>`},{path:"/app/bookmarks",protected:!0,view:()=>f`<bookmarks-view></bookmarks-view>`},{path:"/app/about",view:()=>f`<about-view></about-view>`},{path:"/app",view:()=>f`<home-view></home-view>`},{path:"/",redirect:"/app"}];class ai extends uo.Element{constructor(){super(ni,"tabsaver:history","tabsaver:auth")}}class li extends ks.Provider{constructor(){super(Ho,Lo,"tabsaver:auth")}}fo({"mu-auth":tt.Provider,"mu-history":_r.Provider,"mu-switch":ai,"mu-store":li,"login-form":z,"ts-header":de,"home-view":ue,"mu-form":fe.Element,"bookmarks-view":Et,"bookmark-edit":W,"login-view":St,"groups-view":At,"about-view":Vt});
