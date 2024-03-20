import {encodeObj, u} from "../utils";
import {Err} from "../error";
import {IPaginator} from "../models/comment";
import {Role} from "../models/user";

export type RecordCategory = "availability" | "boat" | "comment" | "dock" | "enterprise" | "path" | "picture" | "schedule" | "user" | "region" | "other";
export enum ReportReason {
    /**
     * El contenido no está relacionado directamente con el registro en cuestión.
     */
    OUT_OF_TOPIC = 0,
    /**
     * Contenido publicitario, repetitivo y/o engañoso.
     */
    SPAM = 1,
    /**
     * Contenido inapropiado
     */
    NSFW_CONTENT = 2,
    /**
     * Amenazas, insultos
     */
    VIOLENCE = 3,
    /**
     * Otra razón
     */
    OTHER = 4
}
export enum ReportStatus {
    /**
     * **Enviado.**
     * El reporte fue enviado y será visto por algún administrador a la brevedad.
     */
    SENT = 0,
    /**
     * **Visto.** El reporte fue visto por un administrador.
     */
    INFORMED = 1,
    /**
     * **Trabajando.** El administrador está trabajando en solucionar el problema.
     */
    WORKING = 2,
    /**
     * **Solucionado.** El problema fue solucionado y el reporte fue cerrado.
     */
    FIXED = 3,
    /**
     * **Cerrado.** El reporte simplemente fue cerrado.
     */
    CLOSED = 4,
    /**
     * **Contra reportado**. El reporte es inapropiado. Podría resultar en un bloqueo.
     */
    REPORTED_BACK = 5
}
export interface IReportRequest {
    resource: string;
    type: RecordCategory;
    reason: ReportReason;
    details: string;
}
export const report = async ({ resource, type, reason, details }: IReportRequest): Promise<{ _id: string }> => {
    const call: Response = await u.post("reports/", { resource, type, reason, details });
    const { _id, error } = await call.json();
    if(call.ok) return { _id };
    throw new Err(error);
};
export interface IReportView {
    _id: string;
    resource: string;
    type: RecordCategory;
    reason: ReportReason;
    details: string;
    status: ReportStatus;
    user: { _id: string, name: string, username: string, role: Role };
    admin?: { _id: string, name: string, username: string, role: Role };
    officialMessage?: string;
    uploadDate: Date | string;
}
export interface IReportSearchParams extends IPaginator {
    q: string;
    type?: RecordCategory;
    reason?: ReportReason;
    status?: ReportStatus;

}
interface IReportUpdateParamsOnlyOfficialMessage {
    id: string;
    officialMessage: string;
    status?: ReportStatus;
}
interface IReportUpdateParamsOnlyStatus {
    id: string;
    status: ReportStatus;
    officialMessage?: string;
}
export type ReportUpdateParams = IReportUpdateParamsOnlyStatus | IReportUpdateParamsOnlyOfficialMessage;
export const patch = async ({ id, status, officialMessage }: ReportUpdateParams): Promise<void> => {
    const call: Response = await u.patch("reports/"+id, { status, officialMessage });
    if(call.ok) return;
    const { error } = await call.json();
    throw new Err(error);
};
export const list = async ({ q, p, itemsPerPage, type, reason, status }: IReportSearchParams): Promise<IReportView[]> => {
    const call: Response = await u.get("reports/?" + encodeObj({q, p, itemsPerPage, type, reason, status}));
    const { data, error } = await call.json();
    if(call.ok) return data;
    throw new Err(error);
}