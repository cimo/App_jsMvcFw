import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main.js";

const viewMvcView = (): IvirtualNode => {
    return (
        <div class="view_content">
            <h1>View</h1>
            <table>
                <colgroup>
                    <col class="cell" />
                    <col class="cell" />
                    <col class="cell" />
                </colgroup>
                <thead class="filter">
                    <tr className="row filter_action"></tr>
                    <tr class="row not_hover">
                        <th class="cell">Signature</th>
                        <th class="cell">Return type</th>
                        <th class="cell">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="row">
                        <td class="cell">{"viewMvcView(variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode"}</td>
                        <td class="cell">{"IvirtualNode"}</td>
                        <td class="cell">Renders the virtual DOM for the View using JSX.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default viewMvcView;
