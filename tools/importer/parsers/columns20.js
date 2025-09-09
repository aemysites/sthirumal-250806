/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all immediate column divs
  const colDivs = Array.from(row.children).filter(child => child.classList.contains('col-lg-4'));
  if (colDivs.length === 0) return;

  // For each column, extract the main content block
  const columnCells = colDivs.map(col => {
    // Defensive: Find the main content container
    const iconCta = col.querySelector('.lp__listnav_icon_cta');
    if (!iconCta) return document.createElement('div'); // fallback empty div
    return iconCta;
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
