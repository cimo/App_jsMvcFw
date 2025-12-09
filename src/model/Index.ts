import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main.js";

export interface Ivariable {
    itemClickName: IvariableBind<string>;
}

export interface Imethod {
    onClickItem: (name: string) => void;
    onClickLink: (pagePath: string) => void;
}

export interface IelementHook extends Record<string, Element | Element[]> {}
