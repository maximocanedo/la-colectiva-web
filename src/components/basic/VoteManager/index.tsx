import {VoteManagerProps} from "./defs";
import React, {useEffect, useState} from "react";
import {StateManager} from "../../../page/SignUpPage/defs";
import {VoteStatus, VoteType} from "../../../data/models/vote";
import {ToggleButton} from "@fluentui/react-components";
import {ArrowDown16Filled, ArrowDown16Regular, ArrowUp16Filled, ArrowUp16Regular} from "@fluentui/react-icons";
import {log} from "../../page/definitions";


const VoteManager = ({ me, id, fetcher, upvoter, downvoter }: VoteManagerProps): React.JSX.Element => {
    log("VoteManager");
    const [ upvotes, updateUpvotes ]: StateManager<number> = useState<number>(0);
    const [ downvotes, updateDownvotes ]: StateManager<number> = useState<number>(0);
    const [ mine, updateMyVote ]: StateManager<VoteType> = useState<VoteType>(VoteType.NONE);
    const [ total, setTotal ]: StateManager<number> = useState<number>(0);
    useEffect((): void => {
        setTotal(upvotes - downvotes);
    }, [upvotes, downvotes]);

    useEffect(() => {
        fetcher(id)
            .then((status: VoteStatus): void => {
                updateUpvotes(status.up);
                updateDownvotes(status.down);
                updateMyVote(status.userVote);
            })
            .catch((err): void => {
                console.error(err);
            });
    }, [ fetcher, id ]);

    const upvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const oldAction: VoteType = mine;
        const oldVotes: number = upvotes;
        updateUpvotes(oldAction === VoteType.UP ? ( upvotes - 1 ) : (upvotes + 1));
        if(oldAction === VoteType.DOWN) updateDownvotes(downvotes - 1);
        updateMyVote(oldAction === VoteType.UP ? VoteType.NONE : VoteType.UP);
        upvoter(id)
            .then((status: VoteStatus): void => {
                updateUpvotes(status.up);
                updateDownvotes(status.down);
                updateMyVote(status.userVote);
            })
            .catch((err): void => {
                console.error(err);
                updateUpvotes(oldVotes);
                updateMyVote(oldAction);

            });
    };
    const downvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const oldAction: VoteType = mine;
        const oldVotes: number = downvotes;
        updateDownvotes(oldAction === VoteType.DOWN ? ( downvotes - 1 ) : (downvotes + 1));
        if(oldAction === VoteType.UP) updateUpvotes(upvotes - 1);
        updateMyVote(oldAction === VoteType.DOWN ? VoteType.NONE : VoteType.DOWN);
        downvoter(id)
            .then((status: VoteStatus): void => {
                updateUpvotes(status.up);
                updateDownvotes(status.down);
                updateMyVote(status.userVote);
            })
            .catch((err): void => {
                console.error(err);
                updateUpvotes(oldVotes);
                updateMyVote(oldAction);
            });
    };

    return (<div className="voter">
        <ToggleButton
            icon={mine === VoteType.UP ? <ArrowUp16Filled /> : <ArrowUp16Regular />}
            shape={"circular"}
            size={"small"}
            appearance={"transparent"}
            checked={mine === VoteType.UP}
            onClick={upvote} />
        <div className="total-votes">{total}</div>
        <ToggleButton
            icon={mine === VoteType.DOWN ? <ArrowDown16Filled /> : <ArrowDown16Regular />}
            shape={"circular"}
            size={"small"}
            appearance={"transparent"}
            checked={mine === VoteType.DOWN}
            onClick={downvote} />
    </div>)
};
export default VoteManager;