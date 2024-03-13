import {Myself} from "../../../page/definitions";

export interface CurrentUserSectionProps {
    onClick?(): void;
    me: Myself;
}
export interface RouteParams {
    next: string | undefined;
}