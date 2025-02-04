import { attachShadow } from "./utils.mjs";

const navLinks = [
  { href: "/packages/labs/public/index.html", text: "Home" },
  { href: "/packages/labs/public/portfolio.html", text: "Portfolio" },
  {
    href: "/packages/labs/public/files/Matteo Terrien Resume.pdf",
    text: "Resume",
  },
];

let navHtml = "<nav id='links'>";
navLinks.forEach((link) => {
  navHtml += `<a href="${link.href}">${link.text}</a>`;
});
navHtml += "</nav>";

// Create template for the header
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <header>
    <div id='mobile-header'>
      <h1 class='name_title'>Matteo Terrien</h1>
      <div id='mobile'>
        <label id='darkmode'>
          <input type="checkbox" autocomplete="off"/>
            Dark mode
        </label>
        <button id='menu'>Menu</button>
      </div>
    </div>
    ${navHtml}
  </header>
  <style>
    header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: var(--color-primary-background);
      min-height: 3.5rem;
      border-bottom: 2px solid black;
      padding-inline: 2rem;
      align-items: center;
    }

    button {
      display: none;
      height: 2rem;
      width: 4rem;
      color: var(--color-accent);
      align-self: center;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    nav a {
      text-decoration: none;
      color: var(--color-accent);
    }

    nav a.active {
      border-bottom: 4px solid var(--color-accent);
      margin-bottom: -0.1rem;
    }

    label {
      margin-bottom: 0.15rem;
      margin-right: 1rem;
    }

    #mobile-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    #mobile {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    @media (max-width: 40rem) {
      header {
        display: flex;
        flex-direction: column;
      }

      #mobile-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-self: flex-start;
      }

      #mobile {
        width: 55%;
        justify-content: flex-end;
      }

      nav {
        display: none;
      }
        
      button {
        display: block;
      }

      nav.open {
        display: flex;
        flex-direction: column;
        align-self: start;
        align-items: start;
        margin-bottom: 1rem;
      }

      nav.close {
        display: none;
      }
    }
  </style>
`;

// Classic NavBar Look
class CustomHeader extends HTMLElement {
  constructor() {
    super();
    attachShadow(this, TEMPLATE);
    this.highlightCurrentLink();
    this.checkForDarkMode();
  }

  connectedCallback() {
    this.highlightCurrentLink();
    this.setupMenuToggle();
    this.darkModeToggle();
  }

  highlightCurrentLink() {
    const links = this.shadowRoot.querySelectorAll("nav a");
    links.forEach((link) => {
      if (link.href === window.location.href) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  setupMenuToggle() {
    const menuButton = this.shadowRoot.querySelector("#menu");
    const links = this.shadowRoot.querySelector("#links");

    menuButton.addEventListener("click", () => {
      if (links.classList.contains("open")) {
        links.classList.remove("open");
      } else {
        links.classList.add("open");
      }
    });

    document.body.addEventListener("click", (event) => {
      const isClickInsideMenu = this.contains(event.target);

      if (!isClickInsideMenu) {
        links.classList.remove("open");
      }
    });
  }

  darkModeToggle() {
    const darkMode = this.shadowRoot.querySelector("#darkmode");

    darkMode.addEventListener("change", () => {
      if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "false");
      } else {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "true");
      }
    });
  }

  checkForDarkMode() {
    const darkMode = this.shadowRoot.querySelector("#darkmode input");

    const isDarkMode = localStorage.getItem("darkMode") === "true";

    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      darkMode.checked = true;
    } else {
      document.body.classList.remove("dark-mode");
      darkMode.checked = false;
    }
  }
}

customElements.define("custom-header", CustomHeader);
