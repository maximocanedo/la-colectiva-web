import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {D, ILightDockSelectorProps} from "./defs";
import {useStyles} from "./styles";
import {Combobox, mergeClasses, Option, OptionOnSelectData, Persona, SelectionEvents} from "@fluentui/react-components";
import * as docks from "../../../data/actions/dock";
import {DockPropertyStatus} from "../../../data/models/dock";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";

const LANG_PATH: string = "components.LightDockSelector";
const strings = {};
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
const reducer = (state: D[], { type, payload }: { type: string, payload: (D | null) }): D[] => {
    if(type === CLEAR) return [];
    if(payload === null) return [ ...state ];
    const exists = (x: D): boolean => state.some(y => y._id === x._id);
    if(type === ADD && !exists(payload)) return [ ...state, payload ];
    return [ ...state ];
}
const LightDockSelector = ({ value, onChange, langPath }: ILightDockSelectorProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate((langPath?? LANG_PATH) + "." + key);
    const styles = useStyles();
    const [ data, dispatchData ] = useReducer(reducer, []);
    const [location, setLocation] = useState<[ number, number ] | null>(null);
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(4);
    const [ searching, setSearchingState ] = useState<boolean>(false);
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position: GeolocationPosition): void => {
                        setLocation([position.coords.latitude, position.coords.longitude]);
                    },
                    (): void => {
                        setLocation(null);
                    }
                );
            } else {
                setLocation(null);
            }
        };

        getLocation();
        return (): void => {};
    }, []);
    const getDock = (id: string): D | null => data.find((v: D) => v._id === id)?? null;
    const search = (): void => {
        const locationFallBack: [ number, number ] = [-34.383983445788935, -58.567954173007095];
        setSearchingState(true);
        docks.explore("", location?? locationFallBack, -1, 3000, { p: page, itemsPerPage: size }, true)
            .then((val: D[]): void => {
                val.map(payload => dispatchData({ type: ADD, payload }));
                if(val.length === size) setPage(page + 1);
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setSearchingState(false);
            });
    };

    useEffect(() => {
        search();
    }, []);

    const es = (x: number): string => translate("dockStatusL." + [
        "private",
        "public",
        "business",
        "government",
        "neighbourhood",
        "other",
        "unlisted"
    ][x]);

    const onSelectChange = (event: SelectionEvents, data: OptionOnSelectData): void => {
        const id: string = data.optionValue?? "";
        const name: string = data.optionText?? "";
        const f:D | null = getDock(id);
        onChange(f?? { _id: id, name, status: DockPropertyStatus.UNLISTED });
    }

    return (<Combobox
        onOptionSelect={onSelectChange}
        selectedOptions={[...(value === null ? [] : [ value._id ])]}
        value={value === null ? "" : value.name}
        className={mergeClasses(styles.root, "lightDockSelector")}>
        {
            data.map((data: D) => {
            return <Option
                key={data._id + "$Option"}
                text={data.name}
                value={data._id}>
                <Persona
                    key={data._id + "$Persona"}
                    avatar={{ color: "colorful" }}
                    name={data.name}
                    secondaryText={es(data.status?? DockPropertyStatus.UNLISTED)}
                />
            </Option>
        })}
        <LoadMoreButton loading={searching} onClick={(): void => search()} />
    </Combobox>);
};
export default LightDockSelector;