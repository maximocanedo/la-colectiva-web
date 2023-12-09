'use strict';
export default class DropdownIcon {
    constructor() {

    }
    createInactivePolygon() {
        const polygon1 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon1.setAttribute("class", "mdc-select__dropdown-icon-inactive");
        polygon1.setAttribute("stroke", "none");
        polygon1.setAttribute("fill-rule", "evenodd");
        polygon1.setAttribute("points", "7 10 12 15 17 10");
        return polygon1;
    }
    createActivePolygon() {
        const polygon2 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon2.setAttribute("class", "mdc-select__dropdown-icon-active");
        polygon2.setAttribute("stroke", "none");
        polygon2.setAttribute("fill-rule", "evenodd");
        polygon2.setAttribute("points", "7 15 12 10 17 15");
        return polygon2;
    }
    render() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "mdc-select__dropdown-icon-graphic");
        svg.setAttribute("viewBox", "7 10 10 5");
        svg.setAttribute("focusable", "false");
        const polygon1 = this.createInactivePolygon();
        const polygon2 = this.createActivePolygon();
        svg.appendChild(polygon1);
        svg.appendChild(polygon2);
        return svg;
    }
}