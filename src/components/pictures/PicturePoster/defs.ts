import {CommonResponse} from "../../../data/utils";
import {IPictureDetails} from "../../../data/models/picture";
import {OnPostResponse} from "../../../data/actions/picture";

import {Myself} from "../../page/definitions";

export interface IPicturePosterProps {
    id: string;
    me: Myself;
    poster(id: string, image: Blob, description: string): Promise<OnPostResponse>;
    onPost(data: IPictureDetails): void;
}

export const compressImage = (file: Blob, maxSizeInBytes: number, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target!.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                const maxSize = Math.sqrt(maxSizeInBytes);
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Error al comprimir la imagen.'));
                    }
                }, 'image/jpeg', quality);
            };
        };
        reader.onerror = () => {
            reject(new Error('Error al leer el archivo de imagen.'));
        };
        reader.readAsDataURL(file);
    });
};