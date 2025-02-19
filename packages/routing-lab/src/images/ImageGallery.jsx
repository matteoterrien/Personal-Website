import { MainLayout } from "../MainLayout.jsx";
import { useImageFetching } from "./useImageFetching.js";
import "./ImageGallery.css";

export function ImageGallery() {
    const { isLoading, fetchedImages } = useImageFetching("");

    const imageElements = fetchedImages.map((image) => (
        <div key={image.id} className="ImageGallery-photo-container">
            <a href={"/images/" + image.id}>
                <img src={image.src} alt={image.name}/>
            </a>
        </div>
    ));
    return (
        <MainLayout>
            <h2>Image Gallery</h2>
            {isLoading && "Loading..."}
            <div className="ImageGallery">
                {imageElements}
            </div>
        </MainLayout>
    );
}
