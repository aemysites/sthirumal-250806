/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct column divs
  const columns = Array.from(element.querySelectorAll(':scope .row > div'));

  // For each column, grab the main content block (the .lp__listnav_icon_cta)
  const columnCells = columns.map((col) => {
    // Find the main content container in each column
    const content = col.querySelector('.lp__listnav_icon_cta');
    // Defensive: if not found, fallback to the column itself
    return content || col;
  });

  // Build the table rows
  const headerRow = ['Columns (columns20)'];
  const contentRow = columnCells;
  const tableRows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
