'use strict';

export default class UserPage {
    constructor(data) {
        this.getData = () => data;
    }
    static async load(username){
        const APIURL = "https://colectiva.com.ar:5050/users/" + username;
        const req = await fetch(APIURL, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': "application/json"
            }
        });
        if(req.ok) {
            const data = await req.json();
            return new UserPage(data);
        }
        return new UserPage({});
    }
    homepage() {
        
    }
    render() {

    }
}