'use strict';

import TextField from "../../components/material/TextField.js";
import ButtonView from "../../components/material/ButtonView.js";
import Snackbar from "../../components/material/Snackbar.js";


async function verifyUsername(txtUsername) {
    const username = txtUsername.getValue();
    const source = await fetch('https://colectiva.com.ar:5050/users/' + username, {
        method: "HEAD",
        credentials: "include"
    });
    const code = source.status;
    let res = false;
    switch(code) {
        case 404:
            txtUsername.material.valid = true;
            res = true;
            break;
        case 200:
            txtUsername.material.valid = false;
            res = false;
            showSnackbar("Ese nombre de usuario ya existe. Probá con otro. ");
            break;
        default:
            showSnackbar("Hubo un error al intentar validar el usuario. Intentá de nuevo más tarde. ");
            break;
    }
    if(!res) {
        document.signup.reportValidity();
    }
    return res;
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
    const btnOK = new ButtonView("Crear cuenta", {
        raised: true
    });

    const txtUsername_el = txtUsername.getElement();
    (x => {
        x.required = true;
        x.setAttribute("pattern", "^[a-zA-Z0-9_]{3,16}$");
        x.addEventListener("change", async () => {
            await verifyUsername(txtUsername);
        });
    })(txtUsername_el.querySelector("input"));
    const txtName_el = txtName.getElement();
    (x => {
        x.setAttribute("maxlength", 24);
        x.setAttribute("minlength", 3);
        x.required = true;
    })(txtName_el.querySelector("input"));
    const txtBio_el = txtBio.getElement();
    const txtBirth_el = txtBirth.getElement();
    (x => {
        x.required = true;
    })(txtBirth_el.querySelector("input"));
    const txtPassword_el = txtPassword.getElement();
    (x => {
        x.setAttribute("minlength", 8);
        x.setAttribute("maxlength", 40);
        x.required = true;
    })(txtPassword_el.querySelector("input"));

    const btnOK_el = btnOK.getElement();

    btnOK_el.addEventListener("click", async (e) => {
        const usernameOK = await verifyUsername(txtUsername);
        if(document.signup.checkValidity() && usernameOK) {
            const payload = {
                username: txtUsername.getValue(),
                name: txtName.getValue(),
                bio: txtBio.getValue(),
                birth: (() => {
                    const d = txtBirth.getValue();
                    const dt = new Date(d);
                    return dt.toISOString();
                })(),
                password: txtPassword.getValue()
            };
            await (async () => {
                const req = await fetch(
                    "https://colectiva.com.ar:5050/users", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify(payload)
                    }
                );
                if(req.ok) {
                    showSnackbar("¡Bienvenido! Ya creaste tu cuenta. ");
                } else {
                    showSnackbar("Hubo un error al intentar crear tu cuenta. ");
                    const data = await req.json();
                    console.log(data);
                }
            })();
        } else {
            showSnackbar("Revise los datos ingresados e intente de nuevo. ");
        }
    });


    document.signup.append(
        txtUsername_el,
        txtName_el,
        txtBio_el,
        txtBirth_el,
        txtPassword_el,
        btnOK_el
    );
})();