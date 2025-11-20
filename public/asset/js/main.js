/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFw.js":
/*!********************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFw.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.frameworkReset = exports.elementObserverOn = exports.elementObserverOff = exports.elementObserver = exports.variableBind = exports.variableHook = exports.renderAfter = exports.renderTemplate = exports.getControllerList = exports.getAppLabel = exports.setAppLabel = exports.getUrlRoot = exports.setUrlRoot = void 0;
const JsMvcFwDom_1 = __webpack_require__(/*! ./JsMvcFwDom */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwDom.js");
const JsMvcFwEmitter_1 = __importDefault(__webpack_require__(/*! ./JsMvcFwEmitter */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwEmitter.js"));
let urlRoot = "";
let appLabel = "";
const virtualNodeObject = {};
const renderTriggerObject = {};
const variableLoadedList = {};
const variableEditedList = {};
const variableRenderUpdateObject = {};
const variableHookObject = {};
const controllerList = [];
let cacheVariableProxyWeakMap = new WeakMap();
const emitterObject = {};
let observerWeakMap = new WeakMap();
let callbackObserverWeakMap = new WeakMap();
const variableRenderUpdate = (controllerName) => {
    if (emitterObject[controllerName] && !variableRenderUpdateObject[controllerName]) {
        variableRenderUpdateObject[controllerName] = true;
        Promise.resolve().then(() => {
            const renderTrigger = renderTriggerObject[controllerName];
            if (renderTrigger) {
                renderTrigger();
            }
            emitterObject[controllerName].emit("variableChanged");
            variableRenderUpdateObject[controllerName] = false;
        });
    }
};
const variableProxy = (stateLabel, stateValue, controllerName) => {
    if (typeof stateValue !== "object" || stateValue === null) {
        return stateValue;
    }
    const cache = cacheVariableProxyWeakMap.get(stateValue);
    if (cache) {
        return cache;
    }
    const proxy = new Proxy(stateValue, {
        get(target, property, receiver) {
            const result = Reflect.get(target, property, receiver);
            if (typeof result === "object" && result !== null) {
                return variableProxy(stateLabel, result, controllerName);
            }
            return result;
        },
        set(target, property, newValue, receiver) {
            if (variableEditedList[controllerName] && !variableEditedList[controllerName].includes(stateLabel)) {
                variableEditedList[controllerName].push(stateLabel);
            }
            const isSuccess = Reflect.set(target, property, newValue, receiver);
            if (isSuccess) {
                variableRenderUpdate(controllerName);
            }
            return isSuccess;
        },
        deleteProperty(target, property) {
            if (variableEditedList[controllerName] && !variableEditedList[controllerName].includes(stateLabel)) {
                variableEditedList[controllerName].push(stateLabel);
            }
            const isSuccess = Reflect.deleteProperty(target, property);
            if (isSuccess) {
                variableRenderUpdate(controllerName);
            }
            return isSuccess;
        }
    });
    cacheVariableProxyWeakMap.set(stateValue, proxy);
    return proxy;
};
const variableBindItem = (label, stateValue, controllerName) => {
    let _state = variableProxy(label, stateValue, controllerName);
    let _listener = null;
    return {
        get state() {
            return _state;
        },
        set state(value) {
            if (variableEditedList[controllerName] && !variableEditedList[controllerName].includes(label)) {
                variableEditedList[controllerName].push(label);
            }
            _state = variableProxy(label, value, controllerName);
            if (_listener) {
                _listener(_state);
            }
            variableRenderUpdate(controllerName);
        },
        listener(callback) {
            _listener = callback;
        }
    };
};
const variableWatch = (controllerName, callback) => {
    if (!emitterObject[controllerName]) {
        emitterObject[controllerName] = new JsMvcFwEmitter_1.default();
    }
    const emitter = emitterObject[controllerName];
    emitter.on("variableChanged", () => {
        const editedList = variableEditedList[controllerName] || [];
        callback((groupObject) => {
            for (const group of groupObject) {
                let isAllEdited = true;
                for (let b = 0; b < group.list.length; b++) {
                    const key = group.list[b];
                    if (editedList.indexOf(key) === -1) {
                        isAllEdited = false;
                        break;
                    }
                }
                if (isAllEdited) {
                    group.action();
                    for (const key of group.list) {
                        const index = editedList.indexOf(key);
                        if (index !== -1) {
                            editedList.splice(index, 1);
                        }
                    }
                }
            }
            variableEditedList[controllerName] = editedList;
        });
    });
};
const elementHook = (elementContainer, controllerValue) => {
    const elementHookList = elementContainer.querySelectorAll("[jsmvcfw-elementHookName]");
    const elementHookObject = {};
    for (const elementHook of elementHookList) {
        const attribute = elementHook.getAttribute("jsmvcfw-elementHookName");
        if (attribute) {
            const matchList = attribute.match(/^([a-zA-Z0-9]+)_\d+$/);
            const baseKey = matchList ? matchList[1] : attribute;
            if (elementHookObject[baseKey]) {
                if (Array.isArray(elementHookObject[baseKey])) {
                    elementHookObject[baseKey].push(elementHook);
                }
                else {
                    elementHookObject[baseKey] = [elementHookObject[baseKey], elementHook];
                }
            }
            else {
                if (matchList) {
                    elementHookObject[baseKey] = [elementHook];
                }
                else {
                    elementHookObject[attribute] = elementHook;
                }
            }
        }
    }
    controllerValue.elementHookObject = elementHookObject;
};
const setUrlRoot = (urlRootValue) => (urlRoot = urlRootValue);
exports.setUrlRoot = setUrlRoot;
const getUrlRoot = () => urlRoot;
exports.getUrlRoot = getUrlRoot;
const setAppLabel = (appLabelValue) => (appLabel = appLabelValue);
exports.setAppLabel = setAppLabel;
const getAppLabel = () => appLabel;
exports.getAppLabel = getAppLabel;
const getControllerList = () => controllerList;
exports.getControllerList = getControllerList;
const renderTemplate = (controllerValue, controllerParent, callback) => {
    const controllerName = controllerValue.constructor.name;
    if (!controllerParent) {
        controllerList.push({ parent: controllerValue, childrenList: [] });
    }
    else {
        for (const controller of controllerList) {
            if (controllerParent.constructor.name === controller.parent.constructor.name) {
                controller.childrenList.push(controllerValue);
                break;
            }
        }
    }
    controllerValue.variable();
    const renderTrigger = () => {
        const virtualNodeNew = controllerValue.view();
        if (!virtualNodeNew || typeof virtualNodeNew !== "object" || !virtualNodeNew.tag) {
            throw new Error(`@cimo/jsmvcfw - JsMvcFw.ts - renderTrigger() => Invalid virtual node returned by controller "${controllerName}"!`);
        }
        let elementContainer = null;
        if (!controllerParent) {
            const elementRoot = document.getElementById("jsmvcfw_app");
            if (!elementRoot) {
                throw new Error("@cimo/jsmvcfw - JsMvcFw.ts - renderTrigger() => Root element #jsmvcfw_app not found!");
            }
            elementContainer = elementRoot;
        }
        else {
            const parentContainer = document.querySelector(`[jsmvcfw-controllerName="${controllerParent.constructor.name}"]`);
            if (!parentContainer) {
                throw new Error(`@cimo/jsmvcfw - JsMvcFw.ts - renderTrigger() => Tag jsmvcfw-controllerName="${controllerParent.constructor.name}" not found!`);
            }
            elementContainer = parentContainer.querySelector(`[jsmvcfw-controllerName="${controllerName}"]`);
            if (!elementContainer) {
                throw new Error(`@cimo/jsmvcfw - JsMvcFw.ts - renderTrigger() => Tag jsmvcfw-controllerName="${controllerName}" not found inside jsmvcfw-controllerName="${controllerParent.constructor.name}"!`);
            }
        }
        const virtualNodeOld = virtualNodeObject[controllerName];
        if (!virtualNodeOld) {
            if (elementContainer) {
                const elementVirtualNode = (0, JsMvcFwDom_1.createVirtualNode)(virtualNodeNew);
                elementContainer.innerHTML = "";
                elementContainer.appendChild(elementVirtualNode);
                if (callback) {
                    callback();
                }
            }
        }
        else {
            if (elementContainer) {
                const elementFirstChild = elementContainer.firstElementChild;
                if (elementFirstChild) {
                    (0, JsMvcFwDom_1.updateVirtualNode)(elementFirstChild, virtualNodeOld, virtualNodeNew);
                }
            }
        }
        virtualNodeObject[controllerName] = virtualNodeNew;
        elementHook(elementContainer, controllerValue);
    };
    renderTriggerObject[controllerName] = renderTrigger;
    renderTrigger();
    if (controllerValue.subControllerList) {
        const subControllerList = controllerValue.subControllerList();
        for (const subController of subControllerList) {
            (0, exports.renderTemplate)(subController, controllerValue, () => {
                subController.event();
                (0, exports.renderAfter)(subController).then(() => {
                    subController.rendered();
                });
            });
        }
    }
    variableWatch(controllerName, (watch) => {
        controllerValue.variableEffect.call(controllerValue, watch);
    });
};
exports.renderTemplate = renderTemplate;
const renderAfter = (controller) => {
    return new Promise((resolve) => {
        const check = () => {
            const controllerName = controller.constructor.name;
            if (!variableLoadedList[controllerName]) {
                return;
            }
            const variableLoadedLength = variableLoadedList[controllerName].length;
            const isRendering = variableRenderUpdateObject[controllerName];
            if (variableLoadedLength > 0 && !isRendering) {
                resolve();
            }
            else {
                Promise.resolve().then(check);
            }
        };
        check();
    });
};
exports.renderAfter = renderAfter;
const variableHook = (label, stateValue, controllerName) => {
    if (!(controllerName in variableHookObject)) {
        if (!variableLoadedList[controllerName]) {
            variableLoadedList[controllerName] = [];
            variableEditedList[controllerName] = [];
        }
        if (variableLoadedList[controllerName].includes(label)) {
            throw new Error(`@cimo/jsmvcfw - JsMvcFw.ts - variableHook() => The method variableHook use existing label "${label}"!`);
        }
        variableLoadedList[controllerName].push(label);
        variableHookObject[controllerName] = variableProxy(label, stateValue, controllerName);
    }
    return {
        state: variableHookObject[controllerName],
        setState: (value) => {
            if (variableEditedList[controllerName] && !variableEditedList[controllerName].includes(label)) {
                variableEditedList[controllerName].push(label);
            }
            variableHookObject[controllerName] = variableProxy(label, value, controllerName);
            variableRenderUpdate(controllerName);
        }
    };
};
exports.variableHook = variableHook;
const variableBind = (variableObject, controllerName) => {
    const result = {};
    if (!variableLoadedList[controllerName]) {
        variableLoadedList[controllerName] = [];
        variableEditedList[controllerName] = [];
    }
    for (const key in variableObject) {
        if (Object.prototype.hasOwnProperty.call(variableObject, key)) {
            if (variableLoadedList[controllerName].includes(key)) {
                throw new Error(`@cimo/jsmvcfw - JsMvcFw.ts - variableBind() => The method variableBind use existing label "${key}"!`);
            }
            variableLoadedList[controllerName].push(key);
            result[key] = variableBindItem(key, variableObject[key], controllerName);
        }
    }
    return result;
};
exports.variableBind = variableBind;
const elementObserver = (element, callback) => {
    const callbackList = callbackObserverWeakMap.get(element) || [];
    callbackObserverWeakMap.set(element, [...callbackList, callback]);
    if (!observerWeakMap.has(element)) {
        const observer = new MutationObserver((mutationRecordList) => {
            const callbackList = callbackObserverWeakMap.get(element);
            if (!callbackList) {
                return;
            }
            for (const mutationRecord of mutationRecordList) {
                for (const callback of callbackList) {
                    callback(element, mutationRecord);
                }
            }
        });
        observer.observe(element, {
            subtree: true,
            childList: true,
            attributes: true
        });
        observerWeakMap.set(element, observer);
    }
};
exports.elementObserver = elementObserver;
const elementObserverOff = (element) => {
    const observer = observerWeakMap.get(element);
    if (observer) {
        observer.disconnect();
    }
};
exports.elementObserverOff = elementObserverOff;
const elementObserverOn = (element) => {
    const observer = observerWeakMap.get(element);
    if (observer) {
        observer.observe(element, {
            subtree: true,
            childList: true,
            attributes: true
        });
    }
};
exports.elementObserverOn = elementObserverOn;
const frameworkReset = () => {
    Object.keys(virtualNodeObject).forEach((key) => delete virtualNodeObject[key]);
    Object.keys(renderTriggerObject).forEach((key) => delete renderTriggerObject[key]);
    Object.keys(variableLoadedList).forEach((key) => delete variableLoadedList[key]);
    Object.keys(variableEditedList).forEach((key) => delete variableEditedList[key]);
    Object.keys(variableRenderUpdateObject).forEach((key) => delete variableRenderUpdateObject[key]);
    Object.keys(variableHookObject).forEach((key) => delete variableHookObject[key]);
    controllerList.length = 0;
    cacheVariableProxyWeakMap = new WeakMap();
    Object.keys(emitterObject).forEach((key) => delete emitterObject[key]);
    observerWeakMap = new WeakMap();
    callbackObserverWeakMap = new WeakMap();
};
exports.frameworkReset = frameworkReset;
//# sourceMappingURL=JsMvcFw.js.map

/***/ }),

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwCookie.js":
/*!**************************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwCookie.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.removeCookie = exports.readCookie = exports.writeCookie = void 0;
const JsMvcFw_1 = __webpack_require__(/*! ./JsMvcFw */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFw.js");
const isJson = (value) => {
    try {
        JSON.parse(value);
        return true;
    }
    catch {
        return false;
    }
};
const isBase64 = (value) => {
    return /^[A-Za-z0-9+/]*={0,2}$/.test(value) && value.length % 4 === 0;
};
const escapeRegExp = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
const writeCookie = (tag, value, expire = "", httpOnly = "", path = "/") => {
    const encodedData = window.btoa(encodeURIComponent(JSON.stringify(value)));
    document.cookie = `${(0, JsMvcFw_1.getAppLabel)()}_${tag}=${encodedData};expires=${expire};${httpOnly};path=${path};Secure`;
};
exports.writeCookie = writeCookie;
const readCookie = (tag) => {
    let result;
    const name = escapeRegExp(`${(0, JsMvcFw_1.getAppLabel)()}_${tag}`);
    const resultMatch = document.cookie.match(new RegExp(`${name}=([^;]+)`));
    if (resultMatch) {
        let cookie = resultMatch[1];
        if (isBase64(cookie.replaceAll('"', ""))) {
            cookie = window.atob(cookie.replaceAll('"', ""));
        }
        const decodeUriCookie = decodeURIComponent(cookie);
        if (isJson(decodeUriCookie)) {
            result = JSON.parse(decodeUriCookie);
        }
        else {
            result = decodeUriCookie;
        }
    }
    return result;
};
exports.readCookie = readCookie;
const removeCookie = (tag) => {
    document.cookie = `${(0, JsMvcFw_1.getAppLabel)()}_${tag}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
exports.removeCookie = removeCookie;
//# sourceMappingURL=JsMvcFwCookie.js.map

/***/ }),

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwDom.js":
/*!***********************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwDom.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateVirtualNode = exports.createVirtualNode = void 0;
const applyProperty = (element, key, valueNew, valueOld) => {
    if (key.startsWith("on") && typeof valueNew === "function") {
        const eventName = key.slice(2).toLowerCase();
        if (typeof valueOld === "function") {
            element.removeEventListener(eventName, valueOld);
        }
        element.addEventListener(eventName, valueNew);
    }
    else if (typeof valueNew === "boolean") {
        valueNew ? element.setAttribute(key, "") : element.removeAttribute(key);
    }
    else if (typeof valueNew === "string" || typeof valueNew === "number") {
        element.setAttribute(key, valueNew.toString());
    }
    else if (Array.isArray(valueNew)) {
        let stringValue = "";
        for (const value of valueNew) {
            if (typeof value === "string") {
                stringValue += value + " ";
            }
        }
        element.setAttribute(key, stringValue.trim());
    }
    else if (valueNew == null) {
        element.removeAttribute(key);
    }
};
const updateProperty = (element, oldList, newList) => {
    for (const key in oldList) {
        if (!(key in newList)) {
            if (key.startsWith("on") && typeof oldList[key] === "function") {
                element.removeEventListener(key.slice(2).toLowerCase(), oldList[key]);
            }
            else {
                element.removeAttribute(key);
            }
        }
    }
    for (const [key, value] of Object.entries(newList)) {
        const valueOld = oldList[key];
        if (value !== valueOld) {
            applyProperty(element, key, value, valueOld);
        }
    }
};
const updateChildren = (element, nodeOldListValue, nodeNewListValue) => {
    const nodeOldList = Array.isArray(nodeOldListValue) ? nodeOldListValue : [];
    const nodeNewList = Array.isArray(nodeNewListValue) ? nodeNewListValue : [];
    const keyOldObject = {};
    for (let a = 0; a < nodeOldList.length; a++) {
        const node = nodeOldList[a];
        if (typeof node === "object" && node.key) {
            keyOldObject[node.key] = { node, dom: element.childNodes[a] };
        }
    }
    const nodeMaxLength = Math.max(nodeOldList.length, nodeNewList.length);
    for (let a = 0; a < nodeMaxLength; a++) {
        const nodeOld = nodeOldList[a];
        const nodeNew = nodeNewList[a];
        const nodeDom = element.childNodes[a];
        if (!nodeNew && nodeDom) {
            const isControllerName = nodeDom.nodeType === Node.ELEMENT_NODE && nodeDom.hasAttribute("jsmvcfw-controllername");
            if (!isControllerName) {
                element.removeChild(nodeDom);
            }
            continue;
        }
        if (typeof nodeNew === "string") {
            if (!nodeDom) {
                element.appendChild(document.createTextNode(nodeNew));
            }
            else if (nodeDom.nodeType === Node.TEXT_NODE) {
                if (nodeDom.textContent !== nodeNew) {
                    nodeDom.textContent = nodeNew;
                }
            }
            else {
                element.replaceChild(document.createTextNode(nodeNew), nodeDom);
            }
        }
        else if (typeof nodeNew === "object") {
            const isControllerName = nodeDom?.nodeType === Node.ELEMENT_NODE && nodeDom.hasAttribute("jsmvcfw-controllername");
            if (isControllerName && !nodeNew.key) {
                continue;
            }
            if (nodeNew.key && keyOldObject[nodeNew.key]) {
                const { node, dom } = keyOldObject[nodeNew.key];
                (0, exports.updateVirtualNode)(dom, node, nodeNew);
                if (nodeDom !== dom) {
                    element.insertBefore(dom, nodeDom);
                }
            }
            else if (typeof nodeOld === "object" && nodeOld.tag === nodeNew.tag && nodeDom) {
                (0, exports.updateVirtualNode)(nodeDom, nodeOld, nodeNew);
            }
            else {
                const domNew = (0, exports.createVirtualNode)(nodeNew);
                if (nodeDom) {
                    element.replaceChild(domNew, nodeDom);
                }
                else {
                    element.appendChild(domNew);
                }
            }
        }
    }
    while (element.childNodes.length > nodeNewList.length) {
        const nodeExtra = element.childNodes[nodeNewList.length];
        const isControllerName = nodeExtra.nodeType === Node.ELEMENT_NODE && nodeExtra.hasAttribute("jsmvcfw-controllername");
        if (!isControllerName) {
            element.removeChild(nodeExtra);
        }
        else {
            break;
        }
    }
};
const createVirtualNode = (node) => {
    const element = document.createElement(node.tag);
    for (const [key, value] of Object.entries(node.propertyObject || {})) {
        applyProperty(element, key, value);
    }
    if (Array.isArray(node.childrenList)) {
        for (const child of node.childrenList) {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            }
            else {
                element.appendChild((0, exports.createVirtualNode)(child));
            }
        }
    }
    return element;
};
exports.createVirtualNode = createVirtualNode;
const updateVirtualNode = (element, nodeOld, nodeNew) => {
    if (nodeOld.tag !== nodeNew.tag) {
        const elementNew = (0, exports.createVirtualNode)(nodeNew);
        element.replaceWith(elementNew);
        return;
    }
    updateProperty(element, nodeOld.propertyObject || {}, nodeNew.propertyObject || {});
    updateChildren(element, nodeOld.childrenList, nodeNew.childrenList);
};
exports.updateVirtualNode = updateVirtualNode;
//# sourceMappingURL=JsMvcFwDom.js.map

/***/ }),

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwEmitter.js":
/*!***************************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwEmitter.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Emitter {
    listenerObject = {};
    on(event, listener) {
        if (!this.listenerObject[event]) {
            this.listenerObject[event] = [];
        }
        this.listenerObject[event].push(listener);
    }
    emit(event, ...[payload]) {
        const listenerEventList = this.listenerObject[event];
        if (listenerEventList) {
            for (const listener of listenerEventList) {
                listener(payload);
            }
        }
    }
    off(event, listener, isRemoveAll = false) {
        const listenerEventList = this.listenerObject[event];
        if (listenerEventList) {
            if (isRemoveAll) {
                for (let a = listenerEventList.length - 1; a >= 0; a--) {
                    if (listenerEventList[a] === listener) {
                        listenerEventList.splice(a, 1);
                    }
                }
            }
            else {
                const index = listenerEventList.indexOf(listener);
                if (index !== -1) {
                    listenerEventList.splice(index, 1);
                }
            }
        }
    }
}
exports["default"] = Emitter;
//# sourceMappingURL=JsMvcFwEmitter.js.map

/***/ }),

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwInterface.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwInterface.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=JsMvcFwInterface.js.map

/***/ }),

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwJsx.js":
/*!***********************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwJsx.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jsxFragment = exports.jsxFactory = void 0;
const stackErrorDetail = () => {
    const stack = new Error().stack;
    if (!stack) {
        return "unknown";
    }
    const stackSplit = stack.split("\n");
    const callerLine = stackSplit[2].trim() || "unknown";
    return callerLine.charAt(0).toUpperCase() + callerLine.slice(1).toLowerCase();
};
const checkDynamicElement = (childrenListValue) => {
    let isDynamic = false;
    for (let a = 0; a < childrenListValue.length; a++) {
        if (Array.isArray(childrenListValue[a])) {
            isDynamic = true;
            break;
        }
    }
    if (isDynamic) {
        const tagObject = {};
        for (let a = 0; a < childrenListValue.length; a++) {
            const childEntry = childrenListValue[a];
            const isFromArray = Array.isArray(childEntry);
            const childrenList = isFromArray ? childEntry : [childEntry];
            for (const children of childrenList) {
                const node = typeof children === "number" ? String(children) : children;
                if (typeof node === "object" && "tag" in node) {
                    if (!tagObject[node.tag]) {
                        tagObject[node.tag] = [];
                    }
                    tagObject[node.tag].push({ node, isFromArray });
                }
            }
        }
        const errorDetail = stackErrorDetail();
        for (const tag in tagObject) {
            const group = tagObject[tag];
            const keyMissingList = group.filter(({ node }) => node.key === undefined);
            const isAllFromArray = group.every(({ isFromArray }) => isFromArray);
            if (group.length > 1 && keyMissingList.length > 0 && isAllFromArray) {
                throw new Error(`@cimo/jsmvcfw - JsMvcFwJsx.ts - checkDynamicElement() => ${errorDetail}, multiple <${tag}> elements missing key tag!`);
            }
        }
    }
};
const jsxFactory = (tag, propertyObjectValue = {}, ...childrenListValue) => {
    const childrenList = [];
    for (let a = 0; a < childrenListValue.length; a++) {
        const child = childrenListValue[a];
        if (child == null) {
            continue;
        }
        if (Array.isArray(child)) {
            for (let b = 0; b < child.length; b++) {
                const childNested = child[b];
                if (childNested == null) {
                    continue;
                }
                childrenList.push(typeof childNested === "number" ? String(childNested) : childNested);
            }
        }
        else {
            childrenList.push(typeof child === "number" ? String(child) : child);
        }
    }
    checkDynamicElement(childrenListValue);
    const { key, ...propertyObject } = propertyObjectValue || {};
    if (typeof tag === "function") {
        return tag({ children: childrenList });
    }
    return {
        tag,
        propertyObject,
        childrenList,
        key: key !== undefined ? String(key) : undefined
    };
};
exports.jsxFactory = jsxFactory;
const jsxFragment = ({ children }) => children;
exports.jsxFragment = jsxFragment;
//# sourceMappingURL=JsMvcFwJsx.js.map

/***/ }),

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwRoute.js":
/*!*************************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwRoute.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.navigateTo = exports.route = void 0;
const JsMvcFw_1 = __webpack_require__(/*! ./JsMvcFw */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFw.js");
let routeList = [];
let controller;
const cleanUrl = (urlNext) => {
    const [path, queryString] = urlNext.split("?");
    const queryStringCleanedList = [];
    if (queryString) {
        const queryStringList = queryString.split("&");
        for (let a = 0; a < queryStringList.length; a++) {
            const param = queryStringList[a];
            const [key, value] = param.split("=");
            const keyCleaned = encodeURIComponent(decodeURIComponent(key.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")));
            if (value) {
                const valueCleaned = encodeURIComponent(decodeURIComponent(value.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")));
                queryStringCleanedList.push(`${keyCleaned}=${valueCleaned}`);
            }
            else {
                queryStringCleanedList.push(keyCleaned);
            }
        }
    }
    const pathCleaned = path.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const urlCleaned = pathCleaned + (queryStringCleanedList.length > 0 ? "?" + queryStringCleanedList.join("&") : "");
    return urlCleaned;
};
const historyPush = (urlNext, parameterObject, parameterSearch, title = "") => {
    const data = {
        urlPrevious: window.location.pathname,
        parameterObject,
        parameterSearch
    };
    window.history.pushState(data, title, cleanUrl(urlNext));
};
const removeController = () => {
    if (controller) {
        const controllerList = (0, JsMvcFw_1.getControllerList)();
        for (let a = controllerList.length - 1; a >= 0; a--) {
            for (const children of controllerList[a].childrenList) {
                children.destroy();
            }
        }
        controller.destroy();
    }
};
const removeTrail = (value) => {
    return value.endsWith("/") && value.length > 1 ? value.slice(0, -1) : value;
};
const populatePage = (urlNext, isSoft, parameterObject, parameterSearch) => {
    if (!isSoft) {
        if (parameterSearch) {
            window.location.search = parameterSearch;
        }
        window.location.href = cleanUrl(urlNext);
    }
    else {
        let isNotFound = true;
        const urlNextTrail = removeTrail(urlNext);
        for (const route of routeList) {
            const routePathTrail = removeTrail(`${(0, JsMvcFw_1.getUrlRoot)()}${route.path}`);
            if (routePathTrail === urlNextTrail) {
                isNotFound = false;
                (0, JsMvcFw_1.frameworkReset)();
                historyPush(urlNextTrail, parameterObject, parameterSearch, route.title);
                document.title = route.title;
                removeController();
                controller = route.controller();
                (0, JsMvcFw_1.renderTemplate)(controller, undefined, () => {
                    controller.event();
                    (0, JsMvcFw_1.renderAfter)(controller).then(() => {
                        controller.rendered();
                    });
                });
                break;
            }
        }
        if (isNotFound) {
            historyPush(`${(0, JsMvcFw_1.getUrlRoot)()}/404`, parameterObject, parameterSearch, "404");
            document.title = "404";
            const elementRoot = document.getElementById("jsmvcfw_app");
            if (elementRoot) {
                elementRoot.innerHTML = "Route not found!";
            }
        }
    }
};
const route = (routeListValue) => {
    routeList = routeListValue;
    window.onload = (event) => {
        if (event) {
            populatePage(window.location.pathname, true);
        }
    };
    window.onpopstate = (event) => {
        const data = event.state;
        if (data.urlPrevious) {
            populatePage(data.urlPrevious, true);
        }
        else {
            populatePage(window.location.pathname, true);
        }
    };
    window.onbeforeunload = () => {
        removeController();
    };
};
exports.route = route;
const navigateTo = (urlNext, isSoft = true, parameterObject, parameterSearch) => {
    populatePage(urlNext, isSoft, parameterObject, parameterSearch);
};
exports.navigateTo = navigateTo;
//# sourceMappingURL=JsMvcFwRoute.js.map

/***/ }),

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwStorage.js":
/*!***************************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwStorage.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.removeStorage = exports.readStorage = exports.writeStorage = void 0;
const JsMvcFw_1 = __webpack_require__(/*! ./JsMvcFw */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFw.js");
const writeStorage = (tag, value) => {
    const encodedData = window.btoa(encodeURIComponent(JSON.stringify(value)));
    localStorage.setItem(`${(0, JsMvcFw_1.getAppLabel)()}_${tag}`, encodedData);
};
exports.writeStorage = writeStorage;
const readStorage = (tag) => {
    let result;
    const storage = localStorage.getItem(`${(0, JsMvcFw_1.getAppLabel)()}_${tag}`);
    if (storage) {
        result = JSON.parse(decodeURIComponent(window.atob(storage)));
    }
    return result;
};
exports.readStorage = readStorage;
const removeStorage = (tag) => {
    localStorage.removeItem(`${(0, JsMvcFw_1.getAppLabel)()}_${tag}`);
};
exports.removeStorage = removeStorage;
//# sourceMappingURL=JsMvcFwStorage.js.map

/***/ }),

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js":
/*!*****************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/Main.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./JsMvcFw */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFw.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwCookie */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwCookie.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwDom */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwDom.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwEmitter */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwEmitter.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwInterface */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwInterface.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwJsx */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwJsx.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwRoute */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwRoute.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwStorage */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwStorage.js"), exports);
//# sourceMappingURL=Main.js.map

/***/ }),

/***/ "./src/controller/Example.ts":
/*!***********************************!*\
  !*** ./src/controller/Example.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Example)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_Example__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view/Example */ "./src/view/Example.tsx");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);


class Example {
  constructor() {
    // Variable
    __publicField(this, "variableObject");
    __publicField(this, "methodObject");
    __publicField(this, "elementDivTest");
    __publicField(this, "elementObserverTest");
    __publicField(this, "elementCookieRead");
    __publicField(this, "elementStorageRead");
    // Method
    __publicField(this, "onClickLink", (pagePath) => {
      (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.navigateTo)(pagePath);
    });
    __publicField(this, "onClickCount", () => {
      this.variableObject.count.state += 1;
    });
    __publicField(this, "onClickElementHook", () => {
      if (this.elementDivTest) {
        this.elementDivTest.innerText = "Novum exemplum textus.";
      }
    });
    __publicField(this, "onClickVariableWatchTest", () => {
      this.variableObject.variableWatchTest.state = "Exemplum textus.";
    });
    __publicField(this, "actionVariableWatchTest", () => {
      alert("actionWatchTest");
    });
    __publicField(this, "statusElmentObserverTest", () => {
      if (this.elementDivTest) {
        (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.elementObserver)(this.elementDivTest, (element, change) => {
          (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.elementObserverOff)(element);
          if (change.type === "childList" && this.elementObserverTest) {
            this.elementObserverTest.innerText = "jsmvcfw-elementHookName is changed.";
          }
          (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.elementObserverOn)(element);
        });
      }
    });
    __publicField(this, "onClickWriteCookie", () => {
      (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.writeCookie)("test", "1");
      if (this.elementCookieRead) {
        this.elementCookieRead.innerText = "Created";
      }
    });
    __publicField(this, "onClickReadCookie", () => {
      const result = (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.readCookie)("test");
      if (this.elementCookieRead) {
        if (result) {
          this.elementCookieRead.innerText = result;
        } else {
          this.elementCookieRead.innerText = "";
        }
      }
    });
    __publicField(this, "onClickRemoveCookie", () => {
      (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.removeCookie)("test");
      if (this.elementCookieRead) {
        this.elementCookieRead.innerText = "Removed";
      }
    });
    __publicField(this, "onClickWriteStorage", () => {
      (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.writeStorage)("test", "1");
      if (this.elementStorageRead) {
        this.elementStorageRead.innerText = "Created";
      }
    });
    __publicField(this, "onClickReadStorage", () => {
      const result = (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.readStorage)("test");
      if (this.elementStorageRead) {
        if (result) {
          this.elementStorageRead.innerText = result;
        } else {
          this.elementStorageRead.innerText = "";
        }
      }
    });
    __publicField(this, "onClickRemoveStorage", () => {
      (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.removeStorage)("test");
      if (this.elementStorageRead) {
        this.elementStorageRead.innerText = "Removed";
      }
    });
    __publicField(this, "elementHookObject", {});
    this.variableObject = {};
    this.methodObject = {};
    this.elementDivTest = null;
    this.elementObserverTest = null;
    this.elementCookieRead = null;
    this.elementStorageRead = null;
  }
  variable() {
    this.variableObject = (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.variableBind)(
      {
        count: 0,
        variableWatchTest: ""
      },
      this.constructor.name
    );
    this.methodObject = {
      onClickLink: this.onClickLink,
      onClickCount: this.onClickCount,
      onClickElementHook: this.onClickElementHook,
      onClickVariableWatchTest: this.onClickVariableWatchTest,
      onClickWriteCookie: this.onClickWriteCookie,
      onClickReadCookie: this.onClickReadCookie,
      onClickRemoveCookie: this.onClickRemoveCookie,
      onClickWriteStorage: this.onClickWriteStorage,
      onClickReadStorage: this.onClickReadStorage,
      onClickRemoveStorage: this.onClickRemoveStorage
    };
  }
  variableEffect(watch) {
    watch([
      {
        list: ["variableWatchTest"],
        action: () => {
          this.actionVariableWatchTest();
        }
      }
    ]);
  }
  view() {
    return (0,_view_Example__WEBPACK_IMPORTED_MODULE_1__["default"])(this.variableObject, this.methodObject);
  }
  event() {
  }
  subControllerList() {
    const resultList = [];
    return resultList;
  }
  rendered() {
    this.elementDivTest = this.elementHookObject.elementDivTest;
    this.elementObserverTest = this.elementHookObject.elementObserverTest;
    this.elementCookieRead = this.elementHookObject.elementCookieRead;
    this.elementStorageRead = this.elementHookObject.elementStorageRead;
    this.statusElmentObserverTest();
  }
  destroy() {
  }
}


/***/ }),

/***/ "./src/controller/Index.ts":
/*!*********************************!*\
  !*** ./src/controller/Index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Index)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_Index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view/Index */ "./src/view/Index.tsx");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);


class Index {
  constructor() {
    // Variable
    __publicField(this, "variableObject");
    __publicField(this, "methodObject");
    // Method
    __publicField(this, "onClickItem", (name) => {
      this.variableObject.itemClickName.state = name;
    });
    __publicField(this, "onClickLink", (pagePath) => {
      (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.navigateTo)(pagePath);
    });
    __publicField(this, "elementHookObject", {});
    this.variableObject = {};
    this.methodObject = {};
  }
  variable() {
    this.variableObject = (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.variableBind)(
      {
        itemClickName: ""
      },
      this.constructor.name
    );
    this.methodObject = {
      onClickItem: this.onClickItem,
      onClickLink: this.onClickLink
    };
  }
  variableEffect(watch) {
    watch([]);
  }
  view() {
    return (0,_view_Index__WEBPACK_IMPORTED_MODULE_1__["default"])(this.variableObject, this.methodObject);
  }
  event() {
  }
  subControllerList() {
    const resultList = [];
    return resultList;
  }
  rendered() {
  }
  destroy() {
  }
}


/***/ }),

/***/ "./src/view/Example.tsx":
/*!******************************!*\
  !*** ./src/view/Example.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);


const viewExample = (variableObject, methodObject) => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { "jsmvcfw-controllerName": "Example" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "page_container view_example" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "header" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "Example"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, 'From index to this page was used "navigateTo" setted to false.', /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), "Will be ok use it when exists a web server (like apache) because generate a url navigation (is not good for single page app).", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), `If is used withtout web server works but if the page will be refreshed a "GET" error appear (because the url doesn't exists).`)), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "left" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickLink("/");
      }
    },
    "Go back"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "Example: Increment count."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This example change the value in the controller and will be permanent in the view."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickCount();
      }
    },
    "Click for increment"
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "Count: ", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("span", null, variableObject.count.state))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "Example: jsmvcfw-elementHookName."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This example change directly the html in the view.", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), 'If you interact with another elment in the page, the value of the "jsmvcfw-elementHookName" will be reset to the original status.', /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), `"jsmvcfw-elementHookName" it's used for intereact with the element in the page, read and use the element.`), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "Text: ", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("span", { "jsmvcfw-elementHookName": "elementDivTest" }, "Exemplum textus.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickElementHook();
      }
    },
    "Click for interact with element"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "Example: variableEffect - watch."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, 'This example show how "variableEffect - watch" works.', /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), "If the variable change the associate method, defined in the controller, will be executed."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickVariableWatchTest();
      }
    },
    "Click for watch"
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "Text: ", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("span", null, variableObject.variableWatchTest.state))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "Example: elementObserver."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, 'This example show how "elementObserver" works.', /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), "If the DOM element change, the event defined in the controller, will be executed.", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), "The change will be catch if the status of that element will be changed by the logic action (don't have effect if will be reset by the render on the initial status)."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "DOM element: ", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("span", { "jsmvcfw-elementHookName": "elementObserverTest" }))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "Example: cookie."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This example show how coockie works.", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), 'Check in your dev tool the cookie to see the result (the read value for this example is "1").'), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickWriteCookie();
      }
    },
    "Click for create"
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickReadCookie();
      }
    },
    "Click for read"
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickRemoveCookie();
      }
    },
    "Click for remove"
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "Cookie status: ", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("span", { "jsmvcfw-elementHookName": "elementCookieRead" }))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "Example: storage."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This example show how storage works.", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("br", null), 'Check in your dev tool the local storage to see the result (the read value for this example is "1").'), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickWriteStorage();
      }
    },
    "Click for create"
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickReadStorage();
      }
    },
    "Click for read"
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "button",
    {
      onclick: () => {
        methodObject.onClickRemoveStorage();
      }
    },
    "Click for remove"
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "Storage status: ", /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("span", { "jsmvcfw-elementHookName": "elementStorageRead" }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewExample);


