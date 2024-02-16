import {NullableUser} from "../EmailSection/defs";
import {ToastIntent} from "@fluentui/react-components";

export interface ActiveSectionProps {
    user: NullableUser;
    me: NullableUser;
    notify(message: string, type: ToastIntent, description?: string): void;
}