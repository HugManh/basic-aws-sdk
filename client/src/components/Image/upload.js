import { useState } from "react";
import { Button, Spin, Upload, message } from "antd";
import * as api from '../../api';

export const UploadImage = () => {
    const [image, setImage] = useState("");
    const [show, setShow] = useState(false);

    const upload = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;

        const fmData = new FormData();
        fmData.append("file", file);
        console.log("file: ", file);
        try {
            const data = await api.uploadImage("bizflydev", fmData)
            const { url } = data
            setImage(url);
            onSuccess("Ok");
        } catch (err) {
            console.log("Error: ", err);
            onError({ err });
        }
    };
    return (
        <>
            {/* <Button onClick={() => {
          !show ? setShow(true) : setShow(false)
          }}>{show ? 'Enabled' : 'Disabled'}</Button>
          <br /> */}
            <Upload
                multiple
                listType="picture-card"
                // action={"http://localhost:3000/api/v1/upload"}
                customRequest={upload}
                showUploadList={!show ? false : { showRemoveIcon: true }
                }
                accept=".png,.jpeg,.jpg,.doc"
                beforeUpload={(file) => {
                    return true;
                }}
                onChange={(file) => {
                    const { status } = file.file;
                    if (status === "uploading") {
                        console.log("uploading: ", file);
                    }
                    if (status === "done") {
                        message.success(
                            `${file.file.name} file uploaded successfully.`
                        );
                    } else if (status === "error") {
                        message.error(`${file.file.name} file upload failed.`);
                    }
                }}
                // defaultFileList={[
                //   {
                //     uid: "abc",
                //     name: "abc",
                //     status: "uploading",
                //     percent: 50,
                //     url: "https://scontent.fhan4-2.fna.fbcdn.net/v/t39.30808-6/356086283_235223269290170_8780881540057273562_n.jpg?stp=dst-jpg_p526x296&_nc_cat=102&ccb=1-7&_nc_sid=730e14&_nc_ohc=xMonJAiP9WYAX8Khfc8&_nc_ht=scontent.fhan4-2.fna&oh=00_AfBT4t2IyU-4XqPiu2V0w7skORG-GpA4wnXgTmX2zBXQIQ&oe=64B7BF09"
                //   }
                // ]}
                iconRender={() => {
                    return <Spin></Spin>;
                }}
                progress={{
                    size: "small",
                    strokeColor: {
                        "0%": "#f0f",
                        "100%": "#ff0",
                    },
                    style: { top: 12 },
                }}
            >
                {/* Drag files here OR */}
                {/* <br /> */}
                {/* <Button>Click Upload</Button> */}
                {console.log(image)}
                {
                    image ? (
                        <img
                            alt=""
                            src={image}
                            style={{ height: "100%", width: "100%", padding: "5px" }}
                        />
                    ) : (
                        <Button>Click Upload</Button>
                    )
                }
            </Upload >
        </>
    )
}