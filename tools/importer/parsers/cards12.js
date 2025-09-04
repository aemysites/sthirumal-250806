/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the HTML structure
  function getCards(root) {
    // Find all card containers
    return Array.from(
      root.querySelectorAll('.lp__card')
    );
  }

  // Helper to extract image (as <picture> or <img>) from card
  function getCardImage(card) {
    // Prefer <picture>, fallback to <img>
    const pic = card.querySelector('.lp__card_img picture');
    if (pic) return pic;
    const img = card.querySelector('.lp__card_img img');
    if (img) return img;
    return null;
  }

  // Helper to extract text content (title, description, cta) from card
  function getCardTextContent(card) {
    const content = document.createElement('div');
    // Title (as heading with link)
    const title = card.querySelector('.lp__card_title');
    if (title) {
      content.appendChild(title);
    }
    // Description (may be multiple paragraphs)
    const desc = card.querySelector('.lp__card_description');
    if (desc) {
      // Remove empty <p> or <i> if present
      const descClone = desc.cloneNode(true);
      Array.from(descClone.querySelectorAll('p')).forEach(p => {
        if (!p.textContent.trim() || p.textContent.trim() === '\u00A0') {
          p.remove();
        }
      });
      content.appendChild(descClone);
    }
    // CTA (overlay link, not the heading link)
    const cta = card.querySelector('.lp__overlay-link');
    if (cta) {
      // Only add if not duplicate of heading link
      const headingLink = title ? title.querySelector('a') : null;
      if (!headingLink || headingLink.href !== cta.href) {
        content.appendChild(cta);
      }
    }
    return content;
  }

  // Find the main row of cards
  let cardsRow = element.querySelector('.row');
  // Defensive: if there are nested rows, pick the one with cards
  if (cardsRow) {
    // Find all .lp__card inside this row
    const cards = getCards(cardsRow);
    if (cards.length > 0) {
      const table = [];
      // Header row
      table.push(['Cards (cards12)']);
      // Each card: [image, text content]
      cards.forEach(card => {
        const img = getCardImage(card);
        const textContent = getCardTextContent(card);
        if (img && textContent) {
          table.push([img, textContent]);
        }
      });
      // Only replace if at least one card found
      if (table.length > 1) {
        const block = WebImporter.DOMUtils.createTable(table, document);
        element.replaceWith(block);
      }
    }
  }
}
