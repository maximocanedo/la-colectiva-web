import {Role} from "../../data/models/user";
import {ToastIntent} from "@fluentui/react-components";
import React from "react";
import * as settings from "./../../data/settings";
import {RecordCategory} from "../../data/actions/reports";


export interface IToastNotification {
    title: string;
    intent: ToastIntent;
    body?: string;
    footer?: React.JSX.Element[];
    action?: React.JSX.Element;
}

export type ToastSenderFunction = (data: IToastNotification) => void;
export type ToastDispatcher = (content: React.ReactNode, options?: ({ intent: ToastIntent } | undefined)) => void;



export interface UserLogged {
    _id: string;
    username: string;
    name: string;
    bio: string;
    birth: Date | string;
    role: Role;
    active: boolean;
    __v: number;
    email?: string;
}

export type Myself = UserLogged | null;

export interface ICommonPageProps {
    sendToast: ToastSenderFunction;
    me: Myself;
    sendReport(id: string, category: RecordCategory): void;
}

export const log = (componentName?: string): void => {
    if(settings.get("count-components-rendering") === "on") {
        if((window as any).renders === undefined) (window as any).renders = {};
        const times: number = (window as any).renders[componentName?? "undefined"]?? 0;
        (window as any).renders[componentName?? "undefined"] = times + 1;
    }
    if(settings.get("report-components-rendering") === "on")
        console.log("Rendering %c<" + componentName + " />", "background: #cfd8dc; color: #263238");

}

export type LoadState = "loaded" | "loading" | "no-data" | "err" | "initial";