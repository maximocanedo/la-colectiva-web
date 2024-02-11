import React, {ReactElement} from "react";
import "./App.css";
import "./styles/styles.css";
import {FluentProvider, webLightTheme} from "@fluentui/react-components";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/basic/Header";
import Footer from "./components/basic/Footer";
import HomePage from "./page/HomePage";
import UserProfile from "./page/UserProfile";
import NotFoundPage from "./page/NotFoundPage";
import SignUpPage from "./page/SignUpPage";

function App(): ReactElement {
	return (
		<Router>
			<FluentProvider theme={webLightTheme}>
				<Header />
				<main>
					<Routes>
						<Route path={"/"} element={HomePage} />
						<Route path={"/signup"} element={<SignUpPage />} />
						<Route path={"/users/:username"} element={<UserProfile />} />
						<Route path={"*"} element={NotFoundPage} />
					</Routes>
				</main>
				<Footer />
			</FluentProvider>
		</Router>

	);
}

export default App;
