/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists and has children
  if (!element || !element.children || element.children.length === 0) return;

  // Header row for the block
  const headerRow = ['Columns (columns2)'];

  // Get all immediate column items (should be 4 for this block)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div.ft-main-item'));

  // Defensive: If no columns found, fallback to all direct children
  const columns = columnDivs.length > 0 ? columnDivs : Array.from(element.children);

  // For each column, collect its content
  const contentRow = columns.map((col) => {
    // Defensive: If the column is empty, return an empty string
    if (!col || !col.childNodes || col.childNodes.length === 0) return '';
    // Use the entire column block as the cell content for resilience
    return col;
  });

  // Build the table data
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
