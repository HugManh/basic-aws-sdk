const base_url = "http://localhost:8000";

upload = async () => {
  try {
    const file = document.getElementById("uploadFiles").files[0];
    const spinner = document.getElementById("spinner");
    const done = document.getElementById("done");
    done.setAttribute("hidden", "");
    console.log("File: ", file);

    const resp = await fetch(`${base_url}/api/bizfly-live/${file.name}`, { method: "POST" }).then(
      (res) => res.json()
    );
    spinner.removeAttribute("hidden");
    console.log(resp);

    /* Upload object to storage by url*/
    await fetch(resp.url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    }).then((res) => {
      console.log(res.status);
      if (res.status === 200) {
        spinner.setAttribute("hidden", "");
        done.removeAttribute("hidden");
      } else {
        spinner.setAttribute("hidden", "");
        fail.removeAttribute("hidden");
      }

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
