import { IUser } from "./user";
export interface IComment {
    _id: string;
    user: IUser | string;
    content: string;
    active: boolean;
    uploadDate: Date;
    __v: number; 
}
export interface IPaginator {
    p: number;
    itemsPerPage: number;
}
export interface ICommentFetchResponse {
    success: boolean;
    comments: IComment[];
    message: string;
}
export interface ICommentCreationResponse {
    success: boolean;
    comment: any[] | Comment;
    message: string;
}