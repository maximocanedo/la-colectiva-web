import {IPictureDetails} from "../models/picture";
import {CommonResponse, u} from "../utils";
import {Err} from "../error";

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
    const { status, json }: Response = await u.get(getPrefix(id));
    const { error, ...data } = await json();
    if(status === 200) return data;
    throw new Err(error);
};
/**
 * **Descargar imagen**
 *
 * Descarga la imagen y la devuelve en formato BLOB.
 * @param id ID de la imagen a descargar.
 */
export const download = async (id: string): Promise<Blob> => {
    const { ok, blob }: Response = await u.get(getPrefix(id) + "/view");
    if(!ok) throw new Error("No se pudo descargar la imagen. ");
    return await blob();
};
/**
 * **Listar imágenes**
 * @param prefix Prefijo de la URL del recurso.
 */
export const list = async (prefix: string): Promise<IPictureDetails[]> => {
    const { ok, json }: Response = await u.get(prefix + "/pictures");
    const { pictures, error } = await json();
    if(ok) return pictures;
    throw new Err(error);
};
/**
 * **Subir imagen**
 *
 * Sube una imagen al servidor.
 * @param prefix Prefijo de la URL del recurso al cual se le añadirá la imagen.
 * @param image Imagen en formato BLOB.
 * @param description Pie de foto.
 */
export const upload = async (prefix: string, image: Blob, description: string): Promise<CommonResponse> => {
    const data: FormData = new FormData();
    data.append("file", image);
    data.append("description", description);
    const { ok, json }: Response = await u.post(prefix + "/pictures", data);
    const { message, error } = await json();
    if(ok) return { success: true, message };
    throw new Err(error);
};