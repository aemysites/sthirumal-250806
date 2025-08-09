/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header
  const headerRow = ['Cards (cards37)'];

  // 2. Find the main grid that holds all cards
  // The first .grid-layout contains the left feature card and the nested grid for right-hand cards
  const container = element.querySelector('.container');
  // Get the first-level grid
  const mainGrid = container.querySelector('.grid-layout');
  // Gather all direct children of mainGrid (cards and a nested grid)
  const mainGridChildren = Array.from(mainGrid.children);

  // Card rows array
  const cardRows = [];

  // The first card is a standalone <a> card (left side, big card)
  const firstCard = mainGridChildren.find(e => e.classList.contains('utility-link-content-block'));
  if (firstCard) {
    // Image: inside .utility-aspect-2x3
    const imgContainer = firstCard.querySelector('.utility-aspect-2x3');
    let img = imgContainer ? imgContainer.querySelector('img') : null;
    // Text: h2 or h3, description <p>, button (optional)
    let textContent = [];
    const heading = firstCard.querySelector('h2, h3, h4');
    if (heading) textContent.push(heading);
    const para = firstCard.querySelector('p');
    if (para) textContent.push(para);
    const cta = firstCard.querySelector('.button, button, a[role="button"]');
    if (cta) textContent.push(cta);
    cardRows.push([img, textContent]);
  }

  // The nested grid is the next direct child that is a .grid-layout (for the right-side cards)
  const nestedGrid = mainGridChildren.find(e => e.classList.contains('grid-layout'));
  if (nestedGrid) {
    // Each card is a direct child <a> in nestedGrid
    const nestedCards = Array.from(nestedGrid.children).filter(e => e.classList.contains('utility-link-content-block'));
    nestedCards.forEach(card => {
      // Image (always first child div .utility-aspect-1x1 or .utility-aspect-2x3)
      const imgContainer = card.querySelector('.utility-aspect-1x1, .utility-aspect-2x3');
      let img = imgContainer ? imgContainer.querySelector('img') : null;
      // Text: h3 or h4 (heading), <p> (desc), button/cta if present
      let textContent = [];
      const heading = card.querySelector('h2, h3, h4');
      if (heading) textContent.push(heading);
      const para = card.querySelector('p');
      if (para) textContent.push(para);
      const cta = card.querySelector('.button, button, a[role="button"]');
      if (cta) textContent.push(cta);
      cardRows.push([img, textContent]);
    });
  }

  // 3. Compose the block table
  const tableRows = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // 4. Replace the original element
  element.replaceWith(block);
}