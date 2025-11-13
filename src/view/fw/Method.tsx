import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../../model/Index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const viewFwMethod = (variableObject: modelIndex.Ivariable): IvirtualNode => {
    return (
        <div>
            <p>Fw method content</p>
        </div>
    );
};

export default viewFwMethod;
