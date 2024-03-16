import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IAvailabilityHandlerProps, nct, tcn, tct} from "./defs";
import {useStyles} from "./styles";
import {availabilities} from "../../../data/actions/path";
import {AvailabilityCondition, IAvailability} from "../../../data/models/path";
import {Button, Checkbox, Combobox, Field, mergeClasses, Option} from "@fluentui/react-components";
import AvailabilityItem from "../AvailabilityItem";

const LANG_PATH: string = "components.AvailabilityHandler";
const strings = {};
const AvailabilityHandler = ({ id, editable, me }: IAvailabilityHandlerProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    /**
     * Al no haber ningún tipo de paginación, y considerando que la cantidad de disponibilidades por recorrido no es ilimitada, manejo los datos de esta forma, sin usar un reducer.
     */
    const [ data, setData ] = useState<IAvailability[]>([]);
    const [ addMode, setAddMode ] = useState<boolean>(false);
    const [ conditionSelected, setConditionSelected ] = useState<AvailabilityCondition>(AvailabilityCondition.MONDAY);
    const [ conditionRuns, setConditionRuns ] = useState<boolean>(true);
    const fill = (raw: IAvailability[]): void => {
        setData([]);
        setData(raw);
    };

    useEffect(() => {
        availabilities.list(id)
            .then((response: IAvailability[]): void => {
                fill(response);
            })
            .catch(err => {
                console.error(err);
            })
            .finally((): void => {});
    }, [ id ]);

    const conditions: AvailabilityCondition[] = [
        AvailabilityCondition.MONDAY,
        AvailabilityCondition.TUESDAY,
        AvailabilityCondition.WEDNESDAY,
        AvailabilityCondition.THURSDAY,
        AvailabilityCondition.FRIDAY,
        AvailabilityCondition.SATURDAY,
        AvailabilityCondition.SUNDAY,
        AvailabilityCondition.HOLIDAY
    ];
    const x: AvailabilityCondition[] = data.map(y => y.condition);
    const noMentioned: AvailabilityCondition[] = conditions.filter(y => x.indexOf(y) === -1);




    const add = (): void => {
        availabilities.add({
            path: id,
            available: conditionRuns,
            condition: conditionSelected
        }, me).then((av) => {
            setData([ av, ...data ]);
            setAddMode(false);
        }).catch(err => console.error(err));
    }


    useEffect(() => {
        if(noMentioned.length === 0) return;
        setConditionSelected(noMentioned[0]);
    }, [ data ]);

    return (<div className={mergeClasses(styles.root, "av_handler")}>
        {addMode && noMentioned.length > 0 && <div className="add">
            <Field label={"Condición dada: "}>
                <Combobox
                    defaultValue={translate(tcn(noMentioned[0]))}
                    defaultSelectedOptions={[tct(noMentioned[0])]}
                    onOptionSelect={(e, d) => {
                        console.log(nct(d.optionValue as string), 32);
                        setConditionSelected(nct(d.optionValue as string));
                    }}>
                    {noMentioned.map(con => {
                        return <Option text={translate(tcn(con))} value={tct(con)}>{translate(tcn(con))}</Option>
                    })}
                </Combobox>
            </Field>
            <Checkbox label={"Recorrido se realiza dada la condición "} onChange={(e,d) => {setConditionRuns(d.checked as boolean)}} checked={conditionRuns}/>
            <div className="jBar">
                <div className="l">
                </div>
                <div className="r flex-edtbl-dt">

                    <Button
                        onClick={() => setAddMode(false)}
                        appearance={"secondary"}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => add()}
                        appearance={"primary"}>
                        Agregar
                    </Button>

                </div>
            </div>
        </div>}
        {!addMode && noMentioned.length >0 && <Button
            onClick={() => setAddMode(true)}
            appearance={"primary"}>
            Agregar
        </Button> }
        {data.map(x => <AvailabilityItem {...x} editable={editable} me={me}/>)}
    </div>);
};
export default AvailabilityHandler;