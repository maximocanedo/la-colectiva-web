import {Myself, UserLogged} from "../../page/definitions";

export interface IEnterpriseFoundationDatePageFieldProps {
    user: UserLogged;
    me: Myself;
    date: Date;
    onChange(date: Date): void;
    id: string;
}