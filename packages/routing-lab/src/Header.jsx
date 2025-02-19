import "./Header.css";

export function Header() {
    return (
        <header>
            <h1>My cool site</h1>
            <div>
                <label>
                    Some switch (dark mode?) <input type="checkbox" />
                </label>
                <nav>
                    <a href="/">Home</a>
                    <a href="/images">Image Gallery</a>
                    <a href="/account">Account</a>
                </nav>
            </div>
        </header>
    );
}
