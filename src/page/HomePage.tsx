import React, {ReactNode, useState} from "react";
import EnterpriseSelector from "../components/enterprise/EnterpriseSelector";
import {IEnterprise} from "../data/models/enterprise";
const HomePage = (): React.JSX.Element => {

    const [ enterprise, setEnterprise ] = useState<IEnterprise>({
        "_id": "659b2198d7c57b99f8498643",
        "name": "Interislander",
        "cuit": 20455556665
    });

    return (<div>
        <EnterpriseSelector selected={enterprise} onSelect={x => setEnterprise(x)} />
        <br/><br/>
        <span>Selected: {enterprise.name}</span>
    </div>)
}
export default HomePage;