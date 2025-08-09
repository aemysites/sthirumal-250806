/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns1)'];

  // Find the first '.container' in the header (element)
  const container = element.querySelector('.container');
  if (!container) return;

  // Find the grid-layout (w-layout-grid)
  const grid = container.querySelector('.w-layout-grid');
  if (!grid) return;

  // The grid holds columns: image and content
  // Let's grab the immediate children of the grid (columns in layout)
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 2) return;

  // According to the HTML, image is first, content is second
  const imageCol = gridChildren[0];
  const contentCol = gridChildren[1];

  // Compose a row for the block: one cell per column
  const rowCells = [imageCol, contentCol];

  const cells = [headerRow, rowCells];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
