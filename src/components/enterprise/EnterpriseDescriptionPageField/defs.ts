import {IUser} from "../../../data/models/user";
import {RegionType} from "../../../data/models/region";
import {Myself, UserLogged} from "../../../App";
import EnterpriseDescriptionPageField from "./index";

export interface IEnterpriseDescriptionPageFieldProps {
    description: string;
    onUpdate(description: string): void;
    author: UserLogged | null;
    me: Myself;
    id: string;
}