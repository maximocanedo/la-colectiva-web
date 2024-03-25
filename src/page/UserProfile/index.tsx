import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import * as users from "../../data/actions/user";
import {IUser} from "../../data/models/user";
import {
    Avatar,
    Persona,
    SelectTabData,
    SelectTabEvent,
    Tab,
    TabList,
    TabValue,
    ToastIntent
} from "@fluentui/react-components";
import RoleSelector from "../../components/user/user-page/RoleSelector";
import EmailSection from "../../components/user/user-page/EmailSection";
import BioSection from "../../components/user/user-page/BioSection";
import NameSection from "../../components/user/user-page/NameSection";
import BirthSection from "../../components/user/user-page/BirthSection";
import {useTranslation} from "react-i18next";
import PasswordSection from "../../components/user/user-page/PasswordSection";
import ActiveSection from "../../components/user/user-page/ActiveSection";
import {UserProfileProps} from "./defs";
import NotFound from "../err/NotFound";

const LANG_PATH: string = "pages.UserProfile";
const UserProfile = (props: UserProfileProps): React.JSX.Element => {
    const username: string = useParams<{ username: string }>().username as string;
    const { t: translationService } = useTranslation();
    const { me, sendToast }: UserProfileProps = props;
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const [user, setUser] = useState<IUser | null>(null);
    const [ loaded, setLoaded ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");
    const [ tab, setTab ] = useState<TabValue>("personal");
    useEffect((): void => {
        users.findByUsername(username as string)
            .then((response: IUser): void => {
                setUser(response);
                setName(response.name);
            })
            .catch((error): void => {
                console.error(error);
            });
        setLoaded(true);
    }, [ username ]);

    const notify = (title: string, intent: ToastIntent, body?: string) => sendToast({title, intent, body});

    if (!loaded) {
        return (
            <div>Loading...</div>
        );
    }

    if (user === null) {
        return <NotFound />;
    }

    const onTabChange = (_e: SelectTabEvent, data: SelectTabData): void => {
        setTab(data.value);
    };
    const canModify: boolean = (me !== null) && me.active && (me.role === 3 || (me._id === user._id));
    const itsMe: boolean = (me !== null) && me.active && (me._id === user._id);
    return (<div className={"page-content flex-down"}>
        <div className="flex-down">
            <Persona
                textPosition="below"
                name={name}
                size={"huge"}
                avatar={<Avatar name={name} />}
                secondaryText={"@" + user.username}
            />
        </div>
        <TabList className={""} defaultSelectedValue={tab} onTabSelect={onTabChange}>
            <Tab value="personal">{t('tabs.personal')}</Tab>
            {itsMe && <Tab value="actions">{t('tabs.more')}</Tab> }
        </TabList>
        { tab === "personal" && <div className={"tab-cnt flex-down"}>
            <NameSection user={user} me={me} onChange={(newName: string): void => setName(newName)} />
            <BioSection user={user} me={me} />
            <RoleSelector user={user} me={me} />
            <BirthSection user={user} me={me} />
            <EmailSection user={user} me={me} />
        </div> }
        { tab === "actions" && <div className={"tab-cnt flex-down"}>
            <PasswordSection user={user} me={me} />
            <ActiveSection user={user} me={me} notify={notify} />
        </div>}
    </div>);
};

export default UserProfile;