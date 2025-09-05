/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a .col-... element
  function extractCard(col) {
    // Get the image (mandatory)
    const img = col.querySelector('img');

    // Get the title (mandatory, inside .lp__listnav_icon_cta_title > span:first-child)
    let title = '';
    const titleWrap = col.querySelector('.lp__listnav_icon_cta_title');
    if (titleWrap) {
      const spans = titleWrap.querySelectorAll('span');
      if (spans.length > 0) {
        title = spans[0].textContent.trim();
      }
    }
    // Create a heading element for the title
    const heading = document.createElement('strong');
    heading.textContent = title;

    // Get the description (inside .lp__listnav_icon_cta_bottom > p)
    let desc = '';
    const descP = col.querySelector('.lp__listnav_icon_cta_bottom p');
    if (descP) {
      desc = descP.textContent.trim();
    }
    // Create a paragraph for the description
    const descElem = document.createElement('p');
    descElem.textContent = desc;

    // Return [image, [title, description]]
    return [img, [heading, descElem]];
  }

  // Find all card columns (direct children of .row)
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = Array.from(row.children).filter((col) => col.className && col.className.match(/col-/));

  // Build the table rows
  const headerRow = ['Cards (cards30)'];
  const rows = cols.map(extractCard);

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
