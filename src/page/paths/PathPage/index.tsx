import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IPathPageProps} from "./defs";
import {useStyles} from "./styles";
import {Button, mergeClasses, Title2} from "@fluentui/react-components";
import {
    bundleIcon, ClockFilled, ClockRegular,
    CommentMultiple24Filled,
    CommentMultiple24Regular,
    DocumentLandscapeDataFilled,
    DocumentLandscapeDataRegular,
    FluentIcon,
    History24Filled,
    History24Regular,
    TextBulletListSquare24Filled,
    TextBulletListSquare24Regular
} from "@fluentui/react-icons";
import {TabData} from "../../../components/basic/TabHandler/defs";
import VoteManager from "../../../components/basic/VoteManager";
import * as paths from "../../../data/actions/path";
import TabHandler from "../../../components/basic/TabHandler";
import {useParams} from "react-router-dom";
import { IBoat } from "../../../data/models/boat";
import {IUserMinimal} from "../../../components/basic/Comment/defs";
import {IPath} from "../../../data/models/path";
import TitleField from "../../../components/path/i/TitleField";
import DescriptionField from "../../../components/path/i/DescriptionField";
import NotesField from "../../../components/path/i/NotesField";
import BoatField from "../../../components/path/i/BoatField";
import UploadedBySection from "../../../components/basic/UploadedBySection";
import UploadDateSection from "../../../components/basic/UploadDateSection";
import CommentHandler from "../../../components/basic/CommentHandler";
import HistoryHandler from "../../../components/basic/HistoryHandler";
import IconRep from "../../../components/path/i/IconRep";
import * as docks from "../../../data/actions/dock";
import {CommonResponse} from "../../../data/utils";
import AvailabilityHandler from "../../../components/path/AvailabilityHandler";

const LANG_PATH: string = "pages.paths.PathPage";
const TextBulletIcon: FluentIcon = bundleIcon(TextBulletListSquare24Filled, TextBulletListSquare24Regular);
const CommentsIcon: FluentIcon = bundleIcon(CommentMultiple24Filled, CommentMultiple24Regular);
const HistoryIcon: FluentIcon = bundleIcon(History24Filled, History24Regular);
const AvailabilitiesIcon: FluentIcon = bundleIcon(DocumentLandscapeDataFilled, DocumentLandscapeDataRegular);
const SchedulesIcon: FluentIcon = bundleIcon(ClockFilled, ClockRegular);

const strings = {
    tabs: {
        basic: "tabs.basic",
        comments: "tabs.comments",
        history: "tabs.history",
        schedules: "tabs.schedules",
        availabilities: "tabs.availabilities"
    }
};
const PathPage = ({ me }: IPathPageProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const id: string = useParams<{ id: string }>().id as string;
    const [ data, setData ] = useState<IPath | null>(null);
    const [ title, setTitle ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ boat, setBoat ] = useState<IBoat | null>(null);
    const [ notes, setNotes ] = useState<string>("");
    const [ active, updateStatus ] = useState<boolean>(true);
    const [ user, setUser ] = useState<IUserMinimal | null>(null);
    const [ uploadDate, setUploadDate ] = useState<Date>(new Date());
    const [ tab, setTab ] = useState<string>("basic");
    const tabs: TabData[] = [
        {
            id: "basic",
            name: t(strings.tabs.basic),
            icon: <TextBulletIcon />
        }, {
            id: "schedules",
            name: t(strings.tabs.schedules),
            icon: <SchedulesIcon />
        }, {
            id: "availabilities",
            name: t(strings.tabs.availabilities),
            icon: <AvailabilitiesIcon />
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
    useEffect(() => {
        paths.find(id)
            .then((response: IPath): void => {
                setData(response);
                setTitle(response.title as string);
                setDescription(response.description as string);
                setBoat(response.boat as IBoat);
                setNotes(response.notes as string);
                updateStatus(response.active?? false);
                setUser(response.user as IUserMinimal);
                setUploadDate(new Date(response.uploadDate?? new Date()))
            })
            .catch(err => {
                console.error(err);
            })
            .finally((): void => {

            });
    }, [ id ]);
    if(data === null) return <></>;
    const canEdit: boolean = me !== null && me !== undefined && me.active && me.role >= 2 && ((
        user !== null && user !== undefined && user._id === me._id
    ) || me.role === 3);
    const updSt = (): void => {
        const newStatus: boolean = !active;
        paths[active ? "del" : "enable"](id)
            .then((response: CommonResponse) => {
                if(response.success) {
                    updateStatus(newStatus);
                }
            }).catch(err => console.error(err)).finally((): void => {

        });
    };


    return (<div className={mergeClasses(styles.root, "page-content", "flex-down")}>
        <IconRep name={title} boatName={(boat as IBoat).name as string} />
        <center>
            <VoteManager
                me={me} id={id}
                fetcher={paths.votes.get}
                upvoter={paths.votes.upvote}
                downvoter={paths.votes.downvote}/>
        </center>
        <TabHandler
            tab={tab}
            onTabSelect={(id: string): void => setTab(id)}
            tabs={tabs}
            minimumVisible={2} />
        { tab === "basic" && <>
            <TitleField id={id} formalValue={title} onUpdate={setTitle} editable={canEdit} />
            <DescriptionField id={id} formalValue={description} onUpdate={setDescription} editable={canEdit} />
            <NotesField id={id} formalValue={notes} onUpdate={setNotes} editable={canEdit} />
            <BoatField value={boat as IBoat} onChange={setBoat} editable={canEdit} id={id} />
            <UploadedBySection user={user} />
            <UploadDateSection date={uploadDate} />
            <br/>
            {canEdit && (<div className="jBar">
                <Button
                    className={active ? styles.disableBtn : styles.enableBtn }
                    onClick={(_e): void => updSt()}
                    appearance={"secondary"}>
                    {active ? translate("actions.disable") : translate("actions.enable")}
                </Button>
            </div>)}
        </>}
        { tab === "comments" && <CommentHandler id={id} me={me} fetcher={paths.comments.get} poster={paths.comments.post} remover={paths.comments.del} /> }
        { tab === "history" && <HistoryHandler id={id} me={me} fetcher={paths.fetchHistory} /> }
        { tab === "availabilities" && <AvailabilityHandler me={me} id={id} editable={canEdit} /> }
    </div>);
};
export default PathPage;