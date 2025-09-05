/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all card elements
  function getCards(root) {
    // Defensive: find all .lp__card within the block
    return Array.from(root.querySelectorAll('.lp__card'));
  }

  // Helper to extract image from card
  function getCardImage(card) {
    // Find the picture element inside the card
    const imgWrapper = card.querySelector('.lp__card_img');
    if (imgWrapper) {
      // Prefer the <img> inside <picture>
      const img = imgWrapper.querySelector('img');
      if (img) return img;
      // Fallback: use picture itself
      const picture = imgWrapper.querySelector('picture');
      if (picture) return picture;
    }
    return null;
  }

  // Helper to extract text content from card
  function getCardText(card) {
    const content = card.querySelector('.lp__card_content');
    if (!content) return document.createElement('div');
    // Compose: title, description, and CTA link
    const frag = document.createElement('div');
    // Title
    const title = content.querySelector('.lp__card_title');
    if (title) {
      // Use heading or link as-is
      frag.appendChild(title);
    }
    // Description
    const desc = content.querySelector('.lp__card_description');
    if (desc) {
      frag.appendChild(desc);
    }
    // CTA: use the overlay link if present and not redundant
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if not already present in title
      const titleLink = title ? title.querySelector('a') : null;
      if (!titleLink || (titleLink.href !== overlayLink.href)) {
        frag.appendChild(overlayLink);
      }
    }
    return frag;
  }

  // Compose table rows
  const headerRow = ['Cards (cards13)'];
  const rows = [headerRow];

  // Find all cards in the block
  const cards = getCards(element);
  cards.forEach((card) => {
    const imgEl = getCardImage(card);
    const textEl = getCardText(card);
    rows.push([imgEl, textEl]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
