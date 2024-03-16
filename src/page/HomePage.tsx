import React, {ReactNode, useState} from "react";
import EnterpriseSelector from "../components/enterprise/EnterpriseSelector";
import {IEnterprise} from "../data/models/enterprise";
import RegionSelector from "../components/region/RegionSelector";
import {IRegion} from "../data/models/region";
import PlaceSelector from "../components/maps/PlaceSelector";
import {Link} from "@fluentui/react-components";
const HomePage = (): React.JSX.Element => {

    const [ coords, setCoords ] = useState<[number, number]>([-34.6037316, -58.3816109])

    return (<div className={"page-content flex-down"}>
        <Link href={"/docks"}>Docks</Link>
    </div>)
}
export default HomePage;