import {EnterpriseAddProps} from "./defs";
import React, {useState} from "react";
import {Button, Spinner, Title2} from "@fluentui/react-components";
import * as enterprises from "../../../data/actions/enterprise";
import {useNavigate} from "react-router-dom";
import GottaLoginFirst from "../../err/GottaLoginFirst";
import {useTranslation} from "react-i18next";
import EnterpriseNameField from "./EnterpriseNameField";
import EnterpriseCUITField from "./EnterpriseCUITField";
import EnterpriseDescriptionField from "./EnterpriseDescriptionField";
import EnterpriseFoundationDateField from "./EnterpriseFoundationDateField";
import {IEnterprise} from "../../../data/models/enterprise";
import {UserLogged} from "../../../components/page/definitions";

const LANG_PATH: string = "pages.enterprises.Register";
const strings = {
    title: "title",
    registering: "registering",
    register: "register"
};
const EnterpriseAdd = ({ me }: EnterpriseAddProps): React.JSX.Element => {
    const navigate = useNavigate();
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);

    const [ name, setName ] = useState<string>("");
    const [ nameIsOK, setNameValidity ] = useState<boolean>(false);

    const [ CUIT, setCUIT ] = useState<number>(parseInt(""))
    const [ CUITIsOK, setCUITValidity ] = useState<boolean>(false);

    const [ description, setDescription ] = useState<string>("");
    const [ descriptionIsOK, setDescriptionValidity ] = useState<boolean>(false);

    const [ foundationDate, setFoundationDate ] = useState<Date>(new Date());
    const [ foundationIsOK, setFoundationDateValidity ] = useState<boolean>(false);

    const [ loading, setLoadingState ] = useState<boolean>(false);
    const register = (): void => {
        if([nameIsOK, CUITIsOK, descriptionIsOK, foundationIsOK].some(x => !x)) return;
        setLoadingState(true);
        enterprises.create({ name, cuit: CUIT, description, foundationDate })
            .then(({ _id }: IEnterprise): void => {
                navigate("/enterprises/" + _id);
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setLoadingState(false);
            });
    };
    const loggedIn: boolean =
        me !== undefined && me !== null && me.active;
    const canCreate: boolean = loggedIn && ((me as UserLogged).role) >= 2;
    if(!canCreate) {
        // TODO Show a banner
        return <></>;
    }
    if(!loggedIn) return <GottaLoginFirst />;

    return (<>
        <div className={"page-content flex-down"}>
            <Title2 align={"center"}>{t(strings.title)}</Title2>
            <br/>
            <EnterpriseNameField value={name} onChange={(x) => setName(x)} onCheck={(x) => setNameValidity(x)}/>
            <EnterpriseCUITField value={CUIT} onChange={(x) => setCUIT(x)} onCheck={(x) => setCUITValidity(x)}/>
            <EnterpriseDescriptionField value={description} onChange={(x) => setDescription(x)}
                                        onCheck={(x) => setDescriptionValidity(x)}/>
            <EnterpriseFoundationDateField value={foundationDate} onChange={x => setFoundationDate(x)}
                                           onCheck={x => setFoundationDateValidity(x)}/>
            <br/>
            <div className="jBar">
                <div className="l"></div>
                <div className="r">
                    <Button
                        iconPosition={"before"}
                        icon={loading ? <Spinner size={"extra-tiny"}/> : null}
                        appearance={"primary"}
                        disabled={loading || !nameIsOK || !CUITIsOK}
                        onClick={_e => register()}>
                        {loading ? t(strings.registering) : t(strings.register)}
                    </Button>
                </div>
            </div>
        </div>
    </>);
}
export default EnterpriseAdd;