import {CommonResponse, IError, u} from "../utils";
import {VoteStatus} from "../models/vote";
import {IComment, ICommentFetchResponse, IPaginator} from "../models/comment";
import {DockPropertyStatus, IDock, IDockCreate, IDockEdit, IDockView} from "../models/dock";
import {Err} from "../error";
import {downvote, getVotes, upvote} from "./vote";
import * as comment from "./comment";
import * as picture from "./picture";
import {OnPostResponse} from "./picture";
import {IPictureDetails} from "../models/picture";
import {IHistoryEvent} from "../models/IHistoryEvent";
import * as history from "./history";

const getPrefix = (id: string): string => "docks/" + id;
/**
 * Edita un registro de muelle.
 * @param id ID del muelle.
 * @param data Datos a actualizar.
 */
export const edit = async (id: string, data: IDockEdit): Promise<CommonResponse> => {
    const call: Response = await u.patch(getPrefix(id), data);
    if(call.ok) return {
        success: true,
        message: "Edición exitosa. "
    };
    const { error }: { error: IError } = await call.json();
    throw new Err(error);

};
/**
 * Deshabilita un registro de muelle.
 * @param id ID del muelle.
 */
export const del = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.del(getPrefix(id), {});
    const { status }: Response = call;
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
    const { status }: Response = call;
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
 * Crea un registro de muelle.
 * @param data Datos del muelle.
 */
export const create = async (data: IDockCreate): Promise<IDock> => {
    const call: Response = await u.post("docks", data);
    const { status }: Response = call;
    if(call.ok) {
        const data = await call.json();
        return {
            name: data.name,
            address: data.address,
            region: { _id: data.region, name: "" },
            notes: data.notes,
            status: data.status,
            coordinates: data.coordinates,
            _id: data._id

        };
    }
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};

/**
 * Buscar registro de muelle por ID.
 * @param id ID del muelle.
 */
export const find = async (id: string): Promise<IDockView> => {
    const call: Response = await u.get(getPrefix(id));
    const data = await call.json();
    if(call.ok) return data.data;
    else throw new Err(data.error);
};
/**
 * Buscar, listar o paginar registros de muelles.
 * @param q Texto a buscar.
 * @param paginator Paginador.
 */
export const search = async (q: string = "", paginator: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<IDockView[]> => {
    const { p, itemsPerPage }: IPaginator = paginator;
    const call: Response = await u.get(`docks/?q=${q}&p=${p}&itemsPerPage=${itemsPerPage}`);
    const data = await call.json();
    if(call.ok) {
        return data.data;
    } throw new Err(data.error);
};
export interface IDockMinimal {
    _id: string;
    name: string;
    status: DockPropertyStatus;
    coordinates: [ number, number ];
}
/**
 * **Explorar muelles cercanos**
 *
 * Busca los muelles más cercanos a las coordenadas dadas.
 * @param q Texto a buscar.
 * @param coordinates Coordenadas a consultar.
 * @param prefer Tipo de muelle preferido. -1 para desactivar.
 * @param radio Radio en metros dentro del cual buscar.
 * @param p Número de página.
 * @param itemsPerPage Elementos por página.
 */
export const explore = async (q: string = "", coordinates: [ number, number ], prefer: number = -1, radio: number = 300, { p, itemsPerPage }: IPaginator = { p: 0, itemsPerPage: 10 }, light: boolean = true): Promise<(IDockView | IDockMinimal)[]> => {
    const call: Response = await u.get(`docks/@${coordinates[0]},${coordinates[1]},${radio}?q=${q}&prefer=${prefer}&p=${p}&itemsPerPage=${itemsPerPage}&light=${light}`);
    const { data, error } = await call.json();
    if(call.ok) return data;
    throw new Err(error);
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
export const pictures = {
    upload: async (id: string, image: Blob, description: string): Promise<OnPostResponse> => picture.upload(getPrefix(id), image, description),
    list: async (id: string, paginator: IPaginator): Promise<IPictureDetails[]> => picture.list(getPrefix(id), paginator),
    rem: async (id: string, photoId: string): Promise<void> => picture.remove(getPrefix(id), photoId)
};
export const fetchHistory = async (id: string, paginator: IPaginator = { p: 0, itemsPerPage: 5 }): Promise<IHistoryEvent[]> =>
    history.fetch(getPrefix(id), paginator);