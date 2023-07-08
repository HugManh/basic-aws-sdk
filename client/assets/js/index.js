const base_url = "http://localhost:3000";

upload = async () => {
  try {
    const file = document.getElementById("uploadFiles").files[0];
    const spinner = document.getElementById("spinner");
    const done = document.getElementById("done");
    done.setAttribute("hidden", "");
    console.log("File: ", file);

    const url = await fetch(`${base_url}/s3/generate/${file.name}`).then(
      (res) => res.json()
    );
    spinner.removeAttribute("hidden");

    // console.log(url);
    /* Upload object to storage by url*/
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    }).then((res) => {
      console.log(res);
      spinner.setAttribute("hidden", "");

      setTimeout(() => {
        done.removeAttribute("hidden");
      }, 20);
    });

    const imageURL = url.split("?")[0];

    console.log(imageURL);
    const img = new Image(100, 200);
    img.src = imageURL;
    document.body.appendChild(img);
    console.log(`Upload success: ` + file.name);
  } catch (error) {
    console.log(error.message);
  }
};

// video = async () => {
//   return await axios
//     .get(
//       "http://localhost:9000/gets3/down/ZBrush-to-Photoshop-Timelapse-'Ryuk'-Concept.mp4"
//     )
//     .then((response) => {
//       console.log(response.headers["content-type"]);
//       return `data:${response.headers["content-type"].toLowerCase()},`;
//     });
// };
