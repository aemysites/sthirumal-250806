/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card root
  function extractCard(cardRoot) {
    // Defensive: find image (picture or img)
    let imgEl = cardRoot.querySelector('.lp__card_img picture') || cardRoot.querySelector('.lp__card_img img');
    // Defensive: find card content
    const contentEl = cardRoot.querySelector('.lp__card_content');
    // Defensive: find title (h3 or h2)
    let titleEl = contentEl ? contentEl.querySelector('.lp__card_title') : null;
    // Defensive: find description
    let descEl = contentEl ? contentEl.querySelector('.lp__card_description') : null;
    // Defensive: find CTA link (the visible one in title)
    let ctaLink = titleEl ? titleEl.querySelector('a') : null;
    // Compose text cell: title, description, CTA link (if not redundant)
    const textCell = document.createElement('div');
    if (titleEl) {
      // Use heading tag for title
      const heading = document.createElement('h3');
      // If titleEl contains a link, use its text and href
      if (ctaLink) {
        const link = document.createElement('a');
        link.href = ctaLink.href;
        link.innerHTML = ctaLink.innerHTML;
        heading.appendChild(link);
      } else {
        heading.innerHTML = titleEl.textContent;
      }
      textCell.appendChild(heading);
    }
    if (descEl) {
      // Use the paragraph(s) directly
      descEl.childNodes.forEach((node) => {
        textCell.appendChild(node.cloneNode(true));
      });
    }
    // If CTA link is not already included, add it (rare)
    // (In this HTML, CTA is always the heading link)
    // Return [image, text]
    // Defensive: use the whole picture element if possible
    let imgCell = null;
    if (imgEl && imgEl.tagName === 'PICTURE') {
      imgCell = imgEl;
    } else if (imgEl && imgEl.tagName === 'IMG') {
      imgCell = imgEl;
    } else {
      // fallback: try to find any img inside cardRoot
      const fallbackImg = cardRoot.querySelector('img');
      if (fallbackImg) imgCell = fallbackImg;
    }
    return [imgCell, textCell];
  }

  // Find all card roots
  // Defensive: cards are .lp__card inside .redesign_card
  const cardNodes = Array.from(element.querySelectorAll('.redesign_card .lp__card'));
  const rows = [];
  // Header row
  rows.push(['Cards (cards14)']);
  // Each card row
  cardNodes.forEach((cardRoot) => {
    const cardCells = extractCard(cardRoot);
    rows.push(cardCells);
  });
  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
