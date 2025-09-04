/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the first <img> from a card
  function getCardImage(card) {
    const img = card.querySelector('picture img');
    return img;
  }

  // Helper to extract the text content (title, description, CTA) from a card
  function getCardTextContent(card) {
    const contentDiv = card.querySelector('.lp__card_content');
    if (!contentDiv) return '';
    // We'll collect: title (as heading), description (as paragraph), CTA (as link)
    const fragments = [];
    // Title
    const title = contentDiv.querySelector('.lp__card_title');
    if (title) {
      // Use the heading element (h3) directly, but strip nested <a> if present
      const heading = document.createElement('h3');
      const a = title.querySelector('a');
      heading.textContent = a ? a.textContent.trim() : title.textContent.trim();
      fragments.push(heading);
    }
    // Description
    const desc = contentDiv.querySelector('.lp__card_description');
    if (desc) {
      // Use the <p> directly if present
      const p = desc.querySelector('p');
      if (p) fragments.push(p);
      else fragments.push(desc);
    }
    // CTA: Use the first <a> in the heading, if present
    if (title) {
      const a = title.querySelector('a');
      if (a && a.href) {
        // Only add CTA if not already present as heading
        const cta = document.createElement('a');
        cta.href = a.href;
        cta.textContent = a.textContent.trim();
        fragments.push(cta);
      }
    }
    return fragments;
  }

  // Find all cards in the block
  // Defensive: cards are .lp__card inside .lp__primary_card
  const cards = Array.from(element.querySelectorAll('.lp__primary_card .lp__card'));

  // Build the table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Cards (cards13)']);

  cards.forEach((card) => {
    // Image cell
    const img = getCardImage(card);
    // Defensive: if no image, skip this card
    if (!img) return;
    // Text content cell
    const textContent = getCardTextContent(card);
    rows.push([
      img,
      Array.isArray(textContent) ? textContent : [textContent],
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
