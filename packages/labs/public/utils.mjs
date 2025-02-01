/**
 * Clones the *contents* of a template element (not the template element itself) into a shadow DOM attached to
 * shadowHost.
 *
 * @param {HTMLElement} shadowHost - the HTML element to attach the shadow DOM to
 * @param {HTMLTemplateElement} template - an <template> element whose contents will be cloned into the shadow tree
 * @return {ShadowRoot} the root node of the shadow tree
 */
export function attachShadow(shadowHost, template) {
  const shadow = shadowHost.attachShadow({ mode: "open" });
  shadow.append(template.content.cloneNode(true));
  return shadow;
}

const PARSER = new DOMParser();

/**
 * Takes an HTML string and returns an DocumentFragment object containing HTML element objects.  If the input has a
 * single root element like "<div><p>child</p></div>", you can access it via fragment.firstElementChild.  Otherwise, if
 * it's multiple elements like "<li>item1</li><li>item2</li>" you can access them via fragment.children.
 *
 * @param {string} htmlString - a string of some HTML
 * @return {DocumentFragment} - DocumentFragment object containing HTML elements
 */
export function toHtml(htmlString) {
  const doc = PARSER.parseFromString(htmlString, "text/html");
  const collection = doc.head.childElementCount
    ? doc.head.children
    : doc.body.children;
  const fragment = new DocumentFragment();

  fragment.replaceChildren(...collection);
  return fragment;
}
