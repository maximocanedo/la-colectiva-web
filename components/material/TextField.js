import {MDCTextField} from "./components.js";

class TextField {
    static getRandomId(prefix = "") {
        let str = prefix + "__"
        str += (Math.random() + 1).toString(36).substring(2);
        let ln = (document.querySelectorAll(`#${str}`).length);
        str += ln === 0 ? "" : ln;
        return str.replaceAll(".", "_");
    }
    constructor({variant, type, label}, value = "") {
        this.options = {variant, type, label};
        const id = TextField.getRandomId("MDCTextField");
        this.getId = () => id;
        this.element = this._createTextField();
        this.getInitialValue = () => value;

    }

    _createTextField() {
        const textFieldContainer = document.createElement('label');
        textFieldContainer.classList.add('mdc-text-field');
        textFieldContainer.id = this.getId();
        this.getTxtContainer = () => textFieldContainer;
        let inputType = 'text';
        if (this.options && this.options.type) {
            inputType = this.options.type;
        }
        let arr = [];
        if (this.options && this.options.variant === 'filled') {
            textFieldContainer.classList.add('mdc-text-field--filled');
            arr = (this._createFilledTextField(inputType));
        } else if (this.options && this.options.variant === 'outlined') {
            textFieldContainer.classList.add('mdc-text-field--outlined');
            arr = (this._createOutlinedTextField(inputType));
        }
        textFieldContainer.append(...arr);
        this.material = new MDCTextField(textFieldContainer);
       // this.material.foundation.shouldAlwaysFloat = true;
        this.material.foundation.init();
        return textFieldContainer;
    }
    setValue(v) {
        this.material.setcharacterCounter = e => null;
        this.material.foundation.setValue(v);
    }

    _createFilledTextField(inputType) {
        const rippleSpan = document.createElement('span');
        rippleSpan.classList.add('mdc-text-field__ripple');

        const floatingLabelSpan = document.createElement('span');
        floatingLabelSpan.classList.add('mdc-floating-label');
        floatingLabelSpan.id = this.getId() + "__label";
        floatingLabelSpan.textContent = (this.options != null ? this.options.label?? "" : ""); // Set your label text here

        const inputField = document.createElement('input');
        inputField.classList.add('mdc-text-field__input');
        inputField.type = inputType;
        inputField.id = this.getId() + "__input";
        inputField.setAttribute('aria-labelledby', this.getId() + "__label");
        this.getValue = () => inputField.value;

        const lineRippleSpan = document.createElement('span');
        lineRippleSpan.classList.add('mdc-line-ripple');

        return [rippleSpan, floatingLabelSpan, inputField, lineRippleSpan];
    }

    _createOutlinedTextField(inputType) {
        const notchedOutline = document.createElement("span");
        notchedOutline.classList.add("mdc-notched-outline");
        const notchedOutline__leading = document.createElement("span");
        notchedOutline__leading.classList.add("mdc-notched-outline__leading");
        const notchedOutline__notch = document.createElement("span");
        notchedOutline__notch.classList.add("mdc-notched-outline__notch");
        const floatingLabelSpan = document.createElement('span');
        floatingLabelSpan.classList.add('mdc-floating-label');
        floatingLabelSpan.id = this.getId() + "__label";
        floatingLabelSpan.textContent = (this.options != null ? this.options.label?? "" : ""); // Set your label text here
        notchedOutline__notch.appendChild(floatingLabelSpan);
        const notchedOutline__trailing = document.createElement("span");
        notchedOutline__trailing.classList.add("mdc-notched-outline__trailing");

        const inputField = document.createElement('input');
        inputField.classList.add('mdc-text-field__input');
        inputField.type = inputType;
        inputField.id = this.getId() + "__input";
        inputField.required = (this.options?? {}).required?? false;
        inputField.setAttribute('aria-labelledby', this.getId() + "__label");
        this.getValue = () => inputField.value;

        notchedOutline.append(notchedOutline__leading, notchedOutline__notch, notchedOutline__trailing);

        return [notchedOutline, inputField];
    }

    getElement() {
        return this.element;
    }
    addEventListener(type, listener, options) {
        this.element.addEventListener(type, listener, options);
    }
}

export default TextField;

// Now you can append textFieldElement to your desired location in the DOM
