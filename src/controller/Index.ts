/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Icontroller,
    IvariableEffect,
    IvirtualNode,
    variableBind,
    navigateTo,
    elementObserver,
    elementObserverOff,
    elementObserverOn
} from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";
import viewIndex from "../view/Index";

export default class Index implements Icontroller {
    // Variable
    private variableObject: modelIndex.Ivariable;
    private methodObject: modelIndex.Imethod;

    // Method
    private onClickItem = (name: string): void => {
        this.variableObject.itemClickName.state = name;
    };

    private onClickLink = (pagePath: string): void => {
        navigateTo(pagePath);
    };

    constructor() {
        this.variableObject = {} as modelIndex.Ivariable;
        this.methodObject = {} as modelIndex.Imethod;
    }

    elementHookObject = {} as modelIndex.IelementHook;

    variable(): void {
        this.variableObject = variableBind(
            {
                itemClickName: ""
            },
            this.constructor.name
        );

        this.methodObject = {
            onClickItem: this.onClickItem,
            onClickLink: this.onClickLink
        };
    }

    variableEffect(watch: IvariableEffect): void {
        watch([]);
    }

    view(): IvirtualNode {
        return viewIndex(this.variableObject, this.methodObject);
    }

    event(): void {}

    subControllerList(): Icontroller[] {
        const resultList: Icontroller[] = [];

        return resultList;
    }

    rendered(): void {}

    destroy(): void {}
}
