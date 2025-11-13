/* eslint-disable @typescript-eslint/no-unused-vars */
import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelAbout from "../model/About";

const viewAbout = (variableObject: modelAbout.Ivariable, methodObject: modelAbout.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-controllerName="About">
            <div class="page_container view_about">
                <div class="header">About</div>
                <div class="left">...</div>
            </div>
        </div>
    );
};

export default viewAbout;
