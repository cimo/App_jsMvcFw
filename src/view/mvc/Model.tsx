import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

const viewMvcModel = (): IvirtualNode => {
    return (
        <div class="view_content">
            <h1>Model</h1>
            <table>
                <colgroup>
                    <col class="cell" />
                    <col class="cell" />
                </colgroup>
                <thead class="filter">
                    <tr className="row filter_action"></tr>
                    <tr class="row not_hover">
                        <th class="cell">Interface</th>
                        <th class="cell">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="row">
                        <td class="cell">Ivariable</td>
                        <td class="cell">Defines reactive variables.</td>
                    </tr>
                    <tr class="row">
                        <td class="cell">Imethod</td>
                        <td class="cell">Defines event handler methods.</td>
                    </tr>
                    <tr class="row">
                        <td class="cell">IelementHook</td>
                        <td class="cell">Defines DOM elements.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default viewMvcModel;
