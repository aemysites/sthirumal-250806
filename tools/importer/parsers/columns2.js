/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists
  if (!element) return;

  // Get all immediate children with class 'ft-main-item' (each is a column)
  const columns = Array.from(element.querySelectorAll(':scope > .ft-main-item'));

  // Defensive: if no columns found, do nothing
  if (!columns.length) return;

  // Table header row as specified
  const headerRow = ['Columns (columns2)'];

  // Second row: each column cell contains the entire ft-main-item div
  const contentRow = columns;

  // Compose table data
  const tableData = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
