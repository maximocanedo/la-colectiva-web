import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {IAvailabilityItemProps} from "./defs";
import {useStyles} from "./styles";
import {Button, Card, mergeClasses} from "@fluentui/react-components";
import UserLink from "../../user/UserLink";
import {IUser} from "../../../data/models/user";
import {CheckmarkCircle24Filled, CheckmarkCircleFilled, DeleteFilled, SubtractCircle24Filled, SubtractCircleFilled} from "@fluentui/react-icons";
import { availabilities, avv } from "../../../data/actions/path";
import {CommonResponse} from "../../../data/utils";
import VoteManager from "../../basic/VoteManager";
import {tcn} from "../AvailabilityHandler/defs";

const LANG_PATH: string = "components.AvailabilityItem";
const strings = {};
const AvailabilityItem = ({ me, _id, available, condition, active, user, uploadDate, editable }: IAvailabilityItemProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const styles = useStyles();
    const [ status, setStatus ] = useState<boolean>(active?? true);

    const del = (): void => {
        availabilities.del(_id)
            .then((response: CommonResponse): void => {
                setStatus(false);
            })
            .catch(err => {
                console.error(err);
            })
            .finally((): void => {})
    };
    if(!status) return <></>;
    return (<Card appearance={"outline"} className={mergeClasses(styles.root, "av_item")}>
        <div className="a">
            {!available ? <SubtractCircle24Filled className={styles.err} /> : <CheckmarkCircle24Filled className={styles.ok} />}
        </div>
        <div className="b">
            <div className="t">{translate(tcn(condition))}</div>
            <div className="u">{ translate("selons") + " "} <UserLink data={user?? null} from={(user as IUser).username?? "0"} /></div>
            { editable && <div className="ac">
                <Button
                    appearance={"secondary"}
                    icon={<DeleteFilled/>}
                    onClick={() => del()}
                    iconPosition={"before"}
                >{translate("actions.delete")}</Button>
            </div>}
        </div>
        <div className="c">
            <VoteManager me={me} id={_id} fetcher={avv.get} upvoter={avv.upvote} downvoter={avv.downvote} />
        </div>
    </Card>);
};
export default AvailabilityItem;