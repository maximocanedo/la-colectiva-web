import React, {useState} from "react";
import {ICommentComponentProps, IUserMinimal} from "./defs";
import {
    Avatar,
    Menu,
    MenuItem,
    MenuTrigger,
    MenuPopover,
    MenuList,
    Button,
    Link,
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogContent,
    DialogBody,
    DialogActions,
    Textarea, useId
} from "@fluentui/react-components";
import UserLink from "../../user/UserLink";
import {useTranslation} from "react-i18next";
import {IUser} from "../../../data/models/user";
import * as comments from "../../../data/actions/comment";
import {IComment} from "../../../data/models/comment";
import {CommonResponse} from "../../../data/utils";
import {log} from "../../page/definitions";
export function getTimePassed(date: Date): [number, Intl.RelativeTimeFormatUnit] {
    const now = Date.now();
    const diff =  (now - date.getTime());
    if (diff < 60000) { // Menos de un minuto
        return [0, 'minutes'];
    } else if (diff < 3600000) { // Menos de una hora
        return [ 0 - Math.floor(diff / 60000), 'minutes'];
    } else if (diff < 86400000) { // Menos de un día
        return [ 0 - Math.floor(diff / 3600000), 'hours'];
    } else if (diff < 604800000) { // Menos de una semana
        return [ 0 - Math.floor(diff / 86400000), 'days'];
    } else if (diff < 2629746000) { // Menos de un mes (asumiendo un mes de 30.44 días)
        return [ 0 - Math.floor(diff / 604800000), 'weeks'];
    } else if (diff < 31556952000) { // Menos de un año (asumiendo un año de 365.24 días)
        return [ 0 - Math.floor(diff / 2629746000), 'months'];
    } else { // Más de un año
        return [ 0 - Math.floor(diff / 31556952000), 'years'];
    }
}
const Comment = ({ id, parentId, handlerId, __v: ver, content: c, author, me, uploaded, remover }: ICommentComponentProps): React.JSX.Element => {
    log("Comment");
    const LANG_PATH = "components.comments.comment";
    const commentComponentId: string = useId("Handler$" + handlerId + "_Comment$" + id);
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const [ content, setContent ] = useState<string>(c);
    const [ value, setValue ] = useState<string>(content);
    const [ showDeleteDialog, setDeleteDialogShowing ] = useState<boolean>(false);

    const lang: string = translationService("defLang");
    const rtf1 = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const [ time, unit ] = getTimePassed(uploaded);
    const [ deleted, setDeleted ] = useState<boolean>(false);
    const [ editing, setEditState ] = useState<boolean>(false);
    const [ edited, setEditedState ] = useState<boolean>(ver > 0);
    const f: string = (time === 0 && unit === "minutes") ? translationService("now") : rtf1.format(time, unit);

    const byMe: boolean = (me !== null && author._id === me._id);
    const canEdit: boolean = byMe;
    const canDelete: boolean = (me !== null) && (canEdit || me.role === 3);
    const showMenu: boolean = canEdit || canDelete;

    const edit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        comments.edit(id, value)
            .then((cm: IComment): void => {
                setContent(cm.content);
                setEditState(false);
                setEditedState(true);
            }).catch(err => {}).finally((): void => {

            });
    };
    const del = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        remover(parentId, id)
            .then((response: CommonResponse): void => {
                setDeleteDialogShowing(false);
                setDeleted(true);
            }).catch(err => console.error(err));
    };
    const closeEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setEditState(false);
        setValue(content);
    };

    if(deleted) return (<></>);
    return (
        <div id={commentComponentId} key={commentComponentId} className="comment">
            <div className="comment_start">
                <Avatar name={author.name} size={32} />
            </div>
            <div className="comment_content">
                <div className="comment_rw">
                    {!editing && <div><UserLink data={author} from={author.username}/> {content}</div> }
                    {editing && <>
                        <UserLink data={author} from={author.username} />
                        <div className="editingContainer">
                            <Textarea
                                value={value}
                                onChange={(e): void => setValue(e.target.value)}
                            />
                            <div className="horFlexEnd">
                                <Button
                                    disabled={content === value}
                                    appearance={"primary"}
                                    onClick={edit}>
                                    {t('edit.btnEdit')}
                                </Button>
                                <Button
                                    onClick={closeEditMode}
                                    appearance={(content === value) ? "primary" : "secondary"}>
                                    {(content === value) ? t("edit.btnClose") : t('edit.btnCancel')}
                                </Button>
                            </div>
                        </div>

                    </> }
                </div>
                <div className="act">{f + "   "}{edited ? "("+t("st.edited")+")   " : ""}{ showMenu && <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <Link>{t("menu.label")}</Link>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            { (canEdit && !editing) && <MenuItem onClick={(_e): void => setEditState(true)}>{t("menu.options.edit")}</MenuItem>}
                            { canDelete && <MenuItem onClick={(_e): void => setDeleteDialogShowing(true)}>{t("menu.options.delete")}</MenuItem>}
                        </MenuList>
                    </MenuPopover>
                </Menu>}</div>
                { canDelete && <Dialog open={showDeleteDialog} modalType="alert">
                    <DialogSurface>
                        <DialogBody>
                            <DialogTitle>{t("dialog.title")}</DialogTitle>
                            <DialogContent>
                                {t("dialog.description")}
                            </DialogContent>
                            <DialogActions>
                                <DialogTrigger disableButtonEnhancement>
                                    <Button onClick={(_e): void => setDeleteDialogShowing(false)} appearance="secondary">{t("edit.btnClose")}</Button>
                                </DialogTrigger>
                                <Button onClick={del} appearance="primary">{t("menu.options.delete")}</Button>
                            </DialogActions>
                        </DialogBody>
                    </DialogSurface>
                </Dialog>}
            </div>
        </div>
    );
};
export default Comment;