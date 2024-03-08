import React, {useEffect, useState} from "react";
import {getRegionTypeLangPathNameFor, RegionPageProps, RegionTypeLangPathNames, useStyles} from "./defs";
import {useParams} from "react-router-dom";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import * as regions from "../../data/actions/region";
import * as users from "../../data/actions/user";
import {IRegion, RegionType} from "../../data/models/region";
import {StateManager} from "../SignUpPage/defs";
import RegionIconRep from "../../components/region/RegionIconRep";
import {IUser, Role} from "../../data/models/user";
import RegionName from "../../components/region/RegionName";
import RegionTypeField from "../../components/region/RegionTypeField";
import VoteManager from "../../components/basic/VoteManager";
import CommentHandler from "../../components/basic/CommentHandler";
import {Button} from "@fluentui/react-components";
import HistoryHandler from "../../components/basic/HistoryHandler";
import {
    bundleIcon, CommentMultiple24Filled, CommentMultiple24Regular,
    FluentIcon,
    History24Filled, History24Regular,
    TextBulletListSquare24Filled,
    TextBulletListSquare24Regular
} from "@fluentui/react-icons";
import TabHandler from "../../components/basic/TabHandler";
import {TabData} from "../../components/basic/TabHandler/defs";
import {CommonResponse} from "../../data/utils";
import UploadedBySection from "../../components/basic/UploadedBySection";
import UploadDateSection from "../../components/basic/UploadDateSection";


const LANG_PATH: string = "pages.Region";


const TextBulletIcon: FluentIcon = bundleIcon(TextBulletListSquare24Filled, TextBulletListSquare24Regular);
const CommentsIcon: FluentIcon = bundleIcon(CommentMultiple24Filled, CommentMultiple24Regular);
const HistoryIcon: FluentIcon = bundleIcon(History24Filled, History24Regular);

const strings = {
    tabs: {
        basic: "tabs.basic",
        comments: "tabs.comments",
        history: "tabs.history"
    }
};

const RegionPage = (props: RegionPageProps): React.JSX.Element => {
    const styles = useStyles();
    const { me }: RegionPageProps = props;
    const id: string = useParams<{ id: string }>().id as string;
    const { t: _translate }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const t = (key: string): string =>  _translate(LANG_PATH + "." + key);
    const [ loading, setLoading ]: StateManager<boolean> = useState<boolean>(false);
    const [ region, setRegion ]: StateManager<IRegion | null> = useState<IRegion | null>(null);
    const [ name, setName ]: StateManager<string> = useState<string>("");
    const [ type, setType ]: StateManager<RegionType> = useState<RegionType>(
        region === null || region.type === undefined ? 0 : region.type
    );
    const [ active, updateStatus ] = useState<boolean>(true);
    const [ tab, setTab ] = useState<string>("basic");
    const tabs: TabData[] = [
        {
            id: "basic",
            name: t(strings.tabs.basic),
            icon: <TextBulletIcon />
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

        regions.find(id)
            .then((response: IRegion): void => {
                setRegion(response);
                setName(response.name as string);
                setType(response.type as RegionType);
                updateStatus(response.active as boolean);
            })
            .catch((error): void => {
                console.error(error);
            })
            .finally((): void => {
                setLoading(false);
            });
    }, []);


    if(region === null) return <></>;
    const canEdit: boolean = (me !== null && region.user !== undefined && region.user !== null && me.active) && (((me._id === region.user) && (me.role as Role >= 2)) || (me.role === 3));


    const updSt = (): void => {
        const newStatus: boolean = !active;
        regions[active ? "del" : "enable"](id)
            .then((response: CommonResponse) => {
                if(response.success) {
                    updateStatus(newStatus);
                }
            }).catch(err => console.error(err)).finally((): void => {

        });
    };



    return (<>
        <div className={"page-content flex-down"}>
            <RegionIconRep name={name} type={type} region={region} />
            <center>
                <VoteManager
                    me={me} id={id}
                    fetcher={regions.votes.get}
                    upvoter={regions.votes.upvote}
                    downvoter={regions.votes.downvote} />
            </center>
            <TabHandler
                tab={tab}
                onTabSelect={(id: string): void => setTab(id)}
                tabs={tabs}
                minimumVisible={2} />
            {tab === "basic" && <>
                <RegionName
                    id={region._id}
                    type={type}
                    name={name}
                    onUpdate={(x: string): void => setName(x)}
                    author={region.user as IUser} me={me} />
                <RegionTypeField
                    id={region._id}
                    initialValue={type}
                    editable={canEdit}
                    onUpdate={(x: RegionType) => setType(x)} />
                <UploadDateSection date={region.uploadDate?? ""} />
                <UploadedBySection
                    user={region.user?? null}
                    username={(region.user as IUser).username} />
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
                    fetcher={regions.comments.get}
                    remover={regions.comments.del}
                    poster={regions.comments.post} />}

            {tab === "history" && <HistoryHandler id={id} fetcher={regions.fetchHistory} me={me}/>}

        </div>
    </>);
};
export default RegionPage;