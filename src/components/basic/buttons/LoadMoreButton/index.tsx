import {LoadMoreButtonProps} from "./defs";
import React from "react";
import {Button, Spinner} from "@fluentui/react-components";
import {useTranslation} from "react-i18next";

const LoadMoreButton = ({ loading, onClick }: LoadMoreButtonProps): React.JSX.Element => {
    const { t } = useTranslation();
    return (<div className="loadMoreBtn">
        <Button appearance={"subtle"} icon={loading ? <Spinner size={"extra-tiny"}/> : <></>} iconPosition={"before"} onClick={(_e): void => onClick()}>
            {loading ? t("loading") : t("actions.loadMore")}
        </Button>
    </div>);
};
export default LoadMoreButton;