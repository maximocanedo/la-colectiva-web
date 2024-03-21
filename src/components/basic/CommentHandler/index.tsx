import {ICommentHandlerProps} from "./defs";
import React, {useEffect, useReducer, useState} from "react";
import {StateManager} from "../../../page/SignUpPage/defs";
import {IComment, ICommentFetchResponse} from "../../../data/models/comment";
import Comment from "../Comment";
import {IUserMinimal} from "../Comment/defs";
import {Button, Spinner, Textarea, useId} from "@fluentui/react-components";
import {Send24Filled} from "@fluentui/react-icons";
import {useTranslation} from "react-i18next";
import LoadMoreButton from "../buttons/LoadMoreButton";
import {LoadState, log} from "../../page/definitions";
import LoadTriggerButton from "../buttons/LoadTriggerButton";

const commentsReducer = (state: IComment[], action: { type: string, payload: IComment | string }): IComment[] => {
    switch(action.type) {
        case "ADD":
            const newComment = action.payload as IComment;
            // Verificar si el comentario ya existe en el estado
            const existingCommentIndex = state.findIndex(comment => comment._id === newComment._id);
            if (existingCommentIndex !== -1) {
                // Si el comentario ya existe, actualízalo en lugar de agregarlo nuevamente
                const newState = [...state];
                newState[existingCommentIndex] = newComment;
                return newState;
            } else {
                // Si el comentario no existe, agrégalo al estado
                return [ ...state, newComment ];
            }
        case "REMOVE":
            return state.filter((comment: IComment): boolean =>  comment._id !== action.payload as string);
        case "UPDATE":
            return state.map((comment: IComment): IComment =>
                comment._id === (action.payload as IComment)._id ? { ...(action.payload as IComment) } : comment
            );
        default:
            return [ ...state ];
    }
};


const CommentHandler = ({ id, fetcher, remover, poster, me, sendReport }: ICommentHandlerProps): React.JSX.Element => {
    log("CommentHandler");
    const LANG_PATH = "components.comments.handler";
    const handlerId: string = useId("commentHandler");
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);

    const [ page, setPage ]: StateManager<number> = useState<number>(0);
    const size: number = 4;
    const [ draft, setDraft ]: StateManager<string> = useState<string>("");
    const [ posting, setPostingState ]: StateManager<boolean> = useState<boolean>(false);
    const [ downloading, setDownloadingState ]: StateManager<boolean> = useState<boolean>(false);
    const [ loadState, setLoadState ] = useState<LoadState>("initial");
    const [ comments, dispatchComments ] = useReducer(commentsReducer, []);

    const contentValid: boolean = draft.trim().length > 0;

    const nextPage = page + 1;
    const add = (comment: IComment) => dispatchComments({ type: "ADD", payload: comment });
    const rem = (_id: string) => dispatchComments({ type: "REMOVE", payload: _id });
    const upd = (comment: IComment) => dispatchComments({ type: "UPDATE", payload: comment });

    const canCreate: boolean = me !== undefined && me !== null && (me.role?? 0) > 0;

    const fetchComments = (): void => {
        setLoadState("loading");
        fetcher(id, { p: page, itemsPerPage: size })
            .then((arr: IComment[]): void => {
                arr.map((co: IComment) => add(co));
                if(arr.length === size) {
                    setPage(page + 1);
                    setLoadState("loaded");
                } else {
                    setLoadState("no-data");
                }
            }).catch(err => {
                console.error(err);
                setLoadState("err");
        });
    };
    useEffect(() => {
        fetchComments();
    }, []);

    const more = (): void => {
        fetchComments();
    };
    const publish = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setPostingState(true);
        poster(id, draft)
            .then((response: ICommentFetchResponse): void => {
                const comment: IComment = (response as any).comment[0];
                add(comment);
                setDraft("");
            }).catch(err => {}).finally((): void => {
                setPostingState(false);
        });
    };

    return <div className={"commentHandler"}>
        {
            comments.length === 0 && <center>
                <b>{t("err.noComments.title")}</b>
                <br/>
                <p>{t("err.noComments.description")}</p>
            </center>
        }
        <div className="commentGroup">
            { comments.map((c: IComment) => (<Comment sendReport={sendReport} __v={c.__v} key={c._id} handlerId={handlerId} parentId={id} id={c._id} me={me} author={c.user as IUserMinimal} remover={remover} content={c.content} uploaded={new Date(c.uploadDate)} />)) }
            <LoadTriggerButton state={loadState} onClick={more} />
        </div>
        {canCreate && <div  className="comments_createBox">
                <Textarea
                    disabled={posting}
                    className="cbx_textarea"
                    placeholder={t("textarea.placeholder")}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)} />
            <Button
                onClick={publish}
                disabled={!contentValid || posting}
                appearance={"primary"}
                icon={posting ? <Spinner size={"extra-tiny"}/> : <Send24Filled/>}
            />
        </div>}
    </div>;
};
export default CommentHandler;