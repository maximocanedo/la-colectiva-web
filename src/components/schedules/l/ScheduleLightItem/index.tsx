import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IScheduleLightItemProps} from "./defs";
import {useStyles} from "./styles";
import {Body1Stronger, Button, Card, Field, Input, Link, mergeClasses, Spinner} from "@fluentui/react-components";
import {DeleteFilled, DismissFilled, EditFilled, SaveFilled} from "@fluentui/react-icons";
import * as schedules from "../../../../data/actions/schedule";
import {CommonResponse} from "../../../../data/utils";
const LANG_PATH: string = "components.schedules.ScheduleLightItem";
const strings = {};

const timeToDate = (time: string): Date => {
    const [hours, minutes]: number[] = time.split(':').map(Number);
    const currentDate: Date = new Date();
    currentDate.setHours(hours, minutes, 0, 0);
    return currentDate;
};
const dateToTime = (date: Date): string => {
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
const ScheduleLightItem = ({ _id, time, dock, path, user, uploadDate, editable, active, onUpdate }: IScheduleLightItemProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ formalValue, setFormalValue ] = useState<string>(time);
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ showingRemoveConfirmation, setRemoveConfirmationVisibility ] = useState<boolean>(false);
    const [ editing, setEditingState ] = useState<boolean>(false);
    const [ value, setValue ] = useState<string>(formalValue);
    const [ validTime, setValidTime ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<boolean>(true);
    useEffect(() => {
        setValidTime(
            /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
        );
    }, [ value ]);
    const editSchedule = (): void => {
        if(!validTime) return;
        setEditingState(true);
        schedules.edit(_id, { time: value })
            .then((response: CommonResponse): void => {
                setEditMode(false);
                setFormalValue(value);
                onUpdate({ _id, time: value, active, dock, path, user, uploadDate });
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setEditingState(false);
            })
    }

    const del = (): void => {
        schedules.del(_id)
            .then((_a: any): void => {
                setStatus(false);
            })
            .catch(err => console.error(err))
            .finally((): void => {

            });
    }

    if(!status) return <></>;

    return (<Card appearance={"outline"} className={mergeClasses(styles.root, "flex-box", "sch-light-item")}>
        {!editMode && <div className="row">
            {editable && <div className="cell">
                <Button
                    appearance={"subtle"}
                    icon={<DeleteFilled/>}
                    onClick={(): void => setRemoveConfirmationVisibility(true)}
                ></Button>
            </div> }
            <div className="cell full-width">
                <Body1Stronger>{formalValue}</Body1Stronger>
            </div>
            {editable && <div className="cell">
                <Button
                    appearance={"subtle"}
                    icon={<EditFilled/>}
                    onClick={(): void => setEditMode(true)}
                ></Button>
            </div>}
        </div>}
        {editable && editMode && <div className="row">
            <div className="cell full-width">
                <Field>
                    <Input
                        disabled={editing}
                        type={"time"}
                        value={value}
                        onChange={(e: any,d: any): void => {
                            setValue(d.value);
                        }} />
                </Field>
            </div>
            <div className="cell">
                <Button
                    appearance={"subtle"}
                    icon={editing ? <Spinner size={"extra-tiny"} /> : <SaveFilled />}
                    disabled={!validTime || editing}
                    onClick={(): void => editSchedule()}
                ></Button>
            </div>
            <div className="cell">
                <Button
                    appearance={"subtle"}
                    icon={<DismissFilled />}
                    onClick={(): void => setEditMode(false)}
                ></Button>
            </div>
        </div>}
        {showingRemoveConfirmation &&
            <div className="row">
                <div className="cell full-width">{t('conf.del')}</div>
                <div className="cell full-width"></div>
                <div className="cell full-width"><Link onClick={(): void => del()}>{translate('actions.delete')}</Link></div>
                <div className="cell full-width"><Link onClick={(): void => setRemoveConfirmationVisibility(false)}>{translate('actions.cancel')}</Link></div>
            </div>}
    </Card>);
};
export default ScheduleLightItem;