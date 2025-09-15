/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns23)'];

  // Find the color-wrapper div (the actual content container)
  const colorWrapper = element.querySelector('.color-wrapper');
  if (!colorWrapper) return;

  // Only include columns if they have meaningful content
  const columns = Array.from(colorWrapper.children)
    .filter(child => (child.classList.contains('gradient-left-side') || child.classList.contains('gradient-right-side')));

  // If there are no columns, still create the block with empty columns (to ensure DOM is modified)
  if (columns.length === 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ['','']
    ], document);
    element.replaceWith(table);
    return;
  }

  // For each column, if it has content, clone it; otherwise, use an empty string
  const columnsRow = columns.map(col => {
    if (col.textContent.trim() || col.children.length > 0) {
      return col.cloneNode(true);
    }
    return '';
  });

  // If all columns are empty, still output empty columns (to ensure DOM is modified)
  if (columnsRow.every(cell => cell === '')) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      Array(columns.length).fill('')
    ], document);
    element.replaceWith(table);
    return;
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
