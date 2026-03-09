import {
    Icontroller,
    IvariableEffect,
    IvirtualNode,
    variableBind,
    navigateTo,
    elementObserver,
    elementObserverOff,
    elementObserverOn,
    writeCookie,
    readCookie,
    deleteCookie,
    writeStorage,
    readStorage,
    deleteStorage
} from "@cimo/jsmvcfw/dist/src/Main.js";

// Source
import * as modelExample from "../model/Example";
import viewExample from "../view/Example";

export default class Example implements Icontroller {
    // Variable
    private variableObject: modelExample.Ivariable;
    private methodObject: modelExample.Imethod;

    // Method
    private onClickLink = (pagePath: string): void => {
        navigateTo(pagePath);
    };

    private onClickCount = (): void => {
        this.variableObject.count.state += 1;
    };

    private onClickElementHook = (): void => {
        this.hookObject.elementDivTest.innerText = "Novum exemplum textus.";
    };

    private onClickVariableWatchTest = (): void => {
        this.variableObject.variableWatchTest.state = "Exemplum textus.";
    };

    private actionVariableWatchTest = (): void => {
        alert("actionWatchTest");
    };

    private statusElmentObserverTest = (): void => {
        if (this.hookObject.elementDivTest) {
            elementObserver(this.hookObject.elementDivTest, (element, change) => {
                elementObserverOff(element);

                if (change.type === "childList") {
                    this.hookObject.elementObserverTest.innerText = "jsmvcfw-elementHookName is changed.";
                }

                elementObserverOn(element);
            });
        }
    };

    private onClickWriteCookie = (): void => {
        writeCookie<string>("test", "1");

        this.hookObject.elementCookieRead.innerText = "Created";
    };

    private onClickReadCookie = (): void => {
        const result = readCookie<string>("test");

        if (result) {
            this.hookObject.elementCookieRead.innerText = result;
        } else {
            this.hookObject.elementCookieRead.innerText = "";
        }
    };

    private onClickDeleteCookie = (): void => {
        deleteCookie("test");

        this.hookObject.elementCookieRead.innerText = "Deleted";
    };

    private onClickWriteStorage = (): void => {
        writeStorage<string>("test", "1");

        this.hookObject.elementStorageRead.innerText = "Created";
    };

    private onClickReadStorage = (): void => {
        const result = readStorage<string>("test");

        if (result) {
            this.hookObject.elementStorageRead.innerText = result;
        } else {
            this.hookObject.elementStorageRead.innerText = "";
        }
    };

    private onClickDeleteStorage = (): void => {
        deleteStorage("test");

        this.hookObject.elementStorageRead.innerText = "Deleted";
    };

    constructor() {
        this.variableObject = {} as modelExample.Ivariable;
        this.methodObject = {} as modelExample.Imethod;
    }

    hookObject = {} as modelExample.IelementHook;

    variable(): void {
        this.variableObject = variableBind(
            {
                count: 0,
                variableWatchTest: ""
            },
            this.constructor.name
        );

        this.methodObject = {
            onClickLink: this.onClickLink,
            onClickCount: this.onClickCount,
            onClickElementHook: this.onClickElementHook,
            onClickVariableWatchTest: this.onClickVariableWatchTest,
            onClickWriteCookie: this.onClickWriteCookie,
            onClickReadCookie: this.onClickReadCookie,
            onClickDeleteCookie: this.onClickDeleteCookie,
            onClickWriteStorage: this.onClickWriteStorage,
            onClickReadStorage: this.onClickReadStorage,
            onClickDeleteStorage: this.onClickDeleteStorage
        };
    }

    variableEffect(watch: IvariableEffect): void {
        watch([
            {
                list: ["variableWatchTest"],
                action: () => {
                    this.actionVariableWatchTest();
                }
            }
        ]);
    }

    view(): IvirtualNode {
        return viewExample(this.variableObject, this.methodObject);
    }

    event(): void {}

    subControllerList(): Icontroller[] {
        const resultList: Icontroller[] = [];

        return resultList;
    }

    rendered(): void {
        this.statusElmentObserverTest();
    }

    destroy(): void {}
}
