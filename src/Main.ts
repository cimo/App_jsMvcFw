import { setUrlRoot, route } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import ControllerIndex from "./controller/Index";
import ControllerAbout from "./controller/About";

setUrlRoot("");

route([
    {
        title: "Index",
        path: "/",
        controller: () => new ControllerIndex()
    },
    {
        title: "About",
        path: "/about",
        controller: () => new ControllerAbout()
    }
]);
