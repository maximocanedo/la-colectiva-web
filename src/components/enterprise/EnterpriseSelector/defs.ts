import {IEnterprise} from "../../../data/models/enterprise";

export interface IEnterpriseSelectorProps {
    selected: IEnterprise | null;
    onSelect(selected: IEnterprise): void;
}