/***/ }),

/***/ "./src/view/Index.tsx":
/*!****************************!*\
  !*** ./src/view/Index.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_fw_Info__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view/fw/Info */ "./src/view/fw/Info.tsx");
/* harmony import */ var _view_fw_File__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view/fw/File */ "./src/view/fw/File.tsx");
/* harmony import */ var _view_fw_Method__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../view/fw/Method */ "./src/view/fw/Method.tsx");
/* harmony import */ var _view_mvc_Model__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../view/mvc/Model */ "./src/view/mvc/Model.tsx");
/* harmony import */ var _view_mvc_View__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../view/mvc/View */ "./src/view/mvc/View.tsx");
/* harmony import */ var _view_mvc_Controller__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../view/mvc/Controller */ "./src/view/mvc/Controller.tsx");








const viewIndex = (variableObject, methodObject) => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { "jsmvcfw-controllerName": "Index" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "page_container view_index" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "header" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "JsMvcFw wiki")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "left" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "p",
    {
      class: "click",
      onclick: () => {
        methodObject.onClickItem("");
      }
    },
    "Home"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "p",
    {
      class: "click",
      onclick: () => {
        methodObject.onClickLink("/example");
      }
    },
    "Example usage"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", { class: "category" }, "Framework:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "p",
    {
      class: "click",
      onclick: () => {
        methodObject.onClickItem("fwInfo");
      }
    },
    "Info"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "p",
    {
      class: "click",
      onclick: () => {
        methodObject.onClickItem("fwFile");
      }
    },
    "File"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "p",
    {
      class: "click",
      onclick: () => {
        methodObject.onClickItem("fwMethod");
      }
    },
    "Method"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", { class: "category" }, "Mvc structure:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "p",
    {
      class: "click",
      onclick: () => {
        methodObject.onClickItem("mvcModel");
      }
    },
    "Model"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "p",
    {
      class: "click",
      onclick: () => {
        methodObject.onClickItem("mvcView");
      }
    },
    "View"
  )), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "p",
    {
      class: "click",
      onclick: () => {
        methodObject.onClickItem("mvcController");
      }
    },
    "Controller"
  )))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "right" }, (() => {
    if (variableObject.itemClickName.state === "fwInfo") {
      return (0,_view_fw_Info__WEBPACK_IMPORTED_MODULE_1__["default"])();
    } else if (variableObject.itemClickName.state === "fwFile") {
      return (0,_view_fw_File__WEBPACK_IMPORTED_MODULE_2__["default"])();
    } else if (variableObject.itemClickName.state === "fwMethod") {
      return (0,_view_fw_Method__WEBPACK_IMPORTED_MODULE_3__["default"])();
    } else if (variableObject.itemClickName.state === "mvcModel") {
      return (0,_view_mvc_Model__WEBPACK_IMPORTED_MODULE_4__["default"])();
    } else if (variableObject.itemClickName.state === "mvcView") {
      return (0,_view_mvc_View__WEBPACK_IMPORTED_MODULE_5__["default"])();
    } else if (variableObject.itemClickName.state === "mvcController") {
      return (0,_view_mvc_Controller__WEBPACK_IMPORTED_MODULE_6__["default"])();
    } else {
      return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "Home"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This wiki is the reference point for understanding how to use the framework and how it is built. Is created with jsMvcFw to show everything in real use cases."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "The menu on the left contains various categories with detailed explanations."));
    }
  })()), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "bottom" })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewIndex);


