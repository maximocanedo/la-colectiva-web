'use strict';

import { u } from "../utils";

export enum VoteType {
    UP = 1,
    DOWN = -1,
    NONE = 0
}

export interface VoteStatus {
    up: number;
    down: number;
    userVote: VoteType;
}

const NO_VOTES_FETCHED: VoteStatus = { up: 0, down: 0, userVote: VoteType.NONE };

const vote = async (type: VoteType, pre: string): Promise<VoteStatus> => {
    const isUp = type === VoteType.UP,
          isNone = type === VoteType.NONE;
    const call = await u[isNone ? "del" : "post"](`${pre}/vote/${(isUp&&"up")||"down"}vote`, {});
    if(call === null) return NO_VOTES_FETCHED;
    const data = await call.json();
    return (call.ok && data) || NO_VOTES_FETCHED;
};
export const getVotes = async (pre: string): Promise<VoteStatus> => {
    const call = await u.get(`${pre}/vote`);
    if(call === null) return NO_VOTES_FETCHED;
    const data = await call.json();
    return (call.ok && data) || NO_VOTES_FETCHED;
};
export const upvote = async (pre: string): Promise<VoteStatus> => await vote(VoteType.UP, pre);
export const downvote = async (pre: string): Promise<VoteStatus> => await vote(VoteType.DOWN, pre);