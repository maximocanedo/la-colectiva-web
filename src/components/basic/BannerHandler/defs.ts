export type BannerData = {
    intent: "error" | "warning" | "success" | "info";
    title: string;
    description?: string;
    links?: { label: string, link: string }[],
    actions?: { label: string, onClick(): void }[],
    dismissible?: boolean;
} | null
export interface IBannerHandlerProps {
    data: BannerData[];
}