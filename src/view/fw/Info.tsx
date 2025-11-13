import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../../model/Index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const viewFwInfo = (variableObject: modelIndex.Ivariable): IvirtualNode => {
    return (
        <div class="view_fw_info">
            <h1>Introduction to the Framework</h1>
            <p>
                The framework is a platform designed to simplify the development of dynamic user interfaces and modern web applications. It provides a
                clear structure and integrated tools to create reusable components, manage application state, and update the UI reactively, reducing
                code complexity and improving maintainability.
            </p>
            <h1>What does the framework do?</h1>
            <ul>
                <li>
                    Component-based architecture: the interface is divided into modular components, each with its own logic, style, and behavior. This
                    approach promotes reuse and scalability.
                </li>
                <li>
                    Reactive UI updates: when data changes, the framework automatically updates only the necessary parts of the interface, ensuring
                    high performance.
                </li>
                <li>
                    State management: includes mechanisms to track and synchronize data between components, avoiding inconsistencies and simplifying
                    application logic.
                </li>
                <li>
                    Integrated routing: allows navigation between views without reloading the entire page, ideal for single-page applications (SPA).
                </li>
                <li>
                    Interfaces with JSX: enables defining the interface structure using a declarative syntax that combines logic and markup,
                    simplifying the creation of complex components.
                </li>
                <li>
                    Dynamic form creation: includes features to generate and manage forms with validation, events, and data binding, reducing manual
                    coding.
                </li>
                <li>
                    Storage management: allows saving data in localStorage or sessionStorage, with encoding options to ensure security and integrity.
                </li>
                <li>
                    Cookie management: enables reading, writing, and deleting cookies, with support for value encoding and options for expiration and
                    security.
                </li>
            </ul>
            <h1>Why use it?</h1>
            <ul>
                <li>In just 54 KB (uncompressed) and 10 KB (compressed), you get a complete and professional system.</li>
                <li>Simplifies the development of complex interfaces.</li>
                <li>Reduces repetitive code thanks to reusable components.</li>
                <li>Improves project maintainability and readability.</li>
                <li>Supports scalability, from small UIs to large applications.</li>
                <li>No external dependencies and a focus on security.</li>
            </ul>
            <h1>Key Principles</h1>
            <ul>
                <li>Modularity: each part of the app is independent and reusable.</li>
                <li>Reactivity: the UI responds to data changes in real time.</li>
                <li>Reduces repetitive code thanks to reusable components.</li>
                <li>Performance: optimized updates to avoid resource waste.</li>
                <li>Extensibility: easy integration with external libraries and tools.</li>
                <li>Secure and easy to use.</li>
            </ul>
        </div>
    );
};

export default viewFwInfo;
