import React, {ReactNode, useState} from "react";
import EnterpriseSelector from "../components/enterprise/EnterpriseSelector";
import {IEnterprise} from "../data/models/enterprise";
import RegionSelector from "../components/region/RegionSelector";
import {IRegion} from "../data/models/region";
import PlaceSelector from "../components/maps/PlaceSelector";
import {Link} from "@fluentui/react-components";
import BoatSelector from "../components/boat/BoatSelector";
import {IBoat} from "../data/models/boat";
const HomePage = (): React.JSX.Element => {

    const [ coords, setCoords ] = useState<[number, number]>([-34.6037316, -58.3816109])
    const [ boat, setBoat ] = useState<IBoat | null>(null);
    return (<div className={"page-content flex-down"}>
        <br/>

        <BoatSelector selected={boat} onSelect={setBoat} />

        <br/><br/><br/>

        <Link href={"/docks"}>Docks</Link>
    </div>)
}
export default HomePage;