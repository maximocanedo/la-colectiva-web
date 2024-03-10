
export interface IEnterprisePhoneItemProps {
    id: string;
    phone: string;
    deletable: boolean;
    onDeleted(phones: string[]): void;
}