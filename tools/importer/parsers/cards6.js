/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card
  function getImage(cardEl) {
    const img = cardEl.querySelector('img');
    return img || null;
  }

  // Helper to extract the text content from a card (date, title, location)
  function getTextContent(cardEl) {
    const content = document.createElement('div');
    // Date box
    const dateBox = cardEl.querySelector('.lp__event_month');
    if (dateBox) {
      content.appendChild(dateBox.cloneNode(true));
    }
    // Details (title, location)
    const details = cardEl.querySelector('.lp__meetingevent_details');
    if (details) {
      content.appendChild(details.cloneNode(true));
    }
    return content;
  }

  // Find all cards
  const cards = Array.from(element.querySelectorAll('.lp__meetingevent_wrapper'));
  const rows = [];
  // Header row
  rows.push(['Cards (cards6)']);

  // Each card is a row: [image, text content]
  cards.forEach((card) => {
    const img = getImage(card);
    const textContent = getTextContent(card);
    rows.push([img, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
