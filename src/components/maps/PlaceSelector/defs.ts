export interface IPlaceSelectorProps {
    value: [ number, number ];
    onChange(value: [ number, number ]): void;
}


export function formatLon(longitud: number): string {
    if (longitud < -180 || longitud > 180) return "";
    const direccion: string = longitud >= 0 ? 'E' : 'O';
    const grados = Math.abs(Math.trunc(longitud));
    const minutos = Math.abs(Math.trunc((longitud % 1) * 60));
    const segundos = Math.abs(((longitud % 1) * 60 - minutos) * 60);
    return `${grados}° ${minutos}' ${segundos.toFixed(2)}" ${direccion}`;
}
export function formatLat(latitud: number): string {
    if (latitud < -90 || latitud > 90) return "";
    const direccion = latitud >= 0 ? 'N' : 'S';
    const grados = Math.abs(Math.trunc(latitud));
    const minutos = Math.abs(Math.trunc((latitud % 1) * 60));
    const segundos = Math.abs(((latitud % 1) * 60 - minutos) * 60);
    return `${grados}° ${minutos}' ${segundos.toFixed(2)}" ${direccion}`;
}