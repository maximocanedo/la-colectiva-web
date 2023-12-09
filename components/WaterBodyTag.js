"use strict";
import Chip from "./Chip.js";

export default class WaterBodyTag {
    constructor(data) {
        this.getData = () => data;
    }
    static rootPath = "/waterbody/details";
    static getNames() {
        return [
            "Río", "Arroyo", "Riachuelo", "Canal", "Lago", "Estanque", "Laguna", "Embalse", "Pantano",
            "Pozo", "Acuífero", "Bahía", "Golfo", "Mar", "Océano"
        ];
    }
    render() {
        const data = this.getData();
        const tag = new Chip({
            label: `${WaterBodyTag.getNames()[data.type]} ${data.name}`,
            icon: "place",
            ripple: true
        });
        const yoink = tag.render();
        yoink.addEventListener("click", e => {
            window.location = `${WaterBodyTag.rootPath}?id=${data._id}`;
        });
        return yoink;
    }
}