/***/ }),

/***/ "./src/view/fw/File.tsx":
/*!******************************!*\
  !*** ./src/view/fw/File.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);


const viewFwFile = () => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "view_content view_fw_file" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "File"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFw.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This file represents the core of the framework, managing the lifecycle of controllers, virtual view rendering, and reactive variable binding."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "group" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Key Features:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Controller management: Maintains a hierarchical list of controllers and subcontrollers."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Virtual rendering: Uses createVirtualNode and updateVirtualNode to efficiently update the DOM."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reactive binding: VariableBind and variableHook allow variables to be bound to controllers and react to changes. Changes trigger automatic re-rendering and notifications via emitter."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "DOM observation: ElementObserver and elementHook monitor and manage dynamic DOM elements."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reactive effects: VariableWatch enables actions to be executed when a group of variables changes."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Framework reset: FrameworkReset() completely clears the internal state.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Architecture:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reactive Proxy: Each variable is wrapped in a proxy that intercepts get, set, and delete operations, triggering re-rendering."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Event emitter: Each controller has aneEmitter that emits variableChanged when state updates occur."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Virtual DOM: Rendering is based on virtual nodes to minimize operations on the real DOM.")))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwCookie.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This file provides utility functions for managing cookies in a secure and structured way, including encoding, decoding, and parsing values."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "group" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Key Features:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Cookie writing: writeCookie stores data as Base64-encoded JSON with optional expiration, HTTP-only flag, and path."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Cookie reading: readCookie retrieves and decodes stored cookies, automatically parsing JSON if valid."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Cookie removal: removeCookie deletes cookies by setting their expiration date to a past timestamp.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Architecture:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Base64 encoding: All values are encoded using window.btoa and decoded with window.atob for safe storage."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "JSON serialization: Complex objects are serialized before encoding, ensuring type consistency on retrieval."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Namespacing: Cookie keys are prefixed with getAppLabel() to avoid collisions across different applications."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Secure flag: Cookies are marked as Secure to enforce HTTPS-only transmission."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Regex escaping: escapeRegExp prevents regex injection when matching cookie names.")))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwDom.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This file defines the core rendering logic of the framework, focusing on virtual DOM creation, efficient DOM updates, and dynamic property handling."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "group" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Key Features:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Property application: applyProperty sets attributes and event listeners on DOM elements based on virtual node properties."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Property updates: updateProperty compares old and new property sets and applies only the necessary changes to the DOM."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Child node synchronization: updateChildren updates the DOM's child elements by comparing virtual node lists, supporting keyed nodes and embedded controllers."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Virtual node creation: createVirtualNode builds DOM elements from virtual node definitions, recursively handling children."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Virtual node updates: updateVirtualNode efficiently updates an existing DOM element by comparing its old and new virtual representations.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Architecture:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Virtual DOM: All rendering is based on virtual node structures to minimize direct DOM manipulation."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Keyed updates: Nodes with keys are tracked and reused to optimize reordering and replacement."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Event binding: Event listeners are dynamically attached and detached based on property changes.")))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwEmitter.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This file implements a generic event emitter class that allows subscribing to, emitting, and unsubscribing from typed events."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "group" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Key Features:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Event subscription: The on method registers listeners for specific event types."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Event emission: The emit method triggers all listeners associated with a given event, passing the appropriate payload."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Event unsubscription: The off method removes a specific listener or all matching listeners for an event, with optional full removal.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Architecture:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Type safety: Events are strongly typed using generics, ensuring payloads match expected types."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Listener storage: Listeners are stored in a dictionary keyed by event names, allowing efficient lookup and dispatch."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Flexible removal: Supports both single listener removal and bulk removal for a given event.")))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwInterface.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This file defines the core TypeScript interfaces and types used throughout the framework, including virtual DOM structure, reactive state management, controller lifecycle, and routing."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "group" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Key Features:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Virtual node structure: IvirtualNode describes the shape of a virtual DOM node, including tag name, properties, children, and optional key."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reactive state: IvariableBind and IvariableHook define reactive state containers with listener and setter capabilities."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reactive effects: IvariableEffect allows defining grouped variable watchers that trigger actions when dependencies change."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Controller interface: Icontroller outlines the lifecycle and structure of a controller, including view rendering, event handling, and subcontroller management."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Routing: Iroute defines a route with a title, path, and associated controller factory."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "History state: IhistoryPushStateData represents navigation state including previous URL and optional parameters."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "DOM observation: IcallbackObserver defines a callback for observing DOM mutations.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Architecture:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Strong typing: All components are defined using TypeScript interfaces and union types to ensure consistency and type safety."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Flexible property model: TvirtualNodeProperty supports strings, numbers, booleans, event handlers, nested virtual nodes, and null/undefined values."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Composable children: TvirtualNodeChildren allows virtual nodes to contain strings, numbers, or other virtual nodes.")))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwJsx.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This file defines the JSX factory function used to create virtual DOM nodes, along with a validation mechanism to ensure dynamic children have proper keys."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "group" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Key Features:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "JSX factory: The jsxFactory function constructs a virtual node from a tag name, property object, and a list of children."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Children normalization: All children, including nested arrays and numbers, are flattened and converted to strings or virtual nodes."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Key validation: The checkDynamicElement function verifies that dynamically generated elements (from arrays) include a key to prevent rendering issues."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Error tracing: stackErrorDetail extracts the caller location from the stack trace to provide detailed error context.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Architecture:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Virtual DOM compliance: The factory ensures that each node includes tag, properties, children, and an optional key."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Dynamic safety: Throws descriptive errors when multiple elements of the same tag are rendered from arrays without keys."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Type integration: Uses TypeScript interfaces to enforce structure and type safety for virtual nodes and children.")))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwRoute.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This file implements the client-side routing module for the framework, handling URL sanitization, history management, controller lifecycle, and page rendering for both soft and hard navigations."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "group" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Key Features:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "URL sanitization: cleanUrl escapes and normalizes the path and query parameters to produce a safe, canonical URL."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "History integration: historyPush stores navigation state (previous URL and optional parameters) and updates the browser history stack."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Controller cleanup: removeController disposes the active controller and all its child controllers to prevent memory leaks."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Navigation flow: populatePage performs soft navigation by matching routes, resetting framework state, pushing history, updating the document title, instantiating the controller, rendering the view, wiring events, and invoking post-render hooks; it also falls back to a 404 route when no match is found."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Route registration: route initializes the route list and wires window events (load, popstate, beforeunload) to drive navigation and cleanup."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Programmatic navigation: navigateTo provides a single entry point for soft or hard navigations with optional parameters and search string.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Architecture:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Route matching: Compares the trailing-slash-normalized target URL with each configured route path, prefixed by the URL root."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Lifecycle orchestration: Coordinates frameworkReset, renderTemplate, event binding, renderAfter, and rendered callbacks for a complete render cycle."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Robust fallbacks: Gracefully handles unmatched routes by updating history, title, and rendering a minimal 404 message into the application root.")))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "section" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwStorage.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "This file provides utility functions for managing data in localStorage with storage."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "group" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Key Features:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Data writing: writeStorage serializes the value to JSON, encodes it as Base64, and stores it under a namespaced key."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Data reading: readStorage retrieves the stored value, decodes Base64, and parses JSON back to its original type."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Data removal: removeStorage deletes the item from localStorage using the namespaced key.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "sub_title" }, "Architecture:"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Base64 encoding: Values are encoded using window.btoa and decoded with window.atob for safe storage."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "JSON serialization: Complex objects are converted to JSON before encoding, ensuring compatibility with localStorage."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Namespacing: Keys are prefixed with getAppLabel() to avoid collisions between different applications or modules."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Persistent storage: Unlike cookies, data stored in localStorage persists until explicitly removed."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Type safety: Generic types (T) ensure that stored and retrieved data maintain type consistency.")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewFwFile);


/***/ }),

