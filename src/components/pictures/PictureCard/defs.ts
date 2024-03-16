import { IPictureDetails } from "../../../data/models/picture";


import {Myself} from "../../page/definitions";

export interface IPictureCardProps extends IPictureDetails {
    me: Myself;
    docId: string;
    deletable: boolean;
    onDelete(): void;
    remover(id: string, photoId: string): Promise<void>;
}