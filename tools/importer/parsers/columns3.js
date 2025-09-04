/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure element exists
  if (!element || !element.querySelectorAll) return;

  // Header row: must be a single column
  const headerRow = ['Columns (columns3)'];

  // Get all immediate child columns (each .text block)
  const columns = Array.from(element.querySelectorAll(':scope > .text'));

  // Each cell should contain the full block of content for that column
  const cellsRow = [columns.map(col => {
    // Use the entire .eventdetail-text block for each column
    const inner = col.querySelector('.eventdetail-text');
    return inner ? inner.cloneNode(true) : col.cloneNode(true);
  })];

  // Build the table rows: header, then columns as a single row
  const tableRows = [headerRow, ...cellsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
