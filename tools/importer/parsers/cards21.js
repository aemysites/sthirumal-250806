/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get all immediate card children
  const cards = Array.from(element.querySelectorAll(':scope > .lp-sticky-card'));
  const rows = [];
  // Always use the required header row
  const headerRow = ['Cards (cards21)'];
  rows.push(headerRow);

  cards.forEach(card => {
    // Defensive: Get overlay, image, and content
    const overlay = card.querySelector('.lp-sticky-card-overlay');
    if (!overlay) return;
    const imgWrap = overlay.querySelector('.lp-sticky-card-img');
    const contentWrap = overlay.querySelector('.lp-sticky-card-content');

    // Find the image (use <picture> if present, else <img>)
    let imageEl = null;
    if (imgWrap) {
      imageEl = imgWrap.querySelector('picture') || imgWrap.querySelector('img');
    }
    // Defensive: If no image, skip this card
    if (!imageEl) return;

    // Get the heading and paragraph
    let titleEl = null;
    let descEl = null;
    if (contentWrap) {
      titleEl = contentWrap.querySelector('h3');
      descEl = contentWrap.querySelector('p');
    }
    // Compose the text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    // Push row: [image, text]
    rows.push([imageEl, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
