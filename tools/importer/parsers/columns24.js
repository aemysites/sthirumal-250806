/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the columns block
  const headerRow = ['Columns (columns24)'];

  // Get all immediate children with class 'text' (each column)
  const columnDivs = Array.from(element.querySelectorAll(':scope > .text'));

  // Defensive: fallback if structure changes
  if (!columnDivs.length) {
    // fallback: treat the element itself as a single column
    columnDivs.push(element);
  }

  // Second row: each cell is a column, containing the respective .text div
  const columnsRow = columnDivs.map(col => col);

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
