import {Myself} from "../../page/definitions";

export interface IDrawerProps {
    me: Myself;
    open: boolean;
    onUpdateOpenStatus(open: boolean): void;
}