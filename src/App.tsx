import React, {ReactElement, useEffect, useState} from "react";
import "./App.css";
import "./styles/styles.css";
import {FluentProvider, Toaster, useId, useToastController, webLightTheme} from "@fluentui/react-components";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from "./components/basic/Header";
import Footer from "./components/basic/Footer";
import HomePage from "./page/HomePage";
import UserProfile from "./page/UserProfile";
import RegionPage from "./page/RegionPage";
import NotFoundPage from "./page/NotFoundPage";
import SignUpPage from "./page/SignUpPage";
import i18n from "./lang";
import {I18nextProvider} from "react-i18next";
import LoginPage from "./page/LoginPage";
import RegionSearch from "./page/RegionSearch";
import RegionAdd from "./page/RegionAdd";
import * as users from "./data/actions/user";
import EnterprisePage from "./page/enterprises/EnterprisePage";
import EnterpriseSearch from "./page/enterprises/EnterpriseSearch";
import EnterpriseAdd from "./page/enterprises/EnterpriseAdd";
import BoatPage from "./page/boats/BoatPage";
import {ICommonPageProps, log, Myself, ToastSenderFunction, UserLogged} from "./components/page/definitions";
import {toastSender} from "./components/page/commons";
import BoatSearchPage from "./page/boats/BoatSearchPage";

function App(): ReactElement {
	log("App");
	const [ me, loadActualUser ] = useState<Myself>(null);
	useEffect((): void => {
		users.myself()
			.then((response: UserLogged): void => {
				loadActualUser(response);
			}).catch((_err: unknown): void => {});
	}, []);

	const toasterId: string = useId("toaster");
	const { dispatchToast } = useToastController(toasterId);
	const sendToast: ToastSenderFunction = toastSender(dispatchToast);

	const pageProps: ICommonPageProps = {
		sendToast,
		me
	};

	return (
		<Router>
			<I18nextProvider i18n={i18n}>
				<FluentProvider theme={webLightTheme}>
					<Header me={me} toasterId={toasterId} />
					<main>
						<Routes>
							<Route
								path={"/"}
								element={<HomePage />} />
							<Route path={"/signup"} element={<SignUpPage {...pageProps}  />} />
							<Route path={"/login"} element={<LoginPage {...pageProps} />} />
							<Route path={"/users/:username"} element={<UserProfile {...pageProps} />} />
							<Route path={"/regions/add"} element={<RegionAdd {...pageProps} />} />
							<Route path={"/regions/:id"} element={<RegionPage {...pageProps} />} />
							<Route path={"/regions"} element={<RegionSearch {...pageProps} />} />
							<Route path={"/enterprises/add"} element={<EnterpriseAdd {...pageProps} />} />
							<Route path={"/enterprises/:id"} element={<EnterprisePage {...pageProps} />} />
							<Route path={"/enterprises"} element={<EnterpriseSearch {...pageProps} />} />
							<Route path={"/boats/add"} element={NotFoundPage} />
							<Route path={"/boats/:id"} element={<BoatPage {...pageProps} />} />
							<Route path={"/boats"} element={<BoatSearchPage {...pageProps} />} />
							<Route path={"*"} element={NotFoundPage} />
						</Routes>
					</main>
					<Toaster toasterId={toasterId} />
					<Footer />
				</FluentProvider>
			</I18nextProvider>
		</Router>

	);
}

export default App;
