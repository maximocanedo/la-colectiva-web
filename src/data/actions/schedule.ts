import {ISchedule, IScheduleCreate, IScheduleEdit, IScheduleLight, ScheduleGroup} from "../models/schedules";
import {CommonResponse, u} from "../utils";
import {Err} from "../error";
import {IPaginator} from "../models/comment";
import {VoteStatus} from "../models/vote";
import {downvote, getVotes, upvote} from "./vote";

const getPrefix = (id: string): string => "schedules/" + id;
/**
 * **Crear horario**
 *
 * Registra un horario a un recorrido específico.
 * @param path ID del recorrido.
 * @param data Datos del horario.
 */
export const create = async ({ path, ...data }: IScheduleCreate): Promise<IScheduleLight> => {
    const call: Response = await u.post(`paths/${path}/schedules`, data);
    const { _id, error } = await call.json();
    if(call.ok) return { ...data, path, _id };
    throw new Err(error);
};
/**
 * **Editar horario**
 *
 * Actualiza la información de un horario específico.
 * @param id ID del horario.
 * @param data Información a actualizar.
 */
export const edit = async (id: string, data: IScheduleEdit): Promise<CommonResponse> => {
    const call: Response = await u.patch(getPrefix(id), data);
    const { error } = await call.json();
    if(call.ok) return { success: true, message: "Horario editado correctamente. " };
    throw new Err(error);
};
/**
 * **Eliminar horario**
 *
 * Deshabilita un horario específico.
 * @param id ID del horario.
 */
export const del = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.del(getPrefix(id));
    const { error } = await call.json();
    if(call.ok) return { success: true, message: "Horario eliminado correctamente. " };
    throw new Err(error);
};
/**
 * **Obtener horario por ID**
 *
 * Busca un horario por su ID.
 * @param id ID del horario.
 */
export const find = async (id: string): Promise<ISchedule> => {
    const call: Response = await u.get(getPrefix(id));
    const { data, error } = await call.json();
    if(call.ok) return data[0];
    throw new Err(error);
};
/**
 * **Listar horarios**
 *
 * Busca y lista horarios.
 * @param q Texto a buscar.
 * @param p Número de página.
 * @param itemsPerPage Elementos por página.
 */
export const search = async (q: string, { p, itemsPerPage }: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<ISchedule[]> => {
    const call: Response = await u.get(`schedules/?q=${q}&p=${p}&itemsPerPage=${itemsPerPage}`);
    const { data, error } = await call.json();
    if(call.ok) return data;
    throw new Err(error);
};

const buildNextURLParams = ({ departure, arrival, time, conditions }: { departure: string, arrival: string, time: string, conditions: string[] }): string => {
    const params: URLSearchParams = new URLSearchParams();
    params.append("departure", departure);
    params.append("arrival", arrival);
    params.append("time", time);
    conditions.map((condition: string) => params.append("conditions[]", condition));
    return params.toString();
};
/**
 * **Consultar próximo horario.**
 * @param departure Muelle de partida.
 * @param arrival Muelle destino.
 * @param time Hora de consulta.
 * @param conditions Condiciones que se deben cumplir. Mínimo una.
 */
export const next = async (departure: string, arrival: string, time: string, conditions: string[] = []): Promise<ScheduleGroup[]> => {
    const call: Response = await u.get(`query/next?${buildNextURLParams({ departure, arrival, time, conditions })}`);
    const { data, error } = await call.json();
    if(call.ok) return data;
    throw new Err(error);
};
export const votes = {
    get: async (id: string): Promise<VoteStatus> => getVotes(getPrefix(id)),
    upvote: async (id: string): Promise<VoteStatus> => upvote(getPrefix(id)),
    downvote: async (id: string): Promise<VoteStatus> => downvote(getPrefix(id))
};