/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const columnDivs = Array.from(grid.children);
  // For each column, extract ALL content (not just images)
  const contentRow = columnDivs.map(colDiv => {
    // Drill down to the deepest div that isn't just a single div child
    let node = colDiv;
    while (
      node &&
      node.children.length === 1 &&
      node.firstElementChild.tagName === 'DIV'
    ) {
      node = node.firstElementChild;
    }
    // Get all child nodes that are elements or significant text
    const children = Array.from(node.childNodes).filter(
      n => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    );
    if (children.length === 0) return '';
    if (children.length === 1) return children[0];
    return children;
  });

  const headerRow = ['Columns (columns16)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
