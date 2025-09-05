/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image (picture or img) from a card
  function extractImage(card) {
    const imgContainer = card.querySelector('.lp__card_img');
    if (!imgContainer) return '';
    // Prefer <picture>, fallback to <img>
    const picture = imgContainer.querySelector('picture');
    if (picture) return picture;
    const img = imgContainer.querySelector('img');
    if (img) return img;
    return '';
  }

  // Helper to extract the text content (title, description, cta) from a card
  function extractTextContent(card) {
    const contentDiv = card.querySelector('.lp__card_content');
    if (!contentDiv) return '';
    const frag = document.createDocumentFragment();
    // Title
    const title = contentDiv.querySelector('.lp__card_title');
    if (title) {
      // Use the heading tag (h3) and its children (including link)
      frag.appendChild(title.cloneNode(true));
    }
    // Description
    const desc = contentDiv.querySelector('.lp__card_description');
    if (desc) {
      frag.appendChild(desc.cloneNode(true));
    }
    // CTA: overlay link (if present and not duplicate)
    const overlayLink = card.querySelector('.lp__overlay-link');
    if (overlayLink) {
      // Only add if not a duplicate of the title link
      let titleLink = title && title.querySelector('a');
      if (!titleLink || overlayLink.href !== titleLink.href) {
        // Place CTA on its own line
        const p = document.createElement('p');
        p.appendChild(overlayLink.cloneNode(true));
        frag.appendChild(p);
      }
    }
    return frag.childNodes.length ? frag : '';
  }

  // Find all cards in the block
  // Cards are .lp__card inside .lp__primary_card
  const cards = Array.from(element.querySelectorAll('.lp__primary_card .lp__card'));

  // Build table rows
  const rows = [];
  // Header row (block name as required)
  rows.push(['Cards (cards14)']);

  // Card rows
  cards.forEach((card) => {
    const img = extractImage(card);
    const textContent = extractTextContent(card);
    rows.push([
      img || '',
      textContent || '',
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
