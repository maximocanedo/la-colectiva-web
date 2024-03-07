import {IComment, ICommentFetchResponse, IPaginator} from "../../../data/models/comment";
import {CommonResponse} from "../../../data/utils";
import {IUser} from "../../../data/models/user";

export interface ICommentHandlerProps {
    id: string;
    me: IUser | null;
    fetcher: (id: string, paginator: IPaginator) => Promise<IComment[]>;
    poster: (id: string, content: string) => Promise<ICommentFetchResponse>;
    remover: (id: string, commentId: string) => Promise<CommonResponse>;
}