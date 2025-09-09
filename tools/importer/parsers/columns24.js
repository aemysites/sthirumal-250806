/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as per spec
  const headerRow = ['Columns (columns24)'];

  // Select all direct child .text columns
  const columnDivs = element.querySelectorAll(':scope > .text');

  // Defensive: If no columns found, do nothing
  if (!columnDivs.length) return;

  // Each column is a cell in the second row, referencing the actual element
  const columnsRow = Array.from(columnDivs);

  // Build the table rows
  const tableRows = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
