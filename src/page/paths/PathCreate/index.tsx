import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IPathCreateProps} from "./defs";
import {useStyles} from "./styles";
import {Button, mergeClasses, Spinner, Title2} from "@fluentui/react-components";
import TitleField from "../../../components/path/c/TitleField";
import {IBoat} from "../../../data/models/boat";
import BoatField from "../../../components/path/c/BoatField";
import DescriptionField from "../../../components/path/c/DescriptionField";
import NotesField from "../../../components/path/c/NotesField";
import * as paths from "../../../data/actions/path";
import {CommonResponse} from "../../../data/utils";
import {IPath} from "../../../data/models/path";
import {useNavigate} from "react-router-dom";
import {UserLogged} from "../../../components/page/definitions";
import GottaLoginFirst from "../../err/GottaLoginFirst";
import InsufficientRole from "../../err/InsufficientRole";

const LANG_PATH: string = "pages.paths.PathCreate";
const strings = {
    title: "title"
};
const PathCreate = ({ me }: IPathCreateProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const navigate = useNavigate();

    const [ title, setTitle ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ notes, setNotes ] = useState<string>("");
    const [ boat, setBoat ] = useState<IBoat | null>(null);

    const [ titleIsValid, setTitleValidity ] = useState<boolean>(false);
    const [ descriptionIsValid, setDescriptionValidity ] = useState<boolean>(false);
    const [ notesIsValid, setNotesValidity ] = useState<boolean>(false);
    const [ boatIsValid, setBoatValidity ] = useState<boolean>(false);
    const [ saving, setSavingState ] = useState<boolean>(false);


    const ok: boolean = [ titleIsValid, descriptionIsValid, notesIsValid, boatIsValid ].every(x => x);

    const isLogged: boolean = me !== null && me !== undefined && me.active;
    const canCreate: boolean = isLogged && (me as UserLogged).role >= 2;
    if(!isLogged) return <GottaLoginFirst />;
    if(!canCreate) return <InsufficientRole />;

    const save = (): void => {
        if(boat === null || !ok) return;
        setSavingState(true);
        paths.create({ title, description, notes, boat: boat._id })
            .then((response: IPath): void => {
                navigate("/paths/" + response._id);
                //console.log(response);
            })
            .catch(err => {
                console.error(err);
            })
            .finally((): void => {
                setSavingState(false);
            })
    };

    return (<div className={mergeClasses(styles.root, "page-content", "flex-down")}>
        <Title2>{t(strings.title)}</Title2>
        <br/>
        <TitleField value={title} onChange={setTitle} onCheck={setTitleValidity} />
        <BoatField value={boat} onChange={setBoat} onCheck={setBoatValidity} />
        <DescriptionField value={description} onChange={setDescription} onCheck={setDescriptionValidity} />
        <NotesField value={notes} onChange={setNotes} onCheck={setNotesValidity} />
        <div className="jBar">
            <div className="l"></div>
            <div className="r">
                <Button
                    onClick={() => save()}
                    appearance={"primary"}
                    icon={saving ? <Spinner size={"extra-tiny"} /> : null}
                    disabled={!ok || saving}
                >{saving ? translate("status.registering") : translate("actions.register")}</Button>
            </div>
        </div>
    </div>);
};
export default PathCreate;