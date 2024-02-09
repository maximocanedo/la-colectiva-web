import {ISchedule, IScheduleCreate, IScheduleEdit, IScheduleLight} from "../models/schedules";
import {CommonResponse, u} from "../utils";
import {Err} from "../error";
import {IPaginator} from "../models/comment";

const getPrefix = (id: string): string => "schedules/" + id;
/**
 * **Crear horario**
 *
 * Registra un horario a un recorrido específico.
 * @param path ID del recorrido.
 * @param data Datos del horario.
 */
export const create = async ({ path, ...data }: IScheduleCreate): Promise<IScheduleLight> => {
    const { status, json }: Response = await u.post(`paths/${path}/schedules`, data);
    const { _id, error } = await json();
    if(status === 201) return { ...data, path, _id };
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
    const { status, json }: Response = await u.put(getPrefix(id), data);
    const { error } = await json();
    if(status === 200) return { success: true, message: "Horario editado correctamente. " };
    throw new Err(error);
};
/**
 * **Eliminar horario**
 *
 * Deshabilita un horario específico.
 * @param id ID del horario.
 */
export const del = async (id: string): Promise<CommonResponse> => {
    const { status, json }: Response = await u.del(getPrefix(id));
    const { error } = await json();
    if(status === 200) return { success: true, message: "Horario eliminado correctamente. " };
    throw new Err(error);
};
/**
 * **Obtener horario por ID**
 *
 * Busca un horario por su ID.
 * @param id ID del horario.
 */
export const find = async (id: string): Promise<ISchedule> => {
    const { status, json }: Response = await u.get(getPrefix(id));
    const { data, error } = await json();
    if(status === 200) return data[0];
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
    const { status, json }: Response = await u.get(`schedules/?q=${q}&p=${p}&itemsPerPage=${itemsPerPage}`);
    const { data, error } = await json();
    if(status === 200) return data;
    throw new Err(error);
};