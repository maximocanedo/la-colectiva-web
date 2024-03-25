type AnyElement = React.JSX.Element | React.JSX.Element[] | string | number | null | undefined | any;
export interface IScreenProps {
    title: string;
    description: AnyElement;
    icon?: AnyElement;
}