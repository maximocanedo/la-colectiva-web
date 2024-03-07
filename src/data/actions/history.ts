import {IPaginator} from "../models/comment";
import {IError, u} from "../utils";
import {Err} from "../error";
import {IHistoryEvent} from "../models/IHistoryEvent";

export const fetch = async (prefix: string, paginator: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<IHistoryEvent[]> => {
    const call: Response = await u.get(prefix + `/history?p=${paginator.p}&itemsPerPage=${paginator.itemsPerPage}`);
    const { status }: Response = call;
    const {data, error} = await call.json();
    if(status === 200) return data;
    else throw new Err(error as IError);
};