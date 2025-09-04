/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate .text children (each is a column)
  const columns = Array.from(element.querySelectorAll(':scope > .text'));

  // Table header row must match block name exactly
  const headerRow = ['Columns (columns24)'];
  // Table content row: reference each .text div directly (preserves all content and formatting)
  const contentRow = columns;

  // Compose table data
  const tableData = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
