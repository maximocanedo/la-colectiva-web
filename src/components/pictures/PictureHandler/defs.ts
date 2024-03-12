import {IPictureDetails} from "../../../data/models/picture";
import {CommonResponse} from "../../../data/utils";
import {IPaginator} from "../../../data/models/comment";
import {Myself} from "../../../App";
import {OnPostResponse} from "../../../data/actions/picture";

export interface IPictureHandlerProps {
    id: string;
    me: Myself;
    fetcher(id: string, paginator: IPaginator): Promise<IPictureDetails[]>;
    poster(id: string, image: Blob, description: string): Promise<OnPostResponse>;
    remover(id: string, photoId: string): Promise<void>;
}