/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists
  if (!element) return;

  // Header row as specified
  const headerRow = ['Columns (columns24)'];

  // Find all immediate child columns
  // Each column is a .text div
  const columnDivs = Array.from(element.querySelectorAll(':scope > .text'));

  // Defensive: if no columns, do nothing
  if (!columnDivs.length) return;

  // Each cell in the second row is the full .text div (preserves bold, paragraphs, etc)
  const columnsRow = columnDivs.map(col => col);

  // Build the table data
  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
