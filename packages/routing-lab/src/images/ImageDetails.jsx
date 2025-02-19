import { MainLayout } from "../MainLayout.jsx";
import { useImageFetching } from "./useImageFetching.js";

export function ImageDetails(props) {
    const { isLoading, fetchedImages } = useImageFetching(props.imageId, 500);
    if (isLoading) {
        return <MainLayout>Loading...</MainLayout>;
    }
    const imageData = fetchedImages[0];
    if (!imageData) {
        return <MainLayout><h2>Image not found</h2></MainLayout>;
    }

    return (
        <MainLayout>
            <h2>{imageData.name}</h2>
            <img className="ImageDetails-img" src={imageData.src} alt={imageData.name} />
        </MainLayout>
    )
}
