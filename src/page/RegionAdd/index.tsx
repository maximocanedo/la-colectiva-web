import {IRegionAddProps} from "./defs";
import React, {useState} from "react";
import {Button, Input, Spinner, Title2} from "@fluentui/react-components";
import {IRegion, RegionType} from "../../data/models/region";
import RegionTypeSelector from "../../components/region/RegionTypeSelector";
import {NullableRegionType} from "../../components/region/RegionTypeSelector/defs";
import RegionNameField from "../../components/region/RegionNameField";
import RegionTypeSelectorField from "../../components/region/RegionTypeSelectorField";
import * as regions from "../../data/actions/region";
import { useNavigate } from "react-router-dom";

const RegionAdd = ({}: IRegionAddProps): React.JSX.Element => {
    const navigate = useNavigate();
    const [ name, setName ] = useState<string>("");
    const [ nameIsOK, setNameValidity ] = useState<boolean>(false);
    const [ type, setType ] = useState<NullableRegionType>()
    const [ typeIsOK, setTypeValidity ] = useState<boolean>(false);
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const register = (): void => {
        if([nameIsOK, typeIsOK].some(x => !x)) return;
        setLoadingState(true);
        regions.create({ name, type: type as RegionType })
            .then(({ _id }: IRegion): void => {
                navigate("/regions/" + _id);
            }).catch(err => console.error(err)).finally((): void => {
                setLoadingState(false);
        });
    };

    return (<>
        <div className={"page-content flex-down"}>
            <Title2 align={"center"}>Registrar una región</Title2>
            <br/><br/>
            <RegionNameField disabled={loading} value={name} onChange={value => setName(value)} onCheck={isValid => setNameValidity(isValid)} />
            <RegionTypeSelectorField
                disabled={loading}
                value={type?? null}
                onChange={value => setType(value)}
                onCheck={isValid => setTypeValidity(isValid)}
            />
            <div className="jBar">
                <div className="l"></div>
                <div className="r">
                    <Button iconPosition={"before"} icon={loading ? <Spinner size={"extra-tiny"} /> : null} appearance={"primary"} disabled={!nameIsOK || !typeIsOK} onClick={e => register()}>
                        { loading ? "Registrando... " : "Registrar" }
                    </Button>
                </div>
            </div>
        </div>
    </>);
}
export default RegionAdd;