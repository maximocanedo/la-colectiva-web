import React from "react";
import {ISignUpRequest} from "../../data/models/user";
import {TabValue, ToastIntent} from "@fluentui/react-components";
import {TFunction} from "i18next";
import {ICommonPageProps, ToastSenderFunction} from "../../components/page/definitions";

export type StateManager<T> = [ T, React.Dispatch<React.SetStateAction<T>> ];
export type SignUpTabValues = "personal" | "account" | "more";
export type SignUpTabValue = TabValue | SignUpTabValues;
export type TabSwitchFunction = React.Dispatch<React.SetStateAction<SignUpTabValue>>;
export interface ITranslatableMethod {
    t: TFunction<"translation", undefined>;
}
export interface SignUpPageProps extends ICommonPageProps {
}
export interface TabPersonalStates {
    name: string;
    username: string;
    birth: Date;
}
export interface TabPersonalFunctions extends ITranslatableMethod {
    setName: React.Dispatch<React.SetStateAction<string>>;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setBirth: React.Dispatch<React.SetStateAction<Date>>;
    setBirthValidity: React.Dispatch<React.SetStateAction<boolean>>;
    setNameValidity: React.Dispatch<React.SetStateAction<boolean>>;
    setUsernameValidity: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedValue: TabSwitchFunction;
}
export interface TabAccountStates {
    email: string;
    password: string;
    repeatPassword: string;
}
export interface TabAccountFunctions extends ITranslatableMethod {
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setMailValidity: React.Dispatch<React.SetStateAction<boolean>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    setPasswordValidity: React.Dispatch<React.SetStateAction<boolean>>;
    setRepeatPassword: React.Dispatch<React.SetStateAction<string>>;
    setPasswordsEquality: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedValue: TabSwitchFunction;
}
export interface TabMoreStates {
    bio: string;
    allValid: boolean;
    loading: boolean;
    data: ISignUpRequest;
}
export interface TabMoreFunctions extends ITranslatableMethod {
    setBio: React.Dispatch<React.SetStateAction<string>>;
    setBioValidity: React.Dispatch<React.SetStateAction<boolean>>;
    onSignUpButtonClick(data: ISignUpRequest, functions: OnSignUpButtonClickFunctions): void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    notify(message: string, type: ToastIntent, description?: string): void;
}
export interface OnSignUpButtonClickFunctions extends ITranslatableMethod {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    notify(message: string, type: ToastIntent, description?: string): void;
}