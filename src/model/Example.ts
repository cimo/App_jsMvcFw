import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main.js";

export interface Ivariable {
    count: IvariableBind<number>;
    variableWatchTest: IvariableBind<string>;
}

export interface Imethod {
    onClickLink: (pagePath: string) => void;
    onClickCount: () => void;
    onClickElementHook: () => void;
    onClickVariableWatchTest: () => void;
    onClickWriteCookie: () => void;
    onClickReadCookie: () => void;
    onClickRemoveCookie: () => void;
    onClickWriteStorage: () => void;
    onClickReadStorage: () => void;
    onClickRemoveStorage: () => void;
}

export interface IelementHook extends Record<string, Element | Element[]> {
    elementDivTest: HTMLElement;
    elementObserverTest: HTMLElement;
    elementCookieRead: HTMLElement;
    elementStorageRead: HTMLElement;
}
