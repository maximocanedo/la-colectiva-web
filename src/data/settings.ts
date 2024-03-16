export type SettingKey =
    "report-components-rendering"
    | "count-components-rendering";
export const SettingDefaults: any = {
    /**
     * **Reportar renderizado de componentes**
     * Especifica si se reporta el renderizado de cada componente.
     * @values "on" | "off"
     */
    "report-components-rendering": "off",
    /**
     * **Contar renderizaciones.**
     * Especifica si se debe contar y guardar registro en `window.renders` la cantidad de renderizados de cada componente.
     * @values "on" | "off"
     */
    "count-components-rendering": "off"
};

export const get = (key: SettingKey): string => {
    const v: string | null = localStorage.getItem(key);
    if(v === null) {
        return SettingDefaults[key];
    } else return v;
};
export const set = (key: SettingKey, value: string) => localStorage.setItem(key, value);

(window as any).settings = {
    get,
    set,
    SettingDefaults
};