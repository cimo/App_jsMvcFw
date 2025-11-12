/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Icontroller,
    IvariableEffect,
    IvirtualNode,
    variableBind,
    elementObserver,
    elementObserverOff,
    elementObserverOn
} from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelPage1 from "../model/Page1";
import viewPage1 from "../view/Page1";

export default class Page1 implements Icontroller {
    // Variable
    private variableObject: modelPage1.Ivariable;
    private methodObject: modelPage1.Imethod;

    // Method
    constructor() {
        this.variableObject = {} as modelPage1.Ivariable;
        this.methodObject = {} as modelPage1.Imethod;
    }

    elementHookObject = {} as modelPage1.IelementHook;

    variable(): void {
        this.variableObject = variableBind(
            {
                isLoading: true
            },
            this.constructor.name
        );

        this.methodObject = {};
    }

    variableEffect(watch: IvariableEffect): void {
        watch([]);
    }

    view(): IvirtualNode {
        return viewPage1(this.variableObject, this.methodObject);
    }

    event(): void {}

    subControllerList(): Icontroller[] {
        const resultList: Icontroller[] = [];

        return resultList;
    }

    rendered(): void {}

    destroy(): void {}
}
