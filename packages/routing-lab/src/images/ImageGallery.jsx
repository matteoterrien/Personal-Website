import { Link } from "react-router";
import "./ImageGallery.css";
import { ImageUploadForm } from "./ImageUploadForm";

export function ImageGallery(props) {
  const imageElements = props.fetchedImages.map((image, index) => (
    <div key={image._id || index} className="ImageGallery-photo-container">
      <Link to={"/images/" + image._id}>
        <img src={image.src} alt={image.name} />
      </Link>
    </div>
  ));

  return (
    <div>
      <h2>Image Gallery</h2>
      <h3>Upload a new image</h3>
      <ImageUploadForm authToken={props.authToken} />

      {props.isLoading && "Loading..."}
      <nav>
        <div className="ImageGallery">{imageElements}</div>
      </nav>
    </div>
  );
}
