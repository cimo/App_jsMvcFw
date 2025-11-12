import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewIndex = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-controllerName="Index">
            <div class="page_container view_index">
                <div class="header">Header</div>
                <div class="left">
                    <ul>
                        <li
                            onclick={() => {
                                methodObject.onClickLink("/page_1");
                            }}
                        >
                            <p class="link">Go to page 1</p>
                        </li>
                        <li>Section 1</li>
                        <li>Section 2</li>
                    </ul>
                </div>
                <div class="right">Right</div>
            </div>
        </div>
    );
};

export default viewIndex;
