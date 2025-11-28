import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

const viewFwFile = (): IvirtualNode => {
    return (
        <div class="view_content">
            <h1>File</h1>
            <div class="section">
                <p class="title">JsMvcFw.ts</p>
                <p>
                    This file represents the core of the framework, managing the lifecycle of controllers, virtual view rendering, and reactive
                    variable binding.
                </p>
                <div class="group">
                    <p class="sub_title">Key Features:</p>
                    <ul>
                        <li>Controller management: Maintains a hierarchical list of controllers and subcontrollers.</li>
                        <li>Virtual rendering: Uses createVirtualNode and updateVirtualNode to efficiently update the DOM.</li>
                        <li>
                            Reactive binding: VariableBind and variableHook allow variables to be bound to controllers and react to changes. Changes
                            trigger automatic re-rendering and notifications via emitter.
                        </li>
                        <li>DOM observation: ElementObserver and elementHook monitor and manage dynamic DOM elements.</li>
                        <li>Reactive effects: VariableWatch enables actions to be executed when a group of variables changes.</li>
                        <li>Framework reset: FrameworkReset() completely clears the internal state.</li>
                    </ul>
                    <p class="sub_title">Architecture:</p>
                    <ul>
                        <li>
                            Reactive Proxy: Each variable is wrapped in a proxy that intercepts get, set, and delete operations, triggering
                            re-rendering.
                        </li>
                        <li>Event emitter: Each controller has aneEmitter that emits variableChanged when state updates occur.</li>
                        <li>Virtual DOM: Rendering is based on virtual nodes to minimize operations on the real DOM.</li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <p class="title">JsMvcFwCookie.ts</p>
                <p>
                    This file provides utility functions for managing cookies in a secure and structured way, including encoding, decoding, and
                    parsing values.
                </p>
                <div class="group">
                    <p class="sub_title">Key Features:</p>
                    <ul>
                        <li>Cookie writing: writeCookie stores data as Base64-encoded JSON with optional expiration, HTTP-only flag, and path.</li>
                        <li>Cookie reading: readCookie retrieves and decodes stored cookies, automatically parsing JSON if valid.</li>
                        <li>Cookie removal: removeCookie deletes cookies by setting their expiration date to a past timestamp.</li>
                    </ul>
                    <p class="sub_title">Architecture:</p>
                    <ul>
                        <li>Base64 encoding: All values are encoded using window.btoa and decoded with window.atob for safe storage.</li>
                        <li>JSON serialization: Complex objects are serialized before encoding, ensuring type consistency on retrieval.</li>
                        <li>Namespacing: Cookie keys are prefixed with getAppLabel() to avoid collisions across different applications.</li>
                        <li>Secure flag: Cookies are marked as Secure to enforce HTTPS-only transmission.</li>
                        <li>Regex escaping: escapeRegExp prevents regex injection when matching cookie names.</li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <p class="title">JsMvcFwDom.ts</p>
                <p>
                    This file defines the core rendering logic of the framework, focusing on virtual DOM creation, efficient DOM updates, and dynamic
                    property handling.
                </p>
                <div class="group">
                    <p class="sub_title">Key Features:</p>
                    <ul>
                        <li>
                            Property application: applyProperty sets attributes and event listeners on DOM elements based on virtual node properties.
                        </li>
                        <li>
                            Property updates: updateProperty compares old and new property sets and applies only the necessary changes to the DOM.
                        </li>
                        <li>
                            Child node synchronization: updateChildren updates the DOM's child elements by comparing virtual node lists, supporting
                            keyed nodes and embedded controllers.
                        </li>
                        <li>
                            Virtual node creation: createVirtualNode builds DOM elements from virtual node definitions, recursively handling children.
                        </li>
                        <li>
                            Virtual node updates: updateVirtualNode efficiently updates an existing DOM element by comparing its old and new virtual
                            representations.
                        </li>
                    </ul>
                    <p class="sub_title">Architecture:</p>
                    <ul>
                        <li>Virtual DOM: All rendering is based on virtual node structures to minimize direct DOM manipulation.</li>
                        <li>Keyed updates: Nodes with keys are tracked and reused to optimize reordering and replacement.</li>
                        <li>Event binding: Event listeners are dynamically attached and detached based on property changes.</li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <p class="title">JsMvcFwEmitter.ts</p>
                <p>This file implements a generic event emitter class that allows subscribing to, emitting, and unsubscribing from typed events.</p>
                <div class="group">
                    <p class="sub_title">Key Features:</p>
                    <ul>
                        <li>Event subscription: The on method registers listeners for specific event types.</li>
                        <li>
                            Event emission: The emit method triggers all listeners associated with a given event, passing the appropriate payload.
                        </li>
                        <li>
                            Event unsubscription: The off method removes a specific listener or all matching listeners for an event, with optional
                            full removal.
                        </li>
                    </ul>
                    <p class="sub_title">Architecture:</p>
                    <ul>
                        <li>Type safety: Events are strongly typed using generics, ensuring payloads match expected types.</li>
                        <li>Listener storage: Listeners are stored in a dictionary keyed by event names, allowing efficient lookup and dispatch.</li>
                        <li>Flexible removal: Supports both single listener removal and bulk removal for a given event.</li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <p class="title">JsMvcFwInterface.ts</p>
                <p>
                    This file defines the core TypeScript interfaces and types used throughout the framework, including virtual DOM structure,
                    reactive state management, controller lifecycle, and routing.
                </p>
                <div class="group">
                    <p class="sub_title">Key Features:</p>
                    <ul>
                        <li>
                            Virtual node structure: IvirtualNode describes the shape of a virtual DOM node, including tag name, properties, children,
                            and optional key.
                        </li>
                        <li>
                            Reactive state: IvariableBind and IvariableHook define reactive state containers with listener and setter capabilities.
                        </li>
                        <li>
                            Reactive effects: IvariableEffect allows defining grouped variable watchers that trigger actions when dependencies change.
                        </li>
                        <li>
                            Controller interface: Icontroller outlines the lifecycle and structure of a controller, including view rendering, event
                            handling, and subcontroller management.
                        </li>
                        <li>Routing: Iroute defines a route with a title, path, and associated controller factory.</li>
                        <li>History state: IhistoryPushStateData represents navigation state including previous URL and optional parameters.</li>
                        <li>DOM observation: IcallbackObserver defines a callback for observing DOM mutations.</li>
                    </ul>
                    <p class="sub_title">Architecture:</p>
                    <ul>
                        <li>
                            Strong typing: All components are defined using TypeScript interfaces and union types to ensure consistency and type
                            safety.
                        </li>
                        <li>
                            Flexible property model: TvirtualNodeProperty supports strings, numbers, booleans, event handlers, nested virtual nodes,
                            and null/undefined values.
                        </li>
                        <li>Composable children: TvirtualNodeChildren allows virtual nodes to contain strings, numbers, or other virtual nodes.</li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <p class="title">JsMvcFwJsx.ts</p>
                <p>
                    This file defines the JSX factory function used to create virtual DOM nodes, along with a validation mechanism to ensure dynamic
                    children have proper keys.
                </p>
                <div class="group">
                    <p class="sub_title">Key Features:</p>
                    <ul>
                        <li>
                            JSX factory: The jsxFactory function constructs a virtual node from a tag name, property object, and a list of children.
                        </li>
                        <li>
                            Children normalization: All children, including nested arrays and numbers, are flattened and converted to strings or
                            virtual nodes.
                        </li>
                        <li>
                            Key validation: The checkDynamicElement function verifies that dynamically generated elements (from arrays) include a key
                            to prevent rendering issues.
                        </li>
                        <li>Error tracing: stackErrorDetail extracts the caller location from the stack trace to provide detailed error context.</li>
                    </ul>
                    <p class="sub_title">Architecture:</p>
                    <ul>
                        <li>Virtual DOM compliance: The factory ensures that each node includes tag, properties, children, and an optional key.</li>
                        <li>
                            Dynamic safety: Throws descriptive errors when multiple elements of the same tag are rendered from arrays without keys.
                        </li>
                        <li>Type integration: Uses TypeScript interfaces to enforce structure and type safety for virtual nodes and children.</li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <p class="title">JsMvcFwRoute.ts</p>
                <p>
                    This file implements the client-side routing module for the framework, handling URL sanitization, history management, controller
                    lifecycle, and page rendering for both soft and hard navigations.
                </p>
                <div class="group">
                    <p class="sub_title">Key Features:</p>
                    <ul>
                        <li>URL sanitization: cleanUrl escapes and normalizes the path and query parameters to produce a safe, canonical URL.</li>
                        <li>
                            History integration: historyPush stores navigation state (previous URL and optional parameters) and updates the browser
                            history stack.
                        </li>
                        <li>
                            Controller cleanup: removeController disposes the active controller and all its child controllers to prevent memory leaks.
                        </li>
                        <li>
                            Navigation flow: populatePage performs soft navigation by matching routes, resetting framework state, pushing history,
                            updating the document title, instantiating the controller, rendering the view, wiring events, and invoking post-render
                            hooks; it also falls back to a 404 route when no match is found.
                        </li>
                        <li>
                            Route registration: route initializes the route list and wires window events (load, popstate, beforeunload) to drive
                            navigation and cleanup.
                        </li>
                        <li>
                            Programmatic navigation: navigateTo provides a single entry point for soft or hard navigations with optional parameters
                            and search string.
                        </li>
                    </ul>
                    <p class="sub_title">Architecture:</p>
                    <ul>
                        <li>
                            Route matching: Compares the trailing-slash-normalized target URL with each configured route path, prefixed by the URL
                            root.
                        </li>
                        <li>
                            Lifecycle orchestration: Coordinates frameworkReset, renderTemplate, event binding, renderAfter, and rendered callbacks
                            for a complete render cycle.
                        </li>
                        <li>
                            Robust fallbacks: Gracefully handles unmatched routes by updating history, title, and rendering a minimal 404 message into
                            the application root.
                        </li>
                    </ul>
                </div>
            </div>
            <div class="section">
                <p class="title">JsMvcFwStorage.ts</p>
                <p>This file provides utility functions for managing data in localStorage with storage.</p>
                <div class="group">
                    <p class="sub_title">Key Features:</p>
                    <ul>
                        <li>Data writing: writeStorage serializes the value to JSON, encodes it as Base64, and stores it under a namespaced key.</li>
                        <li>Data reading: readStorage retrieves the stored value, decodes Base64, and parses JSON back to its original type.</li>
                        <li>Data removal: removeStorage deletes the item from localStorage using the namespaced key.</li>
                    </ul>
                    <p class="sub_title">Architecture:</p>
                    <ul>
                        <li>Base64 encoding: Values are encoded using window.btoa and decoded with window.atob for safe storage.</li>
                        <li>JSON serialization: Complex objects are converted to JSON before encoding, ensuring compatibility with localStorage.</li>
                        <li>Namespacing: Keys are prefixed with getAppLabel() to avoid collisions between different applications or modules.</li>
                        <li>Persistent storage: Unlike cookies, data stored in localStorage persists until explicitly removed.</li>
                        <li>Type safety: Generic types (T) ensure that stored and retrieved data maintain type consistency.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default viewFwFile;
