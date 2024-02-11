import React, {ReactElement} from "react";
import "./App.css";
import {FluentProvider, webLightTheme} from "@fluentui/react-components";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/basic/Header";
import Footer from "./components/basic/Footer";
import HomePage from "./page/HomePage";
import UserProfile from "./page/UserProfile";
import NotFoundPage from "./page/NotFoundPage";

function App(): ReactElement {
	return (
		<Router>
			<FluentProvider theme={webLightTheme}>
				<Header />
				<Routes>
					<Route path={"/"} element={HomePage} />
					<Route path={"/users/:username"} element={<UserProfile />} />
					<Route path={"*"} element={NotFoundPage} />
				</Routes>
				<Footer />
			</FluentProvider>
		</Router>

	);
}

export default App;
