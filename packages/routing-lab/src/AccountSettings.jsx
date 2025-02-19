import { MainLayout } from "./MainLayout.jsx";

export function AccountSettings(props) {
    return (
        <MainLayout>
            <h2>Account settings</h2>
            <label>
                Username <input />
            </label>
            <p><i>Changes are auto-saved.</i></p>
        </MainLayout>
    );
}
