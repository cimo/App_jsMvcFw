import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";
import viewFwInfo from "../view/fw/Info";
import viewFwFile from "../view/fw/File";
import viewFwMethod from "../view/fw/Method";
import viewMvcModel from "../view/mvc/Model";
import viewMvcView from "../view/mvc/View";
import viewMvcController from "../view/mvc/Controller";

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
                                    methodObject.onClickLink("/example");
                                }}
                            >
                                Example usage
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
                        <li class="category">Mvc structure:</li>
                        <li>
                            <p
                                class="click"
                                onclick={() => {
                                    methodObject.onClickItem("mvcModel");
                                }}
                            >
                                Model
                            </p>
                        </li>
                        <li>
                            <p
                                class="click"
                                onclick={() => {
                                    methodObject.onClickItem("mvcView");
                                }}
                            >
                                View
                            </p>
                        </li>
                        <li>
                            <p
                                class="click"
                                onclick={() => {
                                    methodObject.onClickItem("mvcController");
                                }}
                            >
                                Controller
                            </p>
                        </li>
                    </ul>
                </div>
                <div class="right">
                    {(() => {
                        if (variableObject.itemClickName.state === "fwInfo") {
                            return viewFwInfo();
                        } else if (variableObject.itemClickName.state === "fwFile") {
                            return viewFwFile();
                        } else if (variableObject.itemClickName.state === "fwMethod") {
                            return viewFwMethod();
                        } else if (variableObject.itemClickName.state === "mvcModel") {
                            return viewMvcModel();
                        } else if (variableObject.itemClickName.state === "mvcView") {
                            return viewMvcView();
                        } else if (variableObject.itemClickName.state === "mvcController") {
                            return viewMvcController();
                        } else {
                            return (
                                <div>
                                    <h1>Home</h1>
                                    <p>
                                        This wiki is the reference point for understanding how to use the framework and how it is built. Is created
                                        with jsMvcFw to show everything in real use cases.
                                    </p>
                                    <p>The menu on the left contains various categories with detailed explanations.</p>
                                </div>
                            );
                        }
                    })()}
                </div>
                <div class="footer"></div>
            </div>
        </div>
    );
};

export default viewIndex;
