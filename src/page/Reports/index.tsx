import {Button, Dropdown, mergeClasses, Option} from "@fluentui/react-components";
import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IReportsProps} from "./defs";
import {useStyles} from "./styles";
import * as reports from "./../../data/actions/reports";
import {IReportView, RecordCategory, ReportReason, ReportStatus} from "../../data/actions/reports";
import LoadMoreButton from "../../components/basic/buttons/LoadMoreButton";
import ReportCard from "../../components/basic/ReportCard";
import { SearchBox } from "@fluentui/react-search-preview";
import type { SearchBoxProps } from "@fluentui/react-search-preview";
import { SearchRegular } from "@fluentui/react-icons";
import WelcomingTitle from "../../components/basic/WelcomingTitle";

const LANG_PATH: string = "components.Reports";
const strings = {};
const ADD: string = "ADD";
const CLEAR: string = "CLEAR";
const reducer = (state: IReportView[], { type, payload }: { type: string, payload: IReportView | null }): IReportView[] => {
    const exists = (): boolean => payload !== null && state.some(x => x._id === payload._id);
    if(payload !== null && type === ADD && !exists()) return [ ...state, payload ];
    if(type === CLEAR) return [];
    return [ ...state ];
};
const Reports = ({ me }: IReportsProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ q, setQuery ] = useState<string>("");
    const [ page, setPage ] = useState<number>(0);
    const [ type, setType ] = useState<RecordCategory>();
    const [ reason, setReason ] = useState<ReportReason>();
    const [ status, setStatus ] = useState<ReportStatus>();
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [ reps, dispatchReports ] = useReducer(reducer, []);
    const [ cleanNextTime, setCleanNextTime ] = useState<boolean>(false);
    const size: number = 3;
    let needtoClear: boolean = false;
    useEffect((): void => {
        needtoClear = (true);
        setPage(0);
    }, [ type, reason, status, q ]);
    const find = (): void => {
        setLoadingState(true);
        reports.list({q, p: page, itemsPerPage: size, type, reason, status })
            .then((data: IReportView[]): void => {
                if(needtoClear) {
                    dispatchReports({ type: CLEAR, payload: null });
                    needtoClear = (false);
                }
                data.map(rep => dispatchReports({ type: ADD, payload: rep }));
                if(data.length === size) setPage(page + 1);
                else if(data.length === 0 && page > 0) setPage(page - 1);
            }).catch(err => console.error(err))
            .finally((): void => {
                setLoadingState(false);
            })
    };

    useEffect(() => {
        find();
    }, []);

    const canEdit: boolean = me !== null && me !== undefined && me.role === 3;

    const reasonStrings: string[] = [0,1,2,3,4].map(i => translate("report.reason.i"+i+".short"));

    const statusStrings: string[] = [0,1,2,3,4,5].map(i => translate("report.status.i"+i+".st"));

    return (<div className={mergeClasses(styles.root, "page-content", "flex-down")}>
        <WelcomingTitle content={translate("report.pageTitle")} />
        <SearchBox
            placeholder={translate("report.pageSearchPlaceholder")}

            value={q}
            onChange={(e,d): void => {
                setQuery(d.value);
            }}
        />
        <div className="filters-two">
            <Dropdown
                className={"filter-box"}
                defaultValue={reason === undefined ? translate("report.reason.all") : reasonStrings[reason]}
                defaultSelectedOptions={[reason + ""]}
                onOptionSelect={(e,d): void => {

                    const newValue: number | undefined = d.optionValue === "undefined" ? undefined : (Number(d.optionValue));
                    setReason(newValue)
                }}
            >
                <Option key={"00i"} value={"undefined"}>{translate("report.reason.all")}</Option>
                {reasonStrings.map((l, i) => <Option key={l + i} text={l} value={i + ""} >{l}</Option>)}
            </Dropdown>
            <Dropdown
                className={"filter-box"}
                defaultValue={status === undefined ? translate("report.status.all") : statusStrings[status]}
                defaultSelectedOptions={[status + ""]}
                onOptionSelect={(e,d): void => {

                    const newValue: number | undefined = d.optionValue === "undefined" ? undefined : (Number(d.optionValue));
                    setStatus(newValue)
                }}
            >
                <Option key={"00i"} value={"undefined"}>{translate("report.status.all")}</Option>
                {statusStrings.map((l, i) => <Option key={l + i} text={l} value={i + ""} >{l}</Option>)}
            </Dropdown>
        </div>
        <Button icon={<SearchRegular />} onClick={(): void => find()} appearance={"primary"}>{translate("actions.search")}</Button>
        {
            reps.map(rep => <ReportCard editable={canEdit} {...rep} />)
        }
        <LoadMoreButton loading={loading} onClick={(): void => find()} />
    </div>);
};
export default Reports;