/***/ "./src/view/fw/Info.tsx":
/*!******************************!*\
  !*** ./src/view/fw/Info.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);


const viewFwInfo = () => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "view_content" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "Info"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", null, "The framework is a platform designed to simplify the development of dynamic user interfaces and modern web applications. It provides a clear structure and integrated tools to create reusable components, manage application state, and update the UI reactively, reducing code complexity and improving maintainability."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "What does the framework do?"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Component-based architecture: the interface is divided into modular components, each with its own logic, style, and behavior. This approach promotes reuse and scalability."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reactive UI updates: when data changes, the framework automatically updates only the necessary parts of the interface, ensuring high performance."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "State management: includes mechanisms to track and synchronize data between components, avoiding inconsistencies and simplifying application logic."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Integrated routing: allows navigation between views with and without reloading the entire page. If need single page application or use webserver, the system support both navigation just with 1 setting (it's possible use both in same application)."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Interfaces with JSX: enables defining the interface structure using a declarative syntax that combines logic and markup, simplifying the creation of complex components. It's not necessary to use a custom name or special code, just simple html."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Storage management: allows saving data in localStorage or sessionStorage, with encoding options to ensure security and integrity."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Cookie management: enables reading, writing, and deleting cookies, with support for value encoding and options for expiration and security.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "Why use it?"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "In just 54 KB (uncompressed) and 10 KB (compressed), you get a complete and professional system."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Simplifies the development of complex interfaces."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reduces repetitive code thanks to reusable components."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Improves project maintainability and readability."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Supports scalability, from small UIs to large applications."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "No external dependencies with focus on security and performance.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "Key Principles"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Modularity: each part of the app is independent and reusable."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reactivity: the UI responds to data changes in real time."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Reduces repetitive code thanks to reusable components."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Performance: optimized updates to avoid resource waste."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Extensibility: easy integration with external libraries and tools (compatibile with 100% of all external library because is created with pure typescript without dependencies)."), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Secure and easy to use.")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewFwInfo);


/***/ }),

