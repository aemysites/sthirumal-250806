/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card elements
  function getCards(root) {
    // Defensive: find all .lp__card_wrapper inside the element
    return Array.from(root.querySelectorAll('.lp__card_wrapper'));
  }

  // Helper to extract image (as <img>) from card
  function getCardImage(card) {
    // Find the .lp__card_img inside the card
    const imgContainer = card.querySelector('.lp__card_img');
    if (!imgContainer) return null;
    // Find the <img> inside (not <picture>), reference the <img> directly
    const img = imgContainer.querySelector('img');
    return img || null;
  }

  // Helper to extract text content (title, description, CTA) from card
  function getCardTextContent(card) {
    const content = document.createElement('div');
    // Title (h3 > a)
    const title = card.querySelector('.lp__card_title');
    if (title) {
      // Use the <a> inside h3 if present
      const a = title.querySelector('a');
      if (a) {
        // Clone the <a> so we can safely append
        const h = document.createElement('strong');
        h.appendChild(a.cloneNode(true));
        content.appendChild(h);
        content.appendChild(document.createElement('br'));
      } else {
        // fallback: just append the h3
        content.appendChild(title.cloneNode(true));
      }
    }
    // Description
    const desc = card.querySelector('.lp__card_description');
    if (desc) {
      // Append all paragraphs inside description
      Array.from(desc.children).forEach((child) => {
        content.appendChild(child.cloneNode(true));
      });
    }
    // CTA: look for .lp__overlay-link (but only if it's not the same as the title link)
    const cta = card.parentElement.querySelector('.lp__overlay-link');
    if (cta) {
      // Only add if href is not already used in title
      const titleLink = title && title.querySelector('a');
      if (!titleLink || titleLink.href !== cta.href) {
        const ctaLink = cta.cloneNode(true);
        content.appendChild(ctaLink);
      }
    }
    return content;
  }

  // Compose the table rows
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Find all cards in the block
  const cards = getCards(element);
  cards.forEach((card) => {
    const img = getCardImage(card);
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
