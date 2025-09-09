/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find all card root elements
  function getCardElements(root) {
    // Defensive: find all .lp__card elements within the block
    return Array.from(root.querySelectorAll('.lp__card'));
  }

  // Helper to extract image (picture or img) from card
  function getCardImage(card) {
    // Find the .lp__card_img container
    const imgContainer = card.querySelector('.lp__card_img');
    if (!imgContainer) return null;
    // Prefer <picture>, else <img>
    const picture = imgContainer.querySelector('picture');
    if (picture) return picture;
    const img = imgContainer.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to extract the text content (title, description, cta) from card
  function getCardTextContent(card) {
    const contentDiv = card.querySelector('.lp__card_content');
    if (!contentDiv) return null;
    // We'll collect: heading (h3), description (div.lp__card_description), cta (a inside h3 or overlay-link)
    const fragment = document.createDocumentFragment();

    // Title (h3 > a or h3)
    const h3 = contentDiv.querySelector('h3');
    if (h3) {
      // Clone the h3 (with its link)
      fragment.appendChild(h3.cloneNode(true));
    }

    // Description
    const desc = contentDiv.querySelector('.lp__card_description');
    if (desc) {
      // Clone the description div
      fragment.appendChild(desc.cloneNode(true));
    }

    // CTA: If there's an overlay link (outside contentDiv), add it if not already present
    // (But only if it's not the same as the h3 > a)
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if its href is not already present in h3 > a
      const h3a = h3 ? h3.querySelector('a') : null;
      if (!h3a || h3a.href !== overlayLink.href) {
        fragment.appendChild(overlayLink.cloneNode(true));
      }
    }

    return fragment;
  }

  // Find all cards in the block
  const cards = getCardElements(element);

  // Build table rows
  const headerRow = ['Cards (cards35)'];
  const rows = [headerRow];

  cards.forEach((card) => {
    const img = getCardImage(card);
    const textContent = getCardTextContent(card);
    // Defensive: if either is missing, skip
    if (!img || !textContent) return;
    rows.push([img, textContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
