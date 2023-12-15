'use strict';

import TextField from "../../components/material/TextField.js";
import ButtonView from "../../components/material/ButtonView.js";
import Snackbar from "../../components/material/Snackbar.js";


(async () => {
    Snackbar.init();

    const main = document.querySelector("main");

    const txtUsername = new TextField({
        variant: "outlined",
        type: "text",
        label: "Nombre de usuario",
        icon: "alternate_email"
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
    })(txtUsername_el.querySelector("input"));
    const txtPassword_el = txtPassword.getElement();
    (x => {
        x.setAttribute("maxlength", 40);
        x.required = true;
    })(txtPassword_el.querySelector("input"));

    const btnOK_el = btnOK.getElement();

    btnOK_el.addEventListener("click", async (e) => {
        if(document.login.checkValidity()) {
            const payload = {
                username: txtUsername.getValue(),
                password: txtPassword.getValue()
            };
            await (async () => {
                const req = await fetch(
                    "https://colectiva.com.ar:5050/users/login", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify(payload)
                    }
                );
                if(req.ok) {
                    showSnackbar("¡Bienvenido!");
                } else {
                    showSnackbar("Revisá los datos ingresados e intentá de nuevo. ");
                    const data = await req.json();
                    console.log(data);
                }
            })();
        } else {
            showSnackbar("Revisá los datos ingresados e intentá de nuevo. ");
        }
    });


    document.login.append(
        txtUsername_el,
        txtPassword_el,
        btnOK_el
    );
})();