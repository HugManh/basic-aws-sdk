import React, { useEffect, useState } from 'react'
import './styles/app.css'
import * as api from './api';
import { Editor } from './components/Editor'
import { ListImage, UploadImage } from './components/Image'

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getListImage();
  }, []);

  const getListImage = async () => {
    try {
      const data = await api.getListImage("bizflydev")
      console.log(data);
      setImages(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          margin: "0px 100px",
          flexDirection: "column",
        }}
      >
        <Editor />
        <h1>Image Upload</h1>
        {/* Component upload hình ảnh */}
        <UploadImage />

        {/* Component hiển thị danh sách hình ảnh */}
        <ListImage images={images} />
      </div>
    </div>
  )
}

export default App
