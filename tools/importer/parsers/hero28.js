/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, exactly as required
  const headerRow = ['Hero (hero28)'];

  // --- Extract background image (2nd row) ---
  // Find all immediate grid cells (divs inside grid)
  let gridCells = [];
  const layoutGrid = element.querySelector(':scope > .w-layout-grid');
  if (layoutGrid) {
    gridCells = Array.from(layoutGrid.querySelectorAll(':scope > div'));
  } else {
    gridCells = Array.from(element.querySelectorAll(':scope > div'));
  }

  // Find the first <img> inside a grid cell for background image
  let backgroundImage = '';
  for (const cell of gridCells) {
    const img = cell.querySelector('img');
    if (img) {
      backgroundImage = img; // reference the image directly
      break;
    }
  }

  // --- Extract text content (3rd row) ---
  // Find the cell with the heading
  let textCell = '';
  for (const cell of gridCells) {
    // Look for a heading, subheading, cta, etc.
    if (cell.querySelector('h1, h2, h3, p, a, button')) {
      // If there is a div that wraps the main text, prefer it
      let mainTextWrap = cell.querySelector('.utility-margin-bottom-6rem');
      if (mainTextWrap) {
        textCell = mainTextWrap;
      } else {
        textCell = cell;
      }
      break;
    }
  }

  // Edge case: If no img or heading found, fallback to empty string, already handled above.

  // Compose the table rows as per spec: header, background image, then text block
  const rows = [
    headerRow,
    [backgroundImage ? backgroundImage : ''],
    [textCell ? textCell : ''],
  ];

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
