/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card root element
  function extractCard(cardRoot) {
    // Defensive: find image (picture or img)
    let imgEl = cardRoot.querySelector('.lp__card_img picture, .lp__card_img img');
    if (!imgEl) {
      // fallback: any img inside card
      imgEl = cardRoot.querySelector('img');
    }
    // Defensive: find card content
    const contentEl = cardRoot.querySelector('.lp__card_content');
    // Defensive: find title (h3 or h2)
    let titleEl = contentEl ? contentEl.querySelector('.lp__card_title, h3, h2') : null;
    // Defensive: find description
    let descEl = contentEl ? contentEl.querySelector('.lp__card_description, p') : null;
    // Defensive: find CTA link (prefer overlay link, fallback to title link)
    let ctaLink = cardRoot.querySelector('.lp__overlay-link');
    if (!ctaLink && titleEl) {
      ctaLink = titleEl.querySelector('a');
    }
    // Compose text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl && descEl !== titleEl) textCell.push(descEl);
    // Only add CTA if it's not already the title link
    if (ctaLink && (!titleEl || !titleEl.contains(ctaLink))) {
      textCell.push(ctaLink);
    }
    return [imgEl, textCell];
  }

  // Find all cards in the block
  // Defensive: cards may be nested in various wrappers
  const cardEls = [];
  // Look for all .lp__card in the subtree
  element.querySelectorAll('.lp__card').forEach(card => {
    cardEls.push(card);
  });

  // Compose table rows
  const rows = [];
  // Header row as specified
  rows.push(['Cards (cards8)']);
  // Each card row: [image, text content]
  cardEls.forEach(cardRoot => {
    rows.push(extractCard(cardRoot));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
