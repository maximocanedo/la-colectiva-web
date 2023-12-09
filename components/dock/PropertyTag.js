"use strict";
import Chip from "../Chip.js";

const PUBLIC_TAG = new Chip({
    label: "Público",
    icon: "public"
});
const PRIVATE_TAG = new Chip({
    label: "Privado",
    icon: "home"
});
const BUSINESS_TAG = new Chip({
    label: "Negocio",
    icon: "deck"
});
const TERMINAL_TAG = new Chip({
    label: "Terminal",
    icon: "signpost"
});
const getTag = index => {
    return [
        PRIVATE_TAG,
        PUBLIC_TAG,
        BUSINESS_TAG,
        TERMINAL_TAG
    ][index];
};
export { PUBLIC_TAG, PRIVATE_TAG, BUSINESS_TAG, TERMINAL_TAG, getTag };