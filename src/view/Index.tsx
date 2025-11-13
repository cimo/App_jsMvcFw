import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";
import viewFwInfo from "../view/fw/Info";
import viewFwFile from "../view/fw/File";
import viewFwMethod from "../view/fw/Method";

const viewIndex = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-controllerName="Index">
            <div class="page_container view_index">
                <div class="header">
                    <p>JsMvcFw wiki</p>
                </div>
                <div class="left">
                    <ul>
                        <li>
                            <p
                                class="click"
                                onclick={() => {
                                    methodObject.onClickItem("");
                                }}
                            >
                                Home
                            </p>
                        </li>
                        <li>
                            <p
                                class="click"
                                onclick={() => {
                                    methodObject.onClickLink("/about");
                                }}
                            >
                                About
                            </p>
                        </li>
                        <li class="category">Framework:</li>
                        <li>
                            <p
                                class="click"
                                onclick={() => {
                                    methodObject.onClickItem("fwInfo");
                                }}
                            >
                                Info
                            </p>
                        </li>
                        <li>
                            <p
                                class="click"
                                onclick={() => {
                                    methodObject.onClickItem("fwFile");
                                }}
                            >
                                File
                            </p>
                        </li>
                        <li>
                            <p
                                class="click"
                                onclick={() => {
                                    methodObject.onClickItem("fwMethod");
                                }}
                            >
                                Method
                            </p>
                        </li>
                        <li class="category">Model:</li>
                        <li class="click">Structure</li>
                        <li class="category">View:</li>
                        <li class="click">Structure</li>
                        <li class="category">Controller:</li>
                        <li class="click">Structure</li>
                    </ul>
                </div>
                <div class="right">
                    {(() => {
                        if (variableObject.itemClickName.state === "fwInfo") {
                            return viewFwInfo(variableObject);
                        } else if (variableObject.itemClickName.state === "fwFile") {
                            return viewFwFile(variableObject);
                        } else if (variableObject.itemClickName.state === "fwMethod") {
                            return viewFwMethod(variableObject);
                        } else {
                            return (
                                <div>
                                    <p>This wiki is the reference point for understanding how to use the framework and how it is built.</p>
                                    <p>The menu on the left contains various categories with detailed explanations.</p>
                                </div>
                            );
                        }
                    })()}
                </div>
            </div>
        </div>
    );
};

export default viewIndex;
