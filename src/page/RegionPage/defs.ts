import {makeStyles, tokens} from "@fluentui/react-components";

import {ICommonPageProps} from "../../components/page/definitions";

export interface RegionPageProps extends ICommonPageProps {}
export const RegionTypeLangPathNames = {
    river: "models.region.types.river",
    stream: "models.region.types.stream",
    brook: "models.region.types.brook",
    canal: "models.region.types.canal",
    lake: "models.region.types.lake",
    pond: "models.region.types.pond",
    lagoon: "models.region.types.lagoon",
    reservoir: "models.region.types.reservoir",
    swamp: "models.region.types.swamp",
    well: "models.region.types.well",
    aquifer: "models.region.types.aquifer",
    bay: "models.region.types.bay",
    gulf: "models.region.types.gulf",
    sea: "models.region.types.sea",
    ocean: "models.region.types.ocean"
};
export const getRegionTypeLangPathNameFor = (i: number): string => [
    RegionTypeLangPathNames.river,
    RegionTypeLangPathNames.stream,
    RegionTypeLangPathNames.brook,
    RegionTypeLangPathNames.canal,
    RegionTypeLangPathNames.lake,
    RegionTypeLangPathNames.pond,
    RegionTypeLangPathNames.lagoon,
    RegionTypeLangPathNames.reservoir,
    RegionTypeLangPathNames.swamp,
    RegionTypeLangPathNames.well,
    RegionTypeLangPathNames.aquifer,
    RegionTypeLangPathNames.bay,
    RegionTypeLangPathNames.gulf,
    RegionTypeLangPathNames.sea,
    RegionTypeLangPathNames.ocean
][i];
export interface RegionPageParams {
    id: string;
}

export const useStyles = makeStyles({
    disableBtn: {
        color: tokens.colorPaletteRedBackground3
    },
    enableBtn: {
        color: tokens.colorPaletteGreenBackground3
    }
});