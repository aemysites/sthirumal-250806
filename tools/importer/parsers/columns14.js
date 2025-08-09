/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  // Get all immediate children of the grid, these are the columns
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // The header row should be a single cell, even if there are multiple columns in the content row
  // This ensures [[header], [col1, col2]] structure
  const headerRow = ['Columns (columns14)'];
  const contentRow = columns;
  
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
