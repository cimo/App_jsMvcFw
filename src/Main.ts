import { setUrlRoot, route } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import ControllerIndex from "./controller/Index";

setUrlRoot("");

route([
    {
        title: "Index",
        path: "/",
        controller: () => new ControllerIndex()
    }
]);
