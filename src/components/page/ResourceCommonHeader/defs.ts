import {VoteStatus} from "../../../data/models/vote";
import {TabData} from "../../basic/TabHandler/defs";
import {Myself} from "../definitions";

export interface IResourceCommonHeaderProps {
    voteFeature: {
        get(id: string): Promise<VoteStatus>;
        downvote(id: string): Promise<VoteStatus>;
        upvote(id: string): Promise<VoteStatus>;
    };
    title: string;
    tabs: TabData[];
    onTabSelect(id: string): void;
    tab: string;
    me: Myself;
    id: string;
}