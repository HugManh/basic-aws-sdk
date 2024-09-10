import "../../styles/gallery.css";

export const ListImage = ({ images }) => {


  return (
    <div className="gallery">
      {console.log(images.length)}
      {images.map((data) => {
        return (
          <div className="pics" key={data.id}>
            <img src={data.url} alt={data.name} className="gallery_img" />
          </div>
        );
      })
      }
    </div>
  );
}

