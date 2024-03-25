import React, {ReactNode, useState} from "react";
import EnterpriseSelector from "../components/enterprise/EnterpriseSelector";
import {IEnterprise} from "../data/models/enterprise";
import RegionSelector from "../components/region/RegionSelector";
import {IRegion} from "../data/models/region";
import PlaceSelector from "../components/maps/PlaceSelector";
import {Button, Link, makeStyles, mergeClasses, shorthands, tokens} from "@fluentui/react-components";
import BoatSelector from "../components/boat/BoatSelector";
import {IBoat} from "../data/models/boat";
import LightDockSelector from "../components/docks/LightDockSelector";
import {DockPropertyStatus} from "../data/models/dock";
import DockSelector from "../components/docks/DockSelector";
import {IDockMinimal} from "../data/actions/dock";
import TripSelector from "../components/docks/TripSelector";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles({
    mapHeaderContainer: {
        zIndex: 50,
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderBottom("1px", "solid", tokens.colorNeutralStroke1Pressed)
    }
});
const HomePage = (): React.JSX.Element => {
    const styles = useStyles();
    const navigate = useNavigate();
    const [ from, setFrom ] = useState<{ _id: string, name: string, status: DockPropertyStatus } | null>(null);
    const [ dest, setDestination ] = useState<{ _id: string, name: string, status: DockPropertyStatus } | null>(null);
    let i: number = 0;
    const handleDockSelect = (dock: IDockMinimal): void => {
        if(i % 2 === 0) setFrom(dock);
        else setDestination(dock);
        i++;
    };
    return (<div className={"page-content flex-down"}>
        <br/>
        <div  className={mergeClasses(styles.mapHeaderContainer, "map-header-container")}>
            <div className="map-header-subcontainer">
                <TripSelector from={from} dest={dest} onFromChange={setFrom} onDestinationChange={setDestination} />
                <div className="btns">
                    <Button
                        onClick={(): void => {
                            if(from === null || dest === null) return;
                            navigate("/next/from/"+from._id+"/to/"+dest._id);
                        }}
                        disabled={from === null || dest === null}
                        appearance={"primary"}>Continuar</Button>
                </div>
            </div>
        </div>
        {  <DockSelector onClick={handleDockSelect} />
        }
        <span>{from === null ? "No se seleccionó nada. " : from.name}</span>
        <br/><br/><br/><br/><br/><br/>
    </div>)
}
export default HomePage;