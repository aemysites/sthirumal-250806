/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all immediate child divs (each column)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Each column's content is the entire child div (preserves formatting and structure)
  const columnsRow = columnDivs.map((colDiv) => colDiv);

  // Build the table rows
  const cells = [
    ['Columns (columns24)'], // Header row as required
    columnsRow,              // Second row: each column as a cell
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
