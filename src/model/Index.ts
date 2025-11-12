import { IvariableBind } from "@cimo/jsmvcfw/dist/src/Main";

export interface Ivariable {
    isLoading: IvariableBind<boolean>;
}

export interface Imethod {}

export interface IelementHook extends Record<string, Element | Element[]> {
    selectBrowserName: HTMLSelectElement[];
    inputVideoName: HTMLInputElement;
    inputSpecUpload: HTMLInputElement;
    inputChatMessageSend: HTMLInputElement;
}
