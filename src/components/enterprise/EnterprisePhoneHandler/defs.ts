import {Myself, UserLogged} from "../../page/definitions";

export interface IEnterprisePhoneHandlerProps {
    me: Myself;
    author: UserLogged | null;
    id: string;
}