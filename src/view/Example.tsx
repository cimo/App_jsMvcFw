import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelExample from "../model/Example";

const viewExample = (variableObject: modelExample.Ivariable, methodObject: modelExample.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-controllerName="Example">
            <div class="page_container view_example">
                <div class="header">
                    <h1>Example</h1>
                    <p>
                        From index to this page was used "navigateTo" setted to false.
                        <br />
                        Will be ok use it when exists a web server (like apache) because generate a url navigation (is not good for single page app).
                        <br />
                        If is used withtout web server works but if the page will be refreshed a "GET" error appear (because the url doesn't exists).
                    </p>
                </div>
                <div class="left">
                    <div class="section">
                        <button
                            onclick={() => {
                                methodObject.onClickLink("/");
                            }}
                        >
                            Go back
                        </button>
                    </div>
                    <div class="section">
                        <p class="title">Example: Increment count.</p>
                        <p>This example change the value in the controller and will be permanent in the view.</p>
                        <button
                            onclick={() => {
                                methodObject.onClickCount();
                            }}
                        >
                            Click for increment
                        </button>
                        <p>
                            Count: <span>{variableObject.count.state}</span>
                        </p>
                    </div>
                    <div class="section">
                        <p class="title">Example: jsmvcfw-elementHookName.</p>
                        <p>
                            This example change directly the html in the view.
                            <br />
                            If you interact with another elment in the page, the value of the "jsmvcfw-elementHookName" will be reset to the original
                            status.
                            <br />
                            "jsmvcfw-elementHookName" it's used for intereact with the element in the page, read and use the element.
                        </p>
                        <p>
                            Text: <span jsmvcfw-elementHookName="elementDivTest">Exemplum textus.</span>
                        </p>
                        <button
                            onclick={() => {
                                methodObject.onClickElementHook();
                            }}
                        >
                            Click for interact with element
                        </button>
                    </div>
                    <div class="section">
                        <p class="title">Example: variableEffect - watch.</p>
                        <p>
                            This example show how "variableEffect - watch" works.
                            <br />
                            If the variable change the associate method, defined in the controller, will be executed.
                        </p>
                        <button
                            onclick={() => {
                                methodObject.onClickVariableWatchTest();
                            }}
                        >
                            Click for watch
                        </button>
                        <p>
                            Text: <span>{variableObject.variableWatchTest.state}</span>
                        </p>
                    </div>
                    <div class="section">
                        <p class="title">Example: elementObserver.</p>
                        <p>
                            This example show how "elementObserver" works.
                            <br />
                            If the DOM element change, the event defined in the controller, will be executed.
                            <br />
                            The change will be catch if the status of that element will be changed by the logic action (don't have effect if will be
                            reset by the render on the initial status).
                        </p>
                        <p>
                            DOM element: <span jsmvcfw-elementHookName="elementObserverTest"></span>
                        </p>
                    </div>
                    <div class="section">
                        <p class="title">Example: cookie.</p>
                        <p>
                            This example show how coockie works.
                            <br />
                            Check in your dev tool the cookie to see the result.
                        </p>
                        <button
                            onclick={() => {
                                methodObject.onClickWriteCookie();
                            }}
                        >
                            Click for create
                        </button>
                        <button
                            onclick={() => {
                                methodObject.onClickReadCookie();
                            }}
                        >
                            Click for read
                        </button>
                        <button
                            onclick={() => {
                                methodObject.onClickRemoveCookie();
                            }}
                        >
                            Click for remove
                        </button>
                        <p>
                            Cookie read: <span jsmvcfw-elementHookName="elementCookieRead"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default viewExample;
