/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope .row > div'));
  if (!columns.length) return;

  // For each column, extract the content block (preserving all text, images, and structure)
  const columnCells = columns.map((col) => {
    // Use the main content wrapper if present
    const content = col.querySelector('.lp__listnav_icon_cta') || col;
    // Reference the existing element (do not clone)
    return content;
  });

  // Build the table rows
  const headerRow = ['Columns (columns20)'];
  const contentRow = columnCells;

  // Create the table using DOMUtils
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
