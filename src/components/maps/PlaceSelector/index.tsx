import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {formatLat, formatLon, IPlaceSelectorProps} from "./defs";
import {useStyles} from "./styles";
import {Button, Field, Input, ToggleButton} from "@fluentui/react-components";

import 'leaflet/dist/leaflet.css'
import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from 'react-leaflet'
import L, {LeafletEvent} from 'leaflet'
import {
    EditFilled,
    GlobeFilled,
    GlobeRegular,
    MapFilled,
    MyLocationRegular,
    NumberSymbolSquareFilled,
    NumberSymbolSquareRegular
} from "@fluentui/react-icons";


//delete L.Icon.Default.prototype?._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const LANG_PATH: string = "components.PlaceSelector";
const strings = {
    label: {
        selectInMap: "label.selectInMap",
        type: "label.type",
        decimal: "label.decimal"
    }
};

function isDarkModeEnabled(): boolean {
    return ('matchMedia' in window && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
const PlaceSelector = ({ value, onChange }: IPlaceSelectorProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ showMap, setMapShowing ] = useState<boolean>(true);
    const [ satelliteMode, setSatelliteMode ] = useState<boolean>(true);

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
    }

    const X = () => {
        m = useMap();
        const map = useMapEvents({
            move(e: LeafletEvent) {
                const i = map.getCenter();
                onChange([ i.lat, i.lng ]);
            }
        });
        return <></>;
    };

    return (<div className={styles.root + " place-selector"}>
        <nav>
            {showMap && <Button
                appearance={"secondary"}
                onClick={() => lc()}
                icon={<MyLocationRegular />}
            ></Button>}
            <ToggleButton
                appearance={"subtle"}
                checked={false}
                onClick={() => setMapShowing(!showMap)}
                icon={showMap ? <EditFilled /> : <MapFilled />}>
                {!showMap ? t(strings.label.selectInMap) : t(strings.label.type)}
            </ToggleButton>
            { showMap && <ToggleButton
                appearance={"secondary"}
                checked={satelliteMode}
                onClick={() => setSatelliteMode(!satelliteMode)}
                icon={satelliteMode ? <GlobeFilled /> : <GlobeRegular />}>
            </ToggleButton>}
        </nav>
        { !showMap && <div className="coordInputs">
            <>
                <Field label={"Latitud"}
                       validationMessage={formatLat(value[0])}
                       validationState={(value[0] + "") === "" ? "none" : "success"}
                >
                    <Input
                        type={"number"}
                        placeholder={t(strings.label.decimal)}
                        value={value[0] + ""}
                        onChange={e => onChange([parseFloat(e.target.value === "" ? "0" : e.target.value), value[1]])}/>
                </Field>
                <br/>
                <Field label={"Longitud"}
                       validationMessage={formatLon(value[1])}
                       validationState={(value[1] + "") === "" ? "none" : "success"}>
                    <Input
                        type={"number"}
                        placeholder={t(strings.label.decimal)}
                        value={value[1] + ""}
                        onChange={e => onChange([value[0], parseFloat(e.target.value === "" ? "0" : e.target.value)])}/>
                </Field>
            </>
        </div> }
        { showMap && <MapContainer
            className="place-selector--map"
            center={value}
            zoom={18}
            minZoom={12}
            maxZoom={20}
            scrollWheelZoom={true}>
            <X />
            <TileLayer
                attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
                url={tileURL}
            />
            <Marker position={{lat: value[0], lng: value[1]}} ></Marker>
        </MapContainer> }
    </div>);
};
export default PlaceSelector;