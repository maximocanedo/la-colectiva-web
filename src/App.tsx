import React, {ReactElement} from "react";
import logo from "./logo.svg";
import "./App.css";
import * as user from "./data/models/user";
import { IUser } from "./data/models/user";
import * as auth from "./data/auth";

(async (): Promise<void> => {
	// Two ways of finding a user by its username.
	// 1:
	console.log(1);

	user.findByUsername("root")
		.then((user: IUser): void => {
			console.log(user);
		})
		.catch((error: Error): void => {
			console.error(error);
		});

	// 2:
	console.log(2);

	try {
		const data: IUser = await user.findByUsername("root");
		console.log(data);
	} catch(error) {
		console.error(error);
	}

})();

function App(): ReactElement {
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
