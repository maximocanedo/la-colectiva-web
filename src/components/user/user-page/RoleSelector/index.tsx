import {FieldValidationStatus, RoleOption, RoleOptions, RoleSelectorProps} from "./defs";
import {Role} from "../../../../data/models/user";
import {useEffect, useState} from "react";
import {Dropdown, Field, Option, OptionOnSelectData, SelectionEvents, useId} from "@fluentui/react-components";
import * as users from "./../../../../data/actions/user";
import {CommonResponse} from "../../../../data/utils";
import {StateManager} from "../../../../page/SignUpPage/defs";
import {useTranslation} from "react-i18next";
import {Err} from "../../../../data/error";
import {log} from "../../../page/definitions";
const RoleSelector = (props: RoleSelectorProps): React.JSX.Element => {
    log("RoleSelector");
    const labelId: string = useId("roleSelector__labelId");
    const { t } = useTranslation();
    const { user, me }: RoleSelectorProps = props;
    const [ status, setStatus ]: StateManager<FieldValidationStatus> = useState<FieldValidationStatus>("none");
    const [ message, setMessage ]: StateManager<string> = useState<string>("");
    const [ editable, setEditable ]: StateManager<boolean> = useState<boolean>(false);
    useEffect((): void => {
        if(me !== null && typeof me.role !== 'undefined' && me.role === Role.ADMINISTRATOR)
            setEditable(true);
    }, [me]);


    if(!user || typeof user.role === 'undefined') return <></>;

    const options: RoleOptions = [
        { name: t('components.user.user-page.RoleSelector.roles.observer'), value: Role.OBSERVER },
        { name: t('components.user.user-page.RoleSelector.roles.normal'), value: Role.NORMAL },
        { name: t('components.user.user-page.RoleSelector.roles.moderator'), value: Role.MODERATOR },
        { name: t('components.user.user-page.RoleSelector.roles.admin'), value: Role.ADMINISTRATOR }
    ];
    const userRole: RoleOption = options[user.role];

    const changeRole = (_event: SelectionEvents, data: OptionOnSelectData): void => {
        if (!data.optionValue) return;
        const newRole: Role = parseInt(data.optionValue) as Role;
        users.updateRole(user.username, newRole)
            .then((response: CommonResponse): void => {
                if(response.success) {
                    setStatus("success");
                    setMessage(t('components.user.user-page.RoleSelector.ok.updated'));
                } else {
                    setStatus("error");
                    setMessage(t('components.user.user-page.RoleSelector.err.noUpdated'));
                }
            })
            .catch((err): void => {
                setStatus("error");
                if(err instanceof Err) {
                    const e: Err = err as Err;
                    setMessage(e.message + "(" + e.code + ").");
                }
                setMessage(err.message);
            });
        setTimeout((): void => {
            setStatus("none");
            setMessage("");
        }, 5000);
    };

    return (<>
        <div className="jBar">
            <span className="l" id={labelId}>{t('components.user.user-page.RoleSelector.label')}:</span>
            { !editable && <span className="r">{ userRole.name }</span>}
            { editable && <Field
                validationState={status}
                validationMessage={message}
                className="r"
                {...props}
            ><Dropdown
                aria-labelledby={labelId}
                placeholder={t('components.user.user-page.RoleSelector.label')}
                defaultSelectedOptions={[ userRole.value.toString() ]}
                defaultValue={ (userRole.name) }
                onOptionSelect={changeRole}
                {...props}
            >
                {options.map((option: RoleOption) => (
                    <Option key={option.value} value={option.value + ""}>
                        {option.name}
                    </Option>
                ))}
            </Dropdown></Field>
            }

        </div>
    </>);
};
export default RoleSelector;