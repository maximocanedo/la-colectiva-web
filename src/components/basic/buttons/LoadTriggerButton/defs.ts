import {LoadState} from "../../../page/definitions";

export interface ILoadTriggerButtonProps {
    state: LoadState;
    onClick(): void;
}