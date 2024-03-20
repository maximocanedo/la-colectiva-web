import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IResourceCommonHeaderProps} from "./defs";
import {useStyles} from "./styles";
import {Title3} from "@fluentui/react-components";
import VoteManager from "../../basic/VoteManager";
import * as regions from "../../../data/actions/region";
import TabHandler from "../../basic/TabHandler";

const LANG_PATH: string = "components.ResourceCommonHeader";
const strings = {};
const ResourceCommonHeader = ({ voteFeature, tabs, tab, onTabSelect, title, me, id }: IResourceCommonHeaderProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [isMobileScreen, setMobileScreenState] = useState<boolean>(window.innerWidth < 700);

    let eventApplied: boolean = false;
    (() => {
        if (eventApplied) return;
        window.addEventListener("resize", (y: UIEvent): void => {
            setMobileScreenState(window.innerWidth < 700);
        });
        eventApplied = true;
    })();

    return (<div className={"resource-page-header"}>
        <Title3>{title}</Title3>
        <VoteManager
            fetcher={voteFeature.get}
            upvoter={voteFeature.upvote}
            downvoter={voteFeature.downvote}
            {...{ me, id }} />
        <div className="resource-page-header--tabs">
            <TabHandler
                vertical={!isMobileScreen}
                minimumVisible={!isMobileScreen ? 3 : 2}
                {...{ tab, onTabSelect, tabs }}
            />
        </div>
    </div>);
};
export default ResourceCommonHeader;