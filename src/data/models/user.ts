import { CommonResponse, IError } from "../utils";

/**
 * Roles posibles de una cuenta de usuario.
 */
export enum Role {
    /**
     * **Observador**. Puede realizar consultas.
     */
    OBSERVER = 0,
    /**
     * **Usuario normal**. Puede realizar consultas, comentar y votar recursos.
     */
    NORMAL = 1,
    /**
     * **Moderador.** Puede crear nuevos recursos, y editar o eliminar recursos de su autoría.
     */
    MODERATOR = 2,
    /**
     * **Administrador**. Puede cambiar el rol de los usuarios, y editar o eliminar cualquier recurso.
     */
    ADMINISTRATOR = 3
}
type Birth = Date | string | number;
/**
 * Datos necesarios para crear una cuenta. 
 */
export interface ISignUpRequest {
    username: string;
    name: string;
    email: string;
    bio: string;
    birth: Birth;
    password: string;
}
export interface IUser {
    _id: string;
    username: string;
    name: string;
    email?: string;
    bio?: string;
    birth?: Birth | null;
    role?: Role;
    active?: boolean;

}
export interface IUserEditRequest {
    name?: string;
    bio?: string;
    email?: string;
    birth?: Birth | null;
}
export interface MailVerificationSentResponse {
    success: boolean;
    validationId?: string;
    error?: IError;
}
export interface ISignUpResponse extends CommonResponse {
    validationId: string | null;
}
export type IMailSentResponse = { validationId: string, error?: IError };
export interface IMailSentFinalResponse {
    success: boolean;
    validationId?: string;
    error?: IError;
}