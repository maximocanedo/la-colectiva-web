import {Toast, ToastBody, ToastFooter, ToastTitle} from "@fluentui/react-components";
import {IToastNotification, ToastDispatcher, ToastSenderFunction} from "./definitions";

export const toastSender = (dispatchToast: ToastDispatcher): ToastSenderFunction => ({ title, body, action, footer, intent }: IToastNotification): void => {
    dispatchToast(
        <Toast>
            <ToastTitle { ...(action !== undefined ? {action}: {}) }>{title}</ToastTitle>
            <ToastBody subtitle="Subtitle">{body}</ToastBody>
            {footer !== undefined && <ToastFooter>
                { footer.map(link => link) }
            </ToastFooter>}
        </Toast>,
        { intent }
    );
};