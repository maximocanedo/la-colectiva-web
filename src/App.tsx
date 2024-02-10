import React, {ReactElement} from "react";
import logo from "./logo.svg";
import "./App.css";
import * as user from "./data/actions/user";
import {ISignUpResponse, IUser, Role} from "./data/models/user";
import * as auth from "./data/auth";
import {CommonResponse} from "./data/utils";
import {disableMyself} from "./data/actions/user";
const login = (async (): Promise<void> => {
	localStorage.setItem("la-colectiva-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjU3YjE0ZjAxYTQ1NzE0ZmE3NmI1ZjNhIiwiaWF0IjoxNzA3NDkyODgzLCJleHAiOjE3MzkwNTA0ODN9.LbyE5WZV0zaRAB9y_DmTT5uAHfx2YOBYwt3bYvJcXP8");
});
const logout = () => localStorage.removeItem("la-colectiva-token");
const test = (async (): Promise<void> => {
	try {/*
		const x: ISignUpResponse = await user.create({
			name: "Max",
			username: "test123",
			bio: "Hallo",
			birth: new Date().toISOString(),
			password: "a42684627",
			email: "max@gmail.com"
		});*/
		//const y: CommonResponse = await auth.login({ username: "test123", password: "a42684627" });
		const y = await user.updateMyPassword("a42684627");
		//const y: CommonResponse = auth.logout();
		console.log(y);
	} catch(err) {
		console.error(err);
	}
});

function App(): ReactElement {
	return (
		<div className="App">
			<br/>
			<button onClick={test}>Test</button>
			<br/><br/><br/>
			<button onClick={login}>Iniciar sesión como @root</button>
			<br/>
			<br/>
			<button onClick={logout}>Cerrar sesión</button>
		</div>
	);
}

export default App;
