import {IPaginator} from "../../../data/models/comment";
import {IUser} from "../../../data/models/user";
import {IHistoryEvent} from "../../../data/models/IHistoryEvent";

export interface IHistoryHandlerProps {
    id: string;
    me: IUser | null;
    fetcher: (id: string, paginator: IPaginator) => Promise<IHistoryEvent[]>;
}