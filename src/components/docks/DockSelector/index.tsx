import React, {useEffect, useReducer, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {IDockSelectorProps} from "./defs";
import {useStyles} from "./styles";
import {Circle, MapContainer, Marker, Pane, TileLayer, useMap, useMapEvents} from "react-leaflet";
import L, {LeafletEvent} from "leaflet";
import {Button, mergeClasses, ToggleButton} from "@fluentui/react-components";
import * as docks from "../../../data/actions/dock";
import {DockPropertyStatus, IDockView} from "../../../data/models/dock";
import privateIcon from "../../../assets/icons/docks/private/index@48.png";
import publicIcon from "../../../assets/icons/docks/public/index@48.png";
import commercialIcon from "../../../assets/icons/docks/commercial/index@48.png";
import govIcon from "../../../assets/icons/docks/gov/index@48.png";
import neighIcon from "../../../assets/icons/docks/neigh/index@48.png";
import otherIcon from "../../../assets/icons/docks/other/index@48.png";
import unlistedIcon from "../../../assets/icons/docks/unlisted/index@48.png";
import {IDockMinimal} from "../../../data/actions/dock";
import {AddRegular, GlobeSurfaceFilled, GlobeSurfaceRegular, MyLocationRegular} from "@fluentui/react-icons";
import DockMarker from "../../maps/DockMarker";
import { useNavigate } from "react-router-dom";



const LANG_PATH: string = "components.DockSelector";
const strings = {};
type Z = (IDockView | IDockMinimal);
function isDarkModeEnabled(): boolean {
    return ('matchMedia' in window && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
const docksReducer = (state: Z[], { type, payload }: { type: string, payload: Z }): Z[] => {
    const exists = (x: Z): boolean => state.some(y => y._id === x._id);
    if(type === ADD && !exists(payload)) return [ ...state, payload ];
    if(type === CLEAR) return [];
    return [ ...state ];
}
const ComponentResize = () => {
    const map = useMap();

    setTimeout(() => {
        map.invalidateSize();
    }, 0);

    return null;
};
const DockSelector = ({ onClick, showAddButton, query: q, status: s }: IDockSelectorProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const defCoords = [-34.380633459326056,-58.56305122375489];
    const navigate = useNavigate();
    const [ satelliteMode, setSatelliteMode ] = useState<boolean>(false);
    const [ radio, setRadio ] = useState<number>(1800);
    const [ coordinates, setCoordinates ] = useState<[number, number]>([defCoords[0], defCoords[1]]);
    const [ data, dispatchDocks ] = useReducer(docksReducer, []);
    const [ query, setQuery ] = useState<string>(q?? "");
    const [ status, setStatus ] = useState<DockPropertyStatus | -1>(s?? -1);


    const tileURL: string = satelliteMode
        ? "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
        : (isDarkModeEnabled()
            ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            : "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png");
    let m: L.Map | null = null;

    const lc = () => {
        if(m === null) return;
        const xyz = m.locate();
        m.on("locationfound", (e) => {
            if(m === null) return;
            m.flyTo(e.latlng);
        });
        console.log(xyz);
    };


    useEffect((): void => {
        docks.explore(query, coordinates, -1, radio, { p: 0, itemsPerPage: 7 })
            .then((arr: Z[]): void => {
                arr.map(payload => dispatchDocks({ type: ADD, payload }));
            })
            .catch(err => console.error(err))
            .finally((): void => {});
    }, [ coordinates, radio, query ]);

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
    const markersRef = useRef<Record<string, L.Marker<any>>>({});
     useEffect(() => {
        if(m === null) return;
        data.map((d) => {
            if(m === null) return;
            if (!markersRef.current[d._id]) {
                // Si no existe, creamos un nuevo marcador
                const marker = DockMarker({ onClick, data: d, map: m });
                markersRef.current[d._id] = marker; // Agregamos el marcador al objeto de referencias
                marker.addTo(m);
            }
        });
    }, [ data ]);

    const X = () => {
        m = useMap();
        const map = useMapEvents({
            zoomend(e: LeafletEvent): void {
                if(m !== null) updateRadio(m);
            },
            moveend(e: LeafletEvent): void {
                updateCenter(map);
                updateRadio(map);
            },
            load(e: LeafletEvent): void {
                if(m === null) return;
                updateRadio(map);
                updateCenter(map);
            }
        });
        return <></>;
    };



    return (<div className={mergeClasses(styles.root, "dock-selector")}>
        <MapContainer
            className="dock-selector--map"
            zoom={16}
            minZoom={16}
            maxZoom={18}
            center={{lat: defCoords[0], lng: defCoords[1]}}
            scrollWheelZoom={true}>
            <X/><ComponentResize />
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url={tileURL}
            />
        </MapContainer>
        <nav className={"map-side"}>
            { showAddButton && <Button
                size={"large"}
                onClick={() => {
                    navigate("/docks/add");
                }}
                icon={<AddRegular />}
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
export default DockSelector;