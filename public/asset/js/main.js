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
exports.frameworkReset = exports.elementObserverOn = exports.elementObserverOff = exports.elementObserver = exports.variableBind = exports.variableHook = exports.renderAfter = exports.renderTemplate = exports.getControllerList = exports.getUrlRoot = exports.setUrlRoot = void 0;
const JsMvcFwDom_1 = __webpack_require__(/*! ./JsMvcFwDom */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwDom.js");
const JsMvcFwEmitter_1 = __importDefault(__webpack_require__(/*! ./JsMvcFwEmitter */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwEmitter.js"));
let urlRoot = "";
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
    const elementHookList = elementContainer.querySelectorAll("[jsmvcfw-elementHook]");
    const elementHookObject = {};
    for (const elementHook of elementHookList) {
        const attribute = elementHook.getAttribute("jsmvcfw-elementHook");
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

/***/ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwForm.js":
/*!************************************************************!*\
  !*** ./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwForm.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formHook = void 0;
const formHook = () => { };
exports.formHook = formHook;
//# sourceMappingURL=JsMvcFwForm.js.map

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
exports.jsxFactory = void 0;
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
    return {
        tag,
        propertyObject,
        childrenList,
        key: key !== undefined ? String(key) : undefined
    };
};
exports.jsxFactory = jsxFactory;
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.storageHook = void 0;
const storageHook = () => { };
exports.storageHook = storageHook;
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
__exportStar(__webpack_require__(/*! ./JsMvcFwDom */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwDom.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwEmitter */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwEmitter.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwForm */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwForm.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwInterface */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwInterface.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwJsx */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwJsx.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwRoute */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwRoute.js"), exports);
__exportStar(__webpack_require__(/*! ./JsMvcFwStorage */ "./node_modules/@cimo/jsmvcfw/dist/src/JsMvcFwStorage.js"), exports);
//# sourceMappingURL=Main.js.map

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
        isLoading: true
      },
      this.constructor.name
    );
    this.methodObject = {
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

/***/ "./src/controller/Page1.ts":
/*!*********************************!*\
  !*** ./src/controller/Page1.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Page1)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _view_Page1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view/Page1 */ "./src/view/Page1.tsx");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);


class Page1 {
  // Method
  constructor() {
    // Variable
    __publicField(this, "variableObject");
    __publicField(this, "methodObject");
    __publicField(this, "elementHookObject", {});
    this.variableObject = {};
    this.methodObject = {};
  }
  variable() {
    this.variableObject = (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.variableBind)(
      {
        isLoading: true
      },
      this.constructor.name
    );
    this.methodObject = {};
  }
  variableEffect(watch) {
    watch([]);
  }
  view() {
    return (0,_view_Page1__WEBPACK_IMPORTED_MODULE_1__["default"])(this.variableObject, this.methodObject);
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


const viewIndex = (variableObject, methodObject) => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { "jsmvcfw-controllerName": "Index" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "page_container view_index" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "header" }, "Header"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "left" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("ul", null, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)(
    "li",
    {
      onclick: () => {
        methodObject.onClickLink("/page_1");
      }
    },
    /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("p", { class: "link" }, "Go to page 1")
  ), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Section 1"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("li", null, "Section 2"))), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "right" }, "Right")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewIndex);


/***/ }),

/***/ "./src/view/Page1.tsx":
/*!****************************!*\
  !*** ./src/view/Page1.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @cimo/jsmvcfw/dist/src/Main */ "./node_modules/@cimo/jsmvcfw/dist/src/Main.js");
/* harmony import */ var _cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__);


const viewPage1 = (variableObject, methodObject) => {
  return /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { "jsmvcfw-controllerName": "Page1" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "page_container view_page1" }, /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "header" }, "Header"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "left" }, "Left"), /* @__PURE__ */ (0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.jsxFactory)("div", { class: "right" }, "Right")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (viewPage1);


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
/* harmony import */ var _controller_Page1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controller/Page1 */ "./src/controller/Page1.ts");




(0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.setUrlRoot)("");
(0,_cimo_jsmvcfw_dist_src_Main__WEBPACK_IMPORTED_MODULE_0__.route)([
  {
    title: "Index",
    path: "/",
    controller: () => new _controller_Index__WEBPACK_IMPORTED_MODULE_1__["default"]()
  },
  {
    title: "Page 1",
    path: "/page_1",
    controller: () => new _controller_Page1__WEBPACK_IMPORTED_MODULE_2__["default"]()
  }
]);

})();

/******/ })()
;
//# sourceMappingURL=main.js.map