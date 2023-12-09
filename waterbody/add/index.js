"use strict";

import TextField from "../../components/material/TextField.js";
import ButtonView from "../../components/material/ButtonView.js";
import OutlinedSelect from "../../components/material/select/OutlinedSelect.js";
import Snackbar from "../../components/material/Snackbar.js";
import FullscreenDialog from "../../components/material/dialog/FullscreenDialog.js";

const WATERBODY_TYPE = {
    RIVER: 0, // Río
    STREAM: 1, // Arroyo
    BROOK: 2, // Riachuelo
    CANAL: 3, // Canal
    LAKE: 4, // Lago
    POND: 5, // Estanque
    LAGOON: 6, // Laguna
    RESERVOIR: 7, // Embalse
    SWAMP: 8, // Pantano
    WELL: 9, // Pozo
    AQUIFER: 10, // Acuífero
    BAY: 11, // Bahía
    GULF: 12, // Golfo
    SEA: 13, // Mar
    OCEAN: 14, // Océano
};
const types__items = [
    { value: 0, text: "Río" },
    { value: 1, text: "Arroyo" },
    { value: 2, text: "Riachuelo" },
    { value: 3, text: "Canal" },
    { value: 4, text: "Lago" },
    { value: 5, text: "Estanque" },
    { value: 6, text: "Laguna" },
    { value: 7, text: "Embalse" },
    { value: 8, text: "Pantano" },
    { value: 9, text: "Pozo" },
    { value: 10, text: "Acuífero" },
    { value: 11, text: "Bahía" },
    { value: 12, text: "Golfo" },
    { value: 13, text: "Mar" },
    { value: 14, text: "Océano" },
];
(async () => {
    Snackbar.init();
    const txtName = new TextField({icon: null, variant: "outlined", type: "text", label: "Nombre"});
    const txtType = new OutlinedSelect("Tipo", types__items);
    const btnEnviar = new ButtonView("Enviar", {raised: true});
    const gridElement = (...arr) => {
        const el = document.createElement("div");
        el.classList.add("grid-item");
        el.append(...arr);
        return el;
    }
    document.querySelector("#root").append(
        gridElement(txtName.getElement()),
        gridElement(txtType.render()),
        gridElement(btnEnviar.getElement())
    );
    console.log(txtType.material);
    btnEnviar.onClick(async (e) => {
        const result = await fetch("http://colectiva.com.ar:5050/waterBodies/", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: txtName.getValue(),
                type: parseInt(txtType.material.value)
            })
        });
        if(result.ok) {
            showSnackbar("El registro se guardó correctamente. ");
        } else {
            showSnackbar("Hubo un problema y no se pudo guardar el registro. ");
        }
    });
})();
