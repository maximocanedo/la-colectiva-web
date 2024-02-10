import { CommonResponse, IError } from "../utils";

/**
 * Roles posibles de una cuenta de usuario.
 */
export enum Role {
    /**
     * **Observador**.
     *
     * Usuario con funciones limitadas.
     *
     * Un usuario es observador desde que crea su cuenta hasta que verifica su correo electrónico por primera vez.
     * También puede adquirir este rol al incumplir con las normas de La Colectiva, como subir información falsa, spam, y realizar comentarios fuera de tono.
     *
     * @Puede Realizar consultas
     *
     *
     */
    OBSERVER = 0,
    /**
     * **Usuario normal**.
     *
     * Usuario ideal.
     *
     * Un usuario común adquiere su rol desde que verifica su correo electrónico por primera vez.
     *
     * @Puede Realizar consultas
     *
     *  Votar y comentar recursos.
     *
     */
    NORMAL = 1,
    /**
     * **Moderador.**
     *
     * Usuario con permisos extra. Puede crear y eliminar.
     *
     * Un moderador puede adquirir su rol únicamente cuando un administrador se lo concede.
     * Puede perder su rol si incumple con alguna de las normas de La Colectiva,
     * como crear recursos con información falsa.
     *
     * @Puede Realizar consultas.
     *
     *  Votar y comentar recursos.
     *
     *  Crear recursos.
     *
     *  Editar recursos creados por sí mismo.
     *
     *  Eliminar recursos creados por sí mismo.
     */
    MODERATOR = 2,
    /**
     * **Administrador**.
     *
     * Usuario con mayor poder sobre los datos.
     *
     * Un administrador puede adquirir su rol únicamente cuando otro administrador se lo concede.
     * Puede perder su rol por mal comportamiento o mal uso de su poder.
     *
     * @Puede Realizar consultas.
     *
     * Votar y comentar recursos.
     *
     * Crear recursos.
     *
     * Editar recursos.
     *
     * Eliminar recursos.
     *
     * Conceder roles a otros usuarios.
     *
     * Deshabilitar otros usuarios.
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