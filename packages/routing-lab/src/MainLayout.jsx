import { Header } from "./Header.jsx";

export function MainLayout(props) {
    return (
        <div>
            <Header />
            <div style={{padding: "0 2em"}}>
                {props.children}
            </div>
        </div>
    );
}
