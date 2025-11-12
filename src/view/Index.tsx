/* eslint-disable @typescript-eslint/no-unused-vars */
import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewIndex = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-controllerName="Index">
            <div class="page_container view_index">
                <div class="header">Header</div>
                <div class="left">Left</div>
                <div class="right">Right</div>
            </div>
        </div>
    );
};

export default viewIndex;
