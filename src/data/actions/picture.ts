import {IPictureDetails} from "../models/picture";
import {CommonResponse, u} from "../utils";
import {Err} from "../error";
import {IComment, ICommentFetchResponse, IPaginator} from "../models/comment";
import {VoteStatus} from "../models/vote";
import {downvote, getVotes, upvote} from "./vote";
import * as comment from "./comment";

/**
 * TODO:
 * Las funciones deben ser actualizadas en cuanto se terminen
 * de actualizar los endpoints de imágenes en la API.
 */

/**
 * Obtener prefijo de URL de la API.
 * @param id ID del recurso.
 */
const getPrefix = (id: string): string => "photos/" + id;
/**
 * **Buscar imagen por ID**
 *
 * Busca los detalles de una imagen por ID.
 * @param id ID de la imagen.
 */
export const find = async (id: string): Promise<IPictureDetails> => {
    const call: Response = await u.get(getPrefix(id));
    const { error, ...data } = await call.json();
    if(call.ok) return data;
    throw new Err(error);
};
/**
 * **Descargar imagen**
 *
 * Descarga la imagen y la devuelve en formato BLOB.
 * @param id ID de la imagen a descargar.
 */
export const download = async (id: string): Promise<Blob> => {
    const call: Response = await u.get(getPrefix(id) + "/view");
    if(!call.ok) throw new Error("No se pudo descargar la imagen. " + `(${id})`);
    return await call.blob();
};
/**
 * **Listar imágenes**
 * @param prefix Prefijo de la URL del recurso.
 */
export const list = async (prefix: string, paginator: IPaginator): Promise<IPictureDetails[]> => {
    const call: Response = await u.get(prefix + "/pictures?page="+paginator.p+"&size="+paginator.itemsPerPage);
    const { pictures, error } = await call.json();
    if(call.ok) return pictures;
    throw new Err(error);
};
export const remove = async (prefix: string, photoId: string): Promise<void> => {
    const call: Response = await u.del(prefix + "/pictures/" + photoId);
    if(call.ok) return;
    const { error } = await call.json();
    throw new Err(error);
}
export interface OnPostResponse extends CommonResponse {
    id: string;
}
/**
 * **Subir imagen**
 *
 * Sube una imagen al servidor.
 * @param prefix Prefijo de la URL del recurso al cual se le añadirá la imagen.
 * @param image Imagen en formato BLOB.
 * @param description Pie de foto.
 */
export const upload = async (prefix: string, image: Blob, description: string): Promise<OnPostResponse> => {
    const filename = "uploaded_image.jpg";
    const file = new File([image], filename, { type: image.type });

    const data: FormData = new FormData();
    data.append("file", file);
    data.append("description", description);

    const call = await fetch(u.baseUrl + prefix + "/pictures", {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("la-colectiva-token")
        },
        method: "POST",
        body: data
    });

    const { message, id, error } = await call.json();

    if (call.ok) {
        return { success: true, message, id };
    } else {
        throw new Err(error);
    }
};
export const votes = {
    get: async (id: string): Promise<VoteStatus> => getVotes(getPrefix(id)),
    upvote: async (id: string): Promise<VoteStatus> => upvote(getPrefix(id)),
    downvote: async (id: string): Promise<VoteStatus> => downvote(getPrefix(id))
};
export const comments = {
    get: async (id: string, paginator: IPaginator = { p: 0, itemsPerPage: 3 }): Promise<IComment[]> =>
        comment.fetch(getPrefix(id), paginator),
    post: async (id: string, content: string): Promise<ICommentFetchResponse> =>
        comment.post(getPrefix(id), content),
    del: async (id: string, commentId: string): Promise<CommonResponse> =>
        comment.del(getPrefix(id), commentId)
};