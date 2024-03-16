import { CommonResponse, u } from "../utils";
import { VoteStatus } from "../models/vote";
import { IComment, ICommentFetchResponse, IPaginator } from "../models/comment";
import {IBoat, IBoatCreate, IBoatEdit} from "../models/boat";
import {Err} from "../error";
import {downvote, getVotes, upvote} from "./vote";
import * as comment from "./comment";
import * as picture from "./picture";
import {IPictureDetails} from "../models/picture";
import {IHistoryEvent} from "../models/IHistoryEvent";
import * as history from "./history";
import {OnPostResponse} from "./picture";
const getPrefix = (id: string): string => "boats/" + id;
/**
 * **Editar embarcación**
 *
 * Edita el registro de una embarcación.
 * @param id ID de la embarcación.
 * @param data Datos a actualizar.
 */
export const edit = async (id: string, data: IBoatEdit): Promise<CommonResponse> => {
    const call: Response = await u.patch(getPrefix(id), data);
    if(call.ok) return {
        success: true,
        message: "El barco ha sido editado con éxito. "
    };
    const { error } = await call.json();
    throw new Err(error);
};
/**
 * **Eliminar embarcación**
 *
 * Deshabilita una embarcación.
 * @param id ID de la embarcación.
 */
export const del = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.del(getPrefix(id));
    if(call.ok) return {
        success: true,
        message: "El barco ha sido eliminado con éxito. "
    };
    const { error } = await call.json();
    throw new Err(error);
};

export const enable = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.post(getPrefix(id), {});
    if(call.ok) return {
        success: true,
        message: "El barco ha sido rehabilitado con éxito. "
    };
    const { error } = await call.json();
    throw new Err(error);
};
/**
 * **Crear embarcación**
 *
 * Registra una nueva embarcación.
 * @param boat Datos de la embarcación.
 */
export const create = async (boat: IBoatCreate): Promise<IBoat> => {
    const call: Response = await u.post("boats", boat);
    const { _id, error } = await call.json();
    if(call.ok) return { ...boat, _id } as IBoat;
    throw new Err(error);
};
/**
 * **Buscar embarcación por ID**
 *
 * Busca una embarcación por su ID.
 * @param id ID de la embarcación.
 */
export const find = async (id: string): Promise<IBoat> => {
    const call: Response = await u.get(getPrefix(id));
    const { data, error } = await call.json();
    if(call.ok) return data;
    throw new Err(error);
};
export const existsByMat = async (mat: string): Promise<boolean> => {
    const call: Response = await u.head(getPrefix(mat));
    if(call.status === 404) return false;
    if(call.ok) return true;
    throw new Err({ code: "", message: "No se pudo comprobar si existe el registro. ", details: "" });
};
/**
 * **Listar embarcaciones**
 *
 * Busca, lista o pagina embarcaciones.
 * @param q Texto a buscar.
 * @param p Número de página.
 * @param itemsPerPage Elementos por página.
 */
export const search = async (q: string = "", { p, itemsPerPage }: IPaginator = { p: 0, itemsPerPage: 10 }, enterprise?: string): Promise<IBoat[]> => {
    const call: Response = await u.get(`boats/?q=${q}&p=${p}&itemsPerPage=${itemsPerPage}` + (enterprise === undefined ? "" : "&enterprise=" + enterprise));
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