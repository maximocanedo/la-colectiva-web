import {CommonResponse, IError, u} from "../utils";
import {Err} from "../error";
import {IComment, ICommentFetchResponse, IPaginator} from "../models/comment";
import { downvote, getVotes, upvote } from "./vote";
import * as comment from "../actions/comment";
import * as history from "../actions/history";
import {IRegion, IRegionCreate, RegionType} from "../models/region";
import {VoteStatus} from "../models/vote";
import {IHistoryEvent} from "../models/IHistoryEvent";
import {download} from "./picture";

const downloadOnLoad: boolean = true;
const getPrefix = (id: string): string => "regions/" + id;
type RegionEditData = { name: string } | { type: RegionType } | { name: string, type: RegionType };
/**
 * Edita un registro de región.
 * @param id ID del registro.
 * @param data Datos a actualizar.
 */
export const edit = async (id: string, data: RegionEditData): Promise<CommonResponse> => {
    const call: Response = await u.patch(getPrefix(id), data);
    if(call.ok) return {
        success: true,
        message: "Edición exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
/**
 * Elimina una región del sistema.
 * @param id ID de la región a eliminar.
 */
export const del = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.del(getPrefix(id), {});
    if(call.ok) return {
        success: true,
        message: "Eliminación exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
export const enable = async (id: string): Promise<CommonResponse> => {
    const call: Response = await u.post(getPrefix(id), {});
    if(call.ok) return {
        success: true,
        message: "Habilitación exitosa. "
    };
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
};
/**
 * Registrar una región.
 * @param data Datos de la región.
 */
export const create = async (data: IRegionCreate): Promise<IRegion> => {
    const call: Response = await u.post("regions", data);
    if(call.ok) {
        const data = await call.json();
        return {
            ...data,
            _id: data._id
        };
    }
    else {
        const { error }: { error: IError } = await call.json();
        throw new Err(error);
    }
}
/**
 * Encontrar una región por su ID.
 * @param id ID de la región.
 */
export const find = async (id: string): Promise<IRegion> => {
    const call: Response = await u.get(getPrefix(id));
    const { status }: Response = call;
    const data = await call.json();
    if(status === 200) {
        save(data).then(() => {
            console.log("saved");
        }).catch(err => console.error(err));
        return data.data[0];
    } else throw new Err(data.error);
};


const open = (): Promise<IDBDatabase> => {
    const request: IDBOpenDBRequest = indexedDB.open("regions", 1);
    return new Promise<IDBDatabase>((resolve, reject): void => {
        request.onupgradeneeded = function(evt: Event): void {
            const db: IDBDatabase = request.result;
            const store: IDBObjectStore = db.createObjectStore("regions", { keyPath: "_id" });
            const nameIndex: IDBIndex = store.createIndex("byName", "name", {});
            const typeIndex: IDBIndex = store.createIndex("byType", "type", {});
            const activeIndex: IDBIndex = store.createIndex("byState", "active", {});
            const uploadIndex: IDBIndex = store.createIndex("byUploadDate", "uploadDate", {});
            const versionIndex: IDBIndex = store.createIndex("byVersion", "version", {});
        };
        request.onsuccess = function(evt: Event): void {
            resolve(request.result);
        };

        request.onerror = function(evt: Event): void {
            reject(request.error);
        };
    });
};
/**
 * Guarda un registro en la memoria local para su uso fuera de línea.
 * @param data Datos a guardar.
 */
export const save = async (data: IRegion[]): Promise<void> => {
    const db: IDBDatabase = await open();
    return new Promise<void>((resolve, reject): void => {
        const transaction: IDBTransaction = db.transaction("regions", "readwrite");
        const store: IDBObjectStore = transaction.objectStore("regions");
        data.map((item: IRegion) => store.put({...item, downloaded: new Date(Date.now())}));
        transaction.oncomplete = function(): void {
            resolve();
        };
        transaction.onerror = function(): void {
            reject(transaction.error);
        };
    });
};
export const offlineSearch = async (q: string = "", paginator: IPaginator = {p:0,itemsPerPage:10}): Promise<IRegion[]> => {
    let data: IRegion[] = [];
    const db: IDBDatabase = await open();
    return new Promise<IRegion[]>((resolve, reject): void => {
        const transaction: IDBTransaction = db.transaction("regions", "readonly");
        const store: IDBObjectStore = transaction.objectStore("regions");
        // Buscar por nombre únicamente
        const index: IDBIndex = store.index("byName");
        const request: IDBRequest<IDBCursorWithValue | null> = index.openCursor();
        const skip: number = paginator.p * paginator.itemsPerPage;
        const size: number = paginator.itemsPerPage;
        let i: number = 0;
        request.onsuccess = function(): void {
            const cursor: IDBCursorWithValue | null = request.result;
            if(cursor) {
                const value: IRegion = cursor.value as IRegion;
                if(value.name.search(q) > -1) {
                    if(i >= skip && data.length < size) data.push(value);
                    i++;
                }
                cursor.continue();
            } else {
                resolve(data);
            }
        };
        request.onerror = function(): void {
            reject(transaction.error);
        }

    });
}
(async (): Promise<void> => {
    try {
        const data: IRegion[] = await offlineSearch("", { p: 0, itemsPerPage: 6 });
        console.table(data);
    } catch(err) {
        console.error(err);
    }
})();


/**
 * Buscar, listar y/o paginar recursos.
 * @param q Texto a buscar.
 * @param paginator Paginador.
 */
export const search = async (q: string = "", paginator: IPaginator = { p: 0, itemsPerPage: 10 }): Promise<IRegion[]> => {
    try {
        const call: Response = await u.get(`regions/?q=${q}&p=${paginator.p}&itemsPerPage=${paginator.itemsPerPage}`);
        const { status }: Response = call;
        const { data, error } = await call.json();
        if(status === 200) {
            if(downloadOnLoad)
                save(data).then((): void => { console.log("Saved!"); }).catch(err => console.error(err));
            return data;
        } else throw new Err(error);
    } catch(err: any) {
        if(!downloadOnLoad && (!err || !('code' in err) || err.code !== "L-01")) throw new Err(err);
        console.error("Error al intentar cargar registros. Se intentará usar los registros fuera de línea. ");
        try {
            const data: IRegion[] = await offlineSearch(q, paginator);
            return data;
        } catch(err: any) {
            throw new Err(err);
        }
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

export const fetchHistory = async (id: string, paginator: IPaginator = { p: 0, itemsPerPage: 5 }): Promise<IHistoryEvent[]> =>
        history.fetch(getPrefix(id), paginator);