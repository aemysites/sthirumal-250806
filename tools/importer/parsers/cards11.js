/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the <img> from a card
  function getCardImage(card) {
    const img = card.querySelector('.lp__card_img img');
    return img;
  }

  // Helper to extract the text content (title, description, CTA) from a card
  function getCardTextContent(card) {
    const content = card.querySelector('.lp__card_content');
    if (!content) return '';
    // We'll collect: title (h3), description (div.lp__card_description), CTA (ul.lp__card_list)
    const fragment = document.createDocumentFragment();
    // Title
    const title = content.querySelector('.lp__card_title');
    if (title) fragment.appendChild(title);
    // Description
    const desc = content.querySelector('.lp__card_description');
    if (desc) fragment.appendChild(desc);
    // CTA (optional)
    const cta = content.querySelector('.lp__card_list');
    if (cta) fragment.appendChild(cta);
    return fragment;
  }

  // Find all cards in the block
  // Defensive: find all .lp__card inside .redesign_card
  const cards = Array.from(element.querySelectorAll('.redesign_card .lp__card'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards11)']);

  // Card rows
  cards.forEach((card) => {
    const img = getCardImage(card);
    const textContent = getCardTextContent(card);
    rows.push([
      img || '',
      textContent || '',
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
