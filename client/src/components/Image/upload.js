import { useState } from "react";
import { Button, Upload, message } from "antd";
import * as api from '../../api';
import '../../styles/button.css'

export const UploadImage = () => {
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    const upload = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;

        const fmData = new FormData();
        fmData.append("file", file);

        setLoading(true);
        try {
            const data = await api.uploadImage("bizflydev", fmData)
            const { url } = data
            setImage(url);
            onSuccess("Ok");
            message.success(`${file.name} uploaded successfully.`);
        } catch (err) {
            onError({ err });
            message.error(`${file.name} upload failed.`);
        } finally {
            setLoading(false);
        }
    };
    return (

        <Upload
            listType="picture-card"
            customRequest={upload}
            accept=".png,.jpeg,.jpg,.doc"
            showUploadList={false}
            className="upload-btn"
        >
            {
                image ? (
                    <img
                        alt=""
                        src={image}
                        style={{ height: "100%", width: "100%", padding: "5px" }}
                    />
                ) : (
                        <Button loading={loading}>Click Upload</Button>
                )
            }
        </Upload>

    )
}