import { Button, Spin, Upload, message } from "antd"
import "antd/dist/reset.css"
import './App.css';
import axios from "axios";
import { useEffect, useState } from "react";
import './gallery.css'

function App() {

  const [allImage, setAllImage] = useState()
  const [image, setImage] = useState()
  const [show, setShow] = useState(false)

  useEffect(() => {
    getImage()
  }, [])

  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:3000/api/v1/images")
      setAllImage(result.data.data)
    } catch (error) {
      console.log(error);

    }
  }


  const uploadImage = async options => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    fmData.append("file", file);
    console.log("file: ", file);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bizfly-live/" + file.name,
        fmData,
      );

      console.log("Data Response: ", res.data);
      const res2 = await axios.put(
        res.data.url,
        file,
        // {
        //   headers: {
        //     "Content-Type": file.type
        //   }
        // }
      );
      onSuccess("Ok");
      console.log(res2.data);
      // setImage(res.data.data.file_url)
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  return (
    <div style={{
      display: "block",
      margin: "0 100px",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "20vh",
      }}>
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
              if (status === 'uploading') {
                console.log('uploading: ', file)
              }

              if (status === 'done') {
                message.success(`${file.file.name} file uploaded successfully.`);
                getImage()
              } else if (status === 'error') {
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
              return <Spin></Spin>
            }}
            progress={{
              size: "small",
              strokeColor: {
                "0%": "#f0f",
                "100%": "#ff0"
              },
              style: { top: 12 }
            }}
          >
            {/* Drag files here OR */}
            {/* <br /> */}
            {/* <Button>Click Upload</Button> */}
            {console.log(image)}
            {image ?
              (<img src={image} style={{ height: '100%', width: '100%', padding: "5px" }} />) :
              (<Button>Click Upload</Button>)}
          </Upload>
        </div>
      </div >
      <div className="gallery">
        {allImage == null
          ? ""
          : allImage.map((data, index) => {
            return (
              <div className="pics" key={index}>
                <img src={data.url} alt={data.name} style={{ width: '100%' }} />
              </div>
            )
          })}
      </div>
    </div>
  );
}

export default App;