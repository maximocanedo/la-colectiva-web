import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogActions,
    DialogTrigger,
    Button,
    DialogSurface,
    DialogTitle, Option, Caption1, Dropdown, Field, Tag, Textarea, Spinner
} from "@fluentui/react-components";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IReportDialogProps} from "./defs";
import {useStyles} from "./styles";
import {ReportReason} from "../../../data/actions/reports";
import * as reports from "../../../data/actions/reports";

const LANG_PATH: string = "report";
const strings = {};
const ReportDialog = ({id, open, type, close}: IReportDialogProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ reason, setReason ] = useState<ReportReason>(0);
    const [ details, setDetails ] = useState<string>("");
    const [ reporting, setReportingState ] = useState<boolean>(false);
    const [ valid, setValidity ] = useState<boolean>(false);
    const _rt: string[] = [0,1,2,3,4].map(i => "report.reason.i"+i);
    const _short_Label: string[] = _rt.map(e => translate(e + ".short"));
    const _description_Label: string[] = _rt.map(e => translate(e + ".des"));
    useEffect((): void => {
        setValidity(details.length >= 1 && details.length <= 256);
    }, [ details ]);
    const report = (): void => {
        setReportingState(true);
        reports.report({ resource: id, type, details, reason })
            .then(({ _id }): void => {
                console.log({_id});
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setReportingState(false);
                close();
            });
    };

    return (<Dialog open={open}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>{t("dialog.title")}</DialogTitle>
                <DialogContent>
                    <Tag>{t("type." + type) + " #" + id}</Tag>
                    <br/><br/>
                    <Field
                        label={t("dialog.label.reason")}
                        validationMessage={_description_Label[reason]}
                        validationState={"none"}
                    >
                        <Dropdown
                            disabled={reporting}
                            id={`report-reason-default`}
                            defaultValue={_short_Label[reason]}
                            defaultSelectedOptions={[reason + ""]}
                            onOptionSelect={(e,d): void => {
                                setReason(Number(d.optionValue));
                            }}
                        >
                            {_short_Label.map((l, i) => <Option key={l + i} text={l} value={i + ""} >{l}</Option>)}
                        </Dropdown>
                    </Field>
                    <br/>
                    <Field
                        validationState={valid ? "none" : "error"}
                        label={t("dialog.label.details")}
                    >
                        <Textarea
                            disabled={reporting}
                            maxLength={256}
                            value={details}
                            minLength={1}
                            onChange={(e,d): void => {
                                setDetails(d.value);
                            }}
                        ></Textarea>
                    </Field>
                    <br/>
                </DialogContent>
                <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                        <Button disabled={reporting} onClick={(): void => close()} appearance="secondary">{translate("actions.cancel")}</Button>
                    </DialogTrigger>
                    <DialogTrigger disableButtonEnhancement>
                        <Button
                            disabled={reporting || !valid}
                            appearance="primary"
                            icon={reporting ? <Spinner size={"extra-tiny"} /> : null}
                            onClick={(): void => report()}>
                            {reporting ? translate("status.reporting") : translate("actions.report")}
                        </Button>
                    </DialogTrigger>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>);
};
export default ReportDialog;