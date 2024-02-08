'use strict';

import { CommonResponse, u, IError } from "../utils";
import { Comment, IPaginator, ICommentFetchResponse, ICommentCreationResponse } from "./comment";
import { Dock } from "./dock";
import { Region } from "./region";
import { IUser } from "./user";
import { VoteStatus, downvote, getVotes, upvote } from "./vote";

export interface IEnterprise {
    _id: string;
    cuit?: number;
    name?: string;
    user?: IUser | string;
    description?: string;
    foundationDate?: Date;
    phones?: [string];
    active?: boolean;
    uploadDate?: Date;
    __v?: number;
}

interface IEnterpriseCreate {
    name: string;
    cuit: number;
    description?: string;
    foundationDate?: Date;
    phones?: [string];
}

interface IEnterpriseEdit {
    name: string;
    cuit: number;
    description: string;
    foundationDate: Date;
}

const getAPIPrefix = (id: string): string => `enterprises/${id}`;

/**
 * Actualizar datos de una empresa.
 * @param id ID de la empresa.
 * @param data Datos a actualizar.
 */
export const edit = async (id: string, data: IEnterpriseEdit): Promise<CommonResponse> => {
    const call: Response | null = await u.put(getAPIPrefix(id), data);
    if(call !== null) {
        const { status }: Response = call;
        if(status === 200) return {
            success: true,
            message: "Edición exitosa. "
        };
        else {
            const { error }: { error: IError } = await call.json();
            return {
                success: false,
                ...error
            };
        }
    } return {
        success: false,
        message: "Error de conexión. "
    };
};

/**
 * Deshabilitar un registro de empresa.
 * @param id ID de la empresa.
 */
export const disable = async (id: string): Promise<CommonResponse> => {
    const call: Response | null = await u.del(getAPIPrefix(id), {});
    if(call == null) return {
        success: false,
        message: "Error de conexión. "
    };
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Eliminación exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        return {
            success: false,
            ...error
        };
    }
};

/**
 * Crea un registro de empresa.
 * @param enterprise Datos de la empresa.
 */
export const create = async (enterprise: IEnterpriseCreate): Promise<CommonResponse> => {
    const call: Response | null = await u.post("enterprises", enterprise);
    if(call == null) return {
    success: false,
    message: "Error de conexión. "
};
const { status }: Response = call;
if(status === 201) {
    const data = await call.json();
    return {
        success: true,
        message: "Creación exitosa. ",
        data: {
            ...enterprise,
            _id: data._id
        }
    };
}
else {
    const { error }: { error: IError } = await call.json();
    return {
        success: false,
        ...error
    };
}
};

/**
 * Busca un registro de empresa por ID.
 * @param id ID del registro.
 */
export const find = async (id: string): Promise<IEnterprise> => {
    const call: Response | null = await u.get(getAPIPrefix(id));
    if(call == null) return Promise.reject({
        code: "unknown-error",
        message: "Error de conexión. ",
        details: "No se pudo conectar con el servidor. "
    });
    const { status }: Response = call;
    if(status === 200) {
        const data = await call.json();
        return data;
    } return Promise.reject(await call.json());
};

/**
 * Listar empresas.
 */
export const list = async (): Promise<IEnterprise[]> => {
    const call: Response | null = await u.get("enterprises");
    if(call == null) return Promise.reject({
        code: "unknown-error",
        message: "Error de conexión. ",
        details: "No se pudo conectar con el servidor. "
    });
    const { status }: Response = call;
    if(status === 200) {
        const data = await call.json();
        return data;
    } return Promise.reject(await call.json());
};

/**
 * Obtener lista de números asociados a una empresa.
 * @param id ID de la empresa.
 */
export const getPhones = async (id: string): Promise<string[]> => {
    const call: Response | null = await u.get(getAPIPrefix(id) + "/phones");
    if(call == null) return [];
    const { status }: Response = call;
    if(status === 200) {
        const data = await call.json();
        return data;
    } return [];
}

/**
 * Asociar un número a una empresa.
 * @param id ID de la empresa.
 * @param phone Número de teléfono.
 */
export const addPhone = async (id: string, phone: string): Promise<CommonResponse> => {
    const call: Response | null = await u.post(getAPIPrefix(id) + "/phones", { phone });
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
        return {
            success: false,
            ...error
        };
    }
};

/**
 * Eliminar un número de empresa.
 * @param id ID de la empresa.
 * @param phone Número de teléfono a eliminar.
 */
export const deletePhone = async (id: string, phone: string): Promise<CommonResponse> => {
    const call: Response | null = await u.del(getAPIPrefix(id) + "/phones", { phone });
    if(call == null) return {
        success: false,
        message: "Error de conexión. "
    };
    const { status }: Response = call;
    if(status === 200) return {
        success: true,
        message: "Teléfono eliminado. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        return {
            success: false,
            ...error
        };
    }
}

export const votes = {
    get: (id: string): Promise<VoteStatus> => getVotes(getAPIPrefix(id)),
    upvote: (id: string): Promise<VoteStatus> => upvote(getAPIPrefix(id)),
    downvote: (id: string): Promise<VoteStatus> => downvote(getAPIPrefix(id))
};

export const comments = {
    fetch: (id: string, paginator: IPaginator): Promise<ICommentFetchResponse> => Comment.fetch(getAPIPrefix(id), paginator),
    post: (id: string, content: string): Promise<ICommentCreationResponse> => Comment.post(getAPIPrefix(id), content),
    erase: (id: string, comment: Comment): Promise<CommonResponse> => comment.delete(getAPIPrefix(id))
};