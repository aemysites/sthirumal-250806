/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element is a container with columns
  if (!element || !element.classList.contains('ft-main')) return;

  // Header row for the block
  const headerRow = ['Columns (columns2)'];

  // Get all direct column children
  const columns = Array.from(element.querySelectorAll(':scope > .ft-main-item'));

  // Defensive: skip if no columns found
  if (!columns.length) return;

  // Second row: each cell is a column's content
  // For resilience, include the whole column block (not just the ul)
  const contentRow = columns.map(col => col);

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
