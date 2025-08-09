/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs (columns)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));
  
  // Create the header row as a single-cell row (matches the example)
  const headerRow = ['Columns (columns4)'];
  // Create the content row with each column's div as a cell
  const contentRow = columnDivs;

  // Compose the table data
  const cells = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
