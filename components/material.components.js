"use strict";
import {
    MDCBanner,
    MDCDialog,
    MDCDrawer, MDCLinearProgress,
    MDCRipple,
    MDCSelect,
    MDCSnackbar,
    MDCTextField, MDCTopAppBar
} from "./material/components.js";



const doc = {};

const mdSelectMenuItemSingleLine = (value, text) => {
    const li = document.createElement("li");
    li.classList.add("mdc-deprecated-list-item");
    li.setAttribute("data-value", value);
    li.setAttribute("role", "option");
    const rippleSpan = document.createElement("span");
    rippleSpan.classList.add("mdc-deprecated-list-item__ripple");
    const span = document.createElement("span");
    span.classList.add("mdc-deprecated-list-item__text");
    span.innerText = text;

    li.append(rippleSpan, span);
    return li;
};

const rippleIt = (element) => MDCRipple.attachTo(element);

const loadSelect = (element) => {
    const e = new MDCSelect(element);
    if (e.root.getAttribute("id") != null) {
        doc[e.root.getAttribute("id")] = e;
    }
    return e;
};

const loadDrawer = (element) => {
    const drawer = new MDCDrawer(element);
    document
        .querySelector(".btn--open-drawer")
        .addEventListener("click", (e) => (drawer.open = true));
    document
        .querySelectorAll(".mdc-drawer .mdc-deprecated-list")
        .forEach((listEl) => {
            listEl.addEventListener("click", (event) => {
                drawer.open = false;
            });
        });
    if (drawer.root.getAttribute("id") != null) {
        doc[drawer.root.getAttribute("id")] = drawer;
    }
    return drawer;
};

const loadDialog = (id = "#defaultDialog") => {
    const dialogElement = document.querySelector(id + ".mdc-dialog");
    const e = new MDCDialog(dialogElement);
    if (e.root.getAttribute("id") != null) {
        doc[e.root.getAttribute("id")] = e;
    }
    return e;
};

const loadSnackbar = () => {
    const snackbarElement = document.querySelector(".mdc-snackbar");
    const e = new MDCSnackbar(snackbarElement);
    if (e.root.getAttribute("id") != null) {
        doc[e.root.getAttribute("id")] = e;
    }
    return e;
};

const showSnackbar = (text) => {
    const snackbar = loadSnackbar();
    snackbar.labelText = text;
    snackbar.open();
};
const showBanner = (text, action = {
    text: "Cerrar", handler: (e) => {
    }
}) => {
    const banner = new MDCBanner(
        document.querySelector(".mdc-banner")
    );
    banner.textEl.innerText = text;
    banner.setPrimaryActionText(action.text);
    const evlstnr = (e) => {
        action.handler(e);
    };
    banner.primaryActionEl.onclick = () => {
    };
    banner.primaryActionEl.onclick = evlstnr;
    banner.open();
};

const showOtherDialog = (id) => {
    const dialog = loadDialog(id);
    dialog.open();
    return dialog;
};
// Confirm dialog only
const showDialog = async (question) => {
    const dialog = loadDialog();
    //console.log(dialog);
    let status = false;
    dialog.root.querySelector("#dialog--question").innerText = question;
    const buttonPromise = new Promise((resolve) => {
        const oA = (e) => {
            status = true;
            resolve(status);
        };
        const oC = (e) => {
            status = false;
            resolve(status);
        };

        dialog.buttons[1].addEventListener("click", oA); // Quita el paréntesis aquí
        dialog.buttons[0].addEventListener("click", oC); // Quita el paréntesis aquí
    });

    dialog.buttons[0].innerText = "Cancelar";
    dialog.buttons[1].innerText = "Aceptar";

    dialog.open();

    return await buttonPromise;
};

const loadElements = () => {
    // Instanciar todos los MDCDrawer
    document
        .querySelectorAll(".mdc-drawer")
        .forEach((element) => loadDrawer(element));

    // Instanciar todos los TextField
    document.querySelectorAll(".mdc-text-field").forEach((element) => {
        var textfield_mdc = new MDCTextField(element);
        if (textfield_mdc.root.getAttribute("id") != null) {
            doc[textfield_mdc.root.getAttribute("id")] = textfield_mdc;
        }
        //console.log(textfield_mdc);
        //textfield_mdc.layout();
        textfield_mdc.foundation.init();
        //textfield_mdc.foundation.autoCompleteFocus();
    });
    document.querySelectorAll(".mdc-select").forEach((element) => {
        var select_mdc = loadSelect(element);
        //console.log({ select_mdc });
    });
    document.querySelectorAll(".mdc-top-app-bar").forEach((element) => {
        var topAppBar = new MDCTopAppBar(element);
    });
    document.querySelectorAll(".mdc-button").forEach((element) => {
        const e = rippleIt(element);
        if (e.root.getAttribute("id") != null) {
            doc[e.root.getAttribute("id")] = e;
        }
    });

    document.querySelectorAll(".mdc-snackbar").forEach((element) => {
        var md = new MDCSnackbar(element);
        window.showSnackbar = (message) => {
            md.labelText = message;
            md.open();
        };
    });
};

const loadLinearProgressBar = (element) => {
    let mdEl = new MDCLinearProgress(element);
    return mdEl;
};

const loadTxt = (element) => {
    return new MDCTextField(element);
};

export {
    doc,
    loadElements,
    rippleIt,
    loadLinearProgressBar,
    loadTxt,
    mdSelectMenuItemSingleLine,
    loadSelect,
    loadDialog,
    showDialog,
    loadSnackbar,
    showSnackbar,
    showOtherDialog,
    showBanner,
};
