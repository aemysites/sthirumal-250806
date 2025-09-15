/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all direct column divs
  const colDivs = Array.from(row.children).filter((child) => child.classList.contains('col-lg-4'));
  if (colDivs.length === 0) return;

  // For each column, extract its main content block
  const cells = colDivs.map((col) => {
    // The main content is inside .lp__listnav_icon_cta
    const block = col.querySelector('.lp__listnav_icon_cta');
    // Defensive: if not found, fallback to the column itself
    return block || col;
  });

  // Build the table rows
  const tableRows = [
    ['Columns (columns20)'], // Header row
    cells // Second row: one cell per column
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
