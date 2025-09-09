/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first <img> from a <picture> (for robustness)
  function getCardImage(card) {
    const img = card.querySelector('.lp-aca-card-img img');
    return img;
  }

  // Helper to build the text cell for a card
  function getCardText(card) {
    const frag = document.createDocumentFragment();
    // Tag (e.g., Impact Programs)
    const tag = card.querySelector('.lp-aca-card-tag');
    if (tag) {
      frag.appendChild(tag.cloneNode(true));
    }
    // Title (as heading)
    const content = card.querySelector('.lp-aca-card-content');
    if (content) {
      const titleH3 = content.querySelector('.lp-aca-card-title');
      if (titleH3) {
        const link = titleH3.querySelector('a');
        if (link) {
          const heading = document.createElement('h3');
          heading.appendChild(link.cloneNode(true));
          frag.appendChild(heading);
        } else {
          frag.appendChild(titleH3.cloneNode(true));
        }
      }
      // Description
      const desc = content.querySelector('.lp-aca-card-description');
      if (desc) {
        frag.appendChild(desc.cloneNode(true));
      }
    }
    return frag;
  }

  // Get all cards (li.swiper-slide)
  const cards = Array.from(element.querySelectorAll(':scope > li'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards27)']);

  // Each card: [image, text content]
  cards.forEach((li) => {
    const card = li.querySelector('.lp-aca-card');
    if (!card) return;
    const img = getCardImage(card);
    const text = getCardText(card);
    // Defensive: skip if no image and no text
    if (!img && !text) return;
    rows.push([
      img ? img : '',
      text ? text : ''
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
