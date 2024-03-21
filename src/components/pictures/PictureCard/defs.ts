import { IPictureDetails } from "../../../data/models/picture";


import {Myself} from "../../page/definitions";
import {RecordCategory} from "../../../data/actions/reports";

export interface IPictureCardProps extends IPictureDetails {
    me: Myself;
    docId: string;
    deletable: boolean;
    onDelete(): void;
    sendReport(id: string, category: RecordCategory): void;
    remover(id: string, photoId: string): Promise<void>;
}