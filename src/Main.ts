import { setUrlRoot, setAppLabel, route } from "@cimo/jsmvcfw/dist/src/Main.js";

// Source
import ControllerIndex from "./controller/Index";
import ControllerExample from "./controller/Example";

setUrlRoot("");
setAppLabel("jsmvcfw");

route([
    {
        title: "Index",
        path: "/",
        controller: () => new ControllerIndex()
    },
    {
        title: "Example",
        path: "/example",
        controller: () => new ControllerExample()
    }
]);
