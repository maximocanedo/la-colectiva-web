import {CommonResponse} from "../../../data/utils";
import {IUser} from "../../../data/models/user";
export interface IUserMinimal {
    _id: string;
    username: string;
    name: string;
}
export interface ICommentComponentProps {
    id: string;
    content: string;
    uploaded: Date;
    __v: number;
    parentId: string;
    author: IUserMinimal;
    me: IUser | null;
    remover: (id: string, commentId: string) => Promise<CommonResponse>;
}