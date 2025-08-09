/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches exactly
  const headerRow = ['Hero (hero6)'];

  // Get the first .w-layout-grid
  const grid = element.querySelector(':scope > .w-layout-grid');
  let bgImg = '';
  if (grid) {
    // Find first immediate child div that contains an img as background
    const gridDivs = grid.querySelectorAll(':scope > div');
    for (const div of gridDivs) {
      const img = div.querySelector('img');
      if (img) {
        bgImg = img;
        break;
      }
    }
  }
  const secondRow = [bgImg];

  // Content: find the .card (which has the heading, subheading, CTAs)
  let contentCell = [];
  if (grid) {
    // There may be nested .w-layout-grid and .container layers, so search for .card inside grid
    const card = grid.querySelector('.card');
    if (card) {
      // Always preserve existing elements
      const children = [];
      // Heading (h1)
      const h1 = card.querySelector('h1');
      if (h1) children.push(h1);
      // Subheading (p.subheading)
      const subheading = card.querySelector('p.subheading');
      if (subheading) children.push(subheading);
      // Button group (div.button-group)
      const buttonGroup = card.querySelector('.button-group');
      if (buttonGroup) children.push(buttonGroup);
      // If there's anything else in the card that isn't above (robustness)
      // Get all children that are not h1, p.subheading, or buttonGroup
      // (not needed if above elements are sufficient, but safe for edge cases)
      const allCardChildren = Array.from(card.children);
      for (const child of allCardChildren) {
        if (child !== h1 && child !== subheading && child !== buttonGroup) {
          children.push(child);
        }
      }
      if (children.length) contentCell = children;
    }
  }
  const thirdRow = [contentCell.length ? contentCell : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [bgImg],
    thirdRow
  ], document);

  element.replaceWith(table);
}
