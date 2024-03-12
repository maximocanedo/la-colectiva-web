import {IUserMinimal} from "../../components/basic/Comment/defs";

export interface IPictureDetails {
    _id: string;
    url: string;
    user: IUserMinimal;
    description: string;
    uploadDate: string;
    validations: number;
    invalidations: number;
}