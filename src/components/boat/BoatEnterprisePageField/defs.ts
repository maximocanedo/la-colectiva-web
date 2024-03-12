import {IEnterprise} from "../../../data/models/enterprise";

export interface IBoatEnterprisePageFieldProps {
    initial: IEnterprise;
    onUpdate(value: IEnterprise): void;
    id: string;
    editable: boolean;
}