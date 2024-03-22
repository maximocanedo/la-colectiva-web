import React, {ReactElement, useEffect, useRef, useState} from "react";
import "./App.css";
import "./styles/styles.css";
import {
	BrandVariants,
	createDarkTheme,
	createLightTheme,
	FluentProvider, shorthands, Theme,
	Toaster, tokens,
	useId,
	useToastController,
	webDarkTheme,
	webLightTheme
} from "@fluentui/react-components";
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
import BoatAdd from "./page/boats/BoatAdd";
import DockPage from "./page/docks/DockPage";
import DockAdd from "./page/docks/DockAdd";
import DockExplore from "./page/docks/DockExplore";
import PathCreate from "./page/paths/PathCreate";
import PathPage from "./page/paths/PathPage";
import PathSearch from "./page/paths/PathSearch";
import PathMap from "./page/paths/PathMap";
import Next from "./page/Next";
import {RecordCategory} from "./data/actions/reports";
import ReportDialog from "./components/basic/ReportDialog";
import Reports from "./page/Reports";
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
	root: {
		backgroundColor: tokens.colorNeutralBackground2
	},
});
function isDarkModeEnabled(): boolean {
	return ('matchMedia' in window && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
const colectiva: BrandVariants = {
	10: "#010307",
	20: "#08182A",
	30: "#002848",
	40: "#00345B",
	50: "#00406F",
	60: "#004D84",
	70: "#005B99",
	80: "#0069AF",
	90: "#0077C6",
	100: "#0085DD",
	110: "#1B94F1",
	120: "#3CA2FF",
	130: "#6AB0FF",
	140: "#8BBDFF",
	150: "#A8CBFF",
	160: "#C2DAFF"
};

const lightTheme: Theme = {
	...createLightTheme(colectiva),
};

const darkTheme: Theme = {
	...createDarkTheme(colectiva),
};


darkTheme.colorBrandForeground1 = colectiva[110];
darkTheme.colorBrandForeground2 = colectiva[120];

function App(): ReactElement {
	const styles = useStyles();
	const [ me, loadActualUser ] = useState<Myself>(null);
	const [ reportedId, setReportedId ] = useState<string>("");
	const [ reportedCat, setReportedCat ] = useState<RecordCategory>("other");
	const [ reporting, setReportingState ] = useState<boolean>(false);

	const logout = (): void => {
		localStorage.removeItem("la-colectiva-token");
		loadActualUser(null);
	};
	const sendReport = (id: string, category: RecordCategory): void => {
		setReportedId(id);
		setReportedCat(category);
		setReportingState(true);
	}

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
		me,
		sendReport
	};


	return (
		<Router>
			<I18nextProvider i18n={i18n}>
				<FluentProvider className={styles.root} theme={isDarkModeEnabled() ? darkTheme : lightTheme}>
					<div className="root-background"></div>
					<Header me={me} toasterId={toasterId} />
					<main>
						<Routes>
							<Route path={"/"} element={<HomePage />} />
							<Route path={"/signup"} element={<SignUpPage {...pageProps}  />} />
							<Route path={"/login"} element={<LoginPage {...pageProps} />} />
							<Route path={"/users/:username"} element={<UserProfile {...pageProps} />} />
							<Route path={"/regions/add"} element={<RegionAdd {...pageProps} />} />
							<Route path={"/regions/:id"} element={<RegionPage {...pageProps} />} />
							<Route path={"/regions"} element={<RegionSearch {...pageProps} />} />
							<Route path={"/enterprises/add"} element={<EnterpriseAdd {...pageProps} />} />
							<Route path={"/enterprises/:id"} element={<EnterprisePage {...pageProps} />} />
							<Route path={"/enterprises"} element={<EnterpriseSearch {...pageProps} />} />
							<Route path={"/boats/add"} element={<BoatAdd {...pageProps} />} />
							<Route path={"/boats/:id"} element={<BoatPage {...pageProps} />} />
							<Route path={"/boats"} element={<BoatSearchPage {...pageProps} />} />
							<Route path={"/docks/add"} element={<DockAdd {...pageProps} />} />
							<Route path={"/docks/:id"} element={<DockPage {...pageProps} />} />
							<Route path={"/docks"} element={<DockExplore {...pageProps} />} />
							<Route path={"/paths/add"} element={<PathCreate {...pageProps} />} />
							<Route path={"/paths/:id/map"} element={<PathMap {...pageProps} />} />
							<Route path={"/paths/:id"} element={<PathPage {...pageProps} />} />
							<Route path={"/paths/"} element={<PathSearch {...pageProps} />} />
							<Route path={"/next/from/:from/to/:to"} element={<Next {...pageProps} />} />
							<Route path={"/reports/"} element={<Reports {...pageProps} />} />
							<Route path={"*"} element={NotFoundPage} />
						</Routes>
					</main>
					<Toaster toasterId={toasterId} />
					<Footer me={me} logout={logout} />
					<ReportDialog id={reportedId} open={reporting} type={reportedCat} close={(): void => setReportingState(false)} />

				</FluentProvider>
			</I18nextProvider>
		</Router>

	);
}

export default App;
