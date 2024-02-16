import {NullableUser} from "../EmailSection/defs";

export interface NameSectionProps {
    user: NullableUser;
    me: NullableUser;
    onChange(newName: string): void;
}