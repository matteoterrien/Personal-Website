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
    <div id='mobile'>
      <h1 class='name_title'>Matteo Terrien</h1>
      <button id='menu'>Menu</button>
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
    }

    button {
      display: none;
      height: 3rem;
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
    }

    #mobile {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    @media (max-width: 40rem) {
      header {
        flex-direction: column;
      }
      nav {
        display: none;
        flex-direction: column;
        align-items: start;
        margin-bottom: 1rem;
      }
      button {
        display: block;
      }
      nav.open {
        display: flex;
      }
    }
  </style>
`;

// Classic NavBar Look
class CustomHeader extends HTMLElement {
  constructor() {
    super();
    attachShadow(this, TEMPLATE);
  }

  connectedCallback() {
    this.highlightCurrentLink();
    this.setupMenuToggle();
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
      links.classList.toggle("open");
    });
  }
}

customElements.define("custom-header", CustomHeader);
