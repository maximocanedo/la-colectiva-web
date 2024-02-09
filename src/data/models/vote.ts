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
export const NO_VOTES_FETCHED: VoteStatus = { up: 0, down: 0, userVote: VoteType.NONE };