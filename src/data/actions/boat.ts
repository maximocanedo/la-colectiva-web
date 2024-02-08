import { CommonResponse, u } from "../utils";
import { VoteStatus } from "../models/vote";
import { IComment, ICommentFetchResponse, IPaginator } from "../models/comment";
import {IBoat, IBoatCreate, IBoatEdit} from "../models/boat";
import {Err} from "../error";
import {downvote, getVotes, upvote} from "./vote";
import * as comment from "./comment";
const getPrefix = (id: string): string => "boats/" + id;
/**
 * **Editar embarcación**
 *
 * Edita el registro de una embarcación.
 * @param id ID de la embarcación.
 * @param data Datos a actualizar.
 */
export const edit = async (id: string, data: IBoatEdit): Promise<CommonResponse> => {
    const { status, json }: Response = await u.put(getPrefix(id), data);
    const { error } = await json();
    if(status === 200) return {
        success: true,
        message: "El barco ha sido editado con éxito. "
    }; throw new Err(error);
};
/**
 * **Eliminar embarcación**
 *
 * Deshabilita una embarcación.
 * @param id ID de la embarcación.
 */
export const del = async (id: string): Promise<CommonResponse> => {
    const { status, json }: Response = await u.del(getPrefix(id));
    const { error } = await json();
    if(status === 200) return {
        success: true,
        message: "El barco ha sido eliminado con éxito. "
    }; throw new Err(error);
};
/**
 * **Crear embarcación**
 *
 * Registra una nueva embarcación.
 * @param boat Datos de la embarcación.
 */
export const create = async (boat: IBoatCreate): Promise<IBoat> => {
    const { status, json }: Response = await u.post("boats", boat);
    const { _id, error } = await json();
    if(status === 201) return { ...boat, _id } as IBoat;
    throw new Err(error);
};
/**
 * **Buscar embarcación por ID**
 *
 * Busca una embarcación por su ID.
 * @param id ID de la embarcación.
 */
export const find = async (id: string): Promise<IBoat> => {
    const { status, json }: Response = await u.get(getPrefix(id));
    const { data, error } = await json();
    if(status === 200) return data;
    throw new Err(error);
};
/**
 * **Listar embarcaciones**
 *
 * Busca, lista o pagina embarcaciones.
 * @param q Texto a buscar.
 * @param p Número de página.
 * @param itemsPerPage Elementos por página.
 */
export const search = async (q: string = "", { p, itemsPerPage }: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<IBoat[]> => {
    const { status, json }: Response = await u.get(`boats/?q=${q}&p=${p}&itemsPerPage=${itemsPerPage}`);
    const { data, error } = await json();
    if(status === 200) return data;
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