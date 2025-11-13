import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../../model/Index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const viewFwFile = (variableObject: modelIndex.Ivariable): IvirtualNode => {
    return (
        <div>
            <p>Fw file content</p>
        </div>
    );
};

export default viewFwFile;
