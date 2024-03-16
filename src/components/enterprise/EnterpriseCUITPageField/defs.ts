import EnterpriseCUITPageField from "./index";


import {Myself, UserLogged} from "../../page/definitions";

export interface IEnterpriseCUITPageFieldProps {
    id: string;
    value: number;
    onChange(value: number): void;
    me: Myself;
    author: UserLogged | null;
}