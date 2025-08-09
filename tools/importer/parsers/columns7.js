/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each column's main content (in this case, the first image in each column)
  const cellsRow = columns.map(col => {
    const img = col.querySelector('img');
    return img || col;
  });

  // The header row must be a single cell (which the importer will span across columns)
  const headerRow = ['Columns (columns7)'];

  // Compose the table as per spec: header row (single cell), then a content row with N columns
  const tableRows = [headerRow, cellsRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
