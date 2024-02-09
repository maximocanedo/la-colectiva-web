import { IRegion } from "./region";
import { IUser } from "./user";
/**
 * Categorías de muelles según su propiedad.
 */
enum DockPropertyStatus {
    /**
     * **Privado**. Muelle de uso privado.
     */
    PRIVATE = 0,
    /**
     * **Público**. Muelle de uso público.
     */
    PUBLIC = 1,
    /**
     * **Comercial**. Muelle de uso comercial. Por ejemplo, muelles de restaurantes u hostales.
     */
    BUSINESS = 2,
    /**
     * **Gubernamental**. Muelle de uso gubernamental. Por ejemplo, muelles de comisarías o edificios estatales.
     */
    GOVERNMENT = 3,
    /**
     * **Vecinal**. Muelle de uso exclusivo de vecinos de la zona. Por ejemplo, muelles de barrios privados.
     */
    NEIGHBOURHOOD = 4,
    /**
     * **Otro**. Otro tipo de muelle.
     */
    OTHER = 5,
    /**
     * **Desconocido**. Se desconoce el tipo de muelle.
     */
    UNLISTED = 6
}
export interface IDock {
    _id: string;
    name: string;
    address: number;
    region: IRegion;
    notes: string;
    status: DockPropertyStatus;
    user?: IUser;
    uploadDate?: Date;
    active?: boolean;
    coordinates: [number, number];
    pictures?: [string];
    __v?: number;
}
export interface IDockEdit {
    name: string;
    address: number;
    region: string;
    notes: string;
    coordinates: [number, number];
}
export interface IDockCreate {
    name: string;
    address: number;
    region: string;
    notes: string;
    status: DockPropertyStatus;
    coordinates: [number, number];
}