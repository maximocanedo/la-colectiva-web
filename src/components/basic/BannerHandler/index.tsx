import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {BannerData, IBannerHandlerProps} from "./defs";
import {useStyles} from "./styles";
import {
    MessageBar,
    MessageBarBody,
    MessageBarTitle,
    useId,
    Link,
    Button,
    MessageBarActions
} from "@fluentui/react-components";
import {DismissRegular} from "@fluentui/react-icons";

const LANG_PATH: string = "components.BannerHandler";
const strings = {};
const BannerHandler = ({ data }: IBannerHandlerProps): React.JSX.Element => {
    const {t: translate} = useTranslation();
    const t = (key: string): string => translate(LANG_PATH + "." + key);
    const id: string = useId();
    const styles = useStyles();
    const [ active, setActive ] = useState<boolean>(true);
    if(data === null || !active) return <></>;
    const dismiss = (): void => setActive(false);
    return (<div className={styles.container}>
        { data.map((banner: BannerData) => banner === null ? null : (<MessageBar layout={"multiline"} key={id} intent={banner.intent}>
            <MessageBarBody>
                <MessageBarTitle>{banner.title}</MessageBarTitle>
                { banner.description?? "" }
                { (banner.links?? []).map(link =>
                    <Link href={link.link}>{link.label}</Link>) }
            </MessageBarBody>
            <MessageBarActions
                containerAction={
                    (banner.dismissible?? true) ? <Button onClick={dismiss} appearance="transparent" icon={<DismissRegular />} /> : null
                }>{ (banner.actions??[])
                    .map(action =>
                        <Button onClick={action.onClick}>{action.label}</Button>) }
            </MessageBarActions>
        </MessageBar>))}
    </div>);
};
export default BannerHandler;