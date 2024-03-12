import {IEnterprise} from "../../../data/models/enterprise";

export interface IEnterpriseSelectorProps {
    selected: IEnterprise;
    onSelect(selected: IEnterprise): void;
}