/***/ "./src/view/fw/Method.tsx":
/*!********************************!*\
  !*** ./src/view/fw/Method.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);


const viewFwMethod = () => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "view_content" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "Method"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFw.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return type"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Description"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "setUrlRoot(urlRootValue: string)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Sets the framework's base URL.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "getUrlRoot()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "string"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Returns the current base URL.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "getControllerList()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Array<{ parent: Icontroller; childrenList: Icontroller[] }>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Returns the hierarchical list of controllers (parent + children).")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "renderTemplate(controller, controllerParent?, callback?)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Renders the controller (and subcontrollers), attaches hooks to elements, and activates reactive effects.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "renderAfter(controller)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Promise<void>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Resolves when all controller variables are loaded and no re-render is in progress.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "variableHook<T>(label, stateValue, controllerName)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IvariableHook<T>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Creates a single reactive state for a controller, with state and setState.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "variableBind<T extends Record<string, unknown>>(variableObject, controllerName)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "{ [K in keyof T]: IvariableBind<T[K]> }"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Creates reactive bindings for each key in variableObject, with getter/setter and listeners.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "elementObserver(element: HTMLElement, callback: IcallbackObserver)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Activates a MutationObserver on the element and registers one or more callbacks.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "elementObserverOff(element: HTMLElement)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Disconnects the MutationObserver from the element.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "elementObserverOn(element: HTMLElement)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Reactivates observation on the element if an observer exists.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "frameworkReset()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Fully resets the internal state of the framework."))))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwCookie.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return type"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Description"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "writeCookie<T>(tag: string, value: T, expire = '', httpOnly = '', path = '/')", " "), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Encodes the value as Base64, stores it in a cookie with optional expiration, HTTP-only flag, and path.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "readCookie<T>(tag: string)", " "), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "T | undefined"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Reads a cookie by tag, decodes Base64 if applicable, parses JSON if valid, and returns the value.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "removeCookie(tag: string)", " "), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Deletes the cookie by setting its expiration date to a past timestamp."))))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwDom.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Purpose"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "createVirtualNode(node: IvirtualNode)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "HTMLElement"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Creates a DOM element from a virtual node, applying properties and recursively rendering children.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "updateVirtualNode(element: Element, nodeOld: IvirtualNode, nodeNew: IvirtualNode)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Updates an existing DOM element to match a new virtual node, modifying properties and children as needed."))))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwEmitter.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Purpose"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "class Emitter<Events extends Record<string, unknown>>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Emitter"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Default export class that manages event listeners and dispatching for typed events."))))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwInterface.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Purpose"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "interface IvirtualNode"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IvirtualNode"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Defines a virtual DOM node with tag, properties, children, and optional key.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "interface IvariableBind<T>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IvariableBind<T>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Represents a reactive binding with state and listener registration.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "interface IvariableHook<T>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IvariableHook<T>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Represents a reactive hook with state and setState method.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "interface IvariableEffect"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IvariableEffect"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Defines a function that reacts to changes in a group of variables.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "interface Icontroller"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Icontroller"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Describes a controller with lifecycle methods, view rendering, and variable handling.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "interface Iroute"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Iroute"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Represents a route with title, path, and associated controller.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "interface IhistoryPushStateData"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IhistoryPushStateData"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Contains data for managing browser history state transitions.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "interface IcallbackObserver"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IcallbackObserver"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Defines a callback for observing DOM mutations.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "type TvirtualNodeProperty"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "TvirtualNodeProperty"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Union type for valid virtual node property values.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "type TvirtualNodeChildren"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "TvirtualNodeChildren"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Union type for valid virtual node children."))))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwJsx.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Purpose"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, 'jsxFactory(tag: string, propertyObjectValue?: IvirtualNode["propertyObject"], ...childrenListValue: TvirtualNodeChildren[])'), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IvirtualNode"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Creates a virtual node from tag, props, and children (flattens arrays, converts numbers to strings, and validates the presence of keys for dynamic lists).")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "jsxFragment({ children }: { children: Array<IvirtualNode | string> })"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Array<IvirtualNode | string>"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Returns the children without any wrapper, allowing the use of JSX Fragments in the framework without creating an additional virtual node. Need be use inside the html code (not how root element)."))))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwRoute.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Purpose"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "route(routeListValue: Iroute[])"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Registers the application's routes and wires browser events (onload, onpopstate, onbeforeunload) to render the matching controller and manage history state.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "navigateTo(urlNext: string, isSoft = true, parameterObject?: Record<string, unknown>, parameterSearch?: string)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Navigates to the given URL; soft navigation updates the view and history without full page reload, while hard navigation changes window location."))))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "title" }, "JsMvcFwStorage.ts"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return type"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Description"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "writeStorage<T>(tag: string, value: T)", " "), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Encodes the value as Base64 and stores it in localStorage under a namespaced key.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "readStorage<T>(tag: string)", " "), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "T | undefined"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Retrieves and decodes the stored value from localStorage, parsing JSON if applicable.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "removeStorage(tag: string)", " "), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Removes the item from localStorage using the namespaced key.")))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewFwMethod);


/***/ }),

