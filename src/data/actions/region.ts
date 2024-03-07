import {CommonResponse, IError, u} from "../utils";
import {Err} from "../error";
import {IComment, ICommentFetchResponse, IPaginator} from "../models/comment";
import { downvote, getVotes, upvote } from "./vote";
import * as comment from "../actions/comment";
import * as history from "../actions/history";
import {IRegion, IRegionCreate, RegionType} from "../models/region";
import {VoteStatus} from "../models/vote";
import {IHistoryEvent} from "../models/IHistoryEvent";
const getPrefix = (id: string): string => "regions/" + id;
type RegionEditData = { name: string } | { type: RegionType } | { name: string, type: RegionType };
/**
 * Edita un registro de región.
 * @param id ID del registro.
 * @param data Datos a actualizar.
 */
export const edit = async (id: string, data: RegionEditData): Promise<CommonResponse> => {
    const call: Response = await u.patch(getPrefix(id), data);
    if(call.ok) return {
        success: true,
        message: "Edición exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
/**
 * Elimina una región del sistema.
 * @param id ID de la región a eliminar.
 */
export const del = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.del(getPrefix(id), {});
    if(call.ok) return {
        success: true,
        message: "Eliminación exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
export const enable = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.post(getPrefix(id), {});
    if(call.ok) return {
        success: true,
        message: "Habilitación exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
/**
 * Registrar una región.
 * @param data Datos de la región.
 */
export const create = async (data: IRegionCreate): Promise<IRegion> => {
    const call: Response = await u.post("regions", data);
    const { status }: Response = call;
    if(status === 201) {
        const data = await call.json();
        return {
            ...data,
            _id: data._id
        };
    }
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
}
/**
 * Encontrar una región por su ID.
 * @param id ID de la región.
 */
export const find = async (id: string): Promise<IRegion> => {
    const call: Response = await u.get(getPrefix(id));
    const { status }: Response = call;
    const data = await call.json();
    if(status === 200) {
        return data.data[0];
    } else throw new Err(data.error);
};
/**
 * Buscar, listar y/o paginar recursos.
 * @param q Texto a buscar.
 * @param paginator Paginador.
 */
export const search = async (q: string = "", paginator: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<IRegion[]> => {
    const call: Response = await u.get(`regions/?q=${q}&p=${paginator.p}&itemsPerPage=${paginator.itemsPerPage}`);
    const { status }: Response = call;
    const { data, error } = await call.json();
    if(status === 200) return data;
    else throw new Err(error);
};
export const votes = {
    get: async (id: string): Promise<VoteStatus> => getVotes(getPrefix(id)),
    upvote: async (id: string): Promise<VoteStatus> => upvote(getPrefix(id)),
    downvote: async (id: string): Promise<VoteStatus> => downvote(getPrefix(id))
};
export const comments = {
    get: async (id: string, paginator: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<IComment[]> =>
        comment.fetch(getPrefix(id), paginator),
    post: async (id: string, content: string): Promise<ICommentFetchResponse> =>
        comment.post(getPrefix(id), content),
    del: async (id: string, commentId: string): Promise<CommonResponse> =>
        comment.del(getPrefix(id), commentId)
};

export const fetchHistory = async (id: string, paginator: IPaginator = { p: 0, itemsPerPage: 5 }): Promise<IHistoryEvent[]> =>
        history.fetch(getPrefix(id), paginator);