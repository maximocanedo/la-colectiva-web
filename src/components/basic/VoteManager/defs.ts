import {IUser} from "../../../data/models/user";
import {VoteStatus} from "../../../data/models/vote";

export interface VoteManagerProps {
    me: IUser | null;
    id: string;
    fetcher: (id: string) => Promise<VoteStatus>;
    upvoter: (id: string) => Promise<VoteStatus>;
    downvoter: (id: string) => Promise<VoteStatus>;
}