import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {compressImage, IPicturePosterProps} from "./defs";
import {
    Body1,
    Button, Caption1,
    Card,
    CardFooter,
    CardHeader,
    CardPreview,
    Field,
    Spinner,
    Textarea, Tooltip
} from "@fluentui/react-components";
import {ArrowSyncFilled, ArrowUploadFilled, DeleteRegular, ImageAddFilled, SendCopyFilled} from "@fluentui/react-icons";
import {UserLogged} from "../../../App";
import {OnPostResponse} from "../../../data/actions/picture";
import {u} from "../../../data/utils";

const LANG_PATH: string = "components.pics.poster";
const strings = {
    actions: {
        cancel: "actions.cancel",
        post: "actions.post",
        submit: "actions.submit",
        upload: "actions.upload",
        change: "actions.change"
    },
    st: {
        noImage: "st.noImage",
        draft: "st.draft",
        chNi: "st.chNi",
        uploading: "st.uploading",
        publishing: "st.publishing",
        publishingDes: "st.publishingDes"
    },
    label: {
        description: "label.description"
    }
};
const PicturePoster = ({me, id, poster, onPost}: IPicturePosterProps): React.JSX.Element => {
    const { t: translate } = useTranslation();
    const t = (key: string): string => translate(`${LANG_PATH}.${key}`);
    const [ image, setImage ] = useState<Blob>();
    const [ loadingCacheImage, setCacheImageLoadingState ] = useState<boolean>(false);
    const [ description, setDescription ] = useState<string>("");
    const [ uploading, setUploadingState ] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const selectedFile = fileList[0];
            try {
                const compressedImage = await compressImage(selectedFile, 5 * 1024 * 1024); // 5MB
                setImage(compressedImage);
            } catch (error) {
                console.error('Error al comprimir la imagen:', error);
                // Manejar el error, por ejemplo, mostrar un mensaje al usuario
            }
        }
    };
    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    const url: string = image === undefined ? "" : URL.createObjectURL(image);

    const cardHeaderPrimaryText: string = uploading ? t(strings.st.publishing) : (image !== undefined ? (me as UserLogged).name : t(strings.st.chNi));


    const primaryTextBtn: string = (loadingCacheImage ? t(strings.st.uploading)
        : (image === undefined ? t(strings.actions.upload) : t(strings.actions.change)));

    const cancel = (): void => {
        setDescription("");
        setImage(undefined);
    };
    const publish = (): void => {
        if(image === undefined) return;
        if(me === null) return;
        setUploadingState(true);
        poster(id, image, description)
            .then((response: OnPostResponse): void => {
                console.log({_id: response.id});
                if(response.success) {
                    onPost({
                        _id: response.id,
                        user: me,
                        url: u.baseUrl + "photos/" + response.id,
                        description,
                        validations: 0,
                        invalidations: 0,
                        uploadDate: new Date(Date.now()).toISOString()
                    });
                    cancel();
                    console.log("Subido con éxito!!!");
                }
            })
            .catch(err => console.error(err))
            .finally((): void => {
                setUploadingState(false);
            });
    };

    const button = {
        upload: (
            <Button
                onClick={handleClick}
                appearance={image === undefined ? "primary" : "secondary"}
                disabled={loadingCacheImage}
                icon={loadingCacheImage ? <Spinner size={"extra-tiny"}/> : (image === undefined ?
                    <ArrowUploadFilled/> : <ArrowSyncFilled/>)}>
                {primaryTextBtn}
            </Button>
        ),
        publish: (<Button
            appearance={"primary"}
            iconPosition={"before"}
            onClick={() => publish()}
            icon={<SendCopyFilled/>}>{t(strings.actions.submit)}</Button>),
        cancel: (<Button
            onClick={() => cancel()}
            appearance={"secondary"}
            iconPosition={"before"}
            icon={<DeleteRegular />}>{t(strings.actions.cancel)}</Button>),
        start: (<Button
            appearance={"primary"}
            iconPosition={"before"}
            onClick={() => {}}
            icon={<ImageAddFilled/>}>{t(strings.actions.post)}</Button>)
    }


    return (<div className="poster">
        <input type={"file"} ref={inputRef} style={{display: "none"}} onChange={handleFileChange}/>
        {<Card appearance={"outline"}>
            <CardHeader
                header={<Body1><b>{cardHeaderPrimaryText}</b></Body1>}
                description={<Caption1>{uploading ? t(strings.st.publishingDes) : (image === undefined ? t(strings.st.noImage) : t(strings.st.draft))}</Caption1>}
                action={uploading ? <Spinner size={"small"} /> : (image === undefined ? button.upload : button.publish)}
            />
            <CardPreview style={{opacity: (uploading ? 0.7 : 1)}} logo={(image === undefined || uploading) ? null : (<div className={"fx-rw"}>{button.upload} {button.cancel}</div>)}>
                {image !== undefined && <img src={url} alt={description}/> }
            </CardPreview>
            {!uploading && image !== undefined && <CardFooter>
                <div className="pic_all">
                    <div className="rw">
                        <Field style={{width: "100%"}} label={t(strings.label.description)}>
                            <Textarea style={{width: "100%"}} value={description}
                                  onChange={(e) => setDescription(e.target.value)}></Textarea>
                        </Field>
                    </div>
                </div>
            </CardFooter>}
        </Card>}
    </div>);
};
export default PicturePoster;