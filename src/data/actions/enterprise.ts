import {CommonResponse, IError, u} from "../utils";
import {IEnterprise, IEnterpriseCreate, IEnterpriseEdit} from "../models/enterprise";
import {Err} from "../error";
import {VoteStatus} from "../models/vote";
import {downvote, getVotes, upvote} from "./vote";
import {IComment, ICommentFetchResponse, IPaginator} from "../models/comment";
import * as comment from "./comment";

const getPrefix = (id: string): string => `enterprises/${id}`;
/**
 * Actualizar datos de una empresa.
 * @param id ID de la empresa.
 * @param data Datos a actualizar.
 */
export const edit = async (id: string, data: IEnterpriseEdit): Promise<CommonResponse> => {
    const call: Response = await u.put(getPrefix(id), data);
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Edición exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
/**
 * Deshabilitar un registro de empresa.
 * @param id ID de la empresa.
 */
export const disable = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.del(getPrefix(id), {});
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Eliminación exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
/**
 * Crea un registro de empresa.
 * @param enterprise Datos de la empresa.
 */
export const create = async (enterprise: IEnterpriseCreate): Promise<IEnterprise> => {
    const call: Response = await u.post("enterprises", enterprise);
    const { status }: Response = call;
    const data = await call.json();
    if(status === 201) {
        return {
            ...enterprise,
            _id: data._id
        };
    }
    else {
        throw new Err(data.error);
    }
};
/**
 * Busca un registro de empresa por ID.
 * @param id ID del registro.
 */
export const find = async (id: string): Promise<IEnterprise> => {
    const call: Response = await u.get(getPrefix(id));
    const { status }: Response = call;
    const data = await call.json();
    if(status === 200) {
        return data.data[0];
    } throw new Err(data.error);
};
/**
 * Listar empresas.
 */
export const list = async (): Promise<IEnterprise[]> => {
    const call: Response = await u.get("enterprises");
    const { status }: Response = call;
    const data = await call.json();
    if(status === 200) {
        return data.data;
    } throw new Err(data.error);
};
/**
 * Obtener lista de números asociados a una empresa.
 * @param id ID de la empresa.
 */
export const getPhones = async (id: string): Promise<string[]> => {
    const call: Response = await u.get(getPrefix(id) + "/phones");
    const { status }: Response = call;
    const { phones, error } = await call.json();
    if(status === 200) {
        return phones;
    } throw new Err(error);
}
/**
 * Asociar un número a una empresa.
 * @param id ID de la empresa.
 * @param phone Número de teléfono.
 */
export const addPhone = async (id: string, phone: string): Promise<CommonResponse> => {
    const call: Response = await u.post(getPrefix(id) + "/phones", { phone });
    if(call == null) return {
        success: false,
        message: "Error de conexión. "
    };
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Teléfono agregado. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
/**
 * Eliminar un número de empresa.
 * @param id ID de la empresa.
 * @param phone Número de teléfono a eliminar.
 */
export const deletePhone = async (id: string, phone: string): Promise<CommonResponse> => {
    const call: Response = await u.del(getPrefix(id) + "/phones", { phone });
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Teléfono eliminado. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
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