/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Ensure element is present and has children
  if (!element || !element.children || element.children.length === 0) return;

  // Header row as required
  const headerRow = ['Columns (columns3)'];

  // Get all immediate .text children (each column)
  const columnDivs = Array.from(element.querySelectorAll(':scope > .text'));

  // For each column, grab the .eventdetail-text div (which contains the label and value)
  const columns = columnDivs.map((colDiv) => {
    // Defensive: find the .eventdetail-text div
    const detailDiv = colDiv.querySelector('.eventdetail-text');
    if (detailDiv) {
      // Use the entire detailDiv for the cell (preserves <p><b>Label</b></p><p>Value</p>)
      return detailDiv;
    }
    // Fallback: use the column div itself
    return colDiv;
  });

  // Only one content row, with each column's content as a cell
  const tableRows = [headerRow, columns];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
