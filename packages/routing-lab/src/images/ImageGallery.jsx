import { Link } from "react-router";
import "./ImageGallery.css";

export function ImageGallery(props) {
  const imageElements = props.fetchedImages.map((image) => (
    <div key={image.id} className="ImageGallery-photo-container">
      <Link to={"/images/" + image.key}>
        <img src={image.src} alt={image.name} />
      </Link>
    </div>
  ));
  return (
    <div>
      <h2>Image Gallery</h2>
      {props.isLoading && "Loading..."}
      <nav>
        <div className="ImageGallery">{imageElements}</div>
      </nav>
    </div>
  );
}
