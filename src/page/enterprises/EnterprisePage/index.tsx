import React, {useEffect, useState} from "react";
import {EnterprisePageProps, useStyles} from "./defs";
import {useParams} from "react-router-dom";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import * as enterprises from "../../../data/actions/enterprise";
import {StateManager} from "../../SignUpPage/defs";
import {IUser, Role} from "../../../data/models/user";
import VoteManager from "../../../components/basic/VoteManager";
import CommentHandler from "../../../components/basic/CommentHandler";
import {Button} from "@fluentui/react-components";
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
import {UserLogged} from "../../../App";
import EnterpriseDescriptionPageField from "../../../components/enterprise/EnterpriseDescriptionPageField";
import EnterpriseCUITPageField from "../../../components/enterprise/EnterpriseCUITPageField";
import EnterpriseFoundationDatePageField from "../../../components/enterprise/EnterpriseFoundationDatePageField";


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
    const { me }: EnterprisePageProps = props;
    const id: string = useParams<{ id: string }>().id as string;
    const { t: _translate }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const t = (key: string): string =>  _translate(LANG_PATH + "." + key);
    const [ loading, setLoading ]: StateManager<boolean> = useState<boolean>(false);
    const [ enterprise, setEnterprise ]: StateManager<IEnterprise | null> = useState<IEnterprise | null>(null);
    const [ name, setName ]: StateManager<string> = useState<string>("");
    const [ cuit, setCUIT ] = useState<number>(0);
    const [ description, setDescription ] = useState<string>("");
    const [ foundationDate, setFoundationDate ] = useState<Date>(new Date());
    const [ active, updateStatus ] = useState<boolean>(true);
    const [ tab, setTab ] = useState<string>("basic");

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
    }, []);


    if(enterprise === null) return <></>;
    const canEdit: boolean = (me !== null && enterprise.user !== undefined && enterprise.user !== null && me.active) && (((me._id === enterprise.user) && (me.role as Role >= 2)) || (me.role === 3));


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



    return (<>
        <div className={"page-content flex-down"}>
            <EnterpriseIconRep name={name} cuit={cuit} />
            <center>
                <VoteManager
                    me={me} id={id}
                    fetcher={enterprises.votes.get}
                    upvoter={enterprises.votes.upvote}
                    downvoter={enterprises.votes.downvote} />
            </center>
            <TabHandler
                tab={tab}
                onTabSelect={(id: string): void => setTab(id)}
                tabs={tabs}
                minimumVisible={2} />
            {tab === "basic" && <>
                <EnterpriseNamePageField
                    name={name}
                    onUpdate={newName => setName(newName)}
                    author={enterprise.user as UserLogged} me={me} id={id} />
                <EnterpriseDescriptionPageField
                    description={description}
                    onUpdate={x => setDescription(x)}
                    author={enterprise.user as UserLogged} me={me} id={id} />
                <EnterpriseCUITPageField
                    id={id}
                    value={cuit}
                    onChange={x => setCUIT(x)}
                    me={me} author={enterprise.user as UserLogged} />
                <EnterpriseFoundationDatePageField user={enterprise.user as UserLogged} me={me} date={foundationDate} onChange={x => setFoundationDate(x)} id={id} />
                <UploadDateSection date={enterprise.uploadDate?? ""} />
                <UploadedBySection
                    user={enterprise.user?? null}
                    username={(enterprise.user as IUser).username} />
                {canEdit && (<div className="jBar">
                    <Button
                        className={active ? styles.disableBtn : styles.enableBtn }
                        onClick={(e): void => updSt()}
                        appearance={"secondary"}>
                        {active ? t("actions.disable") : t("actions.enable")}
                    </Button>
                </div>)}
                </>
            }
            {tab === "comments" &&
                <CommentHandler
                    id={id} me={me}
                    fetcher={enterprises.comments.get}
                    remover={enterprises.comments.del}
                    poster={enterprises.comments.post} />}

            {tab === "history" && <HistoryHandler id={id} fetcher={enterprises.fetchHistory} me={me}/>}

        </div>
    </>);
};
export default EnterprisePage;