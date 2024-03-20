import React, {useEffect, useState} from "react";
import {EnterprisePageProps, useStyles} from "./defs";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import * as enterprises from "../../../data/actions/enterprise";
import {StateManager} from "../../SignUpPage/defs";
import {IUser, Role} from "../../../data/models/user";
import VoteManager from "../../../components/basic/VoteManager";
import CommentHandler from "../../../components/basic/CommentHandler";
import {Button, Link} from "@fluentui/react-components";
import HistoryHandler from "../../../components/basic/HistoryHandler";
import {
    bundleIcon, CommentMultiple24Filled, CommentMultiple24Regular,
    FluentIcon,
    History24Filled, History24Regular,
    TextBulletListSquare24Filled,
    TextBulletListSquare24Regular,
    VehicleShip24Filled, VehicleShip24Regular
} from "@fluentui/react-icons";
import TabHandler from "../../../components/basic/TabHandler";
import {TabData} from "../../../components/basic/TabHandler/defs";
import {CommonResponse} from "../../../data/utils";
import UploadedBySection from "../../../components/basic/UploadedBySection";
import UploadDateSection from "../../../components/basic/UploadDateSection";
import {IEnterprise} from "../../../data/models/enterprise";
import EnterpriseIconRep from "../../../components/enterprise/EnterpriseIconRep";
import EnterpriseNamePageField from "../../../components/enterprise/EnterpriseNamePageField";
import EnterpriseDescriptionPageField from "../../../components/enterprise/EnterpriseDescriptionPageField";
import EnterpriseCUITPageField from "../../../components/enterprise/EnterpriseCUITPageField";
import EnterpriseFoundationDatePageField from "../../../components/enterprise/EnterpriseFoundationDatePageField";
import EnterprisePhoneHandler from "../../../components/enterprise/EnterprisePhoneHandler";

import {UserLogged} from "../../../components/page/definitions";
import BoatListForEnterprise from "../../../components/boat/BoatListForEnterprise";
import {IBoat} from "../../../data/models/boat";
import ResourcePage from "../../../components/page/ResourcePage";
import ResourceCommonHeader from "../../../components/page/ResourceCommonHeader";
import ResourcePageBody from "../../../components/page/ResourcePageBody";
import DisableButton from "../../../components/basic/buttons/DisableButton";


const LANG_PATH: string = "pages.enterprises.Enterprise";


const TextBulletIcon: FluentIcon = bundleIcon(TextBulletListSquare24Filled, TextBulletListSquare24Regular);
const CommentsIcon: FluentIcon = bundleIcon(CommentMultiple24Filled, CommentMultiple24Regular);
const HistoryIcon: FluentIcon = bundleIcon(History24Filled, History24Regular);
const BoatIcon: FluentIcon = bundleIcon(VehicleShip24Filled, VehicleShip24Regular)

const strings = {
    tabs: {
        basic: "tabs.basic",
        comments: "tabs.comments",
        history: "tabs.history"
    }
};

const EnterprisePage = (props: EnterprisePageProps): React.JSX.Element => {
    const styles = useStyles();
    const { me, sendReport }: EnterprisePageProps = props;
    const id: string = useParams<{ id: string }>().id as string;
    const { t: _translate }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const t = (key: string): string =>  _translate(LANG_PATH + "." + key);
    const [ , setLoading ]: StateManager<boolean> = useState<boolean>(false);
    const [ enterprise, setEnterprise ]: StateManager<IEnterprise | null> = useState<IEnterprise | null>(null);
    const [ name, setName ]: StateManager<string> = useState<string>("");
    const [ cuit, setCUIT ] = useState<number>(0);
    const [ description, setDescription ] = useState<string>("");
    const [ foundationDate, setFoundationDate ] = useState<Date>(new Date());
    const [ active, updateStatus ] = useState<boolean>(true);
    const [ tab, setTab ] = useState<string>("basic");

    const navigate = useNavigate();
    const tabs: TabData[] = [
        {
            id: "basic",
            name: t(strings.tabs.basic),
            icon: <TextBulletIcon />
        }, {
            id: "boats",
            name: "Embarcaciones",
            icon: <BoatIcon />
        }, {
            id: "comments",
            name: t(strings.tabs.comments),
            icon: <CommentsIcon />
        }, {
            id: "history",
            name: t(strings.tabs.history),
            icon: <HistoryIcon />
        }
    ];

    useEffect((): void => {
        setLoading(true);

        enterprises.find(id)
            .then((response: IEnterprise): void => {
                setEnterprise(response);
                setName(response.name as string);
                setCUIT((response.cuit?? 0) as number);
                setDescription(response.description?? "");
                updateStatus(response.active as boolean);
            })
            .catch((error): void => {
                console.error(error);
            })
            .finally((): void => {
                setLoading(false);
            });
    }, [id]);


    if(enterprise === null) return <></>;
    const canEdit: boolean = (me !== null && enterprise.user !== undefined && enterprise.user !== null && me.active) && (((me._id === (enterprise.user as { _id: string })._id) && (me.role as Role >= 2)) || (me.role === 3));


    const updSt = (): void => {
        const newStatus: boolean = !active;
        enterprises[active ? "disable" : "enable"](id)
            .then((response: CommonResponse) => {
                if(response.success) {
                    updateStatus(newStatus);
                }
            }).catch(err => console.error(err)).finally((): void => {

        });
    };



    return <ResourcePage>
        <ResourceCommonHeader
            voteFeature={enterprises.votes}
            title={name}
            onTabSelect={setTab}
            {...{ tab, tabs, me, id }} />
        <ResourcePageBody>
            { tab === "basic" && <div className="resource-page-field-container">
                <EnterpriseNamePageField
                    name={name}
                    onUpdate={newName => setName(newName)}
                    author={enterprise.user as UserLogged} me={me} id={id}/>
                <EnterpriseDescriptionPageField
                    description={description}
                    onUpdate={x => setDescription(x)}
                    author={enterprise.user as UserLogged} me={me} id={id}/>
                <EnterpriseCUITPageField
                    id={id}
                    value={cuit}
                    onChange={x => setCUIT(x)}
                    me={me} author={enterprise.user as UserLogged}/>
                <EnterpriseFoundationDatePageField user={enterprise.user as UserLogged} me={me} date={foundationDate}
                                                   onChange={x => setFoundationDate(x)} id={id}/>
                <UploadDateSection date={enterprise.uploadDate ?? ""}/>
                <UploadedBySection
                    user={enterprise.user ?? null}
                    username={(enterprise.user as IUser).username}/>
                <EnterprisePhoneHandler me={me} author={enterprise.user as UserLogged} id={id}/>
                <br/><br/>
                {canEdit && (<DisableButton onClick={updSt} status={active}/>)}
                <br/>
                <Link onClick={(_e): void => sendReport(id, "enterprise")}>{_translate("actions.report")}</Link>
            </div>}
            {tab === "boats" && <div className="resource-page-field-container">
                <BoatListForEnterprise
                    enterprise={(enterprise as IEnterprise)._id ?? ""}
                    onClick={({_id}: IBoat): void => {navigate("/boats/" + _id);}} />
            </div> }
            { tab === "comments" && <div className="resource-page-field-container">
                <CommentHandler
                    id={id} me={me}
                    fetcher={enterprises.comments.get}
                    remover={enterprises.comments.del}
                    poster={enterprises.comments.post} />
            </div> }
            { tab === "history" && <div className="resource-page-field-container">
                <HistoryHandler id={id} fetcher={enterprises.fetchHistory} me={me}/>
            </div> }
        </ResourcePageBody>
    </ResourcePage>
};
export default EnterprisePage;