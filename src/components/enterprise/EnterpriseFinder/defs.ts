import {IEnterprise} from "../../../data/models/enterprise";

export interface IEnterpriseFinderProps {
    creatable: boolean;
    onSelect(enterprise: IEnterprise): void;
}