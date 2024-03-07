import {VoteManagerProps} from "./defs";
import React, {useEffect, useState} from "react";
import {StateManager} from "../../../page/SignUpPage/defs";
import {VoteStatus, VoteType} from "../../../data/models/vote";
import {Button, ToggleButton} from "@fluentui/react-components";
import {ArrowDown16Filled, ArrowUp16Filled, ArrowDown16Regular, ArrowUp16Regular} from "@fluentui/react-icons";


const VoteManager = ({ me, id, fetcher, upvoter, downvoter }: VoteManagerProps): React.JSX.Element => {
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
        upvoter(id)
            .then((status: VoteStatus): void => {
                updateUpvotes(status.up);
                updateDownvotes(status.down);
                updateMyVote(status.userVote);
            })
            .catch((err): void => {
                console.error(err);
            });
    };
    const downvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        downvoter(id)
            .then((status: VoteStatus): void => {
                updateUpvotes(status.up);
                updateDownvotes(status.down);
                updateMyVote(status.userVote);
            })
            .catch((err): void => {
                console.error(err);
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