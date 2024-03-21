import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IDockPageProps} from "./defs";
import {useStyles} from "./styles";
import {TabData} from "../../../components/basic/TabHandler/defs";
import {
    bundleIcon,
    CommentMultiple24Filled,
    CommentMultiple24Regular,
    FluentIcon,
    History24Filled,
    History24Regular,
    ImageStackFilled,
    ImageStackRegular,
    TextBulletListSquare24Filled,
    TextBulletListSquare24Regular
} from "@fluentui/react-icons";
import * as docks from "../../../data/actions/dock";
import {DockPropertyStatus, IDockView} from "../../../data/models/dock";
import {useParams} from "react-router-dom";
import {IRegion} from "../../../data/models/region";
import {IUserMinimal} from "../../../components/basic/Comment/defs";
import VoteManager from "../../../components/basic/VoteManager";
import TabHandler from "../../../components/basic/TabHandler";
import PictureHandler from "../../../components/pictures/PictureHandler";
import CommentHandler from "../../../components/basic/CommentHandler";
import HistoryHandler from "../../../components/basic/HistoryHandler";
import NameField from "../../../components/docks/i/NameField";
import AddressField from "../../../components/docks/i/AddressField";
import RegionField from "../../../components/docks/i/RegionField";
import NotesField from "../../../components/docks/i/NotesField";
import LocationField from "../../../components/docks/i/LocationField";
import IconRep from "../../../components/docks/i/IconRep";
import StatusModifiableField from "../../../components/docks/i/StatusModifiableField";
import UploadDateSection from "../../../components/basic/UploadDateSection";
import UploadedBySection from "../../../components/basic/UploadedBySection";
import {Button, Link} from "@fluentui/react-components";
import {CommonResponse} from "../../../data/utils";
import ResourceCommonHeader from "../../../components/page/ResourceCommonHeader";
import ResourcePage from "../../../components/page/ResourcePage";
import ResourcePageBody from "../../../components/page/ResourcePageBody";
import DisableButton from "../../../components/basic/buttons/DisableButton";

const TextBulletIcon: FluentIcon = bundleIcon(TextBulletListSquare24Filled, TextBulletListSquare24Regular);
const CommentsIcon: FluentIcon = bundleIcon(CommentMultiple24Filled, CommentMultiple24Regular);
const HistoryIcon: FluentIcon = bundleIcon(History24Filled, History24Regular);
const ImagesIcon: FluentIcon = bundleIcon(ImageStackFilled, ImageStackRegular);
const LANG_PATH: string = "pages.docks.DockPage";
const strings = {
    tabs: {
        basic: "tabs.basic",
        pics: "tabs.pics",
        comments: "tabs.comments",
        history: "tabs.history"
    }
};

const DockPage = ({ me, sendReport }: IDockPageProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const id: string = useParams<{ id: string }>().id as string;

    const [ name, setName ] = useState<string>("");
    const [ address, setAddress ] = useState<number>(0);
    const [ region, setRegion ] = useState<IRegion | null>(null);
    const [ notes, setNotes ] = useState<string>("");
    const [ status, setStatus ] = useState<DockPropertyStatus>(0);
    const [ coordinates, setCoordinates ] = useState<[number, number]>([0,0]);
    const [ user, setUser ] = useState<IUserMinimal | null>(null);
    const [ uploadDate, setUploadDate ] = useState<Date>(new Date());
    const [ data, setData ] = useState<IDockView | null>(null);
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [ active, updateStatus ] = useState<boolean>(true);
    const [ tab, setTab ] = useState<string>("basic");
    const updSt = (): void => {
        const newStatus: boolean = !active;
        docks[active ? "del" : "enable"](id)
            .then((response: CommonResponse) => {
                if(response.success) {
                    updateStatus(newStatus);
                }
            }).catch(err => console.error(err)).finally((): void => {

        });
    };
    const tabs: TabData[] = [
        {
            id: "basic",
            name: t(strings.tabs.basic),
            icon: <TextBulletIcon />
        }, {
            id: "pics",
            name: t(strings.tabs.pics),
            icon: <ImagesIcon />
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
        setLoadingState(true);
        docks.find(id)
            .then((dock: IDockView): void => {
                setData(dock);
                setName(dock.name);
                setAddress(dock.address);
                setRegion(dock.region);
                setNotes(dock.notes);
                setStatus(dock.status);
                setUser(dock.user);
                setUploadDate(new Date(dock.uploadDate));
                setCoordinates(dock.coordinates);
                updateStatus(true);

            })
            .catch(err => console.error(err))
            .finally((): void => {
                setLoadingState(false);
            })
    }, [ id ]);

    const canEdit: boolean = me !== null && me !== undefined && user !== null && user !== undefined
        && me.active && ((me._id === user._id && me.role === 2) || (me.role === 3));
    if(data === null) return <></>;

    return <ResourcePage>
        <ResourceCommonHeader
            voteFeature={docks.votes}
            title={name}
            onTabSelect={setTab}
            {...{ tabs, tab, me, id }} />
        <ResourcePageBody>
            { tab === "basic" && <div className="resource-page-field-container">
                <NameField
                    id={id}
                    name={name}
                    onUpdate={x => setName(x)}
                    editable={canEdit} />
                <AddressField
                    id={id}
                    value={address}
                    onUpdate={x => setAddress(x)}
                    editable={canEdit} />
                <RegionField editable={canEdit} value={region as IRegion} onChange={x => setRegion(x)} id={id} />
                <NotesField id={id} notes={notes} onUpdate={x => setNotes(x)} editable={canEdit} />
                <StatusModifiableField value={status} onUpdate={x => setStatus(x)} editable={canEdit} id={id} />
                <LocationField editable={canEdit} value={coordinates} onUpdate={x => setCoordinates(x)} id={id} />
                <UploadDateSection date={uploadDate} />
                <UploadedBySection user={user} />
                <br/><br/>
                { canEdit && <DisableButton onClick={updSt} status={active}/> }
                <br/>
                <Link onClick={(_e): void => sendReport(id, "enterprise")}>{translate("actions.report")}</Link>
            </div> }
            { tab === "pics" && <div className="resource-page-field-container">
                <PictureHandler
                    key={id + "$PictureHandler"}
                    {...{ id, me, sendReport }}
                    fetcher={docks.pictures.list}
                    poster={docks.pictures.upload}
                    remover={docks.pictures.rem}
                />
            </div> }
            { tab === "comments" && <div className="resource-page-field-container">
                <CommentHandler
                    {...{ id, me, sendReport }}
                    fetcher={docks.comments.get}
                    remover={docks.comments.del}
                    poster={docks.comments.post} />
            </div> }
            { tab === "history" && <div className="resource-page-field-container">
                <HistoryHandler id={id} fetcher={docks.fetchHistory} me={me} />
            </div> }
        </ResourcePageBody>
    </ResourcePage>
};
export default DockPage;