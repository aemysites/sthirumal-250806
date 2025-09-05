/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the card image (as <img>) from a card root
  function getCardImage(card) {
    // Find the picture or img inside the card
    const imgContainer = card.querySelector('.lp__card_img');
    if (imgContainer) {
      // Prefer <img> inside <picture>
      const img = imgContainer.querySelector('img');
      if (img) return img;
      // Fallback: any image
      const anyImg = imgContainer.querySelector('img, picture');
      if (anyImg) return anyImg;
    }
    return null;
  }

  // Helper to extract the card text content (title, description, CTA)
  function getCardTextContent(card) {
    const content = document.createElement('div');
    // Title (h3 > a)
    const title = card.querySelector('.lp__card_title');
    if (title) {
      // Use the <a> inside the title if present
      const a = title.querySelector('a');
      if (a) {
        // Clone the <a> to avoid moving it from the DOM
        const aClone = a.cloneNode(true);
        // Make the link bold (simulate heading)
        const strong = document.createElement('strong');
        strong.appendChild(aClone);
        content.appendChild(strong);
        content.appendChild(document.createElement('br'));
      } else {
        // Fallback: just use the title text
        content.appendChild(document.createTextNode(title.textContent.trim()));
        content.appendChild(document.createElement('br'));
      }
    }
    // Description
    const desc = card.querySelector('.lp__card_description');
    if (desc) {
      // Use the <p> inside if present
      const p = desc.querySelector('p');
      if (p) {
        content.appendChild(p.cloneNode(true));
      } else {
        content.appendChild(document.createTextNode(desc.textContent.trim()));
      }
    }
    // CTA: use the overlay link if present and not already used as title
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if not same as title link
      const titleLink = title && title.querySelector('a');
      if (!titleLink || (overlayLink.href !== titleLink.href)) {
        const cta = overlayLink.cloneNode(true);
        content.appendChild(document.createElement('br'));
        content.appendChild(cta);
      }
    }
    return content;
  }

  // Find all cards in the block
  // Defensive: find all .lp__card in the subtree
  const cards = element.querySelectorAll('.lp__card');
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards35)'];
  rows.push(headerRow);

  cards.forEach((card) => {
    // First cell: image
    const img = getCardImage(card);
    // Second cell: text content
    const textContent = getCardTextContent(card);
    rows.push([
      img ? img : '',
      textContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
