export function toHtmlElement(htmlString) {
    /**
     * Takes in an HTML string and returns an Element object representing that string.  Input must contain a single
     * root element; for instance, "<div><p>child</p></div>" is acceptable but not "<li>item1</li><li>item2</li>"
     *
     * @param {string} htmlString - a string of some HTML
     * @return {Element} - element object; root of the HTML subtree
     */
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstElementChild;
}
