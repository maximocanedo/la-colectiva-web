import React from "react";
import {useTranslation} from "react-i18next";
import {IEnterprisePhoneItemProps} from "./defs";
import {Call24Filled, MoreVerticalFilled} from "@fluentui/react-icons";
import {Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger} from "@fluentui/react-components";
import {PhoneNumberFormat, PhoneNumberUtil} from "google-libphonenumber";
import * as enterprises from "../../../data/actions/enterprise";
import {CommonResponse} from "../../../data/utils";
import { useNavigate } from "react-router-dom";
import {Tooltip} from "@fluentui/react-components";
import {log} from "../../page/definitions";

function copyToClipboard(text: string): void {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    tempTextArea.style.position = "fixed";
    tempTextArea.style.top = "-9999px";
    tempTextArea.style.left = "-9999px";
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
}

const LANG_PATH: string = "components.enterprise.EnterprisePhoneHandler.item";
const strings = {
    actions: {
        copy: "actions.copy",
        rem: "actions.rem"
    },
    tooltips: {
        call: "tooltips.call"
    }
};
const EnterprisePhoneItem = ({phone, id, deletable, onDeleted }: IEnterprisePhoneItemProps): React.JSX.Element => {

    log("EnterprisePhoneItem");
    const { t: translate } = useTranslation();
    const navigate = useNavigate();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(phone, 'AR');
    const v: string = phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL);

    const delPhone = (): void => {
        enterprises.deletePhone(id, phone)
            .then((response: string[]): void => {
                onDeleted(response);
            }).catch(err => console.error(err)).finally((): void => {

        });
    };
    const copy = (): void => {
        copyToClipboard(v);
    };

    return (<div className="phone-item">

        <Tooltip relationship={"label"} content={t(strings.tooltips.call)}>
            <Button appearance={"secondary"} onClick={() => {
                window.location.href = ("tel://" + v);
            }} icon={<Call24Filled />} />
        </Tooltip>
        <div className="phone-data">
            { v }
        </div>
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <Button size={"small"} appearance={"subtle"} icon={<MoreVerticalFilled />} />
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={() => copy()}>{t(strings.actions.copy)}</MenuItem>
                    {deletable && <MenuItem onClick={() => delPhone()}>{t(strings.actions.rem)}</MenuItem>}
                </MenuList>
            </MenuPopover>
        </Menu>
    </div>);
};
export default EnterprisePhoneItem;