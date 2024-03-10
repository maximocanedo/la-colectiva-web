import {Myself, UserLogged} from "../../../App";

export interface IEnterprisePhoneHandlerProps {
    me: Myself;
    author: UserLogged | null;
    id: string;
}