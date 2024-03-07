import {RegionType} from "../../../data/models/region";
import {ComboboxProps} from "@fluentui/react-components";
export type NullableRegionType = RegionType | null;
export interface RegionTypeSelectorProps extends Omit<Omit<ComboboxProps, "value">, "onChange">  {
    value: NullableRegionType;
    onChange(value: NullableRegionType): void;
    required: boolean;
    requiredEmptyLabelOption: string;
}