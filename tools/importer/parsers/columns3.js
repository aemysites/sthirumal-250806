/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout inside the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid (each is a column)
  const columns = Array.from(grid.children);

  // Defensive: If columns are missing, fill with empty columns for 3-column layout
  const expectedColumns = 2; // From the HTML provided, only two columns are present
  while (columns.length < expectedColumns) {
    const emptyDiv = document.createElement('div');
    columns.push(emptyDiv);
  }

  // Table header: block name with variant
  const headerRow = ['Columns (columns3)'];

  // Use the actual column elements as table cells, preserving all existing children and structure
  const contentRow = columns;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}