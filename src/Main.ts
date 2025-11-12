import { setUrlRoot, route } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import ControllerIndex from "./controller/Index";
import ControllerPage1 from "./controller/Page1";

setUrlRoot("");

route([
    {
        title: "Index",
        path: "/",
        controller: () => new ControllerIndex()
    },
    {
        title: "Page 1",
        path: "/page_1",
        controller: () => new ControllerPage1()
    }
]);
