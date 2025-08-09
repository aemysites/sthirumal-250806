/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid that contains all the columns for the footer
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return; // edge case: no grid, nothing to do

  // Get all the main columns (direct children of grid)
  const columns = Array.from(grid.children);
  if (columns.length === 0) return; // edge case: no columns

  // The header row must be a single cell, matching the markdown example
  // (even if there are multiple columns)
  const headerRow = ['Columns (columns9)'];

  // The second row will have one cell per column block found
  const secondRow = columns;

  // Compose the table: header (single cell), then the columns row
  const cells = [headerRow, secondRow];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // The table header should span all columns. Since createTable does not
  // handle colspan, add it manually after creating the table.
  if (table && table.rows.length > 0 && table.rows[0].cells.length === 1) {
    table.rows[0].cells[0].setAttribute('colspan', columns.length);
  }

  // Replace the original element with the new block table
  element.replaceWith(table);
}
