import React, {useEffect, useState} from "react";
import {IBoatPageProps, useStyles} from "./defs";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation, UseTranslationResponse} from "react-i18next";
import * as boats from "../../../data/actions/boat";
import {StateManager} from "../../SignUpPage/defs";
import {Role} from "../../../data/models/user";
import VoteManager from "../../../components/basic/VoteManager";
import CommentHandler from "../../../components/basic/CommentHandler";
import {Button} from "@fluentui/react-components";
import HistoryHandler from "../../../components/basic/HistoryHandler";
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
import TabHandler from "../../../components/basic/TabHandler";
import {TabData} from "../../../components/basic/TabHandler/defs";
import {CommonResponse} from "../../../data/utils";
import {IEnterprise} from "../../../data/models/enterprise";
import {IBoat} from "../../../data/models/boat";
import BoatNamePageField from "../../../components/boat/BoatNamePageField";
import BoatMatPageField from "../../../components/boat/BoatMatPageField";
import BoatEnterprisePageField from "../../../components/boat/BoatEnterprisePageField";
import PictureHandler from "../../../components/pictures/PictureHandler";
import BoatIconRep from "../../../components/boat/BoatIconRep";

import {UserLogged} from "../../../components/page/definitions";
import UploadedBySection from "../../../components/basic/UploadedBySection";
import UploadDateSection from "../../../components/basic/UploadDateSection";
import BoatListForEnterprise from "../../../components/boat/BoatListForEnterprise";


const LANG_PATH: string = "pages.boats.Boat";


const TextBulletIcon: FluentIcon = bundleIcon(TextBulletListSquare24Filled, TextBulletListSquare24Regular);
const CommentsIcon: FluentIcon = bundleIcon(CommentMultiple24Filled, CommentMultiple24Regular);
const HistoryIcon: FluentIcon = bundleIcon(History24Filled, History24Regular);
const ImagesIcon: FluentIcon = bundleIcon(ImageStackFilled, ImageStackRegular);

const strings = {
    tabs: {
        basic: "tabs.basic",
        comments: "tabs.comments",
        history: "tabs.history",
        pics: "tabs.pics"
    }
};

const BoatPage = (props: IBoatPageProps): React.JSX.Element => {
    const styles = useStyles();
    const { me }: IBoatPageProps = props;
    const id: string = useParams<{ id: string }>().id as string;
    const { t: _translate }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const t = (key: string): string =>  _translate(LANG_PATH + "." + key);
    const [ , setLoading ]: StateManager<boolean> = useState<boolean>(false);
    const [ boat, setBoat ]: StateManager<IBoat | null> = useState<IBoat | null>(null);
    const [ name, setName ]: StateManager<string> = useState<string>("");
    const [ mat, setMat ] = useState<string>("");
    const [ enterprise, setEnterprise ] = useState<IEnterprise | null>(null);
    const [ active, updateStatus ] = useState<boolean>(true);
    const [ tab, setTab ] = useState<string>("basic");

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
        setLoading(true);

        boats.find(id)
            .then((response: IBoat): void => {
                setBoat(response);
                setName(response.name as string);
                setMat(response.mat?? "");
                setEnterprise(response.enterprise as IEnterprise)
                updateStatus(response.active as boolean);
            })
            .catch((error): void => {
                console.error(error);
            })
            .finally((): void => {
                setLoading(false);
            });
    }, [id]);


    if(boat === null) return <></>;
    const canEdit: boolean = (me !== null && boat.user !== undefined && boat.user !== null && me.active) && (((me._id === (boat.user as { _id: string })._id) && (me.role as Role >= 2)) || (me.role === 3));


    const updSt = (): void => {
        const newStatus: boolean = !active;
        boats[active ? "del" : "enable"](id)
            .then((response: CommonResponse) => {
                updateStatus(newStatus);
            })
            .catch(err => console.error(err))
            .finally((): void => {  });
    };



    return (<>
        <div className={"page-content flex-down"}>
            <BoatIconRep name={name} mat={mat} />
            <center>
                <VoteManager
                    me={me} id={id}
                    fetcher={boats.votes.get}
                    upvoter={boats.votes.upvote}
                    downvoter={boats.votes.downvote} />
            </center>
            <TabHandler
                tab={tab}
                onTabSelect={(id: string): void => setTab(id)}
                tabs={tabs}
                minimumVisible={2} />
            { tab === "pics" &&
                <PictureHandler
                    key={id + "$PictureHandler"} me={me} id={id}
                    fetcher={boats.pictures.list}
                    poster={boats.pictures.upload}
                    remover={boats.pictures.rem}
                />}

            {tab === "basic" && <>
                <BoatNamePageField name={name} onUpdate={x => setName(x)} author={boat.user as UserLogged} me={me} id={id} />
                <BoatMatPageField mat={mat} onUpdate={x => setMat(x)} author={boat.user as UserLogged} me={me} id={id} />
                <BoatEnterprisePageField
                    initial={enterprise as IEnterprise}
                    onUpdate={x => setEnterprise(x)} id={id} editable={canEdit} />
                <UploadedBySection user={boat.user as UserLogged} />
                <UploadDateSection date={new Date(boat.uploadDate?? new Date())} />
                {canEdit && (<div className="jBar">
                    <Button
                        className={active ? styles.disableBtn : styles.enableBtn }
                        onClick={(_e): void => updSt()}
                        appearance={"secondary"}>
                        {active ? t("actions.disable") : t("actions.enable")}
                    </Button>
                </div>)}
                </>
            }
            {tab === "comments" &&
                <CommentHandler
                    id={id} me={me}
                    fetcher={boats.comments.get}
                    remover={boats.comments.del}
                    poster={boats.comments.post} />}

            {tab === "history" && <HistoryHandler id={id} fetcher={boats.fetchHistory} me={me}/>}

        </div>
    </>);
};
export default BoatPage;