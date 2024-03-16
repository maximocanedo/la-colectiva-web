import {IDockMarkerProps} from "./defs";
import privateIcon from "../../../assets/icons/docks/private/index@48.png";
import publicIcon from "../../../assets/icons/docks/public/index@48.png";
import commercialIcon from "../../../assets/icons/docks/commercial/index@48.png";
import govIcon from "../../../assets/icons/docks/gov/index@48.png";
import neighIcon from "../../../assets/icons/docks/neigh/index@48.png";
import otherIcon from "../../../assets/icons/docks/other/index@48.png";
import unlistedIcon from "../../../assets/icons/docks/unlisted/index@48.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const isTouchDevice: boolean = 'ontouchstart' in window;
const DockMarker = ({ onClick, data: d, map: m }: IDockMarkerProps): L.Marker<any> => {
    const icon = [ privateIcon, publicIcon, commercialIcon, govIcon, neighIcon, otherIcon, unlistedIcon ][d.status];
    let loveIcon = L.icon({
        iconUrl: icon,
        iconAnchor: [12, 12],
        popupAnchor: [10, -44],
        iconSize: [24, 24],
    });
    const dock: L.Marker<any> = L.marker(d.coordinates, { icon: loveIcon }).addTo(m as L.Map);
    dock.on("click", () => {
        onClick(d);
    });
    const tooltip = new L.Tooltip({ permanent: isTouchDevice, direction: "auto", offset: [15, 0] });
    tooltip.setContent(d.name);
    dock.bindTooltip(tooltip);
    return dock;

};
export default DockMarker;