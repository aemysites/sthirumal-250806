/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find all column wrappers (should be 3)
  const columns = Array.from(element.querySelectorAll(':scope .row > .col-lg-4'));
  if (!columns.length) return;

  // Each column: grab the full content block
  const columnCells = columns.map((col) => {
    // Defensive: find the main content wrapper inside each column
    const block = col.querySelector('.lp__listnav_icon_cta');
    // If not found, use the column itself
    return block || col;
  });

  // Table header row
  const headerRow = ['Columns (columns20)'];
  // Table content row: one cell per column
  const contentRow = columnCells;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
