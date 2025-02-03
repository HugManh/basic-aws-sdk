import "../../styles/gallery.css";

export const ListImage = ({ images }) => {
  return (
    <div className="image-gallery">
      {console.log(images.length)}
      {images.map((data) => {
        return (
          <div key={data.id} className="image-card">
            <img src={data.url} alt={data.name} className="gallery_img" />
          </div>
        );
      })
      }
    </div>
  );
}

