import {IUser} from "../../../data/models/user";
import {RegionType} from "../../../data/models/region";
import EnterpriseDescriptionPageField from "./index";

import {Myself, UserLogged} from "../../page/definitions";

export interface IEnterpriseDescriptionPageFieldProps {
    description: string;
    onUpdate(description: string): void;
    author: UserLogged | null;
    me: Myself;
    id: string;
}