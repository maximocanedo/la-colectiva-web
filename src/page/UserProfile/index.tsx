import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import * as users from "../../data/actions/user";
import {IUser} from "../../data/models/user";
import {Avatar, Persona, SelectTabData, SelectTabEvent, Tab, TabList, TabValue} from "@fluentui/react-components";
import RoleSelector from "../../components/user/user-page/RoleSelector";
import EmailSection from "../../components/user/user-page/EmailSection";
import BioSection from "../../components/user/user-page/BioSection";
import NameSection from "../../components/user/user-page/NameSection";
import BirthSection from "../../components/user/user-page/BirthSection";
import {useTranslation} from "react-i18next";
import PasswordSection from "../../components/user/user-page/PasswordSection";
import ActiveSection from "../../components/user/user-page/ActiveSection";
import { DesignToken } from '@microsoft/fast-foundation';
const LANG_PATH: string = "pages.UserProfile";
const UserProfile = (): React.JSX.Element => {
    const username: string = useParams<{ username: string }>().username as string;
    const { t: translationService } = useTranslation();
    const t = (path: string): string => translationService(LANG_PATH + "." + path);
    const [user, setUser] = useState<IUser | null>(null);
    const [me, setMe] = useState<IUser | null>(null);
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
        users.myself()
            .then((response: IUser): void => {
                setMe(response);
            })
            .catch((error): void => {
                console.error(error);
                setMe(null);
            });
        setLoaded(true);
    }, []);

    if (!loaded) {
        return (
            <div>Loading...</div>
        );
    }

    if (user === null) {
        return (
            <Persona
                textPosition="below"
                name={"@" + username}
                size={"huge"}
                avatar={<Avatar name={""} />}
                secondaryText={t('err.notFound')}
            />
        );
    }

    const onTabChange = (_e: SelectTabEvent<HTMLElement>, data: SelectTabData): void => {
        setTab(data.value);
    };


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
            <Tab value="actions">{t('tabs.more')}</Tab>
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
            <ActiveSection user={user} me={me} />
        </div>}
    </div>);
};

export default UserProfile;