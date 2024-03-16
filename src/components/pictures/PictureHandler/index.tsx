import React, {useEffect, useReducer, useState} from "react";
import {useTranslation} from "react-i18next";
import {IPictureHandlerProps} from "./defs";
import {IPictureDetails} from "../../../data/models/picture";
import LoadMoreButton from "../../basic/buttons/LoadMoreButton";
import PictureCard from "../PictureCard";
import PicturePoster from "../PicturePoster";
import {log} from "../../page/definitions";

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
const PictureHandler = ({fetcher, id, poster, me, remover}: IPictureHandlerProps): React.JSX.Element => {
    log("PictureHandler");
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ page, setPage ] = useState<number>(0);
    const [ size, setSize ] = useState<number>(3);
    const [ loading, setLoadingState ] = useState<boolean>(false);
    const [ pics, dispatchPics ] = useReducer(picsReducer, []);

    const canPost: boolean = me !== undefined && me !== null && me.active && me.role >= 2;
    const isAdmin: boolean = me !== undefined && me !== null && me.active && me.role === 3;
    const fetch = () => {
        setLoadingState(true);
        fetcher(id, { p: page, itemsPerPage: size })
            .then((pics: IPictureDetails[]): void => {
                pics.map(payload => dispatchPics({type: ADD, payload}));
            }).catch(err => console.error(err)).finally((): void => {
                setLoadingState(false);
        })
    };
    useEffect(() => {
        fetch();
    }, [ page ]);


    return (<div>
        { canPost && <PicturePoster poster={poster}  onPost={data => dispatchPics({type: POST, payload: data})} me={me} id={id} /> }
        <br/>
        { pics.map(pic => <>
            <PictureCard
                docId={id}
                deletable={isAdmin || (me !== null && me._id === pic.user._id && me.active && me.role >= 2)}
                remover={remover}
                onDelete={(): void => dispatchPics({ type: REMOVE, payload: pic })}
                key={"picCard-" + pic._id} me={me} {...pic} /><br /></>) }
        <LoadMoreButton loading={loading} onClick={() => setPage(page + 1)} />
    </div>);
};
export default PictureHandler;