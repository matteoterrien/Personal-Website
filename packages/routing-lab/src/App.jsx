import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";

function App() {
    const POSSIBLE_PAGES = [
        <Homepage userName="John Doe" />,
        <AccountSettings />,
        <ImageGallery />,
        <ImageDetails imageId="0" />
    ]

    return POSSIBLE_PAGES[0];
}

export default App
