import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {IPictureCardProps} from "./defs";
import * as pictures from "./../../../data/actions/picture";
import {
    Body1,
    Button,
    Caption1,
    Card,
    CardFooter,
    CardHeader,
    CardPreview,
    Dialog, DialogActions, DialogBody, DialogContent,
    DialogSurface, DialogTitle,
    DialogTrigger,
    Divider,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger, Spinner,
    Tooltip
} from "@fluentui/react-components";
import VoteManager from "../../basic/VoteManager";
import {getTimePassed} from "../../basic/Comment";
import CommentHandler from "../../basic/CommentHandler";
import {CommentOffRegular, CommentRegular, MoreHorizontalRegular} from "@fluentui/react-icons";
import {useNavigate} from "react-router-dom";

const LANG_PATH: string = "components.pics.card";
const strings = {
    actions: {
        download: "actions.download",
        gotoProfile: "actions.gotoProfile",
        remove: "actions.remove",
        close: "actions.close"
    },
    st: {
        removing: "st.removing"
    },
    dialog: {
        remove: {
            title: "dialog.remove.title",
            description: "dialog.remove.description"
        }
    }
};
const PictureCard = ({ deletable, _id, url, user, uploadDate, description, me, onDelete, remover, docId }: IPictureCardProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);

    const lang: string = translate("defLang");
    const rtf1 = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const [ time, unit ] = getTimePassed(new Date(uploadDate));
    const [ imageURL, setImageURL ] = useState<string>("");
    const [ showComments, setCommentShowingState ] = useState<boolean>(false);
    const [ showingRemoveDialog, setRemoveDialogShowingState ] = useState<boolean>(false);
    const [ imageLoaded, setImageLoadedState ] = useState<boolean>(false);
    const f: string = (time === 0 && unit === "minutes") ? translate("now") : rtf1.format(time, unit);
    const [ removing, setRemovingState ] = useState<boolean>(false);
    const [ removed, setRemovedState ] = useState<boolean>(false);
    const navigate = useNavigate();
    useEffect(() => {
        pictures.download(_id)
            .then((raw: Blob): void => {
                setImageURL(URL.createObjectURL(raw));
                setImageLoadedState(true);
            }).catch(err => console.error(err)).finally((): void => {

        });
    }, []);

    const download = (): void => {
        const a = document.createElement("a");
        a.href = imageURL;
        a.download = _id;
        a.click();
    };
    const remove = (): void => {
        setRemoveDialogShowingState(false);
        if(!deletable) return;
        setRemovingState(true);
        remover(docId, _id)
            .then((): void => {
                onDelete();
                setRemovedState(true);
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setRemovingState(false);
            })

    };
    const gotoProfile = (): void => {
        navigate("/users/" + user.username);
    };
    if(removed) return <></>;

    const removeDialog = (<Dialog open={showingRemoveDialog}>
        <DialogSurface>
            <DialogBody>
                <DialogTitle>{t(strings.dialog.remove.title)}</DialogTitle>
                <DialogContent>
                    {t(strings.dialog.remove.description)}
                </DialogContent>
                <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                        <Button onClick={(): void => setRemoveDialogShowingState(false)} appearance="secondary">{t(strings.actions.close)}</Button>
                    </DialogTrigger>
                    <Button onClick={(): void => remove()} appearance="primary">{t(strings.actions.remove)}</Button>
                </DialogActions>
            </DialogBody>
        </DialogSurface>
    </Dialog>);

    const menu = (<Menu>
        <MenuTrigger disableButtonEnhancement>
            <Button icon={<MoreHorizontalRegular />} appearance={"subtle"}></Button>
        </MenuTrigger>

        <MenuPopover>
            <MenuList>
                <MenuItem onClick={(): void => download()}>{t(strings.actions.download)}</MenuItem>
                <MenuItem onClick={(): void => gotoProfile()}>{t(strings.actions.gotoProfile)}</MenuItem>
                {deletable && <Divider/>}
                {deletable && <MenuItem
                    onClick={(): void => setRemoveDialogShowingState(true)}>{t(strings.actions.remove)}</MenuItem>}
            </MenuList>
        </MenuPopover>
    </Menu>)

    return (<Card appearance={"outline"}>
        {removeDialog}
        <CardHeader
            header={<Body1><b>{user.name?? ""}</b></Body1>}
            description={<Caption1>{removing ? t(strings.st.removing) : f}</Caption1>}
            action={menu}
        />
        <CardPreview style={{ opacity: (removing ? 0.7 : 1)}}>
            { imageLoaded && <Tooltip content={description.trim() === "" ? "N/A": description} relationship={"description"}>
                <img src={imageURL} alt={description} />
            </Tooltip>}
            {!imageLoaded && <center>
                <Spinner size={"small"} />
            </center>}
        </CardPreview>
        { !removing && <CardFooter>
            <div className="pic_all">
                <div className={"rw"}>
                    <VoteManager
                        me={me} id={_id}
                        fetcher={pictures.votes.get}
                        upvoter={pictures.votes.upvote}
                        downvoter={pictures.votes.downvote} />
                    <Button
                        onClick={() => setCommentShowingState(!showComments)}
                        appearance={"secondary"}
                        icon={showComments ? <CommentOffRegular /> : <CommentRegular />} />
                </div>
                {showComments && <div className={"rw"}>
                    <CommentHandler
                        id={_id} me={me}
                        fetcher={pictures.comments.get}
                        poster={pictures.comments.post}
                        remover={pictures.comments.del} />
                </div>}
            </div>

        </CardFooter> }
    </Card>);
};
export default PictureCard;