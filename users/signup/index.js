'use strict';

import TextField from "../../components/material/TextField.js";
import ButtonView from "../../components/material/ButtonView.js";
import Snackbar from "../../components/material/Snackbar.js";


async function verifyUsername(txtUsername, e) {
    const username = txtUsername.getValue();
    const source = await fetch('https://colectiva.com.ar:5050/users/' + username, {
        method: "HEAD",
        credentials: "include"
    });
    const code = source.status;
    switch(code) {
        case 404:
            txtUsername.material.valid = true;
            break;
        case 200:
            txtUsername.material.valid = false;
            showSnackbar("Ese nombre de usuario ya existe. Probá con otro. ");
            break;
        default:
            showSnackbar("Hubo un error al intentar validar el usuario. Intentá de nuevo más tarde. ");
            break;
    }
}

(async () => {
    Snackbar.init();
    const main = document.querySelector("main");
    const txtUsername = new TextField({
        variant: "outlined",
        type: "text",
        label: "Nombre de usuario",
        icon: "alternate_email"
    });
    const txtName = new TextField({
        variant: "outlined",
        type: "text",
        label: "Nombre",
        icon: "person"
    });
    const txtBio = new TextField({
        variant: "outlined",
        type: "text",
        label: "Biografía",
        icon: "history_edu"
    });
    const txtBirth = new TextField({
        variant: "outlined",
        type: "date",
        label: "Fecha de nacimiento",
        icon: "cake"
    });
    const txtPassword = new TextField({
        variant: "outlined",
        type: "password",
        label: "Contraseña",
        icon: "password"
    });
    const txtVerifyPassword = new TextField({
        variant: "outlined",
        type: "password",
        label: "Repetir contraseña",
        icon: "password"
    });
    const btnOK = new ButtonView("Crear cuenta", {
        raised: true
    });
    const txtUsername_el = txtUsername.getElement();
    const txtName_el = txtName.getElement();
    const txtBio_el = txtBio.getElement();
    const txtBirth_el = txtBirth.getElement();
    const txtPassword_el = txtPassword.getElement();
    const txtVerifyPassword_el = txtVerifyPassword.getElement();
    const btnOK_el = btnOK.getElement();

    txtUsername_el.addEventListener("change", async (e) => {
        await verifyUsername(txtUsername, e);
    });


    document.signup.append(
        txtUsername_el,
        txtName_el,
        txtBio_el,
        txtBirth_el,
        txtPassword_el,
        txtVerifyPassword_el,
        btnOK_el
    );
})();