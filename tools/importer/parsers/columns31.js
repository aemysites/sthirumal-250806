/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout container for columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all direct children of the grid, each is a column wrapper
  const columnElements = Array.from(grid.children);

  // For each column: group ALL child nodes into a fragment, to support grouping
  const columnsRow = columnElements.map(col => {
    // If the column has more than one child, group them as an array
    const grouped = [];
    for (const node of Array.from(col.childNodes)) {
      // Only push nodes with visible content
      if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
        grouped.push(node);
      }
    }
    if (grouped.length === 1) {
      return grouped[0];
    } else if (grouped.length > 1) {
      return grouped;
    } else {
      return '';
    }
  });
  const headerRow = ['Columns (columns31)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  element.replaceWith(table);
}
