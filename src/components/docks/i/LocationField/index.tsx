import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {ILocationFieldProps} from "./defs";
import {useStyles} from "./styles";
import {Button, mergeClasses, Spinner} from "@fluentui/react-components";
import {formatLat, formatLon} from "../../../maps/PlaceSelector/defs";
import {Edit16Filled} from "@fluentui/react-icons";
import * as docks from "../../../../data/actions/dock";
import {CommonResponse} from "../../../../data/utils";
import PlaceSelector from "../../../maps/PlaceSelector";

const LANG_PATH: string = "components.docks.i.LocationField";
const strings = {
    label: "label"
};
const LocationField = ({ value, onUpdate, editable, id }: ILocationFieldProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ coords, setCoords ] = useState<[number, number]>(value);
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ saving, setSavingState ] = useState<boolean>(false);
    const displayValue: string[] = [formatLat(value[0]),  formatLon(value[1])];

    const eqs: boolean = coords[0] === value[0] && coords[1] === value[1];

    const save = (): void => {
        if(!editable) return;
        setSavingState(true);
        docks.edit(id, { coordinates: coords })
            .then((_response: CommonResponse): void => {
                onUpdate(coords);
                setEditMode(false);
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setSavingState(false);
            });
    };


    return (<>
        <div className={mergeClasses(styles.root, "jBar")}>
            <div className="l">{t(strings.label)}</div>
            <div className="r flex-edtbl-dt">
                { editable && editMode && <Button
                    appearance={"secondary"}
                    onClick={() => {
                        setCoords(value);
                        setEditMode(false);
                    }}
                >
                    {translate("actions.cancel")}
                </Button> }
                { editable && editMode && <Button
                    appearance={"primary"}
                    onClick={() => save()}
                    disabled={eqs || saving}
                    icon={saving ? <Spinner size={"extra-tiny"} /> : null}
                >
                    {saving ? translate("status.saving") : translate("actions.save")}
                </Button> }
                { !editMode && <span>{displayValue[0]}<br/>{displayValue[1]}</span>}
                { !editMode && editable && <Button onClick={() => setEditMode(true)} appearance={"subtle"} size={"small"} icon={<Edit16Filled />} />}
            </div>
        </div>
        { editable && editMode && <PlaceSelector value={coords} onChange={x => setCoords(x)}/>}
        </>);
        };
        export default LocationField;