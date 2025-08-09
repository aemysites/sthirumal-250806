/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all direct children divs of an element
  function getDirectDivs(el) {
    return Array.from(el.children).filter((child) => child.tagName === 'DIV');
  }

  // 1. Find the main grid that holds the content and the image
  const outerGrid = element.querySelector('.w-layout-grid.grid-layout');
  if (!outerGrid) return;

  // 2. Find the hero/main image (should be only <img> at top level of grid)
  const heroImg = outerGrid.querySelector('img');

  // 3. Find the content area: look for a grid with h2 (heading)
  let contentDiv = null;
  const possibleGrids = outerGrid.querySelectorAll('.w-layout-grid');
  for (const grid of possibleGrids) {
    const innerDivs = getDirectDivs(grid);
    for (const child of innerDivs) {
      if (child.querySelector('h2')) {
        contentDiv = child;
        break;
      }
    }
    if (contentDiv) break;
  }

  // 4. Compose the right cell content (heading, richtext, buttons)
  let contentCell = [];
  if (contentDiv) {
    // Heading
    const heading = contentDiv.querySelector('h2');
    if (heading) contentCell.push(heading);

    // Subheading/text (rich text)
    const richText = contentDiv.querySelector('.rich-text');
    if (richText) contentCell.push(richText);

    // CTA/button group
    const buttonGroup = contentDiv.querySelector('.button-group');
    if (buttonGroup) contentCell.push(buttonGroup);
  }
  // Fallback for empty cell
  if (contentCell.length === 0) contentCell = [''];

  // 5. Compose the table as per spec (header, image, content)
  const cells = [
    ['Hero (hero5)'],
    [heroImg || ''],
    [contentCell]
  ];

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
