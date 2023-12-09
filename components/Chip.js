'use strict';

import {MDCChip, MDCRipple} from "./material/components.js";

export default class Chip {
    constructor(options) {
        this.getIcon = () => options.icon?? "";
        this.hasIcon = () => options.icon !== null;
        this.getLabel = () => options.label?? "";
        this.hasRipple = () => options.ripple?? false;
    }
    createChip() {
        const element = document.createElement("span");
        element.classList.add("mdc-chip");
        element.setAttribute("role", "row");
        return element;
    }
    createLeadingCell() {
        const element = document.createElement("div");
        element.classList.add("mdc-chip__cell", "mdc-chip__cell--leading");
        element.setAttribute("role", "gridcell");
        return element;
    }
    createLeadingIcon() {
        const element = document.createElement("span");
        element.classList.add("mdc-chip__icon", "mdc-chip__icon--leading", "material-icons");
        element.innerText = this.getIcon();
        return element;
    }
    createPrimaryCell() {
        const element = document.createElement("div");
        element.classList.add("mdc-chip__cell", "mdc-chip__cell--primary");
        element.setAttribute("role", "gridcell");
        element.innerText = this.getLabel();
        return element;
    }
    createRipple() {
        const element = document.createElement("span");
        element.classList.add("mdc-cip__ripple", "mdc-chip__ripple--primary");
        return element;
    }
    render() {
        const chip = this.createChip();
        this.addEventListener = (event, handler, options) => chip.addEventListener(event, handler, options);
        if(this.hasRipple()) {
            const ripple = this.createRipple();
            chip.append(ripple);
        }
        if(this.hasIcon()) {
            const leadingCell = this.createLeadingCell();
            const icon = this.createLeadingIcon();
            leadingCell.append(icon);
            chip.append(leadingCell);
        }
        const primaryCell = this.createPrimaryCell();
        chip.append(primaryCell);
        this.material = new MDCChip(chip);
        if(this.hasRipple()) {
            this.ripple = new MDCRipple(chip);
        }
        return chip;
    }
}