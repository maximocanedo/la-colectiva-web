import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IReportCardProps} from "./defs";
import {useStyles} from "./styles";
import {
    Body1, Button,
    Caption1,
    Card, CardFooter,
    CardHeader,
    CardPreview,
    Dropdown, Field,
    Option,
    Spinner,
    Tag,
    Textarea
} from "@fluentui/react-components";
import UserLink from "../../user/UserLink";
import * as reports from "../../../data/actions/reports";
import {ReportStatus} from "../../../data/actions/reports";

const LANG_PATH: string = "report";
const strings = {};
const ReportCard = ({ editable, ...report  }: IReportCardProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const [ updatingStatus, setStatusUpdateState ] = useState<boolean>(false);
    const [ updatingOM, setOMUpdateState ] = useState<boolean>(false);
    const [ editMode, setEditMode ] = useState<boolean>(false);
    const [ officialMessage, setOfficialMessage ] = useState<string>(report.officialMessage?? "");
    const [ message, setMessage ] = useState<string>(officialMessage);
    const styles = useStyles();

    const d: string = (new Date(report.uploadDate)).toLocaleString(translate("defLang"), {
        dateStyle: "long",
        timeStyle: "short"
    });
    const _st_Label: string[] = [0,1,2,3,4,5].map(i => t("status.i"+i+".st"));

    const updateStatus = (status: ReportStatus): void => {
        setStatusUpdateState(true);
        reports.patch({ id: report._id, status })
            .then((): void => {
                console.log("OK!");
            }).catch(err => console.error(err))
            .finally((): void => {
                setStatusUpdateState(false);
            });
    };
    const updateOM = (): void => {
        setOMUpdateState(true);
        reports.patch({ id: report._id, officialMessage: message })
            .then((): void => {
                setOfficialMessage(message);
                setEditMode(false);
            }).catch(err => console.error(err))
            .finally((): void => {
                setOMUpdateState(false);
            });
    };

    return (<Card appearance={"filled"} className={styles.root}>
        <CardHeader
            header={<Body1><b>{report.user.name}</b></Body1>}
            description={<Caption1>{d}</Caption1>}
        />
        <div>
            <Tag>{t("type." + report.type) + " #" + report.resource}</Tag>

            <br/>
            <p><b>{t("card.label.reason")} </b>{t("reason.i"+report.reason+".short")}</p>
            <p><b>{t("card.label.details")} </b>{report.details}</p>
            { !editable && <p><b>{t("card.label.status")} </b>{t("status.i"+report.status+".det")}</p>}
            { report.admin !== null && report.admin !== undefined
                && <p><b>{t("card.label.admin")} </b><UserLink from={report.admin.username} data={report.admin} /></p>}
            { !editMode && (officialMessage?? "") !== "" && <p><b>{t("card.label.response")} </b>{officialMessage}</p>}
            { editable && editMode && <Field
                label={t("dialog.label.ofm")}
            >
                <Textarea
                    disabled={updatingOM}
                    maxLength={256}
                    value={message}
                    minLength={1}
                    onChange={(e,d): void => {
                        setMessage(d.value);
                    }}
                ></Textarea>
            </Field>}
        </div>
        { editable && <CardFooter action={ !editMode && <Button appearance={"secondary"} onClick={(): void => setEditMode(true)}>{t("dialog.label.eofm")}</Button> || <></> }>
            {editable && !editMode && <Dropdown
                disabled={updatingStatus}
                id={`report-reason-default`}
                style={{minWidth: "100px"}}
                defaultValue={_st_Label[report.reason]}
                defaultSelectedOptions={[report.reason + ""]}
                onOptionSelect={(e,d): void => {
                    const newValue: number = (Number(d.optionValue));
                    updateStatus(newValue);
                }}
            >
                {_st_Label.map((l, i) => <Option key={l + i} text={l} value={i + ""} >{l}</Option>)}
            </Dropdown>}
            { editMode && <div className="jBar">
                <div className="l"></div>
                <div className="r flex-edtbl-dt">
                    <Button
                        appearance={"primary"}
                        icon={updatingOM ? <Spinner size={"extra-tiny"} /> : null}
                        disabled={updatingOM}
                        onClick={(): void => updateOM()}>
                        { updatingOM ? translate("status.saving") : translate("actions.save")}
                    </Button>
                    <Button
                        appearance={"secondary"}
                        disabled={updatingOM}
                        onClick={(): void => setEditMode(false)}>
                        {translate("actions.cancel")}
                    </Button>
                </div>
            </div> }
        </CardFooter>}
    </Card>);
};
export default ReportCard;