import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IPictureHandlerProps} from "./defs";
import {IPictureDetails} from "../../../data/models/picture";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";
import PictureCard from "../PictureCard";
import PicturePoster from "../PicturePoster";
import {LoadState, log} from "../../page/definitions";
import LoadTriggerButton from "../../basic/buttons/LoadTriggerButton";

const LANG_PATH: string = "";
const strings = {};
const ADD = "ADD";
const REMOVE = "REMOVE";
const CLEAR = "CLEAR";
const POST: string = "POST";
const picsReducer = (state: IPictureDetails[], {type, payload}: { type: string, payload: IPictureDetails }): IPictureDetails[] => {

    const exists = (obj: IPictureDetails): boolean => state.some(x => x._id === obj._id);
    switch(type) {
        case ADD:
            if(exists(payload)) return [ ...state ];
            else return [ ...state, payload ];
        case POST:
            console.log({payload});
            if(exists(payload)) return [ ...state ];
            else {
                const ns = [ ...state ];
                ns.unshift(payload);
                return ns;
            }
        case REMOVE:
            if(exists(payload)) return state.filter(x => x._id !== payload._id);
            else return [ ...state ];
        case CLEAR:
            return [];
        default:
            return [ ...state ];
    }
};
const PictureHandler = ({fetcher, id, poster, me, remover, sendReport}: IPictureHandlerProps): React.JSX.Element => {
    log("PictureHandler");
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ page, setPage ] = useState<number>(0);
    const size: number = 3;
    const [ loadState, setLoadState ] = useState<LoadState>("initial");
    const [ pics, dispatchPics ] = useReducer(picsReducer, []);

    const canPost: boolean = me !== undefined && me !== null && me.active && me.role >= 2;
    const isAdmin: boolean = me !== undefined && me !== null && me.active && me.role === 3;
    const fetchPictures = (): void => {
        setLoadState("loading");
        fetcher(id, { p: page, itemsPerPage: size })
            .then((pics: IPictureDetails[]): void => {
                pics.map(payload => dispatchPics({type: ADD, payload}));
                if(pics.length === size) {
                    setPage(page + 1);
                    setLoadState("loaded");
                } else setLoadState("no-data");
            })
            .catch(err => {
                console.error(err);
                setLoadState("err");
            });
    };
    useEffect(() => {
        fetchPictures();
    }, []);


    return (<div>
        { canPost && <PicturePoster poster={poster}  onPost={data => dispatchPics({type: POST, payload: data})} me={me} id={id} /> }
        <br/>
        { pics.map(pic => <>
            <PictureCard
                docId={id}
                sendReport={sendReport}
                deletable={isAdmin || (me !== null && me._id === pic.user._id && me.active && me.role >= 2)}
                remover={remover}
                onDelete={(): void => dispatchPics({ type: REMOVE, payload: pic })}
                key={"picCard-" + pic._id} me={me} {...pic} /><br /></>) }
        <LoadTriggerButton onClick={fetchPictures} state={loadState} />
    </div>);
};
export default PictureHandler;