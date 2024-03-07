import React, {ReactElement} from "react";
import "./App.css";
import "./styles/styles.css";
import {FluentProvider, Toaster, useId, webLightTheme} from "@fluentui/react-components";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App(): ReactElement {
	const toasterId: string = useId("toaster");
	return (
		<Router>
			<I18nextProvider i18n={i18n}>
				<FluentProvider theme={webLightTheme}>
					<Header toasterId={toasterId} />
					<main>
						<Routes>
							<Route path={"/"} element={HomePage} />
							<Route path={"/signup"} element={<SignUpPage toasterId={toasterId}  />} />
							<Route path={"/login"} element={<LoginPage toasterId={toasterId} />} />
							<Route path={"/users/:username"} element={<UserProfile toasterId={toasterId} />} />
							<Route path={"/regions/:id"} element={<RegionPage toasterId={toasterId} />} />
							<Route path={"/regions"} element={<RegionSearch toasterId={toasterId} />} />
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