/***/ "./src/view/mvc/Controller.tsx":
/*!*************************************!*\
  !*** ./src/view/mvc/Controller.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);


const viewMvcController = () => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "view_content" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "Controller"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return type"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Description"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "variableObject"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "modelIndex.Ivariable"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Holds the reactive variables bound to the view.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "methodObject"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "modelIndex.Imethod"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Holds the reactive method bound to the view.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "constructor()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Initializes variables.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "elementHookObject"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "modelIndex.IelementHook"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Keeps references to DOM element hooks for dynamic updates (with this tag in the view ", "jsmvcfw-elementHookName='xxx'", ")")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "variable()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Binds reactive variables and assigns controller methods for the view.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "variableEffect(watch: IvariableEffect)"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Sets up watchers for variable changes.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "view()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IvirtualNode"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Returns the virtual DOM node generated by the view function.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "event()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Event registration logic.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "subControllerList()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Icontroller[]"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Populate the sub-controllers list (use this tag in the view ", "jsmvcfw-controllerName='xxx'", ").")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "rendered()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Called after the view is rendered.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "destroy()"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "void"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Cleans up resources when the controller is destroyed.")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewMvcController);


/***/ }),

/***/ "./src/view/mvc/Model.tsx":
/*!********************************!*\
  !*** ./src/view/mvc/Model.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);


const viewMvcModel = () => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "view_content" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "Model"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Interface"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Description"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Ivariable"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Defines reactive variables.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Imethod"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Defines event handler methods.")), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IelementHook"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Defines DOM elements.")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewMvcModel);


/***/ }),

/***/ "./src/view/mvc/View.tsx":
/*!*******************************!*\
  !*** ./src/view/mvc/View.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);


const viewMvcView = () => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "view_content" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("h1", null, "View"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("table", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("colgroup", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" }), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("col", { class: "cell" })), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("thead", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row not_hover" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Signature"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Return type"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("th", { class: "cell" }, "Description"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tbody", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("tr", { class: "row" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "viewMvcView(variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "IvirtualNode"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("td", { class: "cell" }, "Renders the virtual DOM for the View using JSX.")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewMvcView);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/Main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _controller_Index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controller/Index */ "./src/controller/Index.ts");
/* harmony import */ var _controller_Example__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controller/Example */ "./src/controller/Example.ts");




(0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.setUrlRoot)("");
(0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.setAppLabel)("jsmvcfw");
(0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.route)([
  {
    title: "Index",
    path: "/",
    controller: () => new _controller_Index__WEBPACK_IMPORTED_MODULE_1__["default"]()
  },
  {
    title: "Example",
    path: "/example",
    controller: () => new _controller_Example__WEBPACK_IMPORTED_MODULE_2__["default"]()
  }
]);

})();

/******/ })()
;
//# sourceMappingURL=main.js.map