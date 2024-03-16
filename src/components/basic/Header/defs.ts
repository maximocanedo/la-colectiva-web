import {Myself} from "../../page/definitions";



export interface HeaderProps {
    me: Myself;
    toasterId: string;
    showSearchBox?: boolean;
    query?: string;
    onSearch?(query: string): void;
}