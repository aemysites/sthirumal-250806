/* global WebImporter */
export default function parse(element, { document }) {
  // Always use a header row with exactly one column
  const headerRow = ['Columns (columns3)'];

  // Collect all .text columns as cell content for the second row
  const columns = Array.from(element.querySelectorAll(':scope > .text'));

  // The table must have a single header cell, then a row with N columns
  const cells = [
    headerRow,
    columns.map(col => col)
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
