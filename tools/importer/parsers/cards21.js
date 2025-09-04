/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Get all immediate card children
  const cards = element.querySelectorAll(':scope > .lp-sticky-card');

  cards.forEach((card) => {
    // Defensive: find image container
    const imgContainer = card.querySelector('.lp-sticky-card-img');
    let imgEl = null;
    if (imgContainer) {
      // Use the <picture> element directly for responsive images
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imgEl = picture;
      } else {
        // Fallback: use the first <img> inside
        imgEl = imgContainer.querySelector('img');
      }
    }

    // Defensive: find content container
    const contentContainer = card.querySelector('.lp-sticky-card-content');
    let textContent = [];
    if (contentContainer) {
      // Title (h3)
      const title = contentContainer.querySelector('h3');
      if (title) textContent.push(title);
      // Description (p)
      const desc = contentContainer.querySelector('p');
      if (desc) textContent.push(desc);
    }

    // Add row: [image, text content]
    rows.push([
      imgEl,
      textContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
