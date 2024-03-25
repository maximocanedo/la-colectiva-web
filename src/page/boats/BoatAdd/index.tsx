import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IBoatAddProps} from "./defs";
import {useStyles} from "./styles";
import {Button, Spinner, Title2} from "@fluentui/react-components";
import {IEnterprise} from "../../../data/models/enterprise";
import NameField from "./NameField";
import MatField from "./MatField";
import * as boats from "../../../data/actions/boat";
import EnterpriseField from "./EnterpriseField";
import { useNavigate } from "react-router-dom";
import {IBoat} from "../../../data/models/boat";
import WelcomingTitle from "../../../components/basic/WelcomingTitle";
import InsufficientRole from "../../err/InsufficientRole";

const LANG_PATH: string = "pages.boats.BoatAdd";
const strings = {
    title: "title",
    save: "actions.save",
    saving: "status.saving"
};
const BoatAdd = ({ me }: IBoatAddProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();

    const [ name, setName ] = useState<string>("");
    const [ mat, setMat ] = useState<string>("");
    const [ enterprise, setEnterprise ] = useState<IEnterprise | null>(null);

    const [ nameIsValid, setNameValidity ] = useState<boolean>(false);
    const [ matIsValid, setMatValidity ] = useState<boolean>(false);
    const [ enterpriseIsValid, setEnterpriseValidity ] = useState<boolean>(false);

    const [ loading, setLoadingState ] = useState<boolean>(false);

    const ableToRegister: boolean = nameIsValid && matIsValid && enterpriseIsValid;
    const navigate = useNavigate();

    const canCreate: boolean = (me !== null && me !== undefined && me.active && me.role >= 2);
    if(!canCreate) return <InsufficientRole />;

    const save = (): void => {
        if(!ableToRegister) return;
        if(enterprise === null) return;
        setLoadingState(true);
        boats.create({ name, mat, enterprise: enterprise._id, status: true })
            .then(({ _id }: IBoat): void => {
                navigate("/boats/" + _id );
            }).catch(err => console.error(err))
            .finally((): void => {
                setLoadingState(false);
            });
    };

    return (<div className={styles.root + " page-content flex-down"}>
        <WelcomingTitle content={t(strings.title)} />
        <br/>
        <NameField value={name} onChange={x => setName(x)} onCheck={x => setNameValidity(x)} />
        <MatField value={mat} onChange={x => setMat(x)} onCheck={x => setMatValidity(x)} />
        <EnterpriseField value={enterprise} onChange={setEnterprise} onCheck={setEnterpriseValidity} />
        <div className="jBar">
            <div className="l"></div>
            <div className="r">
                <Button
                    onClick={() => save()}
                    appearance={"primary"}
                    iconPosition={"before"}
                    icon={loading ? <Spinner size={"extra-tiny"} /> : null}
                    disabled={!ableToRegister}>{translate(loading ? strings.saving : strings.save)}</Button>
            </div>
        </div>
    </div>);
};
export default BoatAdd;