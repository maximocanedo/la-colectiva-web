import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { User } from "./data/models/user";
import * as auth from "./data/auth";

(async () => {
	const user = await User.myself();
	console.log(user);
})();
function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
