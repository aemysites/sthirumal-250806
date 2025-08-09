/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all immediate children of the grid (these represent column pieces)
  const columns = Array.from(grid.children);
  // Defensive: If fewer than 4 children, abort (unexpected layout)
  if (columns.length < 4) return;

  // Compose columns according to the screenshot and HTML structure
  // Column 1: Taylor Brooks (name) + tags block
  const col1 = document.createElement('div');
  if (columns[0].textContent.trim()) col1.appendChild(columns[0]);
  if (columns[1].childNodes.length > 0) col1.appendChild(columns[1]);

  // Column 2: Heading (trends made for living bold)
  const col2 = columns[2];

  // Column 3: Description (rich text)
  const col3 = columns[3];

  // Table header: EXACT match to requirement
  const headerRow = ['Columns (columns30)']; // one cell only

  // Content row: three columns as in the example markdown
  const contentRow = [col1, col2, col3];

  // Final output, header row is one cell, following rows have 3 columns
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
