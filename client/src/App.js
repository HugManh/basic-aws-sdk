import { Button, Spin, Upload, message } from "antd";
import "antd/dist/reset.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import "./gallery.css";

function App() {
  const [allImage, setAllImage] = useState([]);
  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    getImage();
  }, []);

  const getImage = async () => {
    try {
      const list = await axios.get("http://localhost:8000/api/ttcp-live-08600a97-525f-4c09-9bfe-6a158eacfcd3");
      const listUrl = list.data.data.map((it) => {
        return "http://localhost:8000/api/ttcp-live-08600a97-525f-4c09-9bfe-6a158eacfcd3/" + it.Key;
      });
      console.log("listUrl: ", listUrl);
      setAllImage(listUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    fmData.append("file", file);
    console.log("file: ", file);
    const id = nanoid();
    const key = id + "/" + file.name;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/ttcp-live-08600a97-525f-4c09-9bfe-6a158eacfcd3/" + key,
        fmData
      );

      console.log("[http] Get url: ", res.data);
      await axios.put(res.data.data, file, {
        headers: {
          "Content-Type": file.type,
        },
        mode: 'cors',
      }).catch(error => {
        console.error('Error:', error);
      });;
      onSuccess("Ok");
      console.log(
        "[http] Image: ",
        "http://localhost:8000/api/ttcp-live-08600a97-525f-4c09-9bfe-6a158eacfcd3/" + key
      );
      setImage("http://localhost:8000/api/ttcp-live-08600a97-525f-4c09-9bfe-6a158eacfcd3/" + key);
    } catch (err) {
      console.log("Error: ", err);
      onError({ err });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        margin: "0px 100px",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "600px",
          marginTop:"20px"
        }}
      >
        <video id="videoPlayer" style={{ width:"100%", padding: "5px" }} controls autoplay>
          <source
            src="http://localhost:8000/api/ttcp-live-08600a97-525f-4c09-9bfe-6a158eacfcd3/test/P . L . A . Y . L . I . S . T - - B U Ồ N . C H Ú T . T H Ô I . C Ó . S A O . Đ Â U - - Copy.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
        }}
      >
        <div>
          {/* <Button onClick={() => {
          !show ? setShow(true) : setShow(false)
        }}>{show ? 'Enabled' : 'Disabled'}</Button>
        <br /> */}
          <Upload
            multiple
            listType="picture-card"
            // action={"http://localhost:3000/api/v1/upload"}
            customRequest={uploadImage}
            showUploadList={!show ? false : { showRemoveIcon: true }}
            accept=".png,.jpeg,.jpg,.doc"
            beforeUpload={(file) => {
              // console.log({ file });
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
                getImage();
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
            {image ? (
              <img
                alt=""
                src={image}
                style={{ height: "100%", width: "100%", padding: "5px" }}
              />
            ) : (
              <Button>Click Upload</Button>
            )}
          </Upload>
        </div>
      </div>
      <div className="gallery">
        {allImage.length > 0
          ? allImage.map((data, index) => {
              return (
                <div className="pics" key={index}>
                  <img src={data} alt={data.name} className="gallery_img" />
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default App;
