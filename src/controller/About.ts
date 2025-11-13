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
import * as modelAbout from "../model/About";
import viewAbout from "../view/About";

export default class About implements Icontroller {
    // Variable
    private variableObject: modelAbout.Ivariable;
    private methodObject: modelAbout.Imethod;

    // Method
    constructor() {
        this.variableObject = {} as modelAbout.Ivariable;
        this.methodObject = {} as modelAbout.Imethod;
    }

    elementHookObject = {} as modelAbout.IelementHook;

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
        return viewAbout(this.variableObject, this.methodObject);
    }

    event(): void {}

    subControllerList(): Icontroller[] {
        const resultList: Icontroller[] = [];

        return resultList;
    }

    rendered(): void {}

    destroy(): void {}
}
