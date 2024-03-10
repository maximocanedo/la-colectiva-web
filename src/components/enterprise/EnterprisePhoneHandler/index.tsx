import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IEnterprisePhoneHandlerProps} from "./defs";
import {Button, Field, Input, Spinner, Subtitle2, Tooltip} from "@fluentui/react-components";
import EnterprisePhoneItem from "../EnterprisePhoneItem";
import * as enterprises from "../../../data/actions/enterprise";
import {PhoneNumberFormat, PhoneNumberUtil} from "google-libphonenumber";
import {FieldValidationStatus} from "../../user/user-page/RoleSelector/defs";
import {AddRegular, CallAddFilled, DismissFilled} from "@fluentui/react-icons";
import {CommonResponse} from "../../../data/utils";

const LANG_PATH: string = "components.enterprise.EnterprisePhoneHandler";
const strings = {
    title: "title",
    actions: {
        add: "actions.add"
    },
    add: {
        label: "add.label"
    },
    err: {
        no15prefix: "err.no15prefix",
        invalidNumber: "err.invalidNumber",
        externalNumber: "err.externalNumber"
    },
    tooltips: {
        add: "tooltips.add",
        cancel: "tooltips.cancel",
        firstvalid: "tooltips.firstvalid"
    }
};
const phonesReducer = (state: string[], action: { type: string, payload: string}): string[] => {
    const exists = (phone: string): boolean => state.indexOf(phone) !== -1;
    switch (action.type) {
        case "ADD": {
            if(exists(action.payload)) return [ ...state ];
            else return [ ...state, action.payload ];
        } case "DELETE": {
            if(exists(action.payload)) {
                return [ ...state ].filter(x => x !== action.payload);
            } else return [ ...state ];
        }
        default:
            return [ ...state ];
    }
};
const EnterprisePhoneHandler = ({ me, author, id }: IEnterprisePhoneHandlerProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const canDelete: boolean = me !== null && me !== undefined && author !== null && author !== undefined
        && me.active && (me.role === 3 || (me._id === author._id && me.role === 2));

    const [ phones, dispatchPhones ] = useReducer(phonesReducer, []);
    const [ phone, setPhone ] = useState<string>("");
    const [ fp, setFP ] = useState<string>("");
    const [ fs, setFS ] = useState<FieldValidationStatus>("none");
    const [ addMode, setAddMode ] = useState<boolean>(false);
    const [ adding, setAddingState ] = useState<boolean>(false);
    const add = (phone: string) => dispatchPhones({ type: "ADD", payload: phone });
    const remove = (phone: string) => dispatchPhones({ type: "DELETE", payload: phone });
    const phoneUtil = PhoneNumberUtil.getInstance();
    useEffect(() => {
        enterprises.getPhones(id)
            .then((arr: string[]): void => {
                arr.map(x => add(x));
            }).catch(err => console.error(err)).finally((): void => {

        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const v: string = e.target.value;
        setPhone(v);
        try {
            const number = phoneUtil.parse(v, 'AR');
            if(v.startsWith("15") || v.startsWith("015")) {
                if(v.startsWith("15")) setPhone("11" + v.slice(2));
                if(v.startsWith("015")) setPhone("11" + v.slice(3));
                // strings.err.no15prefix
                setFP("No se aceptan los prefijos 15 y 015. ");
                setFS("warning");
                return;
            }
            if(v === "" || !phoneUtil.isValidNumber(number)) {
                setFP("Número inválido.");
                setFS("error");
                return;
            }
            const n: string = phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
            if(phoneUtil.getRegionCodeForNumber(number) !== "AR") {
                setFP("Ese número no es de Argentina. ");
                setFS("error");
                return;
            }
            setFP(n);
            setFS("success");
        } catch(err) {
            setPhone(v);
            setFP("Número inválido.");
            setFS("error");
        }

    };

    const reg = (): void => {
        if(fs !== "success") return;
        setAddingState(true);
        const number = phoneUtil.parse(phone, 'AR');
        const formatted = phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
        enterprises.addPhone(id, formatted)
            .then((response: string[]): void => {
                response.map(p => add(p));
                setPhone("");
                setFS("none");
                setFP("");
                setAddMode(false);
            }).catch(err => console.error(err)).finally((): void => {
            setAddingState(false);
        })
    }


    return (<div className="qphones">
        <Subtitle2>{t(strings.title)}</Subtitle2>
        <div className="list-of-phones" role={"listbox"}>
            { phones.map((phone: string) => {
                return <EnterprisePhoneItem
                    key={"PhoneItem$" + id + "." + phone}
                    id={id}
                    phone={phone}
                    deletable={canDelete}
                    onDeleted={(arr: string[]) => {
                        remove(phone);
                        arr.map(x => add(x));
                    } }
                />;
            })}
            {(!addMode && canDelete) && <Button onClick={(_e): void => setAddMode(true)} className={"fullWidth"} appearance={"secondary"} icon={<AddRegular />}>{t(strings.actions.add)}</Button>}
            { (addMode && canDelete) && <div className="phone-item">
                <Field
                    validationState={fs}
                    validationMessage={fp}
                    className={"fullWidth"}
                >
                    <Input placeholder={t(strings.add.label)} disabled={adding} value={phone} onChange={handleChange} type={"tel"}/>
                </Field>
                <Tooltip relationship={"label"} content={t(strings.tooltips.cancel)}>
                    <Button className={"heightAuto"} appearance={"secondary"} icon={<DismissFilled/>}
                            onClick={(e): void => setAddMode(false)}/>
                </Tooltip>
                <Tooltip relationship={"label"} content={t(fs === "success" ? strings.tooltips.add : strings.tooltips.firstvalid)}>
                    <Button disabled={adding || fs !== "success"} onClick={(_e): void => reg()} className={"heightAuto"} appearance={"primary"}
                            icon={adding ? <Spinner size={"extra-tiny"} /> : <CallAddFilled/>}/>
                </Tooltip>
            </div>}
        </div>
    </div>);
};
export default EnterprisePhoneHandler;