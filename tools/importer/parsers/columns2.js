/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct .ft-main-item children (columns)
  const columns = Array.from(element.querySelectorAll(':scope > .ft-main-item'));
  // If no columns found, fallback to all direct children
  const cells = columns.length > 0 ? columns : Array.from(element.children);

  // Table header row must match block name exactly
  const headerRow = ['Columns (columns2)'];

  // Table body row: each column's content as a cell
  const bodyRow = cells.map((col) => {
    // If the column contains a single ul, use that ul
    const ul = col.querySelector(':scope > ul');
    if (ul) {
      return ul;
    }
    // If the column contains a single ul inside a div, use that ul
    const divUl = col.querySelector('div > ul');
    if (divUl) {
      return divUl;
    }
    // If the column contains a single p, use that p
    const p = col.querySelector(':scope > ul > li > p');
    if (p) {
      // If there is a button/link after the p, include both
      const li = p.closest('li');
      const nextLi = li && li.nextElementSibling;
      if (nextLi && nextLi.querySelector('a.button')) {
        // Create a fragment with both p and button
        const frag = document.createDocumentFragment();
        frag.appendChild(p.cloneNode(true));
        frag.appendChild(nextLi.querySelector('a.button').cloneNode(true));
        return frag;
      }
      return p;
    }
    // Fallback: use the column itself
    return col;
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
