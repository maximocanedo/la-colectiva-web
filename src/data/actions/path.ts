import {CommonResponse, u} from "../utils";
import {VoteStatus} from "../models/vote";
import { IComment, ICommentFetchResponse, IPaginator} from "../models/comment";
import {IAvailability, IAvailabilityCreate, IPath, IPathCreate, IPathEdit} from "../models/path";
import {Err} from "../error";
import {downvote, getVotes, upvote} from "./vote";
import * as comment from "./comment";
import {IHistoryEvent} from "../models/IHistoryEvent";
import * as history from "./history";
import {Myself} from "../../components/page/definitions";
import {IUser} from "../models/user";
import {IScheduleView} from "../models/schedules";
const getPrefix = (id: string): string => "paths/" + id;
/**
 * **Crear recorrido**
 *
 * Registra un nuevo recorrido.
 * @param data Datos del recorrido.
 */
export const create = async (data: IPathCreate): Promise<IPath> => {
    const call: Response = await u.post("paths", data);
    const { _id, error } = await call.json();
    if(call.ok) return { ...data, _id };
    throw new Err(error);
};
/**
 * **Editar recorrido**
 *
 * Actualiza los datos de un recorrido.
 * @param id ID del recorrido.
 * @param data Datos a actualizar.
 */
export const edit = async (id: string, data: IPathEdit): Promise<CommonResponse> => {
    const call: Response = await u.patch(getPrefix(id), data);
    if(call.ok) return { success: true, message: "Editado con éxito. " };
    const { error } = await call.json();
    throw new Err(error);
};
export const getSchedules = async (id: string, q: string, {p, itemsPerPage}: IPaginator): Promise<IScheduleView[]> => {
    const url: string = `${getPrefix(id)}/schedules?q=${q}&p=${p}&itemsPerPage=${itemsPerPage}`;
    const call: Response = await u.get(url);
    const { data, error } = await call.json();
    if(call.ok) return data;
    throw new Err(error);
}
/**
 * **Eliminar recorrido**
 *
 * Deshabilita el registro de un recorrido.
 * @param id ID del recorrido.
 */
export const del = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.del(getPrefix(id));
    if(call.ok) return { success: true, message: "Eliminado con éxito. " };
    const { error } = await call.json();
    throw new Err(error);
};
export const enable = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.post(getPrefix(id), {});
    if(call.ok) return { success: true, message: "Habilitado con éxito. " };
    const { error } = await call.json();
    throw new Err(error);
};
interface IAvalabilitiesActions {
    list(pathId: string): Promise<IAvailability[]>;
    get(avId: string): Promise<IAvailability>;
    add(availability: IAvailabilityCreate, me: Myself): Promise<IAvailability>;
    del(avId: string): Promise<CommonResponse>;
}
export const availabilities: IAvalabilitiesActions = {
    list: async (pathId: string): Promise<IAvailability[]> => {
        const call: Response = await u.get(getPrefix(pathId) + "/availabilities/");
        const { data, error } = await call.json();
        if(call.ok) return data;
        throw new Err(error);
    },
    /**
     * **Obtener disponibilidad por ID**
     *
     * Busca una disponibilidad por ID.
     * @param avId ID de la disponibilidad.
     */
    get: async (avId: string): Promise<IAvailability> => {
        const call: Response = await u.get("availabilities/" + avId);
        const { error, ...data } = await call.json();
        if(call.ok) return data;
        throw new Err(error);
    },
    /**
     * **Añadir disponibilidad**
     *
     * Adjunta al recorrido un detalle sobre la disponibilidad de este.
     * @param availability Detalle sobre la disponibilidad.
     */
    add: async (availability: IAvailabilityCreate, me: Myself): Promise<IAvailability> => {
        const call: Response = await u.post("availabilities/", availability);
        const { _id, error } = await call.json();
        if(call.ok) return { ...availability, user: (me as IUser), _id };
        throw new Err(error);
    },
    /**
     * **Eliminar disponibilidad**
     *
     * Deshabilita la disponibilidad especificada.
     * @param avId ID de la disponibilidad.
     */
    del: async (avId: string): Promise<CommonResponse> => {
        const call: Response = await u.del("availabilities/" + avId);
        if(call.ok) return { success: true, message: "Eliminado correctamente. " };
        const { error } = await call.json();
        throw new Err(error);
    }

};
const getAvPrefix = (id: string): string => `availabilities/${id}`;
export const avv = {
    get: async (id: string): Promise<VoteStatus> => getVotes(getAvPrefix(id)),
    upvote: async (id: string): Promise<VoteStatus> => upvote(getAvPrefix(id)),
    downvote: async (id: string): Promise<VoteStatus> => downvote(getAvPrefix(id))
};
/**
 * **Buscar recorrido por ID**
 *
 * Busca un registro de recorrido por su ID.
 * @param id ID del recorrido.
 */
export const find = async (id: string): Promise<IPath> => {
    const call: Response = await u.get(getPrefix(id));
    const { data, error } = await call.json();
    if(call.ok) return data;
    throw new Err(error);
};
/**
 * **Listar recorridos**
 *
 * Busca, lista o pagina recorridos.
 * @param q Texto a buscar.
 * @param p Número de página.
 * @param itemsPerPage Elementos por página.
 */
export const search = async (q: string = "", { p, itemsPerPage }: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<IPath[]> => {
    const call: Response = await u.get(`paths/?q=${q}&p=${p}&itemsPerPage=${itemsPerPage}`);
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
export const fetchHistory = async (id: string, paginator: IPaginator = { p: 0, itemsPerPage: 5 }): Promise<IHistoryEvent[]> =>
    history.fetch(getPrefix(id), paginator);