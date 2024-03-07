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
import UserButton from "../../components/user/UserButton";
import UserLink from "../../components/user/UserLink";
import VoteManager from "../../components/basic/VoteManager";
import CommentHandler from "../../components/basic/CommentHandler";
import {
    Breadcrumb,
    BreadcrumbButton, BreadcrumbDivider,
    BreadcrumbItem, Button,
    makeStyles, mergeClasses, Overflow, OverflowItem,
    SelectTabData,
    SelectTabEvent,
    shorthands,
    Tab,
    TabList,
    TabValue,
    tokens
} from "@fluentui/react-components";
import HistoryHandler from "../../components/basic/HistoryHandler";
import {ExampleTab} from "../../components/basic/OverflowMenuItem/defs";
import {
    bundleIcon, CommentMultiple24Filled, CommentMultiple24Regular,
    FluentIcon,
    History24Filled, History24Regular,
    TextBulletListSquare24Filled,
    TextBulletListSquare24Regular
} from "@fluentui/react-icons";
import OverflowMenu from "../../components/basic/OverflowMenu";
import TabHandler from "../../components/basic/TabHandler";
import {TabData} from "../../components/basic/TabHandler/defs";
import {CommonResponse} from "../../data/utils";


const LANG_PATH: string = "pages.Region";


const TextBulletIcon: FluentIcon = bundleIcon(TextBulletListSquare24Filled, TextBulletListSquare24Regular);
const CommentsIcon: FluentIcon = bundleIcon(CommentMultiple24Filled, CommentMultiple24Regular);
const HistoryIcon: FluentIcon = bundleIcon(History24Filled, History24Regular);



const RegionPage = (props: RegionPageProps): React.JSX.Element => {
    const styles = useStyles();
    const id: string = useParams<{ id: string }>().id as string;
    const { t: _translate }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const t = (key: string): string =>  _translate(LANG_PATH + "." + key);
    const [ loading, setLoading ]: StateManager<boolean> = useState<boolean>(false);
    const [ region, setRegion ]: StateManager<IRegion | null> = useState<IRegion | null>(null);
    const [ me, loadActualUser ]: StateManager<IUser | null> = useState<IUser | null>(null);
    const [ name, setName ]: StateManager<string> = useState<string>("");
    const [ type, setType ]: StateManager<RegionType> = useState<RegionType>(
        region === null || region.type === undefined ? 0 : region.type
    );
    const [ active, updateStatus ] = useState<boolean>(true);
    const [ tab, setTab ] = useState<string>("basic");
    const tabs: TabData[] = [
        {
            id: "basic",
            name: t("tabs.basic"),
            icon: <TextBulletIcon />
        }, {
            id: "comments",
            name: t("tabs.comments"),
            icon: <CommentsIcon />
        }, {
            id: "history",
            name: t("tabs.history"),
            icon: <HistoryIcon />
        }
    ];

    useEffect((): void => {
        setLoading(true);

        users.myself()
            .then((response: IUser): void => {
                loadActualUser(response);
            }).catch((err: unknown): void => {});
        regions.find(id)
            .then((response: IRegion): void => {
                console.log(response);
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
    const canEdit: boolean = (me !== undefined && me !== null && region.user !== undefined && region.user !== null && me.active === true) && (((me._id === region.user) && (me.role as Role >= 2)) || (me.role === 3));

    const regionType: string = typeof region.type !== 'undefined' ? getRegionTypeLangPathNameFor(region.type) : "models.region.types.unknown";

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

    const formattedDate: string = new Intl.DateTimeFormat(_translate("defLang"), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(region.uploadDate?? ""));

    return (<>
        <div className={"page-content flex-down"}>
            <Breadcrumb
                aria-label="Small breadcrumb example with buttons"
                size="small"
            >
                <BreadcrumbItem>
                    <BreadcrumbButton>Regiones</BreadcrumbButton>
                </BreadcrumbItem>
                <BreadcrumbDivider />
                <BreadcrumbItem>
                    <BreadcrumbButton>{_translate(regionType) + " "}{name}</BreadcrumbButton>
                </BreadcrumbItem>
            </Breadcrumb>
            <RegionIconRep name={name} type={type} region={region}/>
            <center>
                <VoteManager me={me} id={id} fetcher={regions.votes.get} upvoter={regions.votes.upvote}
                             downvoter={regions.votes.downvote}/>
            </center>
            <TabHandler
                tab={tab}
                onTabSelect={(id: string): void => setTab(id)}
                tabs={tabs}
                minimumVisible={2} />
            {tab === "basic" && <>
                <RegionName id={region._id} type={type} name={name} onUpdate={(x: string): void => setName(x)}
                            author={region.user as IUser} me={me}/>
                <RegionTypeField id={region._id} initialValue={type} editable={canEdit}
                                 onUpdate={(x: RegionType) => setType(x)}/>
                <div className="jBar">
                    <div className="l">{t("st.registeredBy")}</div>
                    <div className="r">
                        <UserLink data={null} from={(region.user as any).username}/>
                    </div>
                </div>
                <div className="jBar">
                    <div className="l">{t("st.uploaded")}</div>
                    <div className="r">{formattedDate}</div>
                </div>
                {canEdit && <div className="jBar">
                    <Button className={active ? styles.disableBtn : styles.enableBtn } onClick={(e): void => updSt()} appearance={"secondary"}>
                        {active ? t("actions.disable") : t("actions.enable")}
                    </Button>
                </div>}
            </>}
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