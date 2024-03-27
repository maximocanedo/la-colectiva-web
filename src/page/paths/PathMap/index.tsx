import React, {useEffect, useReducer, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {IPathMapProps} from "./defs";
import {useStyles} from "./styles";
import {useParams} from "react-router-dom";
import {DockPropertyStatus, IDock, IDockView} from "../../../data/models/dock";
import L, {LeafletEvent} from "leaflet";
import * as docks from "../../../data/actions/dock";
import * as schedules from "../../../data/actions/schedule";
import {IDockMinimal} from "../../../data/actions/dock";
import {MapContainer, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger, Field, Input,
    mergeClasses,
    Spinner,
    ToggleButton
} from "@fluentui/react-components";
import {
    ArrowClockwiseDashesFilled,
    ArrowClockwiseFilled,
    GlobeSurfaceFilled,
    GlobeSurfaceRegular,
    MyLocationRegular
} from "@fluentui/react-icons";
import * as paths from "../../../data/actions/path";
import {IScheduleLight, IScheduleView} from "../../../data/models/schedules";
import PathMapDockMarker from "../../../components/maps/PathMapDockMarker";
import ScheduleLightItem from "../../../components/schedules/l/ScheduleLightItem";
import locationIcon from "../../../assets/icons/location.svg";
import NoSchedulesForThisDockScreen from "../../../components/screens/paths/NoSchedulesForThisDockScreen";

const LANG_PATH: string = "components.path.PathMap";
type Z = (IDockView | IDockMinimal);
function isDarkModeEnabled(): boolean {
    return ('matchMedia' in window && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
const dateToTime = (date: Date): string => {
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
const UPDATE: string = "UPDATE";
const docksReducer = (state: Z[], { type, payload }: { type: string, payload: Z }): Z[] => {
    const exists = (x: Z): boolean => state.some(y => y._id === x._id);
    if(type === ADD && !exists(payload)) return [ ...state, payload ];
    if(type === CLEAR) return [];
    return [ ...state ];
};
const schedulesReducer = (state: IScheduleView[], { type, payload }: { type: string, payload: IScheduleView | null }): IScheduleView[] => {
    const exists = (x: IScheduleView): boolean => state.some(y => y._id === x._id);
    if(type === ADD && !exists(payload as IScheduleView)) return [ ...state, (payload as IScheduleView) ];
    if(type === UPDATE) {
        console.log({payload});
        const s = state.filter(schedule => schedule._id !== (payload as IScheduleView)._id);
        console.log({s});
        const d = [ ...s, (payload as IScheduleView) ];
        console.log({d});
        return d;
    }
    if(type === CLEAR) return [];
    return [ ...state ];
};
const PathMap = ({ me, sendToast }: IPathMapProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const id: string = useParams<{ id: string }>().id as string;
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const defCoords = [-34.380633459326056,-58.56305122375489];
    const [ open, setOpen ] = useState<boolean>(false);
    const [ timesLoaded, setTimesLoaded ] = useState<number>(0);
    const [ loadingSchedules, setSchedulesLoadingState ] = useState<boolean>(false);
    const [ satelliteMode, setSatelliteMode ] = useState<boolean>(false);
    const [ radio, setRadio ] = useState<number>(1800);
    const [ coordinates, setCoordinates ] = useState<[number, number]>([defCoords[0], defCoords[1]]);
    const [ data, dispatchDocks ] = useReducer(docksReducer, []);
    const [ times, dispatchSchedules ] = useReducer(schedulesReducer, []);
    const [ query, ] = useState<string>("");
    const [ page, setPage ] = useState<number>(0);
    const [ size, ] = useState<number>(10);
    const [ value, setValue ] = useState<string>(dateToTime(new Date(Date.now())));
    const [ selectedDock, selectDock ] = useState<IDock | Z | null>(null);
    const [ selectedDockSchedules, setSelectedDockSchedules ] = useState<IScheduleView[]>([]);
    const [ validTime, setValidTime ] = useState<boolean>(false);

    const canAddSchedules: boolean = me !== null && me !== undefined && me.active && me.role >= 2;

    useEffect(() => {
        setValidTime(
            /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
        );
    }, [ value ]);

    const tileURL: string = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    let m: L.Map | null = null;

    const lc = () => {
        if(m === null) return;
        let loc = L.icon({
            iconUrl: locationIcon,
            iconAnchor: [12, 12],
            popupAnchor: [10, -44],
            iconSize: [24, 24],
        });
        const locMarker: L.Marker = new L.Marker({ lat: 0, lng: 0 }, { icon: loc });
        locMarker.addTo(m);
        const xyz = m.locate();
        m.on("locationfound", (e) => {
            if(m === null) return;
            locMarker.setLatLng(e.latlng);
            m.flyTo(e.latlng);
        });
    };

    const searchSchedules = (): void => {
        setSchedulesLoadingState(true);
        paths.getSchedules(id, "", { p: page, itemsPerPage: size })
            .then((response: IScheduleView[]): void => {
                response.map(x => dispatchSchedules({ type: ADD, payload: x}));
                if(response.length === size) setPage(page + 1);
                setTimesLoaded(timesLoaded + 1);
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setSchedulesLoadingState(false);
            });

    }

    useEffect((): void => {
        docks.explore(query, coordinates, -1, radio, { p: 0, itemsPerPage: 7 })
            .then((arr: Z[]): void => {
                arr.map(payload => dispatchDocks({ type: ADD, payload }));
            })
            .catch(err => console.error(err))
            .finally((): void => {});
    }, [ coordinates, radio, query ]);

    useEffect(() => {
        searchSchedules();
    }, []);


    const updateRadio = (map: L.Map): void => {
        const bounds = map.getBounds();
        const w: number = map.distance(bounds.getNorthWest(), bounds.getNorthEast());
        const h: number = map.distance(bounds.getNorthWest(), bounds.getSouthWest());
        const bigger: number = w >= h ? w : h;
        setRadio(bigger + 10);
    };
    const updateCenter = (map: L.Map): void => {
        const center: L.LatLng = map.getCenter();
        setCoordinates([center.lat, center.lng]);
    };

    const markersRef = useRef<Record<string, L.Marker>>({});
    useEffect(() => {
        if(m === null) return;
        if(timesLoaded < 1) return;
        const getSchedulesFor = (dock: string) => times.filter(x => x.dock._id === dock);
        (window as any).getSchedules = getSchedulesFor;
        const onClick = ((dock: Z, schedules: IScheduleView[]) => {
            setSelectedDockSchedules(schedules);
            selectDock(dock);
            setOpen(true);
        });
        data.map((d): void => {
            if(m === null) return;
            if (!markersRef.current[d._id]) {
                const marker: L.Marker = PathMapDockMarker({ onClick, data: d, map: m, schedules: getSchedulesFor });
                markersRef.current[d._id] = marker;
                marker.addTo(m);
            }
        });
    }, [ data, times ]);

    const X = () => {
        m = useMap();
        const map: L.Map = useMapEvents({
            zoomend(_e: LeafletEvent): void {
                if(m !== null) updateRadio(m);
            },
            moveend(_e: LeafletEvent): void {
                updateCenter(map);
                updateRadio(map);
            },
            load(_e: LeafletEvent): void {
                if(m === null) return;
                updateRadio(map);
                updateCenter(map);
            }
        });
        return <></>;
    };


    const uploadTime = (): void => {
        if(!canAddSchedules ) return;
        if(selectedDock === null || id === null || !validTime) return;
        schedules.create({
            dock: selectedDock._id, time: value, path: id
        })
            .then((val: IScheduleLight): void => {
                dispatchSchedules({ type: ADD, payload: val as unknown as IScheduleView });
                setOpen(false);
                sendToast({
                    intent: "success",
                    title: "Saved"
                });
            })
            .catch(err => console.error(err))
            .finally((): void => {});
    }


    return (<div className={mergeClasses(styles.root, "dock-selector")}>

        <Dialog open={open} onOpenChange={(_event: any, data: any) => setOpen(data.open)}>
            { selectedDock === null ? <DialogSurface>
                <DialogTitle></DialogTitle>
                <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                        <Button appearance="secondary">{ translate("actions.close") }</Button>
                    </DialogTrigger>
                </DialogActions>
            </DialogSurface> : <DialogSurface>
                <DialogBody>
                    <DialogTitle>{selectedDock.name?? ""}</DialogTitle>
                    <DialogContent>
                        <div className="schs">
                            { selectedDockSchedules.length === 0 && <NoSchedulesForThisDockScreen />}
                            { selectedDockSchedules.length > 0 && selectedDockSchedules.map(sch => {
                                const logged: boolean = me !== null && me !== undefined && me.active;
                                // @ts-ignore
                                const canEdit: boolean = logged && (me.role === 3 || (me.role === 2 && me._id === sch.user._id));
                                return <><ScheduleLightItem onUpdate={payload => {
                                    dispatchSchedules({type: UPDATE, payload});
                                }} {...sch} editable={canEdit} />
                                </>
                            }) }
                        </div>
                        <br/>
                        { canAddSchedules &&
                            <Field>
                                <Input
                                    type={"time"}
                                    value={value}
                                    onChange={(e: any,d: any): void => {
                                        setValue(d.value);
                                    }} />
                            </Field>
                        }
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">{translate("actions.close")}</Button>
                        </DialogTrigger>
                        { canAddSchedules && <Button appearance="primary" disabled={!validTime}
                                 onClick={(): void => uploadTime()}>{translate("actions.save")}</Button>}
                    </DialogActions>
                </DialogBody>
            </DialogSurface>}
        </Dialog>
        <MapContainer
            className="dock-selector--map"
            zoom={16}
            minZoom={16}
            maxZoom={18}
            zoomControl={false}
            center={{lat: defCoords[0], lng: defCoords[1]}}
            scrollWheelZoom={true}>
            <X/>
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url={tileURL}
            />
        </MapContainer>
        <nav className={"map-side"}>
            <Button
                size={"large"}
                onClick={() => {

                    dispatchSchedules({ type: CLEAR, payload: null });
                    setPage(0);
                    searchSchedules();
                }}
                disabled={loadingSchedules}
                icon={loadingSchedules ? <Spinner size={"small"} /> : <ArrowClockwiseDashesFilled />}
            ></Button>
            { <Button
                size={"large"}
                onClick={() => {
                    searchSchedules();
                }}
                disabled={loadingSchedules}
                icon={loadingSchedules ? <Spinner size={"small"} /> : <ArrowClockwiseFilled />}
            ></Button>}
            <ToggleButton
                size={"large"}
                checked={satelliteMode}
                className={"btn-satellite"}
                onClick={() => setSatelliteMode(!satelliteMode)}
                icon={satelliteMode ? <GlobeSurfaceFilled /> : <GlobeSurfaceRegular />}
            ></ToggleButton>
            <Button
                size={"large"}
                className={"btn-location"}
                onClick={() => lc()}
                icon={<MyLocationRegular/>}
                appearance={"primary"}>
            </Button>
        </nav>
    </div>);
};
export default PathMap;