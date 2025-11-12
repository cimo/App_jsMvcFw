/* eslint-disable @typescript-eslint/no-unused-vars */
import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelPage1 from "../model/Page1";

const viewPage1 = (variableObject: modelPage1.Ivariable, methodObject: modelPage1.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-controllerName="Page1">
            <div class="page_container view_page1">
                <div class="header">Header</div>
                <div class="left">Left</div>
                <div class="right">Right</div>
            </div>
        </div>
    );
};

export default viewPage1;
