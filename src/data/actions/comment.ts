import {CommonResponse, IError, u} from "../utils";
import {Err} from "../error";
import {IComment, ICommentFetchResponse, IPaginator} from "../models/comment";
const getPrefix = (id: string): string => "comments/" + id;
/**
 * Edita un comentario.
 * @param id ID del comentario a editar.
 * @param content Nuevo contenido del comentario.
 */
export const edit = async (id: string, content: string): Promise<IComment> => {
    const call: Response = await u.put(getPrefix(id), { content });
    const { status }: Response = call;
    const data = await call.json();
    if(status === 200) {
        return data;
    } else {
        throw new Err(data.error as IError);
    }
};
/**
 * Elimina un comentario.
 * @param prefix Prefijo de la URL del recurso que contiene ese comentario.
 * @param id ID del comentario.
 */
export const del = async (prefix: string, id: string): Promise<CommonResponse> => {
    const call: Response = await u.del(`${prefix}/${getPrefix(id)}`, {});
    const { status }: Response = call;
    const data = await call.json();
    if(status === 200) {
        return {
            success: true,
            message: "Comentario eliminado con éxito. "
        };
    } else {
        throw new Err(data.error as IError);
    }
};
/**
 * Publica un comentario.
 * @param prefix Prefijo de la URL del recurso que se desea comentar.
 * @param content Contenido del comentario.
 */
export const post = async (prefix: string, content: string): Promise<ICommentFetchResponse> => {
    const call: Response = await u.post(prefix + "/comments", { content });
    const { status }: Response = call;
    const data = await call.json();
    if(status === 201) return {
        ...data,
        success: true
    }; else throw new Err(data.error as IError);
};
/**
 * Obtiene comentarios de un recurso.
 * @param prefix Prefijo de la URL del recurso cuyos comentarios se desea obtener.
 * @param paginator Objeto paginador.
 */
export const fetch = async (prefix: string, paginator: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<IComment[]> => {
    const call: Response = await u.get(prefix + `/comments?p=${paginator.p}&itemsPerPage=${paginator.itemsPerPage}`);
    const { status }: Response = call;
    const data = await call.json();
    if(status === 200) return data.comments;
    else throw new Err(data.error as IError);
};