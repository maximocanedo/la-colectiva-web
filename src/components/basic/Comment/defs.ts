import {CommonResponse} from "../../../data/utils";
import {IUser} from "../../../data/models/user";
import {RecordCategory} from "../../../data/actions/reports";
export interface IUserMinimal {
    _id: string;
    username: string;
    name: string;
}
export interface ICommentComponentProps {
    id: string;
    handlerId: string;
    content: string;
    uploaded: Date;
    __v: number;
    parentId: string;
    author: IUserMinimal;
    me: IUser | null;
    sendReport(id: string, category: RecordCategory): void;
    remover: (id: string, commentId: string) => Promise<CommonResponse>;
}