import {Myself, UserLogged} from "../../../App";

export interface IEnterpriseFoundationDatePageFieldProps {
    user: UserLogged;
    me: Myself;
    date: Date;
    onChange(date: Date): void;
    id: string;
}