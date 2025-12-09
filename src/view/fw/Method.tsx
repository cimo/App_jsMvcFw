import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main.js";

const viewFwMethod = (): IvirtualNode => {
    return (
        <div class="view_content">
            <h1>Method</h1>
            <ul>
                <li>
                    <p class="title">JsMvcFw.ts</p>
                    <table>
                        <colgroup>
                            <col class="cell" />
                            <col class="cell" />
                            <col class="cell" />
                        </colgroup>
                        <thead class="filter">
                            <tr className="row filter_action"></tr>
                            <tr class="row not_hover">
                                <th class="cell">Signature</th>
                                <th class="cell">Return type</th>
                                <th class="cell">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row">
                                <td class="cell">{"setUrlRoot(urlRootValue: string)"}</td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">Sets the framework's base URL.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"getUrlRoot()"}</td>
                                <td class="cell">{"string"}</td>
                                <td class="cell">Returns the current base URL.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"getControllerList()"}</td>
                                <td class="cell">{"Array<{ parent: Icontroller; childrenList: Icontroller[] }>"}</td>
                                <td class="cell">Returns the hierarchical list of controllers (parent + children).</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"renderTemplate(controller, controllerParent?, callback?)"}</td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">
                                    Renders the controller (and subcontrollers), attaches hooks to elements, and activates reactive effects.
                                </td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"renderAfter(controller)"}</td>
                                <td class="cell">{"Promise<void>"}</td>
                                <td class="cell">Resolves when all controller variables are loaded and no re-render is in progress.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"variableHook<T>(label, stateValue, controllerName)"}</td>
                                <td class="cell">{"IvariableHook<T>"}</td>
                                <td class="cell">Creates a single reactive state for a controller, with state and setState.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"variableBind<T extends Record<string, unknown>>(variableObject, controllerName)"}</td>
                                <td class="cell">{"{ [K in keyof T]: IvariableBind<T[K]> }"}</td>
                                <td class="cell">Creates reactive bindings for each key in variableObject, with getter/setter and listeners.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"elementObserver(element: HTMLElement, callback: IcallbackObserver)"}</td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">Activates a MutationObserver on the element and registers one or more callbacks.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"elementObserverOff(element: HTMLElement)"}</td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">Disconnects the MutationObserver from the element.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"elementObserverOn(element: HTMLElement)"}</td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">Reactivates observation on the element if an observer exists.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"frameworkReset()"}</td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">Fully resets the internal state of the framework.</td>
                            </tr>
                        </tbody>
                    </table>
                </li>
                <li>
                    <p class="title">JsMvcFwCookie.ts</p>
                    <table>
                        <colgroup>
                            <col class="cell" />
                            <col class="cell" />
                            <col class="cell" />
                        </colgroup>
                        <thead class="filter">
                            <tr className="row filter_action"></tr>
                            <tr class="row not_hover">
                                <th class="cell">Signature</th>
                                <th class="cell">Return type</th>
                                <th class="cell">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row">
                                <td class="cell">{"writeCookie<T>(tag: string, value: T, expire = '', httpOnly = '', path = '/')"} </td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">
                                    Encodes the value as Base64, stores it in a cookie with optional expiration, HTTP-only flag, and path.
                                </td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"readCookie<T>(tag: string)"} </td>
                                <td class="cell">{"T | undefined"}</td>
                                <td class="cell">
                                    Reads a cookie by tag, decodes Base64 if applicable, parses JSON if valid, and returns the value.
                                </td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"removeCookie(tag: string)"} </td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">Deletes the cookie by setting its expiration date to a past timestamp.</td>
                            </tr>
                        </tbody>
                    </table>
                </li>
                <li>
                    <p class="title">JsMvcFwDom.ts</p>
                    <table>
                        <colgroup>
                            <col class="cell" />
                            <col class="cell" />
                            <col class="cell" />
                        </colgroup>
                        <thead class="filter">
                            <tr className="row filter_action"></tr>
                            <tr class="row not_hover">
                                <th class="cell">Signature</th>
                                <th class="cell">Return</th>
                                <th class="cell">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row">
                                <td class="cell">{"createVirtualNode(node: IvirtualNode)"}</td>
                                <td class="cell">{"HTMLElement"}</td>
                                <td class="cell">
                                    Creates a DOM element from a virtual node, applying properties and recursively rendering children.
                                </td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"updateVirtualNode(element: Element, nodeOld: IvirtualNode, nodeNew: IvirtualNode)"}</td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">
                                    Updates an existing DOM element to match a new virtual node, modifying properties and children as needed.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </li>
                <li>
                    <p class="title">JsMvcFwEmitter.ts</p>
                    <table>
                        <colgroup>
                            <col class="cell" />
                            <col class="cell" />
                            <col class="cell" />
                        </colgroup>
                        <thead class="filter">
                            <tr className="row filter_action"></tr>
                            <tr class="row not_hover">
                                <th class="cell">Signature</th>
                                <th class="cell">Return</th>
                                <th class="cell">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row">
                                <td class="cell">{"class Emitter<Events extends Record<string, unknown>>"}</td>
                                <td class="cell">{"Emitter"}</td>
                                <td class="cell">Default export class that manages event listeners and dispatching for typed events.</td>
                            </tr>
                        </tbody>
                    </table>
                </li>
                <li>
                    <p class="title">JsMvcFwInterface.ts</p>
                    <table>
                        <colgroup>
                            <col class="cell" />
                            <col class="cell" />
                            <col class="cell" />
                        </colgroup>
                        <thead class="filter">
                            <tr className="row filter_action"></tr>
                            <tr class="row not_hover">
                                <th class="cell">Signature</th>
                                <th class="cell">Return</th>
                                <th class="cell">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row">
                                <td class="cell">{"interface IvirtualNode"}</td>
                                <td class="cell">{"IvirtualNode"}</td>
                                <td class="cell">Defines a virtual DOM node with tag, properties, children, and optional key.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"interface IvariableBind<T>"}</td>
                                <td class="cell">{"IvariableBind<T>"}</td>
                                <td class="cell">Represents a reactive binding with state and listener registration.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"interface IvariableHook<T>"}</td>
                                <td class="cell">{"IvariableHook<T>"}</td>
                                <td class="cell">Represents a reactive hook with state and setState method.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"interface IvariableEffect"}</td>
                                <td class="cell">{"IvariableEffect"}</td>
                                <td class="cell">Defines a function that reacts to changes in a group of variables.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"interface Icontroller"}</td>
                                <td class="cell">{"Icontroller"}</td>
                                <td class="cell">Describes a controller with lifecycle methods, view rendering, and variable handling.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"interface Iroute"}</td>
                                <td class="cell">{"Iroute"}</td>
                                <td class="cell">Represents a route with title, path, and associated controller.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"interface IhistoryPushStateData"}</td>
                                <td class="cell">{"IhistoryPushStateData"}</td>
                                <td class="cell">Contains data for managing browser history state transitions.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"interface IcallbackObserver"}</td>
                                <td class="cell">{"IcallbackObserver"}</td>
                                <td class="cell">Defines a callback for observing DOM mutations.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"type TvirtualNodeProperty"}</td>
                                <td class="cell">{"TvirtualNodeProperty"}</td>
                                <td class="cell">Union type for valid virtual node property values.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"type TvirtualNodeChildren"}</td>
                                <td class="cell">{"TvirtualNodeChildren"}</td>
                                <td class="cell">Union type for valid virtual node children.</td>
                            </tr>
                        </tbody>
                    </table>
                </li>
                <li>
                    <p class="title">JsMvcFwJsx.ts</p>
                    <table>
                        <colgroup>
                            <col class="cell" />
                            <col class="cell" />
                            <col class="cell" />
                        </colgroup>
                        <thead class="filter">
                            <tr className="row filter_action"></tr>
                            <tr class="row not_hover">
                                <th class="cell">Signature</th>
                                <th class="cell">Return</th>
                                <th class="cell">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row">
                                <td class="cell">
                                    {
                                        'jsxFactory(tag: string, propertyObjectValue?: IvirtualNode["propertyObject"], ...childrenListValue: TvirtualNodeChildren[])'
                                    }
                                </td>
                                <td class="cell">{"IvirtualNode"}</td>
                                <td class="cell">
                                    Creates a virtual node from tag, props, and children (flattens arrays, converts numbers to strings, and validates
                                    the presence of keys for dynamic lists).
                                </td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"jsxFragment({ children }: { children: Array<IvirtualNode | string> })"}</td>
                                <td class="cell">{"Array<IvirtualNode | string>"}</td>
                                <td class="cell">
                                    Returns the children without any wrapper, allowing the use of JSX Fragments in the framework without creating an
                                    additional virtual node. Need be use inside the html code (not how root element).
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </li>
                <li>
                    <p class="title">JsMvcFwRoute.ts</p>
                    <table>
                        <colgroup>
                            <col class="cell" />
                            <col class="cell" />
                            <col class="cell" />
                        </colgroup>
                        <thead class="filter">
                            <tr className="row filter_action"></tr>
                            <tr class="row not_hover">
                                <th class="cell">Signature</th>
                                <th class="cell">Return</th>
                                <th class="cell">Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row">
                                <td class="cell">{"route(routeListValue: Iroute[])"}</td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">
                                    Registers the application's routes and wires browser events (onload, onpopstate, onbeforeunload) to render the
                                    matching controller and manage history state.
                                </td>
                            </tr>
                            <tr class="row">
                                <td class="cell">
                                    {
                                        "navigateTo(urlNext: string, isSoft = true, parameterObject?: Record<string, unknown>, parameterSearch?: string)"
                                    }
                                </td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">
                                    Navigates to the given URL; soft navigation updates the view and history without full page reload, while hard
                                    navigation changes window location.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </li>
                <li>
                    <p class="title">JsMvcFwStorage.ts</p>
                    <table>
                        <colgroup>
                            <col class="cell" />
                            <col class="cell" />
                            <col class="cell" />
                        </colgroup>
                        <thead class="filter">
                            <tr className="row filter_action"></tr>
                            <tr class="row not_hover">
                                <th class="cell">Signature</th>
                                <th class="cell">Return type</th>
                                <th class="cell">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row">
                                <td class="cell">{"writeStorage<T>(tag: string, value: T)"} </td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">Encodes the value as Base64 and stores it in localStorage under a namespaced key.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"readStorage<T>(tag: string)"} </td>
                                <td class="cell">{"T | undefined"}</td>
                                <td class="cell">Retrieves and decodes the stored value from localStorage, parsing JSON if applicable.</td>
                            </tr>
                            <tr class="row">
                                <td class="cell">{"removeStorage(tag: string)"} </td>
                                <td class="cell">{"void"}</td>
                                <td class="cell">Removes the item from localStorage using the namespaced key.</td>
                            </tr>
                        </tbody>
                    </table>
                </li>
            </ul>
        </div>
    );
};

export default viewFwMethod;
