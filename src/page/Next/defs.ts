import {ICommonPageProps} from "../../components/page/definitions";
export interface INextParams extends Record<string, string | undefined> {
    from: string | undefined;
    to: string | undefined;
}
export interface INextProps extends ICommonPageProps {

}