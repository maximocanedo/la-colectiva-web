import {ICommonPageProps, Myself} from "../../components/page/definitions";

export interface LoginPageProps extends ICommonPageProps {
    sendMe(e: boolean): void;
}