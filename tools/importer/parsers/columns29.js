/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the column containers (direct children)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Collect the content for each column; in this case, the image inside each column
  const columnCells = columns.map(col => {
    const img = col.querySelector('img');
    return img || col;
  });

  // To ensure the header row only has one column, and content row has N columns
  // We'll build the data array manually:
  const cells = [];
  // Header row - exactly one column
  cells.push(['Columns (columns29)']);
  // Content row - one cell per column
  cells.push(columnCells);

  // Create the table as usual
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Fix thead so header only has a single th (if createTable adds more)
  const thRow = block.querySelector('tr:first-child');
  while (thRow.children.length > 1) {
    thRow.removeChild(thRow.lastChild);
  }
  // Now replace the original element
  element.replaceWith(block);
}
