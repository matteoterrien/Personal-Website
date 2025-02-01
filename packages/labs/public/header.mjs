import { toHtmlElement } from "./toHtmlElement.mjs";

const navLinks = [
  { href: "/packages/labs/public/index.html", text: "Home" },
  { href: "/packages/labs/public/portfolio.html", text: "Portfolio" },
  {
    href: "/packages/labs/public/files/Matteo Terrien Resume.pdf",
    text: "Resume",
  },
];

let navHtml = "<nav>";
navLinks.forEach((link) => {
  navHtml += `<a href="${link.href}">${link.text}</a>`;
});
navHtml += "</nav>";

const header = toHtmlElement(`
  <header>
    <h1 class='name_title'>Matteo Terrien</h1>
    ${navHtml}
  </header>
`);

window.addEventListener("load", () => {
  console.log("Hello");
  const body = document.querySelector("body");
  body.prepend(header);

  document.querySelectorAll("nav a").forEach((link) => {
    if (link.href === window.location.href) {
      link.style.borderBottom = "4px solid var(--color-accent)";
    } else {
      link.style.borderBottom = "1px solid var(--color-accent)";
    }
  });
});
