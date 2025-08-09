/* global WebImporter */
export default function parse(element, { document }) {
  // ----- 1. Get the main two columns (content area) -----
  const container = element.querySelector('.container');
  const mainGrid = container && container.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  let leftCol = null, rightCol = null;
  if (mainGrid) {
    const children = Array.from(mainGrid.children);
    leftCol = children[0];
    rightCol = children[1];
  }
  // Defensive: if not found, fallback to null

  // ----- 2. Get the images below (second row) -----
  // These are in the grid under .w-layout-grid.grid-layout.mobile-portrait-1-column
  let imageRow = [];
  const imageGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  if (imageGrid) {
    const imgCells = Array.from(imageGrid.querySelectorAll('.utility-aspect-1x1'));
    imageRow = imgCells.map(cell => {
      const img = cell.querySelector('img');
      return img || document.createElement('div'); // fallback div if missing
    });
  }

  // ----- 3. Compose the table rows/cells -----
  const headerRow = ['Columns (columns11)'];
  // The first content row: leftCol, rightCol
  const firstContentRow = [leftCol, rightCol];
  const rows = [headerRow, firstContentRow];
  // Only add image row if images found and >0
  if (imageRow.length > 0) {
    rows.push(imageRow);
  }

  // ----- 4. Build and replace -----
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
