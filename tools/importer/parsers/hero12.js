/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match block name exactly
  const headerRow = ['Hero (hero12)'];

  // --- Background image row ---
  // Take the first image under the first immediate child of the layout grid
  let bgImg = null;
  const grid = element.querySelector('.w-layout-grid');
  if (grid && grid.children.length > 0) {
    const firstChild = grid.children[0];
    bgImg = firstChild.querySelector('img');
  }
  const backgroundRow = [bgImg];

  // --- Content row ---
  // We want ALL the textual and visual content from the 'card' (including headings, paragraphs, buttons, and images)
  // The structure is: grid > [0] bg, [1] content
  let contentCell = null;
  if (grid && grid.children.length > 1) {
    // This will get the content section with text and images
    const contentSection = grid.children[1];
    // If there is a card, use its entire contents to ensure ALL text, visuals & CTA are included
    const card = contentSection.querySelector('.card');
    if (card) {
      contentCell = card;
    } else {
      // Fallback: use the entire content section
      contentCell = contentSection;
    }
  } else {
    // Fallback: use original element if grid not found
    contentCell = element;
  }
  const contentRow = [contentCell];

  // Compose the final block table
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
