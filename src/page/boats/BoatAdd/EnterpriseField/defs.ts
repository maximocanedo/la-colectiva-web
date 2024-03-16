import {IEnterprise} from "../../../../data/models/enterprise";

export interface IEnterpriseFieldProps {
    value: IEnterprise | null;
    onChange(value: IEnterprise): void;
    onCheck(valid: boolean): void;
}