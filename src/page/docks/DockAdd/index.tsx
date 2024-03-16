import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IDockAddProps} from "./defs";
import {useStyles} from "./styles";
import {Button, mergeClasses, Spinner, Title2} from "@fluentui/react-components";
import {IRegion} from "../../../data/models/region";
import {DockPropertyStatus, IDock} from "../../../data/models/dock";
import NameField from "../../../components/docks/c/NameField";
import AddressField from "../../../components/docks/c/AddressField";
import RegionField from "../../../components/docks/c/RegionField";
import NotesField from "../../../components/docks/c/NotesField";
import StatusSelField from "../../../components/docks/c/StatusSelField";
import LocationField from "../../../components/docks/c/LocationField";
import * as docks from "../../../data/actions/dock";
import { useNavigate } from "react-router-dom";
import GottaLoginFirst from "../../err/GottaLoginFirst";

const LANG_PATH: string = "pages.docks.DockAdd";
const strings = {
    title: "title"
};
const DockAdd = ({ me, sendToast }: IDockAddProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const navigate = useNavigate();
    //// <values>
    const [ name, setName ] = useState<string>("");
    const [ address, setAddress ] = useState<number>(0);
    const [ region, setRegion ] = useState<IRegion | null>(null);
    const [ notes, setNotes ] = useState<string>("");
    const [ status, setStatus ] = useState<DockPropertyStatus>(DockPropertyStatus.UNLISTED);
    const [ location, setLocation ] = useState<[number, number]>([-34.38651267795363, -58.572406768798835]);
    //// </values>
    //// <validators>
    const [ nameIsValid, setNameValidity ] = useState<boolean>(false);
    const [ addressIsValid, setAddressValidity ] = useState<boolean>(false);
    const [ regionIsValid, setRegionValidity ] = useState<boolean>(false);
    const [ notesIsValid, setNotesValidity ] = useState<boolean>(false);
    const [ statusIsValid, setStatusValidity ] = useState<boolean>(false);
    const [ locationIsValid, setLocationValidity ] = useState<boolean>(false);
    //// </validators>
    //// <statuses>
    const [ saving, setSavingState ] = useState<boolean>(false);
    //// </statuses>

    const notNull: boolean = me !== null && me !== undefined;
    // @ts-ignore
    const canAdd: boolean = notNull && me.active && me.role >= 2;
    if(!notNull) return <GottaLoginFirst />;
    if(!canAdd) return <>You can't perform this action. </>;

    const ableToRegister: boolean = [ nameIsValid, addressIsValid, regionIsValid, notesIsValid, statusIsValid, locationIsValid ].every((x: boolean) => x);

    const save = (): void => {
        if(region === null) return;
        setSavingState(true);
        docks.create({ name, address, region: region._id, status, coordinates: location, notes })
            .then(({ _id }: IDock): void => {
                navigate("/docks/" + _id);
            })
            .catch(err => {
               console.error(err);
            })
            .finally((): void => {
                setSavingState(false);
            });
    };


    return (<div className={mergeClasses(styles.root, "page-content", "flex-down")}>
        <Title2>{t(strings.title)}</Title2>
        <br/>
        <NameField value={name} onChange={setName} onCheck={setNameValidity} />
        <RegionField value={region} onChange={setRegion} onCheck={setRegionValidity} />
        <AddressField value={address} onChange={setAddress} onCheck={setAddressValidity} />
        <StatusSelField value={status} onChange={setStatus} onCheck={setStatusValidity} />
        <LocationField value={location} onChange={setLocation} onCheck={setLocationValidity} />
        <NotesField value={notes} onChange={setNotes} onCheck={setNotesValidity} />
        <br/>
        <div className="jBar">
            <div className="l"></div>
            <div className="r">
                <Button
                    onClick={x => save()}
                    appearance={"primary"}
                    icon={saving ? <Spinner size={"extra-tiny"} /> : null}
                    disabled={!ableToRegister || saving}>
                    {saving ? translate("status.registering") : translate("actions.register")}
                </Button>
            </div>
        </div>
    </div>);
};
export default DockAdd;