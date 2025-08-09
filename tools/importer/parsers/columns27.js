/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout which contains the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Extract direct children of the grid as columns
  // The typical structure is: [content, image]
  const columns = Array.from(grid.children);
  // Defensive: require at least one column
  if (columns.length === 0) return;

  // Create the header row with exact required label
  const headerRow = ['Columns (columns27)'];

  // Place all columns in a single row for the block table
  const columnsRow = columns;

  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
